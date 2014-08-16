---
published: true
title: A quick look at Twitter analytics [and Twitter cards]
layout: post
---
[Twitter analytics](https://analytics.twitter.com/) gives you insight into your twitter impact. Needless to say, this is a useful social media marketing tool. It answers the questions: how many times was your tweet displayed? The engagement[^1]? Link clicks?

## Getting in

There are two ways to get in - ads and cards. The ad route means you advertise on Twitter. Once you advertise, you get access to Twitter analytics. I don't know much about Twitter ads but if you are going that route, here is a link to get started: [business.twitter.com](https://business.twitter.com/).

To get in through cards, you implement [Twitter cards](https://dev.twitter.com/cards) in your webpages. Twitter cards let you "attach media experiences to Tweets that link to your content". In other words, beyond just having a link to your article or site in a tweet, you can embed pictures, videos and other types of media from the link's content.

![](http://i.imgur.com/rAcu17z.png)

*As you can see, an excerpt from the link is embedded in the Twitter web client*

So how is this done?

1. Go to the [Card Validator](https://dev.twitter.com/docs/cards/validation/validator). (Use a webkit-based browser like Chrome)
2. Select your preferred card. I use **summary** because all I need to embed from the link is a short excerpt.   
![](http://i.imgur.com/pnYFhHN.png)
3. Fill in the standard tags form fields to generate the sample embed code.    
![](http://i.imgur.com/fVJXIcX.png)
4. Copy the code to your webpage header. If you are using cards for automatically generated content (most definitely), you need to replace the ```content``` attribute of the ```meta``` tags with the necessary variables. Here is what [mine (this blog on Github pages)](https://github.com/kehers/kehers.github.com/blob/master/_layouts/post.html) looks like (notice how content ```twitter:title``` and ```twitter:description``` are set to liquid variables that will be automatically generated/replaced):  
{% highlight html %}
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@kehers">
<meta name="twitter:title" content="{{ "{{ page.title " }}}}">
<meta name="twitter:description" content="{{ "{{ content | strip_html | truncate: 200 " }}}}">
<meta name="twitter:creator" content="@kehers">{% endhighlight %}
5. Once you have embedded the code, validate your card and be sure you didn't get things wrong.    
![](http://i.imgur.com/qgVQYoP.png)

That is it. After few days, you should have access to Twitter analytics. I recommend you share a link with your card when done though.

## What does Twitter analytics look like?

![](http://i.imgur.com/uFRSmMj.png)

I can't possibly share all the screenshots but I will mention a few of the things you'd see. (I placed some screenshots side by side).

1. Graphs - tweet impressions, engagement rate (impression/engagement x 100), link clicks, retweets, favs and replies.    
![](http://i.imgur.com/uSc38n2.png)
2. Follower breakdown by interest, gender and follower.   
![](http://i.imgur.com/bkjNwyl.png)
3. Twitter card performance and link click rate   
![](http://i.imgur.com/z3Acy2N.png)

## Extending and other experiments

There are more interesting stats that can be deduced from the data beyond what is available on the analytics web page. Unfortunately, there is no analytics API. Yet. One stat that would be interesting to see is **reach** rate.

I define **Reach rate** as impressions/followers x 100%. What percentage of your followers saw your tweet? Do note that Twitter defines impression as "the number of times users saw the tweet **on Twitter**". This probably means that impressions on third party clients do not count. I want to assume official Twitter clients on other devices count.

Here is what my reach rate is like. I am not a "brand" or social media person of interest so my rate will obviously be low compared to well engaging brands. That said, here is an example tweet with no multiplier engagement like retweets. 

![](http://i.imgur.com/LG5Q8O6.png)

It has 91 impressions and then I had around 1085 followers. This means the reach rate is 8.4%. I would have loved to calculate my average for like a month but it's hard to filter through the data for that period.

Let's consider links on the other hand. What's the click-through rate?

![](http://i.imgur.com/uvfOqYJ.png)

For the first link, the click-through is 9/191 x 100% = 4.7%. For the second, we have 2/30 x 100% = 6.7%. That gives an average of 5.7%.

Will you consider the reach and click through rates a success compared to email marketing (another popular marketing tool)? I don't have a mailing list, but it'd be interesting to compare email opens to tweet reach and click-through in email to Twitter. Which is a better marketing tool?

Another thing you can deduce from this is: when is the best time for high reach? Or better click-throughs. What type of tweets interest (engage) your followers? What links are they interested in?

The good news is Twitter analytics allows you export your [analytics] data. I will see what I can build when I have some free time.

[^1]: Twitter defines engagement as the total number of times a user has interacted with the tweet. This includes all clicks anywhere on the tweet (hashtags, links, usernames, avatar and tweet expansion), retweets, replies, follows and favs.