---
title: A year and two interns
date: 2014-11-17 00:00:00 Z
layout: post
---

My ([our, actually](http://fonebaselabs.com)) two interns leave by the end of the month. I will miss them. It's been an interesting and rough couple of months. But I am proud of what we've achieved together. I am proud to say I have made them better than they were. And I am better than I was before them as well.

## The beginning

Oo (my Co) has always been on the lookout for good developers and designers, even when he doesn't need them for anything. It was the same way he reached out to me some years ago, far before we tried any project together.

One day, end of last year, we were talking about getting young developers to join the team and then the other, he copied me in a mail and introduced 5 young developers from UNN (University of Nigeria, Nsuka) to me.

As interesting as that was, testing was the next challenge. How do we test their technical skills and be sure of what they can do? (Recruiting developers is a hard work. That is a post on it's own). And we were only really interested in keeping just 2. Maybe 3 max. In the end, we settled on telling them to build a simple application using the [Fonenode API](https://fonenode.com/docs). They were to do this within the target time frame, push to a git repo, invite me to the repo and I review. After a couple of back and forth, minor issues here and there, Zim and Godswill finally joined the team early this year.

## A change in everything

I was the only one doing development work on [Fonenode](https://fonenode.com) and [Callbase](https://callbase.co/) before Zim and Godswill joined. Everything revolved round me - server administration, database management, development. No complex team management setups or solutions. Oo and I just exchange emails, phone calls, chat (any closest channel - BBM, Twitter, Skype, etc), and that was it. Versioning was only for backup and not for collaboration. The addition to the team changed everything about how we work. We had to structure everything one small step after another.

So, two guys. Students. 10 hours a week. Working remotely. Unfamiliar with a code base of two apps with crazy architecture. Where do we start from?

### Documentation and introduction. Damn! 

I had to start with introducing the code architecture and documenting a lot of things. This to me was a crazy curve from my normal code schedule. And it was difficult. Especially the documentation part. I didn't know the architecture and codes were that complex till I started explaining them and documenting. In the end, I was able to get something they could easily start with. Trying to explain and document everything didn't work. It came as a gradual process that spanned long months. Even now, every now and then, I still get to explain minor details in some parts of the apps.

### Understanding skills and limitations

Fonenode is built on NodeJs and MongoDB; Callbase on NodeJS, MySQL and PHP. To effectively delegate tasks, I had to understand the individual skills and limitations of the boys (what I call them). But it wasn't a conscious effort. It took a while to figure. Eventually, I knew who to push JS stuff (Node, Mongo, Backbone) to and who to handle PHP and testing.

### Communication

To work remotely and efficiently, proper communication had to come in place. One thing that helped was to set up a Hipchat chat room where all general communication can take place. I also have to nudge the team every now and then (eventually, I settled for every Monday morning) about their tasks, current status and expected time of delivery. The email CCs everyone. And when you want to reply, you hit the "Reply All". Everyone knows what everyone else is to do, doing and up to. That keeps things well defined.

### Versioning

Collaborating on source files wasn't very easy at first. It took some failed trials and mistakes to finally settle for the process we are using now. One that didn't work well was allowing direct modification of the master source. Having members create their own branch on the master repo and work on that was a good option but wasn't flexible enough as I want it to be. Eventually, what I did was to enable only read rights to the master repo and let members make a fork. You work on your fork, do whatever you want with it. Once well tested, you send a pull request to the master repo. I review then decide if to merge or decline. Then it goes to a staging server and can eventually move to live.

## What I have learnt

I have been forced to take on project and people management. It is a totally different experience. It used to be about just managing the technology and ensuring the codes work perfectly. Now it is about managing other people and their codes too. Some days, I just answer emails and chats all day long, explain processes, break down architecture and do pull request reviews. I rarely do long solo code sprints as I used to do anymore. Which isn't a bad thing though.

Initially I was reserved with assigning tasks to them. "Can they do this? Hope they won't break things and mess up everything? (They did break things by the way). Will they even get this logic? Ok, let me give them this other simpler ones". But eventually, I was able to break that fear. Now I purposely throw them complex tasks. Surprisingly, they get to figure it out many times. Other times, I come in later to break it down and put them through. I learnt to be able to trust their decisions and give them the freedom to do things their own way. 

I learnt there are good young developers everywhere - even outside the usual places people look to. Inexperienced? Rough? Yes, probably. But with some mentoring and guidance, they can be very good at what they do. And they can in turn develop others too. I've finally got Co's philosophy. It is really about developing others.

Another big lesson was that remote working is actually not rocket science. And it works. For like 8 months, I never met the boys in person. Communication was simply via chat, email and on very few occasions, calls. What really helped was that goals and tasks were made as clear as possible. And even though I gave them lots of flexibility, I ensured they were communicating progress and made myself available for every possible question.

## What we have achieved

I can proudly look back and say we've achieved a lot. We've done a lot of work on both Callbase and Fonenode. And [Writerack](http://writerack.com/). The boys did the majority of work on the Callbase Call button. They implemented the design of the new [Writerack android app](https://play.google.com/store/apps/details?id=com.writerack.android). I only did the web and initial version of the android app.  

It would have been impossible doing all this alone. 

## From here

Even though I'd love to keep them, they have to move on to other things. I hope in the nearest feature, they can look back and see this time as one that helped shape their future. And they can in turn develop others too.

*PS: We are always on the look out for young developers that are good and passionate about what they do, focused and open to learning. if you are one or know one, kindly hit me up via kehers at gmail.com*