---
published: true
title: "Musings: TheFeed.press"
layout: post
---

Seun me asked on twitter:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/kehers">@kehers</a> quick question: what does the architecture of <a href="https://t.co/ekPbJ2ejCa">https://t.co/ekPbJ2ejCa</a> look like? And how much does it cost to run atm?</p>&mdash; Seun (@impactmass) <a href="https://twitter.com/impactmass/status/860997815014756352">May 6, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

And it is really this simple:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Simple really:<br>Workers: Pull users from DB, read TL, extract links and store<br>Site: Present data from DB in nice form<br>All written in NodeJs <a href="https://t.co/atTjwhzd7k">https://t.co/atTjwhzd7k</a></p>&mdash; Opeyemi Obembe (@kehers) <a href="https://twitter.com/kehers/status/861011096995602434">May 7, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">1. Site on $5 DO<br>2. Some workers doing the heavy aggregation on Amazon Lambda (&gt;$20/mnt)<br>3. $10 Linode MongoDB server (~20k articles/day) <a href="https://t.co/atTjwhzd7k">https://t.co/atTjwhzd7k</a></p>&mdash; Opeyemi Obembe (@kehers) <a href="https://twitter.com/kehers/status/861009284141895681">May 7, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

During the QA session of the Producthunt Lagos meetup (I gave a talk on [Shipping products](https://docs.google.com/presentation/d/13mqostF1vDkBgOehCyNUHge2qKRbG9C76R2i_UbX_Oc)), someone else asked how much it costs to run my side projects. Here is a detailed breakdown of [TheFeed Press](http://thefeed.press/) to help put things in better perspective. But I won't be talking about the running cost alone. For context, I will also be talking about other things.

[TheFeed Press](http://thefeed.press/) is a side project I built last year. The idea was simple. Search my Twitter feed for articles, get and save them, and present them to me in a simple way. The idea came off [Fave](http://github.com/kehers/fave), an earlier experiment that didn't work. With Fave, my Twitter likes were checked for links and sent to my Pocket account. Two issues with this though:

1. Only articles I like were sent to Pocket. Which means when I'm not on Twitter liking tweets, I'm missing the interesting articles my awesome friends are posting on the timeline.
2. My Pocket feed kept growing and I wasn't reading the articles. Turns out I wasn't the only one. Apparently, read later doesn't seem to work for a lot of people. Just look at comments in this [reddit post](https://www.reddit.com/r/programming/comments/5wjhnp/mozilla_acquires_pocket_plans_to_opensource/). [Refind](http://refind.com) explains it better: *"Read later is not the right action since it’s only time-shifting the problem. It’s deferral. Deferral fails in the information age because there’s always more information to read later—our reading lists pile up and read later becomes read never."* (It would be interesting to know the percentage of people that actually read a quarter of links 'pocketed')

So TheFeed Press (TFP) came up. Interestingly, I saw [Nuzzel](http://nuzzel.com/) when looking into the idea. Nuzzel was almost perfect but because I had started already and wanted some slight changes (it was going to take just a day or two of free time anyway), I built TFP.

Here is how it's different to Nuzzel:

1. TFP is focused on one thing—extracting links from the user's Twitter feed. Nuzzel has support for Facebook and a lot of other interesting things like newsletters, feed of friend of friends and a lot more.

2. TFP sorts the article feed displayed by number of influencers (people that tweeted the link in a feed) + time. Everyday, the user gets top articles by influencers in the last 24 hours. It is that simple. I'd assume Nuzzel has some fancy algorithm for this.

3. TFP extracts content of links just the way Pocket/Instapaper saves articles for offline read. This way, it doesn't take you out of the site when you read articles. And everything is preloaded on page load so reading is easy and without the extra distractions going to the individual sites bring. This brings a different concern though. Even though direct links to the respective sites are still available in the feeds, how comfortable are the respective sites with their content being scraped? How does Pocket/Instapaper do it?

#### Architecture, Iterations and Scaling

I did development with NodeJs, using MongoDB as the database. This is the common architecture for most of my experiments. NodeJs' async nature makes it perfect for making multiple requests (this has huge effect on the speed of the workers). My choice of MongoDB was because of the speed of write operations (TFP does thousands of writes/seconds). I spinned a $5 DigitalOcean (DO) server and got nodeJS + HAproxy on it.  I was using [iron.io](http://iron.io/) for Fave already so I moved the worker (the part of the code that regularly checks the user's timeline for articles and extract the content) over there. [compose.io](http://compose.io) took care of database hosting.

I had to move from compose.io shortly after. $30/month for 1GB database storage and 102MB RAM was too much for me[^1]. I figured with half that price, I can do 3 replica sets on 3 DigitalOcean servers that will give me almost 20GB storage and 512MB RAM. Plus I can have WiredTiger, MongoDB's latest storage engine. And that was what I did.

The next thing was moving from iron.io to [Amazon Lambda](https://aws.amazon.com/lambda/). I hit the free tier limit on iron.io and wasn't ready to pay $50/month for the next tier. Besides that, I had to split the worker into multiple scripts connected with a queue. Amazon Lambda was just the perfect alternative.

Within just few months of use (by about 100 users), the DB had over 2m articles and even more streams (tweet records). Then things started breaking. I had to scale each replica set of the DB to the $10 DigitalOcean plan. Even this didn't hold for long. At a point the DB crashed and I lost everything. I noticed [Linode](http://linode.com/) has twice DigitalOcean's RAM at same price and moved the DB there. And so far, everything works.

Search was the other big thing. Initially, what I did was to use [tf-idf](https://en.wikipedia.org/wiki/Tf%E2%80%93idf) to index top words per article and search on that. But that wasn't scalable. Eventually I had to move to Elasticsearch. The setup required atleast 2GB RAM so I had to create a separate server for it. I had this $300 free trial credit on Google cloud so I spinned up a VM on it.

#### Current spend

In total, every month, I currently spend:

- $5 for the application server on DO
- $10 for the database server on Linode (no replica sets for now)
- &gt; $20 for AWS (Lambda, Bandwidth, SNS, etc. Fluctuates)
- $0 for the Elasticsearch DB on Google cloud (The server costs over $20/month but I have free $300 for a year)

#### Making money

Currently, TFP doesn't make money. At a point I added a "free for 6 months, $10/year after" label to the homepage (there was no actual payment integration though). The plan was to use this to limit signups to only interested people. (The more the users, the more work the workers need to do and consequently, the higher my AWS bill and storage/memory required by the DB). Then I thought about it again and remembered [this post from Marco](https://marco.org/2015/10/13/pragmatic-pricing). Why would anyone leave nuzzel (free) or the other news apps (Flipboard, Digg deeper) and pay for TFP? Could there be other ways to make money? Sponsored posts?

I haven't reached a conclusion on that but I am comfortable taking care of hosting costs for now. Eventually, it's going to be a lot and the money will need to come from somewhere. Till then though.

#### What's next

TFP has been my primary source of news. I use it actively and for that I'm motivated to keep it running. There are a couple of things here and there but everything is pretty stable. For one, mobile apps won't be a bad idea. Then maybe automatically categorise articles for better filtering. Really, that's it. I want as little features as possible.

Hi, feedback, suggestions, questions? I'm [@kehers](http://twitter.com/kehers) on twitter.

[^1]: [Compose](http://compose.io/) offers a lot of [interesting features](https://www.compose.com/pricing) like backups, health checks, autoscaling, etc, that makes it worth the price.
