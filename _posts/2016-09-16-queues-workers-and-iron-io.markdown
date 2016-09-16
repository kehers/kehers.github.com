---
published: true
title: Queues, Workers and iron.io
layout: post
---
*[In the last piece](/2016/09/09/a-quick-one-on-microservices.html), I briefly talked about the microservice architecture. In this, I will touch on queues, workers and iron.io. In the next, computing with Amazon Lambda. To keep it concise, I will break this to two parts. This part will be more of theoretical context stuff. The second will be more of how-to codes and screenshots.*

### Queues
A queue in computer terms means almost the same as the plain english term. A simple way to put that is that it's a list of [data] items to be attended to in a particular order (mostly [First-In-First-Out](https://en.wikipedia.org/wiki/FIFO)). But if we look at queue from the 'item store' perspective alone, it does not make a lot of sense. I mean why put items there in the first place?

The beauty of queues come from how the data is retrieved and used. Because queues are designed to work across services and platforms, a totally separate script outside your main application or server can be *polling* the queue at set intervals to retrieve data sent in and process it. Some queues can even *push* to the receiving service once data comes in or at set intervals. Think of the load that could save your stack. For example, [Writerack Pro](http://writerack.com/) allows users set a custom delay interval for their tweets. How this works is that when you compose a 10-tweet tweetstorm and set the tweet interval to 30 seconds, we send all 10 tweets to a queue set to push to the "post tweet" service at 30 seconds interval. As another example, [Gomyway](http://gomyway.com/) lets users subscribe to route availability. Once a new ride is posted, the ride data is sent to a queue where a service checks for people subscribed to that route and sends them a notification. So we can say queues allow us store data we want to process so that it can be processed in an orderly way.

Another beauty of this is in form of intentional delayed execution. Remember our [Moodboard app](/2016/09/09/a-quick-one-on-microservices.html)? We can use queues to delay notifying users of likes and comments on their images by few minutes. If the friend changes his/her mind and unlike or delete the comment within that interval, we can delete the notification data from the queue. No need getting notification for a like or comment that doesn't exist any more.

### Workers

Workers are programs or scripts that perform specific tasks in the background, outside the main program; like posting a tweet (as with the Writerack example) or sending an email (as with Gomyway). These are the guys at the other end of our queues. (Workers are not always used with queues though).

Queues are most times used with workers. Some queues actually come with workers. These are called *task queues*. An example is [Celery](http://www.celeryproject.org/). A message is added to the queue, a *broker* then delivers it to a worker for processing. (See this old post of [how Instagram feeds work](http://blogs.vmware.com/vfabric/2013/04/how-instagram-feeds-work-celery-and-rabbitmq.html)). Queues that only store data are called *message queues*. You will need a worker to poll the queue for "messages" from time to time and process it. Some can even push incoming messages to the worker.

### Iron.io

[Iron.io](http://iron.io/) is a hosted queue and worker service. (They also have a cache service I have never tried). There are other hosted services. Amazon for example has [Amazon Simple Queue Service](https://aws.amazon.com/sqs/). The reason I'm writing about iron.io is because it's the only one I have used extensively. [Writerack](http://writerack.com/) runs on it, [TheFeed Press](http://thefeed.press) was on it. There are also self-hosted queues and workers. You will find a big and detailed list on [Queues.io](http://queues.io/). I have used [Gearman](http://gearman.org) in the past for [Tinypress](http://tinypress.co/)([source](https://github.com/kehers/tinypress/blob/master/queue_workers/change_theme.php)) but these days I tend towards hosted services.

In the next part, I will show some real world examples and code walkthroughs working with iron.io