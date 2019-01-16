---
title: Working with Mailgun webhooks
date: 2017-09-08 00:00:00 Z
layout: post
---

*TL;DR: Mailgun webhooks allow you receive event data for your transactional emails and they are easy to work with. You can use the data to build custom analytics and enrich your applications. For a real world example, check out [Suet](https://github.com/kehers/suet) on Github.*

Transactional emails are essentials for most apps. We send welcome emails, password recovery emails, notifications and more. And when we do, we use providers like [Mailgun](https://mailgun.com/). Sending the emails is cool and all but what about the delivery and performance? Did that user get that password reset email? Was that ‘credit card expiring’ notification email opened?

Although this data is available in your Mailgun account dashboard, another way you can also get updates about what’s happening to your transactional mails in Mailgun is through webhooks. There is also the API but unlike with the API where you “request” for these updates (**Poll**), with webhooks, the updates are sent to you (**Push**). All you need to do is provide the URL of a script that can handle the event data through `POST` .

Needless to mention, push has some advantage over poll.

1. You don’t have to make repeated API requests. This means consuming lesser server resources.
2. Updates are more realtime because it is pushed as soon as available on the server.

## Setting it up
There are two ways to set up webhooks in Mailgun. It can either be done through the Mailgun dashboard or [API](http://mailgun-documentation.readthedocs.io/en/latest/api-webhooks.html#webhooks). The more straightforward way to do it is through the dashboard. Once logged into your dashboard, a **Webhooks** link is available on the navigation bar.

![](https://thepracticaldev.s3.amazonaws.com/i/m9ovyo98ezl699876a0d.png)

The webhooks page lists the different event types you can receive event data for. By clicking the **+** button in front of each event, you can set the URL the event data will be sent to.

## Handling the data
To handle the event data sent to our webhook URL, we must know what the data look like in the first place. Parameters sent via POST is available in the [API documentation](https://documentation.mailgun.com/en/latest/user_manual.html#tracking-opens). We can go a step further and confirm this by using a test webhook URL that will log the data from Mailgun. We can use [Mailgun’s Postbin](http://bin.mailgun.net/) or [requestb.in](https://requestb.in). These services will generate a unique endpoint we can use in the Mailgun dashboard to get sample event data. I recommend requestbin because it provides more details like the request headers. These headers are important because you will easily miss the fact that Mailgun sends some data using the content-type `application/x-www-form-urlencoded` and some as `multipart/form-data`. Missing this little detail changes everything about how you get the event data.

Let’s go ahead to create a test endpoint and see what the event data look like compared to what is in the documentation.

- Visit [requestb.in](https://requestb.in) and create a bin.
- Copy the URL and access the Webhooks section of your Mailgun dashboard.
- Paste the URL in the input field and click the **Test Webhook** link. This will send sample event data to the URL.
- Repeat this for all the events you are interested in.
- Refresh your requestbin page to see the event data sent.

![](https://thepracticaldev.s3.amazonaws.com/i/n04kozbkaeebyx5zhrwz.png)

If you look closely at the requestbin data, you will notice what I said about some data being sent as multipart/form-data.

![](https://thepracticaldev.s3.amazonaws.com/i/qb9swzuhpweep4t3c85y.png)

Now that we know what the parameters are for each event types and the content type they may come in, it is easy to write the code that will handle the sent data. Here is a simple code that will output details of **complaints** and **dropped** emails. (I am using [multer](https://github.com/expressjs/multer) to handle multipart/form-data)

{% highlight javascript %}
const express = require('express')
    , bodyParser = require('body-parser')
    , multer = require('multer')
    ;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.listen(process.env.PORT || 3000);

app.post('/webhook', multer().none(), function(req, res) {
  const email = req.body.recipient;
  const event = req.body.event;

  if (event == 'complained') {
    console.log(`${email} complained about your mail`);
  }
  else if (event == 'dropped') {
    console.log(`Mail to ${email} dropped. ${event.description}`);
  }
  else if (event == 'bounced') {
    console.log(`Error ${event.code}: Mail to ${email} bounced. ${event.error}`);
  }

  res.end();
});
{% endhighlight %}


## Making it secure
Nothing stops anyone that knows our webhook URL from crafting a false event data and sending it to the URL. Luckily, Mailgun signs each request sent and posts the following parameters along:

* **timestamp** (Number of seconds passed since January 1, 1970)
* **token** (Randomly generated string with length 50)
* **signature** (Hexadecimal string generated by HMAC algorithm)

To verify the token;

* Concatenate the values of **timestamp** and **token**.
* Encode the resulting string with HMAC, using your Mailgun API key as the key and Sha256 as the algorithm.
* The result should be the same as the signature.

Here is what it looks like in Node.js:

{% highlight javascript %}
const value = event_data_timestamp+event_data_token;
const hash = crypto.createHmac('sha256', apikey)
                   .update(value)
                   .digest('hex');
if (hash !== event_data_signature) {
  console.log('Invalid signature');
  return;
}
{% endhighlight %}

If we add that to our original code example, we will have something like this:

{% highlight javascript %}
const express = require('express')
    , crypto = require('crypto')
    , multer = require('multer')
    , bodyParser = require('body-parser')
    ;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.listen(process.env.PORT || 3000);

app.get('/webhook', multer().none(), function(req, res) {
  // Validate signature
  const value = req.body.timestamp+req.body.token;
  const hash = crypto.createHmac('sha256',
              process.env.API_KEY)
                   .update(value)
                   .digest('hex');
  if (hash !== req.body.signature) {
    console.log('Invalid signature');
    return res.end();
  }

  // Log status of event
  const email = req.body.recipient;
  const event = req.body.event;

  if (event == 'complained') {
    console.log(`${email} complained about your mail`);
  }
  else if (event == 'dropped') {
    console.log(`Mail to ${email} dropped. ${event.description}`);
  }
  else if (event == 'bounced') {
    console.log(`Error ${event.code}: Mail to ${email} bounced. ${event.error}`);
  }

  res.end();
});
{% endhighlight %}

We can even step this up and:

1.  For every request, check against a token cache to prevent use of the same token. Every token will be stored there. This will prevent replay attacks.
2. Check if the timestamp is not too far from the current time.

## Making it scalable
If you send lots of emails and you are expecting lots of events, putting your webhook script on a server that can’t scale automatically is a bad idea. Even if you are not expecting lots of events, unexpected things can lead to a surge in events. Having a server that can scale automatically is really useful for instances like this.

Enter [Serverless computing](https://en.wikipedia.org/wiki/Serverless_computing). In simple terms, the idea is that you can delegate the execution of your code and everything related to a provider. Because multiple instances of your code can be executed in parallel and you can adjust computing resources like RAM and execution time on the fly, it is highly scalable. You are also charged based on consumed resources and execution time so it can be really cheap.

There are a couple of serverless computing providers. One I use and recommend is [Google Cloud Functions](https://cloud.google.com/functions/) because of the ease of setting up *HTTP functions*. An HTTP function is a code block wrapped as a function that can be triggered by visiting a URL. This is exactly what we need as our webhook.

To create this function, we need to write a JavaScript function that will be exported as a Node.js module. The function takes HTTP-specific arguments: `request` and `response`.

{% highlight javascript %}
exports.webhook = function(request, response) {
  // Handle event data here
  response.send({status:"ok"});
}
{% endhighlight %}

Based on the request *content-type*, the body of the request is automatically passed and available in the **body** parameter of the request object.

{% highlight javascript %}
exports.webhook = function(request, response) {
  let event = request.body.event; // delivered
  // Handle event data here
  // ...
  response.send({status:"ok"});
}
{% endhighlight %}

This doesn’t work for the content type *multipart/form-data* though.  And as we already know, Mailgun sends some data as multipart/form-data. We can bring in a library like Multer by using **require()**. However, we need to ensure the dependency is listed in the *package.json* file.

{% highlight javascript %}
const multer = require('multer');

exports.webhook = function(request, response) {
  parser(request, response, function(){
    console.log(request.body); // Our event data
    // Handle event data here
    // ...
    response.send({status:"ok"});
  });
}
{% endhighlight %}

{% highlight json %}
{
  "dependencies": {
    "multer": "^1.3.0"
  }
}
{% endhighlight %}

Next, we can publish the function to Cloud Functions. An easy way to do this is to do it from the Cloud Functions dashboard.

- Go to your [Google Cloud Console](https://console.cloud.google.com) (if you don’t have an account yet, create one).
- Enable Cloud Functions in the dashboard.
- Click on **Create Function**.
- Enter a name for your function (e.g *mailgun-webhook*).
- In the trigger section, select **HTTP trigger**. Note the URL, that will be your webhook URL.
- Copy your event data handling code to the **index.js** section of the Cloud function.
- Copy the content of your *package.json* and paste in the **package.json** section.
- Select or create a **Stage bucket**. The stage bucket is simply where the code is staged. You can use anything here.
- In Function to execute, enter the name of your function (e.g **webhook**).
- Save.

You can now use the function’s URL in Mailgun as your webhook URL.

## Conclusion
Working with Mailgun’s webhooks is easy. There are many ways the event data can be used to enrich your applications outside Mailgun. If for example you allow your users send emails from your web for any reason and you use Mailgun, you can use this to provide analytics for them. Or maybe you want to send your email analytics to another platform. Or maybe you want to be notified of failures in your Slack account. Or maybe not even that. Maybe you just want more detailed analytics than what is available on the Mailgun dashboard. Whatever the use case is, the event data is available for you.

For a real world example, check out the source of [Suet’s webhook file](https://github.com/kehers/suet/blob/master/workers/hooks/index.js).
