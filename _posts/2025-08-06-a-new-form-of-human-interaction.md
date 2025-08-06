---
title: "A new form of human interaction"
date: 2025-08-06 00:00:00 Z
layout: post
---

Few days ago, Cloudflare published a [blog post](https://blog.cloudflare.com/perplexity-is-using-stealth-undeclared-crawlers-to-evade-website-no-crawl-directives) saying Perplexity is using undeclared crawlers to evade no-crawl directives. This sparked some interesting debates and I was particularly piqued by [one](https://x.com/illyism/status/1952368298370142571) arguing Perplexity is no different from a regular browser and should ignore no-crawl directives. As ridiculous as it initially sounded, I found the argument surprisingly valid and worth further thought. (Perplexity has since [replied](https://x.com/perplexity_ai/status/1952531537385456019) in the same defense).

## Bots, Crawlers, robots.txt and no-crawl
Bots and crawlers are important elements of the web. These bots and crawlers (also called spiders) are automated programs that browse the internet without a human controlling them directly. (Crawlers are special types of bots that follow links and jump from one page to another).   

Search engines like Google use crawlers to discover and index web pages, so they can show them in search results. SEO tools use them to analyze how search engines see your websites. Monitoring tools use them to check if your site is up or down. And there are many more examples like price tracking, content aggregation, and social media auto-posting. But not all bots are good. Bots can also be used to do harmful things like spamming comments or forms, trying passwords on login pages, or for DDos attacks.  

To give website owners control of how bots interact with their site, `robots.txt` was designed. The `robots.txt` file sits in the root directory of the website (example.com/robots.txt) and contains a directive on how bots should interact with the site—bots allowed/disallowed, pages to crawl, etc. In other words, the `robots.txt` says don’t crawl this site or this list of pages and the bots comply. But do they?

## Browsers vs Bots
The argument “But Google Chrome browsers by users are not blocked, why is Perplexity different than a regular browser” falls apart by the single fact that browsers are fundamentally different from bots. Browsers are programs as well, but they are human-controlled programs (generally called **clients**) designed for direct human interaction. This human interaction is a core component of the web that we have designed around:
- Discussions in forums and boards
- Commenting on blog posts
- Interacting with ads
- Recommending a post to a friend
- Support via creator support platforms
- Followers and likes

## Clients: browsers or bots?
The way we interact with the web is rapidly changing. Human interaction that used to mean manually visiting a link and doing stuff on a web page can now be done with programmatic instructions to a [special type of] browser. Better still, tasks can now be performed by simply describing them in natural language: “open example.com and login with this username and password”. AI assistants interact in a similar way with webpages to answer specific real-time questions or process human requests like bookings.  

While we can argue that this is still different from manually visiting a browser to perform the tasks, we can agree it definitely blurs the line between what we define as “real” human interaction and not. Should this type of interaction follow `robots.txt` directives or ignore them like browsers? Should we have a new directive for this type of human-interaction? Should a website not allow me to place a food order or book air travel because I didn’t manually visit the page to place the request but did via a different form of client?

## It is a lost war
Blocking bots is at best a won battle but a lost war. For starters, there is no easy way to enforce `robots.txt` compliance or any non-client preventive rule. Unethical bots don’t follow them anyway. Overly strict methods like full-page captchas on content pages may work in the short term but will harm usability in the long run and ostracize that content from the web.   

I will repeat, “the way we interact with the web is rapidly changing”. I can’t remember the last time I visited Stack Overflow. Or Wikipedia. As web authors (owner, manager or whatever role you play), we need to redefine what we think human interaction is and redesign to accommodate the changes happening; designing expecting that the page will be accessed outside the standard human-visit methods we are familiar with.   

I get it. Human interaction on any web page is what converts to revenue—ads, subscriptions, audience, purchase. Losing this is the big fear (other fear of bots like spam have working or at least somewhat working answers). However it won’t get better. We need to start thinking of alternative ways to [“fund” the web](https://x.com/cesifoti/status/1947717591776301216).
