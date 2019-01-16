---
title: Open-source, licensing and making money
date: 2017-09-20 00:00:00 Z
layout: post
---

I read about the [Caddy licensing issue](https://caddy.community/t/the-realities-of-being-a-foss-maintainer/2728) and did a [thread on Twitter](https://twitter.com/kehers/status/909714002954960896) about going into OSS projects. It doesn’t directly relate to the issue, but these are things I had to look at when starting [Suet](https://github.com/kehers/suet).  Just to re-iterate:

- If you are starting an open source project, you need to have clear plans for long term. If it’s going to be a big project, or if it turns out as one, it will take your time. There will be maintenance, support, issues to deal with.  Will you be able to give this time for no compensation? What does “compensation” translate to for you? Wide adoption? This may be fine by you, but remember, you need to be making money from somewhere/something else to cover your time on the project. If the project needs to be self-sustaining, then how?
- There are a couple of options to look into when considering making money from your open source project.  They include dual-licensing, donations, sponsors, managed/hosted service, commercial support. This is well elaborated here: [github.com/nayafia/lemonade-stand](https://github.com/nayafia/lemonade-stand). 
- If you want to dual-license, do it from the go. If you want to change mid-way, be sure it does’t affect existing users (at least not too much). This was what happened with [Caddy](https://caddyserver.com/blog/accouncing-caddy-commercial-licenses). Generally, changing license will always backfire. Another case in point was [React](https://github.com/facebook/react/issues/7293).
- My fav model is managed/hosted service. It has it cons but can be a really sustainable model. Well, [Discourse](https://www.indiehackers.com/businesses/discourse) and [Ghost](https://ghost.org/about/#metrics) have really impressive numbers. Nothing stops you from combining more than one model. For Suet, I went with dual-licensing and hosted service.
- The numbers I've seen for donations are not impressive. Only 0.125% [paid for Elementary OS](http://blog.elementary.io/post/110645528530/payments), Nodemailer received [~$500 in 7 years](https://blog.nodemailer.com/2017/02/02/nodemailer-v3-0-0/). Only impressive one I’ve seen of late is [Evan You/Vue.js](https://www.patreon.com/evanyou). I doubt donations can be a sustainable model.
- In the end, it all depends on what you are building and what model you consider the right fit. Whatever decision you make, take time to study OSS licensing well.
