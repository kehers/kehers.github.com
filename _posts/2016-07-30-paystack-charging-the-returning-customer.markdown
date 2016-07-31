---
published: true
title: Paystack - charging the returning customer
layout: post
---
[Paystack](http://paystack.co) has an [API for charging returning customers](https://developers.paystack.co/docs/charging-returning-customers). You send the customer's email, amount and authorization code and that's it. (The `authorization code` is one of the parameters returned when you first charge the customer. We will get to it).

Note that this is totally different from [subscriptions and plans](https://developers.paystack.co/docs/create-subscription). Subscriptions are fixed charges that are automatically charged recurrently. My N9,500 monthly wifi.com.ng charge is an example. Charging a returning customer in the context of this post will mean charging a customer that has once used Paystack on your ecommerce site and is back again. Here, the charge is not fixed (he spent N15,000 the first time but now he is spending just N3,500) and does not happen at regular intervals.

Here is what the process looks like:

Let's start with the renowned payment form that shows up once payment is required.

{% highlight html %}
<!-- pay.html -->
<script src="assets/js/jquery.js"></script>
<script>
  function pay(){
    var handler = PaystackPop.setup({
      key: 'pk_test_xxx',
      email: '<?= $_SESSION['user']['email']; ?>',
      amount: <?= $_SESSION['cart']['total'] * 100; ?>,
      ref: '<?= uniqid(); ?>',
      callback: function(response){
        $('form').append('<input type="text" name="ref" value="'+response.trxref+'">').submit();
      }
    });
    handler.openIframe();
  }
</script>
<form method="post" action="process">
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <button type="button" onclick="pay()" class="btn btn-danger">Pay</button>
</form>
{% endhighlight %}

{% highlight php %}
<?php
// process.php
$ref = some_filter_fn($_POST['ref']);

// Confirm ref hasnt been used
$stmt = $db->prepare("select id from orders where ref=?");
$stmt->execute([$ref]);
if ($stmt->fetchColumn())
  return false;

// todo: Verify payment here
// [https://developers.paystack.co/docs/verifying-transactions]
// If payment valid, go ahead and process order
{% endhighlight %}

What we want however is that if the customer has made payment once, he shouldn't have to enter his payment details again. We use his existing payment details to process the new charge. This is where the [charge authorization API](https://developers.paystack.co/docs/charging-returning-customers) comes in. But we need to have the customer's `authorization code` to do this. The `authorization code` is returned anytime we verify a payment like we did above. For reference, below is an example response from the [verify API](https://developers.paystack.co/docs/verifying-transactions). Notice the authorization code in there:

{% highlight json %}
{
  "status": true,
  "message": "Verification successful",
  "data": {
    "amount": 500000,
    "transaction_date": "2015-12-04T08:23:02.000Z",
    "status": "success",
    "reference": "7PVGX8MEk85tgeEpVDtD",
    "domain": "test",
    "authorization": {
      "authorization_code": "AUTH_72btv547", // <-- This guy here
      "card_type": "visa",
      "last4": "1381",
      "exp_month": "10",
      "exp_year": "2017",
      "bank": null,
      "channel": "card",
      "reusable": true
    },
    "customer": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "customer@email.com"
    },
    "plan": null
  }
}
{% endhighlight %}

So let's update our `process.php` script and save the `authorization code` during verification so that we can use it for subsequent charges. For identification purpose, we can also save the last 4 digits of the card, as returned from the API.

{% highlight php %}
<?php
// process.php

$ref = some_filter_fn($_POST['ref']);

// Confirm ref hasnt been used
$stmt = $db->prepare("select id from orders where ref=?");
$stmt->execute([$ref]);
if ($stmt->fetchColumn())
  exit;

// Verify payment here
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,
  'https://api.paystack.co/transaction/verify/'.$ref);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer sk_test_xxx']);
curl_setopt($ch, CURLOPT_HEADER, false);
// Fix for some ssl issues
if (!defined('CURL_SSLVERSION_TLSV1_2'))
  define('CURL_SSLVERSION_TLSV1_2', 6);
$r = curl_exec($ch);
curl_close($ch);
$json = json_decode($r);

if ($json->status == true &&
   $json->data->amount/100 == $_SESSION['cart']['total']) {

  // Save auth code and last card digits
  $stmt = $db->prepare("update users set card=?, auth_code=?
    where user_id=?");
  $stmt->execute([$json->data->authorization->last4,
    $json->data->authorization->authorization_code, $_SESSION['user']['id']]);

  // Process order here
}
{% endhighlight %}

We will then update our payment form to check if we have saved an authorization code for the user. If he has, we show him a button he can click to make payment without having to enter his card details again.

{% highlight php %}
<!-- pay.html -->
<?php
// If he is a returning customer
// Assumption: auth code and card details already retrieved from db
//    and saved in session
if ($_SESSION['user']['auth_code']) {
?>
  <form method="post" action="recharge">
    <button type="submit">Pay
    <?= number_format($_SESSION['cart']['total'], 2); ?> with
    *** <?= $_SESSION['user']['card']; ?></button>
  </form>
<?php
}
else {
  // Our normal payment form for new users here
}
{% endhighlight %}

{% highlight php %}
<?php
// recharge.php
// if there is a post action...

$body = ['amount' => $_SESSION['cart']['total'] * 100,
  'email' => $_SESSION['user']['email'],
  'authorization_code' => $_SESSION['user']['auth_code']];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,
  'https://api.paystack.co/transaction/charge_authorization');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer sk_test_xxx',
    'Content-Type: application/json'
  ]);
curl_setopt($ch, CURLOPT_HEADER, false);
if (!defined('CURL_SSLVERSION_TLSV1_2'))
  define('CURL_SSLVERSION_TLSV1_2', 6);
$r = curl_exec($ch);
curl_close($ch);
{% endhighlight %}

You want to ensure that the recharge script is idempotent, that is if the recharge page is called multiple times, the customer is only charged once. There are many ways this can be done. A very simple approach is to use a token as with CSRF validation.

{% highlight php %}
<!-- pay.html -->
<?php
if ($_SESSION['user']['auth_code']) {
  $_SESSION['cart']['token'] = md5(session_id().' '.json_encode($_SESSION['cart']));
?>
  <form method="post" action="recharge">
    <input type="hidden" name="token" value="<?= $_SESSION['cart']['token']; ?>">
    <button type="submit">Pay
    <?= number_format($_SESSION['cart']['total'], 2); ?> with
    *** <?= $_SESSION['user']['card']; ?></button>
  </form>
<?php
}
else {
  // Our normal payment form for new users here
}
?>
{% endhighlight %}

{% highlight php %}
<?php
// recharge.php
if ($_POST['token'] != $_SESSION['cart']['token']) {
  // Perform error action
  exit;
}
unset($_SESSION['cart']['token']);

// rest of recharge code here
{% endhighlight %}

## Handling failed charges from authorization code

So what happens when the customer's card expires? Paystack obviously won't be able to charge the customer from our authorization code. Remember, the authorization code is attached to the customer's card. Paystack currently doesn't have a way for users to update card details. One way to handle this is that on failed charge, we delete the saved authorization code and card 4 digits so that this brings up the payment form again and we can get new payment details.

{% highlight php %}
<?php
// recharge.php
if ($_POST['token'] != $_SESSION['cart']['token']) {
  // Perform error action
  exit;
}
unset($_SESSION['cart']['token']);

$body = ['amount' => $_SESSION['cart']['total'] * 100,
  'email' => $_SESSION['user']['email'],
  'authorization_code' => $_SESSION['user']['auth_code']];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,
  'https://api.paystack.co/transaction/charge_authorization');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer sk_test_xxx',
    'Content-Type: application/json'
  ]);
curl_setopt($ch, CURLOPT_HEADER, false);
if (!defined('CURL_SSLVERSION_TLSV1_2'))
  define('CURL_SSLVERSION_TLSV1_2', 6);
$r = curl_exec($ch);
curl_close($ch);
$json = json_decode($r);

if ($json->status != true) {

  $stmt = $db->prepare("update users set card='', auth_code='' where user_id=?");
  $stmt->execute([$_SESSION['user']['id']]);
  unset($_SESSION['cart']['token']);
}
{% endhighlight %}
