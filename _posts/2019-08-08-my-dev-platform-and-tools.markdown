---
title: 'My dev platforms and tools (2)'
date: 2019-08-08 00:00:00 Z
layout: post
---

I wrote this 6 years ago: [My web dev platforms and tools](http://obem.be/2013/10/04/my-web-dev-platforms-and-tools.html) and I feel I should write an update on what has changed since then.

### Hosting
- **VPS**
~~Rackspace~~. DigitalOcean, Amazon EC2, Linode. Why 3 separate providers?  Well, DigitalOcean has always been the first love. The reason still remains the simplicity and it has been super reliable after all these years.
Amazon EC2 for two reasons. I got a $5k credit and what other way to spend it than spin some servers? Secondly, it is faster and cheaper for some other AWS products I use (Lambda for example) to connect to EC2 via the private network.
At a time, Linode’s price dropped lower than DigitalOcean so I gave it a shot. Now I have a database server I am too lazy to migrate stuck there. I’ve not had any issue so far though. 
- **Shared**
(For the few friends I still run their website). Gigalayer.
- **Static/Quick experiments**
Github pages ([Consuming REST APIs](http://consumingrestapis.github.io)), Zeit/Now ( [EveryGood](https://everygood.co/) ), Glitch (the office foodbot).
I use [GitHub Pages](https://pages.github.com/) for simple static sites, especially if it has to be in blog form. For non-static quick experiments, [Now](https://zeit.co/now) used to be my goto. Then I checked one day and working with the v2 [turned a struggle](https://twitter.com/kehers/status/1125242812507860992). [Glitch](http://glitch.me/) [was near perfect](https://twitter.com/kehers/status/1125242814340706305), but besides other things, no easy way to get a custom domain. I still use a mix of both anyway.
- **Workers/Jobs**
AWS Lambda and Google Cloud Functions. Lambda was the first but to have HTTP functions (functions that are URLs that can be used like REST endpoints), you will need to attach AWS API gateway to it. With Google Cloud Functions, this is really easy. Plus, the interface is cleaner and I don’t have to upload my `node_module` folder when creating a function. Just the `package.json` file and  that’s all. 
Lambda has its pros though. I found it easier to do [concurrent short-interval recurring jobs](https://twitter.com/kehers/status/1120576212282351616) using connecting SQS (delayed push) to it.

### Domain name
I have one or two domains in 007names that I’m too lazy to migrate but I use Namecheap primarily now. I’m not a fan of Namecheap’s UX though. I still have to enter my card details every time I try to pay. For some weird reasons, the service never remember my card. If I find a better designed product with the domain offerings, and easy migration, I will move.

### Languages
Since we are talking web, these days, it’s mostly Javascript (read NodeJs and most things in between). PHP is the primary language used at work so I still review things done in PHP but I personally haven’t written anything in PHP in a while. I have experimented with some languages but nothing really serious has been done with them.

### Design
I don’t see my self as a designer but I am comfortable doing simple things using tools like Photoshop, Sketch and co. Of late, it’s been Figma.
For web design, my CSS framework transition has been [Bootstrap](https://getbootstrap.com/) -> [Skeleton](http://getskeleton.com) -> now [Tachyons](https://tachyons.io).
I draw inspiration from everything I see and from every website I visit. If I am actively looking for ideas though, the tab I open is [Dribbble](https://dribbble.com). 

### Stack
At this point, it should be obvious. For something pretty basic and straightforward, it’s HTML, CSS, Javascript (or related M* framework) on the client side and NodeJs, MongoDb on the backend. 

### OS
- **Local Machine**
~~Windows (7) and Ubuntu (12.04). Dual boot.~~ MacOS. 
- **Servers**
Debian [when I setup Freeswitch](http://obem.be/2019/04/04/notes-on-freeswitch.html) but Ubuntu majorly (it’s Debian based anyway). Haven’t touched CentOS since I left Rackspace.

### Email 
- **Transactional**
 ~~Amazon SES. Mandrill~~ Mailgun. 
- **Mailbox**
Sigh. I don’t have my mailboxes in one place. There is Privateemail, Zoho, and even Yandex. But every mail leads to a single client so it doesn’t really matter. 

### Versioning
Nothing has changed. Bitbucket and Github.

## Editor
~~Notepad++~~ Sublime text.
