---
title: Building an SMS spam filter II
date: 2014-09-24 00:00:00 Z
layout: post
---

I started an experiment on spam filtering for SMS the other week. I called it **Snag**. You can read about it here already: <https://kehers.github.com/2014/09/07/building-an-sms-spam-filter.html>. 

The way Snag should work is

1. Intercept incoming SMS
2. Match against trained data
3. If spam, save in a separate db and block from reaching the phone's message inbox (or any other message app)

1 and 2 work already. 3 works on Android versions below 4.4. From Android 4.4 (Kitkat), you can no longer block SMS from other messaging apps. [More details about this here](http://android-developers.blogspot.com/2013/10/getting-your-sms-apps-ready-for-kitkat.html). In other words, while Snag will intercept an incoming message and detect if it is spam or not, it won't be able to stop it from reaching the phone's inbox in Android versions from 4.4. The workaround is to develop a full SMS application. Unfortunately, that is a time I don't have now so I have to halt development and opensource it. You can find it on Github here: <http://github.com/kehers/snag-android>

## What good is that then?
If you are interested in finishing it for < 4.4, the source is a good headstart for you. I have done some views, the interception and spam detection work already. The only things left to do are:

1. Create the single message view. (The list view for all messages done)
2. Allow users add a message to the training data (using the + icon)
3. Let users delete and "un-spam" a message
4. Add boring static content - about, feedback, rate

Another thing you can use this for is to create an app that listens to incoming messages to perform an action - OTP verification for example. Just strip away the spam classification part and use the SMSListener part.

## DB Schema
Snag contains an existing database of words based on spam data from <https://docs.google.com/document/d/1TldaHwtLwuAq8paUyjLLUuJqthjYvymOMk5Op8gtR4Y/edit> and non-spam from my phone. The ```words``` table contains the columns ```word```, ```ham_count``` and ```spam_count```. There is also a ```likely_spam``` table where detected spam messages are stored. It has the columns ```id```, ```sender_id```, ```body``` and ```date```.

You will find the database in ```/assets/snag.db```. It includes the training data. If you don't have an SQLite client and you run on Firefox, you can download the [SQLite Manager addon](https://addons.mozilla.org/en-US/firefox/addon/sqlite-manager/) to explore the data.

If you need to ask me anything, even non-related to the project, be free to send me a mail on kehers@gmail.com or to [@kehers](https://twitter.com/kehers) on twitter.