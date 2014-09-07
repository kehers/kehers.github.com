---
published: true
title: Building an SMS spam filter
layout: post
---
TL;DR

I am experimenting with a spam filter for SMS. You can demo an implementation here: [kehers.github.io/experiments/snag](http://kehers.github.io/experiments/snag). (Or download here: [github.com/kehers/snag](http://github.com/kehers/snag)). If you are interested in the final app, get notified here: [tinyletter.com/kehers](https://tinyletter.com/kehers)

/TL;DR

Addressing SMS spam (there has been a lot of it lately) is a simple thing theoretically.

1. Listen to incoming messages
2. Detect if it is spam
3. Block it. Or save it elsewhere. Or delete it. Whatever.

1 and 3 are simple but 2 is a bit tricky. The easy way is to check if the sender id is in a list of senders that have been marked as spam. Or we can mark all SMS with a sender id that match a format, e.g numerical sender ids that is less than 8 characters, as spam.

<blockquote class="twitter-tweet" lang="en"><p>if (sms.sender.length &lt; 8 &amp;&amp;&#10;    isDigit(sms.sender)) {&#10;    sms.delete();&#10;}</p>&mdash; Opeyemi Obembe (@kehers) <a href="https://twitter.com/kehers/status/497668397686333441">August 8, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

This works. But one, you have to keep marking new sender ids as spam. And then, some senders use the same sender id to send spam and non-spam messages - the sender id **MTN N** for example. Blocking all sender ids less than 8 characters in length won't work efficiently either. Many important messages come from sender ids less than 8. My Etisalat data messages for example.

What about we detect spam SMS a similar way to how emails do it? We can use a simple classification algorithm, [Naive Bayes](http://en.wikipedia.org/wiki/Bayesian_spam_filtering), that is also used by many email spam filters.

##Naive Bayes

Naive Bayes uses [conditional probabilities](http://en.wikipedia.org/wiki/Conditional_probability) to detect the likelihood that a word (or group of) belong to a category. In simple form, let's assume the word "**now**" appears 3 times out of 84 spam words and just once out of 250 non-spam words (let's call this ham). What is the probability that a message with **now** is a spam or ham? Well we can say, the probabilty that it is spam is 3/84 = 0.0357 and the probability that it is ham (not spam) is 1/250 = 0.004. Obviously, 0.0357 is more than 0.004, so we can say it is spam. 

But it is not that straightforward. Here we are assuming many things. The real formula is
 
    P(spam/now) = P(now/spam) * P(spam) / (P(now/spam) * P(spam) + P(now/ham) * P(ham))
    P(ham/now) = P(now/ham) * P(ham) / (P(now/ham) * P(ham) + P(now/spam) * P(spam))

For our example, we are assuming equal probabilities that a message is spam or ham, i.e for every 2 messages, 1 is spam and the other is ham. This means P(spam) = P(ham) = 1/2.
Then again, both denominators (called evidence) are the same. They are constants so we can ignore them. This therefore reduces the formula to 

    P(spam/now) = P(now/spam)
    P(ham/now) = P(now/ham)

Again, this is because we have just two categories - spam and ham and assuming equal probabilities of both.

##Implementation
By using this algorithm, we can [combine the probabilties](http://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering#Combining_individual_probabilities) of words in an SMS. This means we find the probability of each word in the text and combine (multiply) them. For this experiment, I am using a modified version called [corrected probability](http://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering#Dealing_with_rare_words) to deal with [rare] words that may not exist in the training data.

There are other slight modifications here and there. One is ignoring words that are less than 3 characters in length. I still need to test if this is really necessary though. In SMS, every word seem to count - even stop words like **a**,**at**,**be**.

Another thing I am taking into consideration is case sensitivity of words. Therefore, the words **free** and **FREE** are considered different words and not the same. Spam messages use **FREE** (uppercase) a lot. A friend sending you a text with **free** will likely send it in lower case. This seem to improve the filter. (Still have to test extensively too).

##Getting training data
We need an existing set of data to train (get words and occurrence counts for) our filter. I synced my device to my PC and copied some of the spam messages I have received. I also created a [Google doc](https://docs.google.com/document/d/1TldaHwtLwuAq8paUyjLLUuJqthjYvymOMk5Op8gtR4Y/edit) anyone can add to. I shared this on Twitter and the awesome people there have added to it.

##What's next?
I have done a simple implementation in Javascript here: [kehers.github.io/experiments/snag](http://kehers.github.io/experiments/snag). I used some of the spam and non-spam messages from my inbox as training data. You can check it out, and test with some SMS. It may not be 100% accurate yet as I used just a few training data. You can also download the source here: [github.com/kehers/snag](http://github.com/kehers/snag). It is just a few lines of Javascript. I am using this to test possible heuristics before implementing on mobile - android to start with. To be notified when it is completed, add your email here: [tinyletter.com/kehers](https://tinyletter.com/kehers).

Do let me know what you think. You can buzz me on twitter via [@kehers](http://twitter.com/kehers).