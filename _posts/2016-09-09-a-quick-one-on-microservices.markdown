---
title: A quick one on microservices
date: 2016-09-09 00:00:00 Z
layout: post
---

### Context
Following links shared on my Twitter timeline has been something I have been interested in. [One experiment](http://github.com/kehers/fave) was to send links in Tweets I fave to my pocket account. But then my unread Pocket articles kept growing. Plus what happens to links I miss and didn't fave on the timeline? Why not a service that constantly checks my timeline and saves the links instead? (Something between Pocket and Nuzzle). This led me to build a [tiny service](http://thefeed.press) I have been using to follow articles shared on my timeline for some months now. I recently moved the core of the service, the part that constantly checks the timeline, from iron.io worker to Amazon Lambda and wanted to write about it. It however just feels odd writing about queues, workers, iron.io and Amazon Lambda without writing about why such architecture in the first place. 

In this piece, I'm going to really briefly talk about the microservice architecture. In the next, I will talk about queues, workers and Iron.io, then later, Amazon Lambda. 

### Ok, back to microservices

The idea of microservices, in the simplest form, is breaking down big components of a web app into tiny parts - services. This form of decoupling means it is easier to maintain and scale the separate parts on their own. The core of the app can also be kept very lean by letting other platforms handle the other services. 

Let's take a basic example. Let's imagine we want to build a moodboard service. Users signup/login, upload images, view uploads and that's it. Basic CRUD stuff right? I mean we could spin a DigitalOcean server with NodeJs, MongoDb, sendmail capabilities and write a monolithic code that manages uploads, save files in special folders, send transaction mails, manage authentication and every other thing. And this may not be a bad idea for something personal or for a few friends. However, if adoption increases or we throw in a couple of more features, things will start going out of hand. And say we up things a little bit:

- We generate 2 thumbnail versions of uploaded images for smaller screens
- Users can create collections and share with their friends
- Friends can comment/like which means we have to send notifications, so more transactional emails

We would need to update our code to generate the thumbnails, send the notification mails too, best in the background.

A better development approach would be to really separate some of these parts into components that can stand on their own but also communicate with the others. Now we are talking:

- Transactional email sending (password recovery and notification stuff)
- Image processing and storage
- Background jobs

Where it gets interesting is we can now abstract some of these components to services that are better at the job. Transactional emails can be handled by [Mailgun](http://mailgun.com/). We can use [Imgix](http://imgix.com/) and [Amazon S3](http://aws.amazon.com/s3) for our image conversion and storage. And [Iron.io](http://iron.io) can take care of the background jobs. If we don't want to even sweat about the database, we can hand it off to services like [MLab](http://mlab.com/) or [compose.io](http://compose.io/). This consequently translates to less coding time.

In reality, it's a little more but this is just a simple breakdown. The core idea is to break down a monolithic architecture into many separate parts that can stand on their own. The end game is easier to manage codebase, faster deployment and better scalability.