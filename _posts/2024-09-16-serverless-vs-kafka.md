---
title: "Serverless vs Kafka"
date: 2024-09-16 00:00:00 Z
layout: post
---

I have been moving a lot of [Engage's](https://engage.so/) architecture to Kafka of late. Even though the monolithic side has been winning the microservice vs monolithic debate in recent times, I am still a big fan of serverless microservices—using PaaS (we use Google Cloud) to host microservices. To be fair, what we do is more of a serverless architecture than a proper microservice architecture but our design goal aims to achieve the same as with a microservice architecture. This has helped us handle millions of events daily from the API and [integrations](https://engage.so/integrations) with less worry about scalability.

So why move off PaaS? A couple of reasons. Top of it are two things. 
1. Bringing together many separate services to make them compact—easier testing, faster interpolation of shared resources, more flexibility, and simpler deployment.
2. [Predictive service cost](https://serverlesshorrors.com/). Note that this is not the same as being cheaper, although our current Kafka setup is, which is great. Being predictive is that I know I am going to pay just about the same amount whether or not I processed 50 million or 1 million events during the month. 

But is the grass really greener on the Kafka side? Nope.

There is the initial overhead of setting things up. (This is if you want to self-manage. You can get another PaaS that can do that for you. There are a couple of managed Kafka services). There is also your consumer design, which is a crucial part. You need to be able to design your consumers in a way that they can consume messages concurrently and efficiently. If for example, you have a topic with 100 partitions that is receiving messages at that throughput, or even more, then you need consumers processing at that speed as well. Now think of 10 topics of similar throughput. So what are you looking at? Threads? Multiple container instances? Node pools? With a serverless architecture, Google Cloud Function for example, you can specify a minimum and maximum number of instances to be deployed to handle such throughput and everything automatically gets taken care of for you. And that’s the beauty of serverless. You are less bothered about the abstraction.

There are other things. Kafka doesn’t have any delay mechanism. Most serverless PaaS do. Amazon SQS has delays. Google Pub/Sub doesn’t but you can use Cloud Tasks.

There is also monitoring and logging. Monitoring is how you know when something is wrong with Kafka or your consumers are failing. Logging is how you ensure messages are properly processed. I have found heartbeats monitoring a good way to monitor consumer uptime. For every consumer, register a heartbeat every time a message is processed. If no message is processed within a time frame (this will depend on the type of message the consumer processes), trigger an alert. (Betterstack has a [good heartbeat monitoring](https://betterstack.com/docs/uptime/cron-and-heartbeat-monitor/) service).

All that said, things are holding up fine so far. Would our dependence on [serverless] PaaS be zero? I honestly doubt it. 