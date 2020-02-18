---
title: Mining my mailbox for top email service providers
date: 2020-02-18 00:00:00 Z
layout: post
---

I was reviewing some stats for [Mailintel](https://mailintel.io/?ref=oo) and was curious about what email service top apps use; being particularly interested in transactional email services. Is there a way I can go through my mailbox, check product emails and check the service for each? Sounds like a fun experiment to give a shot.

### Connecting my mailbox
With my recent [experiments with IMAP](https://obem.be/2019/05/01/imap-new-messages-since-last-check.html), connecting to my mailbox wasn’t difficult. I am using [emailjs-imap-client](https://github.com/emailjs/emailjs-imap-client), a JS IMAP client.

```js
const ImapClient = require('emailjs-imap-client').default

;(async function () {
  try {
    const confOption = {
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      },
      logLevel: 'error'
    }

    if (process.env.PORT === '993'){ confOption.useSecureTransport = true }
    const imap = new ImapClient(process.env.HOST, process.env.PORT, confOption)
    await imap.connect()
  } catch (e) {
    console.log(e)
  }
})()
```

My environmental variables look something like this:

```
EMAIL="myemail@yahoo.com"
PASS="mypassword"
PORT=993
HOST="imap.mail.yahoo.com"
```

If you are connecting to a Yahoo mail, you will need to [generate an app password](https://help.yahoo.com/kb/generate-third-party-passwords-sln15241.html). Using your real email password won’t work. Gmail is a little more complex. To start with, you neexd to [enable IMAP access](https://support.google.com/mail/answer/7126229?hl=en) your account. You can then go with any of the options:

1. [Allow less secure apps](https://myaccount.google.com/lesssecureapps?pli=1). But don't forget to turn this off once you are done with the experiment. If you still can't connect, you may need to [allow app access to your account](https://accounts.google.com/b/0/displayunlockcaptcha). 
2. [Create an app password](https://support.google.com/mail/answer/185833?hl=en) (more secured option).

### Checking ~~product~~ emails
Getting product emails is a tricky one. How do you identify product emails from regular emails? How do you differentiate marketing from transactional emails? This can be done but the ideas I came up with were not worth the effort. In the end, I decided to pull all the emails instead. (This was also easier because I have a Yahoo mail dedicated to product signups, subscriptions and newsletters [^1]).

```js
const ImapClient = require('emailjs-imap-client').default

;(async function () {
  try {
    // …connection code
    await imap.connect()
    const box = await imap.selectMailbox('INBOX')

    // Reading 5k mails at once can choke the process so let's chunk into 50 mails per request. We are also assuming there are > 5k emails in the mailbox
    let start = +box.exists - 5000
    while (true) {
      const messages = await imap.listMessages('INBOX', `${start + 1}:${start + 50}`, ['uid', 'body[]'])
      if (!Array.isArray(messages)) { return }
      // Do stuff with email here
      start += 50
      if (start >= +box.exists) { break }
    }
  } catch (e) {
    console.log(e)
  }
})()
```

### Checking the service provider
How do I know the email service used for the mail? I checked a couple of email headers and noticed a couple of places the provider details can be extracted from. Here is what an email header looks like:

![](/assets/image/{{ page.date | date: '%Y/%m' }}/headers.png)

At first glance at some headers, the `message-id` header looks the most straight forward. Here are a couple of message IDs from 3 different mail headers. 

```
Message-ID: <22.BD.09488.F97644E5@ar.mta1vrest.cc.prd.sparkpost>
Message-ID: <4ebb47b9-4454-afc4-e6448cd22897-000000@email.amazonses.com>
Message-ID: <ZCA0TmwnS-SqPHh2_-gciw@ismtpd0039p1iad2.sendgrid.net>
```

By looking at the host part of the `message-id`, it's easy to know the service provider. But not so fast. Looking at more headers, I noticed some message IDs have a host that is different from the sender value in the `received` header. Below are examples from Bitbucket and Letsencrypt. (Some parts truncated for brevity).

```
Message-ID: <pr-~@bitbucket.org>
Received: by filter0225p1iad2.sendgrid.net with ~
```
```
Message-Id: <~.expiry@letsencrypt.org>
Received: from mail132-5.atl131.mandrillapp.com ~
```

The `received` headers seem the most accurate place to get the provider but it poses its challenges. They are structured in different ways depending on how the mail is sent. After reviewing a couple of headers in Yahoo mail, I was able to find a pattern to match the provider. (Not 100% accurate).

1. For more than one `received` header, match `by *` of the second `received` header. 
2. If that doesn’t exist or does not have a host address or there is just one `received` header, then match `(EHLO *)` in the first `received` header.

Now we can rewrite our script to use `received` headers. To be able to easily extract this, I will be bringing in [Mailparser](https://github.com/nodemailer/mailparser).


```js
const ImapClient = require('emailjs-imap-client').default
const simpleParser = require('mailparser').simpleParser
const PULL = 10000

;(async function () {
  const sites = {}
  try {
    const confOption = {
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      },
      logLevel: 'error'
    }

    if (process.env.PORT === '993') { confOption.useSecureTransport = true }
    const imap = new ImapClient(process.env.HOST, process.env.PORT, confOption)
    await imap.connect()
    const box = await imap.selectMailbox('INBOX')
    const exists = +box.exists

    if (exists <= PULL) {
      console.log('You specified a pull number more than or equal to the number of emails in the mailbox')
      return
    }
    let start = exists - PULL
    while (true) {
      const messages = await imap.listMessages('INBOX', `${start + 1}:${start + 50}`, ['uid', 'body[]'])

      if (!Array.isArray(messages)) { return }
      for (const message of messages) {
        const mail = await simpleParser(message['body[]'])
        const headers = mail.headers.get('received')
        let esp
        if (headers.length > 1) {
          const header = headers[1]
          const match = header.match(/by ([^\s]*)/)
          if (match && match.length > 1 && match[1].indexOf('.') !== -1) {
            esp = match[1].split('.').slice(-2).join('.')
          }
        }
        if (!esp) {
          const header = Array.isArray(headers) ? headers[0] : headers
          const match = header.match(/EHLO ([^)]*)/)
          if (match && match.length > 1 && match[1].indexOf('.') !== -1) {
            esp = match[1].split('.').slice(-2).join('.')
          }
        }
        if (!esp) {
          // Todo: Track failed matches
          continue
        }
        if (sites[esp]) {
          sites[esp]++
        } else {
          sites[esp] = 1
        }
      }
      start += 50
      if (start >= exists) { break }
    }

    await imap.logout()
    await imap.close()
  } catch (e) {
    console.log(e)
  }
  console.log(sites)
})()
```

### Results
This was the breakdown after stripping the results to the top ones.

![](/assets/image/{{ page.date | date: '%Y/%m' }}/breakdown.png)

Few notes:
- rsgsv.net, mcsv.net and mcdlv.net are from [Mailchimp](http://mailchimp.com/). As you know, Mailchimp provides marketing email service. Mandrillapp.com is the transactional email service for Mailchimp. It used to be a standalone service until it became deeply integrated into Mailchimp.
- spmta.com is for [Sparkpost](http://sparkpost.com/).
- marketo.org is for [Marketo.com](http://marketo.com/), currently owned by Adobe. Provides marketing email service.
- Interesting to see [Intercom](http://intercom.com/) there. It's amazing the number of products using Intercom for customer engagement.
- mailgun.net and mailgun.org belong to [Mailgun](http://mailgun.com/), obviously. Mailgun also recently acquired [Mailjet](http://mailjet.com/). Mailjet provides both marketing and transactional email services. It will take more deep-diving into the headers (or content) to figure if the mail was sent as a marketing or transactional email.
- [Sendgrid](http://sendgrid.com/), also like Mailjet, offers both marketing and transactional email services. It’s the most used from my experiment but it’s hard to know what fraction of that is marketing and what other is transactional. PS: they were recently acquired by Twilio.

### Conclusion
I merged the same providers for a more accurate chart. 

![](/assets/image/{{ page.date | date: '%Y/%m' }}/breakdown-merged.png)

This is only a fun experiment and doesn’t show the true market share of the services. Since the data is based on the product emails in just my mailbox, it is flawed by selection bias. However, it’s something you can run on your mailbox for the fun of it. You can also extend it to see what service your favourite product/app uses. Remember, you may need to look at the full headers of some of your emails to come up with the best way to know the service provider. 

By the way, if you use Mailgun or Amazon SES for transactional emails, check out [Mailintel](https://mailintel.io/?ref=oo) for detailed analytics, reporting and business intelligence.

-

[^1]: Plug: [MyRSS.email](https://myrss.email) lets get your newsletter subscriptions via RSS. Check it out.