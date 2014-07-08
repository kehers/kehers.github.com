---
published: true
title: URL rewrites with Apache and PHP
layout: post
---
We all love fancy URLs.

1. You get to hide your file extensions, e.g [tinypress.co/about](https://tinypress.co/about) (no .html, .php or whatever)
2. You get to do interesting RESTful patterns, e.g ```twitter.com/[username]/status/[tweet id]``` which are not only good for SEO but are beautiful and can easily be guessed by users.

The common approach to URL rewrites in Apache is to use the popular [mod_rewrite](http://httpd.apache.org/docs/2.2/mod/mod_rewrite.html). You simply create a .htaccess file where you turn on the rewrite engine (the rewrite mod must be enabled already) and add some rewrite rules.

Here is a sample .htaccess rewrite that "masks" the URL ```[domain]/showposts.php?tag=php``` as ```[domain]/tag/php```

{% highlight text %}
RewriteEngine on
RewriteRule ^tags/(.*)$ showposts.php?tags=$1
{% endhighlight %}

The user types ```[domain]/tag/php``` (or clicks a similar link) and that shows in the address bar. However, under the hood, the url is converted to ```showposts.php?tags=php```.

Our ```showposts.php``` script will then look something like this.

{% highlight php %}
<?php
$tag = $_GET['tag'];
// Rest of script goes here
?>
{% endhighlight %}

It is that simple for few rewrites but can get quite complex and messy when you have to handle a lot of rewrites. Let's look at a scenerio. Consider the [Fonenode API](https://fonenode.com/docs) for example. There are 5 resources (Response, Calls, Numbers, Groups and Billing) and over 16 methods in all. The endpoint for the methods are like these:

- /v1/calls/
- /v1/calls/quick
- /v1/calls/[call id]
- /v1/responses/
- /v1/responses/[response id]

While it may not be a big deal to write rewrites for 16 endpoints, it is not scalable. As your resources/endpoints grow, it becomes more complex.

## Rewrite with MultiViews

One simpler way to achieve rewrite is using the **MultiView** option. ([mod_negotiation](http://httpd.apache.org/docs/2.2/mod/mod_negotiation.html) must be enabled for this). It is still not an elaborate solution but you can easily use it to

1. Hide URL extensions.
2. Redirect RESTful URLs to a base file

If we replace out htaccess with this

{% highlight text %}
Options +MultiViews
{% endhighlight %}

and create a file ```tags.php```, we can visit ```[domain]/tags``` instead of ```[domain]/tags.php``` and everything will work as should (as 1 above). If we visit ```[domain]/tags/php```, Apache serves the ```tags.php``` file i.e redirects to the base file (2 above). The full path is accessible via the ```$_SERVER['PATH_INFO']``` variable and you can use that inside your base script.

So in ```tags.php```, we can have

{% highlight php %}
<?php
$tag = $_SERVER['PATH_INFO']; // => /php
// Remove preceding/trailing slash
$tag = trim($tag, '/');
// Rest of code here
?>
{% endhighlight %}

## One step further - using a route file

A completely different approach is to redirect all traffic to a file and that file takes care of routing by matching the intended URL and using switch/if case to include the necessary file. This is more flexible.

Back to htaccess, we can have:

{% highlight text %}
RewriteEngine On

RewriteCond %{SCRIPT_FILENAME} !-f
RewriteCond %{SCRIPT_FILENAME} !-d    
RewriteRule ^(.*)$ route.php/$1
{% endhighlight %}

What that means is if the file or directory typed in the address bar doesn't exist, redirect to ```route.php?url/user/typed```. So say the user types ```[domain]/about/company```, the URL is converted to ```route.php?about/company``` in the "background".

Our ```route.php``` file will then look like this 

{% highlight php %}
<?php
$requested = $_SERVER['REQUEST_URI']; // => /about/company

// Formatting kungfu here
// You may want to strip preceding/trailing slashes
// Remove queries in url, etc

$pages = explode("/", $requested);
// print_r($pages)
switch ($pages[0]) {
    case 'about':
        // ...
    break;
    default:
        // include home page view
    break;
}
?>
{% endhighlight %}

I try to keep that simple but you should get the idea. By using this method you have just one controller for your routes and you can easily manage lots of URL rewrites. Where it gets interesting is you can create even more elegant solutions using this technique.