---
published: true
title: On Curl's CURLOPT_NOBODY
layout: post
---
Curl has a CURLOPT_NOBODY option that allows you exclude the body from the output. In other words, only the HTTP headers are returned in the request; the content is not. This is extremely useful when you need to just "hit" a URL and "leave" without retrieving the content. Or say you want to verify a link works or get details of a resource (size of an image or mp3 file for example) without downloading it.

What many don't know however (just did myself) is that underneath, the option sets the request method to [HEAD](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.4). That said, never use the option when making a POST; whether you need the result or not!

{% highlight php linenos %}
$ch = curl_init();
curl_setopt($ch, CURLOPT_NOBODY, true); // <-- Dont!
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_exec($ch);
curl_close($ch);
{% endhighlight %}

Interestingly, that [may] work. The data may still get posted. (I still insist you shouldn't do it though). Where you run into troubles is when you are not posting www-urlencoded form data - JSON for example. In my case, I was sending some JSON data from PHP to a NodeJS server.

{% highlight php linenos %}
$ch = curl_init();
$headers = array('Content-Type: application/json');
curl_setopt($ch, CURLOPT_NOBODY, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_exec($ch);
curl_close($ch);
{% endhighlight %}

{% highlight js linenos %}
var http = require('http')
    ,express = require('express');

var server = http.createServer(app).listen(3000);
app.use(express.bodyParser());

app.post('/post-endpoint', function(req, res){
    console.dir(req.body); // <-- nothing!
    res.end();
});
{% endhighlight %}

I wasn't getting anything in my post-endpoint till I removed the CURLOPT_NOBODY option.