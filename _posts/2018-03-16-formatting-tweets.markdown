---
title: 'Formatting tweets: a look at Extended tweets, Retweets and Quotes'
date: 2018-03-16 00:00:00 Z
layout: post
---

*One thing I’ve noticed on [thefeed.press](https://thefeed.press) is that the conversations (the tweets) surrounding shared links are sometimes more interesting than the link. To place proper emphasis on these tweets mean displaying them wherever necessary; the email digest for example. And displaying them mean formatting them properly.*

## Introduction

To display a tweet properly, it needs to be well formatted. This means identifying and linking entities like usernames, hashtags and URLs. In simple terms, it is converting a typical tweet object[^1] like this:

{% highlight json %}
{
  "created_at": "Mon Mar 05 21:16:46 +0000 2018",
  "id": 970770116043595800,
  "text": "Wish I have some time to curate #WeAreNigerianCreatives. Someone please do.",
  "entities": {
    "hashtags": [{
        "text": "WeAreNigerianCreatives",
        "indices": [32, 55]
      }
    ],
    "symbols": [],
    "user_mentions": [],
    "urls": []
  }
}
{% endhighlight %}

to this:

> Wish I have some time to curate [#WeAreNigerianCreatives](https://twitter.com/hashtag/WeAreNigerianCreatives?src=hash). Someone please do.  

Notice that the tweet object’s `text` is plain unformatted text but there is an additional `entities` object with necessary details for formatting. You probably won’t need to write a library to match and replace the entities in the text though. Twitter provides [Twitter Text](https://github.com/twitter/twitter-text), an amazing library to do this.

This is a representation in Node.js. 

{% highlight js %}
// twitter-text already installed with 
// `npm install twitter-text`
// ...
const twitter = require('twitter-text')
    , tweet = {
        "created_at": "Mon Mar 05 21:16:46 +0000 2018",
        "id": 970770116043595800,
        "text": "Wish I have some time to curate #WeAreNigerianCreatives. Someone please do.",
        "entities": {
          "hashtags": [{
              "text": "WeAreNigerianCreatives",
              "indices": [32, 55]
            }
          ],
          "symbols": [],
          "user_mentions": [],
          "urls": []
        }
      }
    ;

console.log(twitter.autoLinkWithJSON(tweet.text, tweet.entities);
{% endhighlight %}

## Say hello to extended tweets

For tweets over 140 characters, the tweet object only returns 140 characters of text by default. In this compatibility mode, 
1. `text` is truncated to 140 characters
2. `truncated` is set to `true` for tweets that are more than 140 characters
3. `entities` only include those in the available 140 text range 

Here is an example tweet object

{% highlight json %}
{
  "created_at": "Sat Mar 10 18:12:17 +0000 2018",
  "id": 972535628742078500,
  "text": "I kind of hate how with most web development/new frameworks etc., I start out with the intention “I’d like to spend… https://t.co/A10WmSzVeL",
  "truncated": true,
  "entities": {
    "hashtags": [],
    "symbols": [],
    "user_mentions": [],
    "urls": [{
        "url": "https://t.co/A10WmSzVeL",
        "expanded_url": "https://twitter.com/i/web/status/972535628742078469",
        "display_url": "twitter.com/i/web/status/9…",
        "indices": [
          117,
          140
        ]
      }
    ]
  }
}
{% endhighlight %}

Formatting that will give this:

> I kind of hate how with most web development/new frameworks etc., I start out with the intention “I’d like to spend…  [https://twitter.com/i/web/status/972535628742078469](https://twitter.com/i/web/status/972535628742078469) …  

compared to the original tweet:

> I kind of hate how with most web development/new frameworks etc., I start out with the intention “I’d like to spend 20 minutes learning X today,” and have to invest an additional 60 minutes just setting up the appropriate environment.  

## Mode: Extended

How to get the full text? Simple. Add the parameter `tweet_mode=extended` to any endpoint you are querying.  So instead of `https://api.twitter.com/1.1/statuses/show/972535628742078469.json`, let’s try `https://api.twitter.com/1.1/statuses/show/972535628742078469.json?tweet_mode=extended`

{% highlight json %}
{
  "created_at": "Sat Mar 10 18:12:17 +0000 2018",
  "id": 972535628742078500,
  "full_text": "I kind of hate how with most web development/new frameworks etc., I start out with the intention “I’d like to spend 20 minutes learning X today,” and have to invest an additional 60 minutes just setting up the appropriate environment.",
  "truncated": false,
  "display_text_range": [0, 234],
  "entities": {
    "hashtags": [],
    "symbols": [],
    "user_mentions": [],
    "urls": []
  }
}
{% endhighlight %}

Yeah, that simple. Notice that:

1. `full_text` replaces `text`
2. `truncated` is `false`
3. `display_text_range` identifies the start and end of the displayable content of the tweet.

You can then go ahead and format using `full_text` and `entities`.

{% highlight js %}
const twitter = require('twitter-text')
    , tweet = {
        "created_at": "Sat Mar 10 18:12:17 +0000 2018",
        "id": 972535628742078500,
        "full_text": "I kind of hate how with most web development/new frameworks etc., I start out with the intention “I’d like to spend 20 minutes learning X today,” and have to invest an additional 60 minutes just setting up the appropriate environment.",
        "truncated": false,
        "display_text_range": [0, 234],
        "entities": {
          "hashtags": [],
          "symbols": [],
          "user_mentions": [],
          "urls": []
        }
      }
    ;

console.log(twitter.autoLinkWithJSON(tweet.full_text, tweet.entities);
{% endhighlight %}

## Hmmm…retweets
Here is a retweet requested in extended mode.

{% highlight json %}
{
  "created_at": "Sun Mar 11 12:00:27 +0000 2018",
  "id": 972804442667003900,
  "full_text": "RT @jasongorman: As a physics grad, I understand how snooker works at a level I imagine a lot of pro snooker players don't. But I suck at s…",
  "truncated": false,
  "display_text_range": [
    0,
    140
  ],
  "entities": {
    "hashtags": [],
    "symbols": [],
    "user_mentions": [
      {
        "screen_name": "jasongorman",
        "name": "jasongorman",
        "id": 18771008,
        "id_str": "18771008",
        "indices": [
          3,
          15
        ]
      }
    ],
    "urls": []
  },
  "retweeted_status": {...}
}
{% endhighlight %}

Notice how `full_text` is truncated even though `truncated` says `false`. What could be wrong? Well, texts in retweets are prefixed with `RT @username: `  and if the resulting text is more than 140 characters, it will be truncated. 

What to do? Use the `retweeted_status` instead. The `retweeted_status` object contains the full text and entities you need.

{% highlight json %}
{
  "created_at": "Sun Mar 11 12:00:27 +0000 2018",
  "id": 972804442667003900,
  "full_text": "RT @jasongorman: As a physics grad, I understand how snooker works at a level I imagine a lot of pro snooker players don't. But I suck at s…",
  "truncated": false,
  "display_text_range": [...],
  "entities": {...},
  "retweeted_status": {
    "created_at": "Sun Mar 11 08:10:46 +0000 2018",
    "id": 972746641957642200,
    "full_text": "As a physics grad, I understand how snooker works at a level I imagine a lot of pro snooker players don't. But I suck at snooker. Understanding != ability.",
    "truncated": false,
    "display_text_range": [0, 155],
    "entities": {
      "hashtags": [],
      "symbols": [],
      "user_mentions": [],
      "urls": []
    },
  }
}
{% endhighlight %}

Just check if `retweeted_status` exist and use that instead.

{% highlight js %}
// Get tweet
// ...
if (tweet.retweeted_status)
  tweet = tweet.retweeted_status;

formatted = twitter.autoLinkWithJSON(tweet.full_text, tweet.entities);
{% endhighlight %}

## Quotes :/

Quotes are in an entirely different world of their own. You need to see what a quoted tweet looks like to understand.

{% highlight json %}
{
  "created_at": "Sat Dec 16 04:04:36 +0000 2017",
  "id": 941881722685284400,
  "full_text": "Added tweets to the daily newsletter for better context. https://t.co/Q46O3husnz",
  "truncated": false,
  "display_text_range": [0, 56],
  "entities": {
    "hashtags": [],
    "symbols": [],
    "user_mentions": [],
    "urls": [{
        "url": "https://t.co/Q46O3husnz",
        "expanded_url": "https://twitter.com/thefeedpress/status/941880801087680512",
        "display_url": "twitter.com/thefeedpress/s…",
        "indices": [57, 80
        ]
      }]
  },
  "quoted_status": {...}
}
{% endhighlight %}

The `full_text` does not tell the complete story. It does not include the tweet that was quoted. The quoted tweet is hidden somewhere in `quoted_status`. And unlike retweets where you can replace the tweet with the retweeted status, you need both the original and additional tweet to make complete sense of a *quote*. Here is what `quoted_status` looks like:

{% highlight json %}
{
  "created_at": "Sat Dec 16 04:00:56 +0000 2017",
  "id": 941880801087680500,
  "full_text": "New newsletter screenshot https://t.co/HQmJumZfhN",
  "truncated": false,
  "display_text_range": [0, 25],
  "entities": {...},
  "extended_entities": {...}
}
{% endhighlight %}

So what do we do in this case? What we need to achieve is something like this:

> Added tweets to the daily newsletter for better context
>> [@thefeedpress](https://twitter.com/thefeedpress):  
>> New newsletter screenshot [pic.twitter.com/HQmJumZfhN](http://pic.twitter.com/HQmJumZfhN)  

And it seems we just need to format the quoted tweet and additional tweet separately and show them together.

{% highlight js %}
const twitter = require('twitter-text')
    ;

// Get tweet
// ..
let text = twitter.autoLinkWithJSON(tweet.full_text, tweet.entities);
if (tweet.quoted_status) {
  let qt = twitter.autoLinkWithJSON(tweet.quoted_status.full_text, 
            tweet.quoted_status.entities);
  text += `<blockquote><a href="https://twitter.com/${tweet.quoted_status.user.screen_name}">@${tweet.quoted_status.user.screen_name}</a>:<br>
            ${qt}
          </blockquote>`;
}

console.log(text);
{% endhighlight %}

> Added tweets to the daily newsletter for better context.  [https://twitter.com/thefeedpress/status/941880801087680512 …](https://twitter.com/thefeedpress/status/941880801087680512)  
>> [@thefeedpress](https://twitter.com/thefeedpress):  
>> New newsletter screenshot [pic.twitter.com/HQmJumZfhN](http://pic.twitter.com/HQmJumZfhN)  

Looks pretty close. But the additional tweet has a link to the embedded quote. Can we remove this link though? Let’s try. 

Since we know the link to the quoted status will always end the additional tweet text, we can match end of text for link with format `https://twitter.com/[quoted_status_user_username]/status/[0-9]+` and remove. There are a couple of issues with this though. If we match the unformatted text, the url will still be in the format `http://t.co/\w+` (unexpanded) and not `https://twitter.com/[quoted_status_user_username]/status/[0-9]+` (expanded). If we match after formatting, the link would have been expanded but will contain HTML tags that will break our regular expression[^2]. 

Well, since we know the link will always end the text, we can remove any ending link in the unformatted text. We can also remove the index from the entities before we then proceed to format the text.

{% highlight js %}
if (tweet.retweeted_status)
  tweet = tweet.retweeted_status;

if (tweet.quoted_status) {
  if (tweet.entities && tweet.entities.urls) {
    let re = new RegExp('https://twitter.com/\\w+/status/'+tweet.quoted_status.id_str);
    tweet.entities.urls = tweet.entities.urls.filter(url => !re.test(url.expanded_url));
  }
  text = twitter.autoLinkWithJSON(tweet.full_text, tweet.entities);
  let qt = twitter.autoLinkWithJSON(tweet.quoted_status.full_text, tweet.quoted_status.entities);
  text = text.replace(/https:\/\/t.co\/[^\/]+$/, '');
  text += `<blockquote><a href="https://twitter.com/${tweet.quoted_status.user.screen_name}">@${tweet.quoted_status.user.screen_name}</a><br>${qt}</blockquote>`;
}
else
    text = twitter.autoLinkWithJSON(tweet.full_text, tweet.entities);
{% endhighlight %}

## Conclusion

This is all you will probably need. But there is still more to do. What about displaying media (pictures, videos) within the tweet? Quotes within quotes? Threaded replies?

If you really want to do it, formatting tweets can be a complex thing. But you really don’t have to do it if not necessary. You can use [embedded tweets](https://dev.twitter.com/web/embedded-tweets) instead.


[^1]: Some items are removed from the tweet object as well as others used in this piece for brevity purpose.
[^2]: Here is what the formatted HTML for the link `https://twitter.com/thefeedpress/status/941880801087680512` looks like `<a href="https://t.co/Q46O3husnz" title="https://twitter.com/thefeedpress/status/941880801087680512" rel="nofollow"><span class='tco-ellipsis'><span style='position:absolute;left:-9999px;'>&nbsp;</span></span><span style='position:absolute;left:-9999px;'>https://</span><span class='js-display-url'>twitter.com/thefeedpress/s</span><span style='position:absolute;left:-9999px;'>tatus/941880801087680512</span><span class='tco-ellipsis'><span style='position:absolute;left:-9999px;'>&nbsp;</span>…</span></a>`
