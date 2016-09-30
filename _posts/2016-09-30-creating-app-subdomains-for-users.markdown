---
published: true
title: Creating App Subdomains for Users
layout: post
---
Someone sent me a [message on Twitter](http://twitter.com/kehers) asking how to automatically create user subdomains and further allow users point their preferred domain to the subdomain. So I think I should just do a quick one about it as it really isn't a complex thing.

A lot of web apps do this. A big example is Tumblr. Once you signup, you get a shiny subdomain based on your selected username, e.g [appscreens.tumblr.com](http://appscreens.tumblr.com/). Another example is Github pages which this blog runs on. On setup, I get [kehers.github.io](http://kehers.github.io/). What I later did was to register [obem.be](http://obem.be/) and point it to [kehers.github.io](http://kehers.github.io/)

There are two things here. One is creating subdomains for users. You can then take it a step forward to allow users register a custom domain and point that domain to the subdomain. 

Let's start with creating user subdomains. If you are familiar with vhost on Apache, you will understand creating subdomains. But we can't create a vhost file for every user that signs up on our app. Remember, to put this in effect, Apache needs to be restarted for every new vhost file as well. Instead of that, the trick here is to create a catch-all CNAME that directs all requests to the same script. Here is what it looks like in DigitalOcean's dashboard.

![](/assets/image/{{ page.date | date: '%Y/%m' }}/catchall.gif)

The * is the catch-all. The @ simply means the server IP. (I could have actually put the server's IP there. It's the same thing). In other words, I'm saying redirect **all subdomains** to the server. On my server, I can now check and see the referring subdomain. In PHP, I can find this in the `$_SERVER['HTTP_HOST']` variable[1]. All I need to do is create an `index.php` script that looks like this in my server document root:

{% highlight php %}
<?php
# /var/www/html/index.php
echo $_SERVER['HTTP_HOST'];
?>
{% endhighlight %}

If the application's domain is **mood.board** and a visitor visits **kehers.mood.board**, the `$_SERVER['HTTP_HOST']` will be **kehers.mood.board** and the script will echo that. Now we can extend that to something more useful.

{% highlight php %}
<?php
$host = $_SERVER['HTTP_HOST'];
list($subdomain, $domain) = explode('.', $host);
// Is there a subdomain? Nope
if ($domain == 'board') {
    // Load generic home page
   Views::index();
    exit;
}
// ...yes. Get attached user
$user = Users::get($subdomain);
if (!$user) {
   // User not found (signup?) error page
  Views::errorPage('404');
  exit;
}

Views::renderUserPage($user);
?> 
{% endhighlight %}

Let's move on to the second part-allowing users register and point their custom domain to their account. 

The process is almost the same as creating the subdomains. We direct users to add an A record that points the custom domain to our server IP. If for example mood.board's IP is **159.203.123.147**, and I registered **opeyemi.board** to point to my **kehers.mood.board** address, I just need to create an A record for **opeyemi.board** and point it to **159.203.123.147** like this:

![](/assets/image/{{ page.date | date: '%Y/%m' }}/opeyemi-board.gif)

What this does is to redirect visitors of the domain to our server. We can then get the redirecting domain still using `$_SERVER['HTTP_HOST']`. If a visitor visits **opeyemi.board**, `$_SERVER['HTTP_HOST']` will then be **opeyemi.board**. We just need to update our script to make provision for this.

{% highlight php %}
<?php
$host = $_SERVER['HTTP_HOST'];
// Check if custom domain
if (!preg_match('|mood\.board$|i', $host)) {
    $user = Users::getByDomain($host);
}
else {
    list($subdomain, $domain) = explode('.', $host);
    // Is there a subdomain? Nope
    if ($domain == 'board') {
        // Load generic home page
       Views::index();
        exit;
    }
    // ...yes. Get attached user
    $user = Users::get($subdomain);
}
if (!$user) {
   // User not found (signup?) error page
  Views::errorPage('404');
  exit;
}

Views::renderUserPage($user);
?> 
{% endhighlight %}

It's that simple. The only other little details is allowing user use a non root domain by forwarding the CNAME (instead of an A record) to our server. So instead of **opeyemi.board**, I may prefer to use **board.obem.be**. To do this, we tell users to forward non root domain addresses to a particular subdomain under our domain. For our moodboard example, we can tell users to forward their non root domains to **alias.mood.board**. Remember, we have a catch-all CNAME in place so all subdomains redirected to **alias.mood.board** still go to the same place.

![](/assets/image/{{ page.date | date: '%Y/%m' }}/obembe.gif)

(Note: I added a dot after alias.mood.board when adding the CNAME because the domain dashboard requires this)

[1]: The HTTP_HOST server variable can be a little tricky. Read more about this here: http://shiflett.org/blog/2006/mar/server-name-versus-http-host. If you have a simple straightforward server Apache setup, you should be fine though.