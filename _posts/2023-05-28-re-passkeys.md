---
title: "Re: Passkeys"
date: 2023-05-28 00:00:00 Z
layout: post
---

“Passkeys are a new, passwordless authentication method that offer a convenient authentication experience for sites and apps, using just a fingerprint, face scan or other screen lock.” ([source](https://security.googleblog.com/2023/05/making-authentication-faster-than-ever.html)). Don’t think too much about how it works, you can check out the demo at [passkeys.io](http://passkeys.io). I just tested it myself and couldn’t help but [comment on the ease](https://twitter.com/kehers/status/1662744844345786368).

I love this – anything that replaces password authentication actually, but in the end, ease (of use and technical implementation) will determine its adoption and consequently, if this will totally replace passwords.

Google claims it’s easier to use but I’d argue “easier” is relative. It feels technical experiencing it for the first time. 

Below is a signup process (implementations will vary but it’s typically going to be close to this):

Step 1 - create an account with your username/email

![Sign up process - create an account](/assets/image/{{ page.date | date: '%Y/%m' }}/step1.png)

Step 2 - set a passkey

![Sign up process - save a passkey](/assets/image/{{ page.date | date: '%Y/%m' }}/step2.png)

For a non-technical person, Step 2 may be confusing. Or at least cause a pause. I actually paused to understand what exactly was going on there. One question I’d assume the user will be asking at that point is, “What am I supposed to do here?”

If I save the passkey on the device, logins are actually easier. 

![Authentication on same device](/assets/image/{{ page.date | date: '%Y/%m' }}/auth.png)

I click “Continue”, I am requested to unlock my laptop and I am logged in. But what happens if I don’t have any lock on the device? I tested this on my phone and I couldn't create a passkey or log in without a lock on the device itself. This makes sense as it ensures access to your unlocked device does not mean access to your logins.

The experience of logging in on a device when you have a passkey on another device is not what I will call easy as well. There is no "easy" way to connect to the passkey saved on another device. Below is trying to log in on mobile while my passkey is on my laptop.

![Authentication on a different device](/assets/image/{{ page.date | date: '%Y/%m' }}/mobile-login.jpeg)

Looking at the friction of these options, give me password authentication please.

Passkey is a good improvement compared to other passwordless methods: multi-device authentication compared to WebAuthn and less friction (not to mention delivery delays and failures) compared to one-time codes/links. I am keenly looking forward to what adoption will look like for this one.