---
published: true
title: 4 little open source projects 
layout: post
---
Here are 4 small open source projects I have created this year.

##1. Ubercodes

This was an experiment with [Twitter Streaming API](https://dev.twitter.com/streaming/overview). How do you connect to the stream of Twitter public tweets to get tweets containing specific terms? 

Ubercodes listens to Twitter for the words "**uber code**". The search words can be anything. At that moment, I was just interested in seeing the number of people tweeting Uber codes per minute. 

The code is written in Node.js which makes sense because of the streaming connection and sending matched tweets from the server to the front end via web socket.  

Source: [github.com/kehers/Ubercodes](https://github.com/kehers/Ubercodes)    
Language: Node.js

##2. Cabbie

We added [two-way SMS to Fonenode](https://fonenode.com/docs#sms) and to showcase it, I built Cabbie. Cabbie allows you interact with the [Uber API](https://developer.uber.com/) via SMS. Don't judge my sudden interest in Uber :D. The API was new and I wanted to check it out.

Source: [github.com/fonenode/Cabbie](https://github.com/fonenode/Cabbie)    
Language: PHP

##3. Fave

I use IFTTT to push links in tweets I fav to Pocket. But many times, the links end up broken and the original tweet is not attached in Pocket (Pocket API allows you attach a tweet to an item by specifying the tweet id). So I created Fave. Simple idea - use the Twitter API to pull the user's faved tweets, check for URLs and push through the Pocket API to Pocket. There are other plans, but it's that simple for now.

By the way, the 2 minute cron that checks for favs is not scalable. I will probably move it to [IronWorker](http://www.iron.io/worker/) when I have the time.

Source: [github.com/kehers/fave](https://github.com/kehers/fave)   
Language: Node.js   
Hosted version: [fave.ninja](http://fave.ninja/)

##4. Billtab

My friends and I have a money pool for house expenses - fuel, food, power, cable TV, internet, etc. I tried using Google sheets to manage it but didn't work quite well. So I created a shared expense/earning tracker - Billtab.

Billtab should allow any member of the team manage the earnings and expenses and display detailed monthly reports based on tags and user. But it doesn't work like that yet. For now it's just a simple expenses/earnings tracker that works offline.

Source: [github.com/kehers/billtab](https://github.com/kehers/billtab)   
Language: HTML5, CSS3, Javascript (Backbone.js)   
Hosted version: [billtab.co](http://billtab.co/)

PS:

I am writing an ebook on Consuming REST APIs. Follow the progress here: [gumroad.com/kehers](https://gumroad.com/kehers)
