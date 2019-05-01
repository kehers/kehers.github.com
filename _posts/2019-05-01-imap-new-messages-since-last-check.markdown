---
title: "IMAP: new messages since last check"
date: 2019-05-01 00:00:00 Z
layout: post
---

I have been working on sharedBox in the last couple of months. The idea is simple: allow teams send and receive emails in Slack. I had to allow email connection via IMAP and doing this means it is important to be able to get only new emails at every check.

### Message IDs and other stories

Let’s start with some basic understanding of the message ids—sequence number and uid. It’s going to be important.  These numbers are how messages are identified[^1] in a mailbox. (Note that a *mailbox* refers to a message folder—inbox, sent, draft…and not the full email box). 

The message sequence number is a sequential numbering of messages in a mailbox. This means that the first message in the mailbox gets 1, the next gets 2, and so on. If a message is deleted, the number is reassigned. For example, given a mailbox with 10 messages, if message 7 is deleted, message with sequence number 8 now becomes 7, 9 becomes 8 and 10 becomes the new 9. So this [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] becomes this [1, 2, 3, 4, 5, 6, 7, 8, 9]. What this says is that the number is not unique and can always change.

UID is similar to sequence number but “more” unique. It is not affected by message deletes. In the example above, even though message with sequence number 8 is now 7, its UID will remain 8. The new array of message UID will then be [1, 2, 3, 4, 5, 6, 8, 9, 10]. Does this mean UIDs never change? No. Things may happen on the server that will reset message UIDs. Like if the mailbox is recreated. The good news though is that when UIDs change, there is a way to know. Enter UIDVALIDITY. 

UIDVALIDITY is an additional value returned when you select a mailbox. This value should be the same for every time the message UIDs are unique. If at any mailbox selection (session) the value is not the same as what it was in the last session, then know that your message UIDs have changed. It is therefore important you store this value at every session so you are able to compare at next check to know if the message UIDs have changed.

So where do sequence numbers and uids come in when pulling messages? We use them to specify what message or range of messages to pull. To pull a range of messages, we need to specify a **sequence set** of the message id (uid or sequence number).  This can take the following formats:

- `4` (only the message with id 4)
- `2,4,9` (messages 2, 4 and 9)
- `4:7` (messages 4 to 7, i.e 4, 5, 6, 7)
- `12:*` (messages 12 to the last message in the mailbox. If the last message in the mailbox is 14, that is 12, 13, 14. If the last message in the box is however less than 12, say 10 for example, then it is that number to 12, i.e 10, 11, 12)
- `2,4:7,9,12:*` (a combination of the formats above)

Now that we have a basic idea of what message ids are, it’s easy to start pulling emails. I will show some examples using the Javascript library [emailjs-imap-client](https://github.com/emailjs/emailjs-imap-client). Then we will get to the difficult part, pulling new messages (after last check).

(The library can be used in browser but I will be using it in Node.js instead. So as the first step, install:  `npm install —save emailjs-imap-client`)

Let’s start with connection to the IMAP server and box selection. And see what the response of the select action looks like.

{% highlight javascript %}
(async function (){
  // Connect to the imap server
	const imap = new ImapClient.default('imap.mail.yahoo.com', 993, {
	        auth: {
	          user: 'awesomeme@yahoo.com',
	          pass: 'ninjaninja'
	        }
	    });
	await imap.connect();

  // Select the "mailbox" you want to "interact" with
	const box = await imap.selectMailbox('INBOX');
  console.log(box);
})()
{% endhighlight %}

This should give you a response like this:

{% highlight json %}
{ readOnly: false,
  exists: 1,
  flags:
   [ '\\Answered',
     '\\Flagged',
     '\\Draft',
     '\\Deleted',
     '\\Seen',
     '$NotPhishing',
     '$Phishing' ],
  permanentFlags:
   [ '\\Answered',
     '\\Flagged',
     '\\Draft',
     '\\Deleted',
     '\\Seen',
     '$NotPhishing',
     '$Phishing',
     '\\*' ],
  uidValidity: 1,
  uidNext: 686,
  highestModseq: '108661' }
{% endhighlight %}

Notice the `uidValidity` and `uidNext` fields. Also note `highestModseq`. We will get to it. Another parameter you may be interested in is `exists`. It returns the number of emails currently available in the mailbox. Even though the mailbox might have received a lot of emails, only one is currently left in the mailbox.

Let’s extend our example to pull message with sequence number 1:

{% highlight javascript %}
(async function (){
	// ...
	const messages = await imap.listMessages('INBOX', '1', ['body[]']);
})()
{% endhighlight %}

We can also pull message with UID 686:

{% highlight javascript %}
(async function (){
	// ...
	const messages = await imap.listMessages('INBOX', '686', ['body[]'], {byUid: true});
})()
{% endhighlight %}

Pulling all emails from the mailbox is easy. All you need to do is specify a message sequence of `1:*`. (This may be a bad idea as the number of messages in the mailbox may choke your application. But you can always split the process `1:500`, `500:1000` and so on). The tricky part comes when you want to only pull new emails (mails after your last pull) from the server. And if you think one way syncs are tricky, wait till you attempt two-way syncs. 

### HighestModseq and ChangedSince

`highestModseq` returned when the mailbox is selected as you’ve seen above is the highest sequence number value of all messages in the mailbox. Once you select a mailbox and this number is greater than at last check, you can assume that there has been changes to the mailbox. You can then use the last value you have to pull all new messages.

Let’s assume the first time we checked the user’s mailbox, `highestModseq` was 100. The next time, it’s 120. This tells us there has been changes to the mailbox. We can then fetch new messages from when our `highestModseq` was 100.

{% highlight javascript %}
(async function (){
	// ...
	const messages = await imap.listMessages('INBOX', '1:*', ['body[]'], {changedSince: '100'});
})()
{% endhighlight %}

This is easy and works. There is just one problem though. Not all servers support `highestModseq`.

### \Recent? \Seen?

There is a `recent` flag that can be used to get “recent” messages from the server. The issue with this though is that the definition of “recent” by the server is relative. Here is what I mean:
- You disconnected from the server at 9:00pm
- 2 new messages come in at 9:02pm. The server marks these messages with the recent flag.
- You connect again at 9:05pm to check for new emails using the recent flag and you get the 2 new messages.
- You disconnect shortly after and the server removes the recent flag on the messages
- A new message comes in 9:07pm and is marked recent
- Another mail client that is not you, connects to the server to pull mails
- The recent flag is removed from the message
- You connect 9:10pm using the remove flag. You get zero messages even though there has been a new message since you last checked.

The `seen` flag is similar but also goes through the same fate. If another client opens the message, the flag is removed. Trying to get “unseen” messages after another client has “seen” them will return nothing. 

### Search Since

We can combine IMAP’s search function with a `since` parameter to get new messages since our last check. And this would have been a great solution—store the last time we checked and use that to get new messages since then. But there is a limitation to IMAP. The `since` parameter only takes date and not time.

### uidValidity + uidNext

Can we use the knowledge of what the next UID will be (taking into consideration if `uidValidity` has changed or not) to do this? Absolutely. If at first pull, uidValidity is 1 and uidNext is 686 then we can pull new messages since last pull with the sequence set: `686:*` if uidValidity is still 1.

{% highlight javascript %}
(async function (){
	// ...
	const messages = await imap.listMessages('INBOX', '686:*', ['body[]'], {byUid: true});
})()
{% endhighlight %}

What if uidValidity has changed? Then we can assume that there has been a major change to the mailbox—it has been recreated or so. We just need to assume we are starting our sync again—we store the new uidValidity and the use the new uidNext as our sequence set.


[^1]: https://tools.ietf.org/html/rfc3501#section-2.3.1
