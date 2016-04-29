---
published: true
title: "now - realtime node.js deployments"
layout: post
---
[Now](http://now.sh/) allows you deploy nodejs applications in realtime, from your terminal. Think of this as a simpler Heroku for nodejs. You simply run `now` in your project directory and you get a unique URL similar to this: https://yo-smppqrgsbt.now.sh

### Installation

My fav thing about this is how easy it is setup and use. You only need to install the node module globally (the g flag).

{% highlight javascript %}
$ sudo npm install -g now
{% endhighlight %}

### Usage

To deploy, just run `now` in your project directory. I will create a simple project as an example.

{% highlight javascript %}
$ mkdir radio-one
$ cd radio-one
{% endhighlight %}

Our project directory needs to have the package.json file so we need to initialize one.

{% highlight javascript %}
$ npm init
{% endhighlight %}

This prompts some questions to generate the `package.json` file. I basically just go with the default. (Just press enter all through). Here is what I get for my package.json

{% highlight javascript %}
{
  "name": "radio-one",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Opeyemi Obembe <kehers@gmail.com> (http://obem.be/opeyemi)",
  "license": "ISC"
}
{% endhighlight %}

But one more thing - the file needs a `start` command so we add one.

{% highlight javascript %}
{
  "name": "radio-one",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Opeyemi Obembe <kehers@gmail.com> (http://obem.be/opeyemi)",
  "license": "ISC"
}
{% endhighlight %}

Now that we have the `package.json` file, let's create a simple experiment. Here is where I create a simple code that prints 'Hello world' but let's do something more interesting. Let's create a simple API experiment. ([I love APIs](http://gum.co/Sxoj)). Let's get the [BBC Radio 1's](http://www.bbc.co.uk/radio1) playlist and display it. The API endpoint is `http://www.bbc.co.uk/radio1/playlist.json` and it requires no authentication. We just send a `GET` request to it and format the JSON response.

I will need [express](http://expressjs.com) module for routing and [request](https://github.com/request/request) module for HTTP request, so let's install them.

{% highlight javascript %}
$ npm install --save express request
{% endhighlight %}

(--save adds the modules to our package.json file)

Now our `index.js` code

{% highlight javascript %}
'use strict'

const request = require('request')
    , app = require('express')()

app.get('/', (req, res) => {
  request('http://www.bbc.co.uk/radio1/playlist.json', (error, response, body) => {
    if (error || response.statusCode != 200) {
      // Something is messed up
      return res.sendStatus(400);
    }

    try {
      let json = JSON.parse(body);
      let html = `<html><head><title>BBC Radio 1</title>
    <style>
    * {
      margin: 0;
      padding: 0;
    }
    ul {
      list-style: none
    }
    li {
      display: inline-block;
      width: 20%;
    }
    img {
      width: 100%;
      display: block;
    }
    p, h3 {
      padding: 10px
    }
    </style>
    </head>
    <body>
    <h3><a href="http://www.bbc.co.uk/radio1">BBC Radio 1 Playlist</a></h3>
    <ul>`;
    // Let's do just the 'a' Playlist: json.playlist.a
    for (var track of json.playlist.a) {
      html += `<li>
        <img src="${track.image}">
        <p><strong>${track.title}</strong><br>
        ${track.artist}</p>
      </li>`;
    }
    html += `</ul></body></html>`;
    res.send(html);
    }
    catch(e) {
      // console.log(e);
      return res.sendStatus(400);
    }
  });
});

app.listen(3000);
{% endhighlight %}

(Ideally, you should use a template engine for the html. I am using es6 template literals here to keep things simple.)

Now that we have our code, all we need to do to deploy is to type `now` in the project directory in our terminal.

{% highlight javascript %}
radio-one $ now
{% endhighlight %}

If it's your first time, `now` requests for your email and sends you a verification link. Once deployed, your deployment url is returned. Here is mine [https://radio-one-yufyrttcin.now.sh](https://radio-one-yufyrttcin.now.sh). You can see the source here [https://radio-one-yufyrttcin.now.sh/_src/?f=index.js](https://radio-one-yufyrttcin.now.sh/_src/?f=index.js) (Just add `_src` after the URL)

### Takeaways

Note: a lot of things I will mention will probably be due to the fact that it's a really new project. I mean, the latest version is 0.10.0. However, here are my takeaways:

**Ports**

I love how you can listen on any port. As you can see from my source, I used :3000 but the deployment is available on 80 on [https://radio-one-yufyrttcin.now.sh/](https://radio-one-yufyrttcin.now.sh/)

**Deploy counts and Pricing**

The free plan comes with 20 monthly deploys among other limitations like bandwidth, storage and filesize. I don't think deployments should count as a limiting factor. It's easy to blow 20 deploys on a single project in under an hour.

`now` generates a unique URL for every new deployment. This means if you update a single character, it is treated as a new one and you get a new URL. (The old one will still work by the way). I should be able to consolidate my deployments to a single URL. ~~Or/and delete ones I no longer need.~~ (Update: From 0.11.0 you can delete deployments with [`now -rm`](https://zeit.co/blog/now-rm-is-here-and-more)

Still on pricing, there is no details about upgrading to the premium plan. I was also expecting to see custom domains somewhere [there](https://zeit.co/now/#pricing).

**DB hosting**

Nothing on database hosting yet. Well for me this is not a biggie. You can always host your database somewhere else and just use the db url. For mongodb, [mLab](https://mlab.com/) for example has a free 500MB sandbox plan.

In conclusion, if you want to run quick experiments or need quick webhooks for that bot, you can use `now`. It's simple and cool. This is one project I am closely following.
