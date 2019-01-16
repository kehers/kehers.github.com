---
title: Javascript, form reset and hidden fields
date: 2014-02-06 00:00:00 Z
layout: post
---

Quick heads up, form reset doesn't clear values of hidden fields. To properly clear form fields and hidden inputs, you can do this in JQuery:

{% highlight php linenos %}
$("#form")[0].reset();
$("input[type=hidden]").val('');
{% endhighlight %}