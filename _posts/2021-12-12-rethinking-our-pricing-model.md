---
title: "[Building Engage] Rethinking our pricing model"
date: 2021-12-12 00:00:00 Z
layout: post
---

Our current [pricing](https://engage.so/pricing) is based on two things – MTU (Monthly Tracked Users) and the number of events. There are other fine details like the number of seats, number of customer segments, and number of automation, but it's majorly those two things. 

MTU represents the number of unique customers you send a message to through broadcast or automation. If for example, you have 50,000 customer profiles in your Engage account and only "engage" 5k of them in the month, irrespective of how many messages you send to that 5k, we only charge you for the 5k. I can't even remember why I modelled the pricing this way but it seems a fair thing to do.

The number of events represents the number of data events sent by any of our supported integrations. Think of it more as the number of API requests that send customer events to Engage. This was necessary because some customers use Engage exclusively for customer segmentation or transactional email analytics and don't incur MTU charges. They only send customer events (through the API/SDKs) and mail events (through their ESP). The event charge then became a way to charge such customers or rate-limit the events.

As we continue to talk with customers and fine-tune our offering, it's becoming clear we may need to change our pricing model to charging by the total number of customers (profiles) in the account. It is going to be a tough switch to make. And not just technically. It feels disappointing to promise to charge based on just the number of people you engage then come back to say, "Hey, we now want to charge based on the number of profiles in your account". 

Why am I thinking about this though? A couple of reasons:

**1. What is MTU? What is a data event?**

We have noticed many customers find it hard to get the concept of MTU and data event charging straightaway. This has come up in sales calls and live chat conversations. The fact that some people still ask, even though we try to explain it on the pricing and [guide page](https://engage.so/docs/guides/mtu), clearly shows something is wrong.

**2. Price estimation**

As an Engage customer, it is currently difficult to estimate how much you are going to pay at the end of your billing cycle? You may have 5,000 customer profiles in your account but depending on customer events, segments you send campaigns to and your automations, you may have 5,000 MTU this month and then 600 MTU the next one. This is why we do not have annual pricing. 

**3. Customer segments are expensive**

Managing customer segments is very resource-intensive. The way customer segments work is we have to continually check the customer's data against created segments to ensure that the customer is added to the right segment or removed from segments they do not fit anymore. We do this anytime new data is synced for the customer. (We are even changing that to ensure this is done at least once daily even if there are no data changes).

With our current pricing model, it means customers can have a lot of customer profiles and segments, be syncing data for these customers, and not incur MTU charges (no automation or campaigns) even though we incur a cost for continually segmenting the profiles.

**4. All profiles should be equal**

There is more we would like to do across all profiles but that we are currently doing for just a subset of customers because of cost implications. Email validation (beta) is an example. At the moment, we only validate emails you attempt to send a broadcast/automation to. Validating emails is another expensive operation and doing this for profiles we do not charge for will be a strain.

## The challenges

If we decide to indeed go by charging based on the number of profiles (looking more likely), there are a couple of challenges. 

- Do we migrate existing paying customers to profile-based charging or just new customers? Remember, we incur costs on profiles with no MTU.
- If we will be migrating existing customers, how do we deal with the effect of change in pricing? Is there something we can do to ensure the price difference for existing customers is subtle so that it doesn't lead to churn? Or a lot of churn.   
This is very difficult to even wrap my head around as the price difference for some customers that use us for just transactional email analytics and have over 100k users will be very huge. I checked pricing across a couple of competitors and they all do profile-based pricing, charging an average of $30 for 1k customers. Going by that price, we will be charging more than 15x what we currently charge them.
- If we will be migrating existing customers, what is a good grace period? 3 months, 6? Or a year?

I'd love to hear your thoughts. I am [@kehers](https://twitter.com/kehers) on Twitter.

