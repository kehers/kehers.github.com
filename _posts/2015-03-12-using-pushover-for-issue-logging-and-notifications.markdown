---
published: true
title: Using Pushover for issue logging and notifications
layout: post
---
Things go wrong within applications, in production. A good thing to do is to build a way to automatically capture and log the issue and related data. This way, these issues don't just go unnoticed. And the location of the issue is known too, which is like half problem solved.

Here is an example source:

{% highlight javascript %}
db.collection('products').findOne({url : link}, function(err, doc) {
  if (err) {
    // Some unexpected error here. What could it be?
    // Log it!

    return;
  }

  // ...
});
{% endhighlight %}

There are a lot of ways to log application errors from file to sending an email. I have even used Mixpanel (in cases where I am already using Mixpanel for other events). Another trick is using Twitter. Register a twitter account, make it private, 'tweet' the logs and follow the account. Or send the logs to yourself as DM. Another interesting way I recently discovered is using [Pushover](http://pushover.net/).

Pushover works in two simple steps.

1. You <del>create</del> register an application (and get an API key). You can start sending notifications via the [API](https://pushover.net/api) or any of the [apps and plugins](https://pushover.com/clients).
2. You add a device to receive notifications on. This can be any of the [Android, iOS and desktop clients](https://pushover.com/clients). Costs a one time $5 fee that is absolutely worth it. Once there is a notification for any of your app, the device gets the notification via push. You can also create groups and allow multiple people receive notifications for any of your applications.

Back to our example source, we can use Pushover to log the issue and send a notification. For NodeJs, I use the module [Pushover Notifications](https://github.com/qbit/node-pushover).

{% highlight javascript %}
var push = require('pushover-notifications'),
   // other modules here
  ;

// My PushOver tokens (set in my environment)
var pusher = new push({
    user: process.env['PUSHOVER_USER'],
    token: process.env['PUSHOVER_TOKEN']
  });

db.collection('products').findOne({url : link}, function(err, doc) {
  if (err) {
    pusher.send({
      title: 'DB error',
      message: 'Link: '+link+'; Error: '+err
    });
    return;
  }

  // ...
});
{% endhighlight %}

Once there is an error, this will send a push notification to my device (I am using the Android app). Easy and works.

PS: If you are looking for a logging class for PHP, check out [Monolog](https://github.com/Seldaek/monolog).