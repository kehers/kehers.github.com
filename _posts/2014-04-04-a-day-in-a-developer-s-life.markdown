---
published: true
title: A day in a developer's life
layout: post
---
I have been up since around 2:00am. 20 hours later, I can't really say I have achieved anything all day. Yeah, it is that bad. Removing the 3 hours of nap later this evening and maybe 3 hours of other "breaks", 4 hours of team and support administration, what TF have I spent like 10 hours on? One word - bugs. Strike that, one bug actually.

Some days you just wake up and it is like all your tools met the previous night to make the day crazy for you. Sometimes I try to imagine what the meeting would be like. "Code" will be the chairperson. Your [online] server will be at the right; your computer at the left. Editor will be the spokesperson. You can guess the others that will be in attendance - browsers, databases, package managers, dev/design softwares, git, app clients...

"I have been working two straight days" - the computer.
"Dude, like seriously? I have been on for 107 consecutive days", the server will reply. 
"We deserve better working conditions. Can you imagine this dude opens like 40+ tabs in my window" - Editor. "Let's frustrate him tomorrow. It's being a while."
Chrome to CSS, "Is he doing box model sizing?".
"Hmm..let me see....nope".
"Gotcha! Firefox, we render differently! Plus make sure you return a different value for that $('.panel-wrapper').height() js line".
Computer to server, "What version of MongoDb does he have installed on you?"
"1.3.x"
"He runs 1.2.x locally. We got him there. Break his update and upsert syntax"
"You bet! By the way, what OS does he run on you?"
"Windows"
"Windows?!", laughs hysterically. "Let's see how he will get Redis up."

I am just fooling around. But I figured that's what it would look like. Really, that's what it feels like. Something works the previous day and today it stops working. And you can't figure out why. For me, 
today it's node. A route stopped processing POST content. And express.bodyParser() was in place but only works if the content type is not json. After lots of tests, I figured it would be best to replicate locally, so I decided to switch from Windows to my Ubuntu partition. Look what I found - grub error; my Ubuntu partition messed up the second time.

So I had to reinstall Ubuntu all over, apt-get update/upgrade and set up my dev environment all over - editor (Sublime), servers, DBs and nodeJs (which took me close to an hour because of some package dependency issues). By the way, if you need to setup NodeJs, download the source and build yourself (./configure, make and make install). 

Ubuntu up, process simulated locally and...you guessed right...everything works perfectly. *sighs*. Now I am back to the beginning - debugging what is wrong on the server. This time, I will just start with comparing the versions of installed npm packages with what I have locally. Damn, those software updates that just break everything for you.
Yeah, those are my suspects.

How do I even get here in the first place? I should really change career. Just kidding.

Or not.