---
published: true
title: MongoDB; the why
layout: post
---
I have heard lots of arguments against MongoDB (NoSQL generally). One wrong assumption that generates this is that MongoDB is a SQL database replacement. It is not. However, there are certain data types and structures that are perfect for a NoSQL database. But even before you jump into making it your choice database for a project, you have to look at your data and be sure it is what you really need.

In MySQL, you can have three tables with one-to-one or one-to-many relationship.

**articles**

id | author_user_id | title | body | hash | date
--- | ------------------------- | ----- | -------- | -------- | -------
1 | 1 | MongoDB; the why | I have heard lots of arguments... | 98eb20e8733c0d5d52f88c1de2f34e19 | 2015-01-01 18:01:01


**users**

id | username | password | avatar
-- | ----------------- | --------------- | -----------
1 | kehers | $2a$08$Lg5XF1Tt.X5TGyfb... | https://avatars.githubusercontent.com/u/213649?v=3


**comments**

id | article_id | user_id | body | hash | date
--- | -------------- | ------------ | -------- | -------- | -------
1 | 1 | 3 | I disagree. Here is what I think... | daa2e4ed6ea7c4863b48b265fd4e26df | 2015-01-02 18:01:01


{% highlight sql %}
select u.username, u.avatar, c.body from comments c, users u where c.article_id={id} and c.user_id=u.id order by c.date desc
{% endhighlight %}

This is a luxury you can't afford in MongoDB. If you will be doing table relationships here and there, MongoDB is not for the project. For simple joins with few tables, say two, maybe. But if you will be doing lots of table joins, no.

What MongoDB is great for is a data structure where you have entities that can contain every property they need on their own. Combine that with it's great write speed, it is perfect for things like logs, events, stats and similar data.

{% highlight json %}
// crawler_logs
{
    title: "HTTP error",
    content: "Failed to access the site: example.com. Curl returns a 400 error.",
    stack: "pinger.js, line 45"
    date: "Sun Jan 11 2015 00:10:16 GMT+0100 (WAT)"
}
{% endhighlight %}

{% highlight json %}
// user_events
{
    event: "Login",
    ip: "192.168.2.2",
    user: {
        id: 525e3fb3b218980d35000001,
        username: "opeyemi"
    },
    date: "Sun Jan 11 2015 00:12:42 GMT+0100 (WAT)"
}
{% endhighlight %}

As you can see, each of the entries above contain all I need about the entry. I don't need to pull an additional data from a different collection (what tables are called in MongoDB) to make sense of the entry or make it complete. (I will be representing MongoDB entries as JSON objects because it closely represents how they are stored).

But MongoDB is not only good for logs. Consider a simple contact entity with the properties:

- Name
- Numbers
- Emails

A contact may contain multiple numbers and emails. We can represent this in MySQL with a one-to-many relationship model like this:

**contacts**

id | name | ..
--- | --------- | ---
1 | Opeyemi O. | ..

**numbers**

id | contact_id | number
--- | ---------------- | -------------
1 | 1 | 08181019_
2 | 1 | 08069018_

**emails**

id | contact_id | email
--- | ---------------- | ---------
1 | 1 | kehers@gmail.com
2 | 1 | ope@fonebaselabs.com

Well, we can argue it can as well be represented in a single table like this:

**contacts**

id | name | numebrs | emails
--- | --------- | -------------- | ----------
1 | Opeyemi O. | 08181019_,08069018_ | kehers@gmail.com,ope@fonebaselabs.com

(CRUD operations will not be as easy as with the one-to-many model but [find\_in\_set](http://dev.mysql.com/doc/refman/5.0/en/string-functions.html#function_find-in-set) can really be a helper). However, if we throw in one more contact property - organisations, with title and position columns, a single table with find_in_set won't save us now. We will have to go back to our one to many relationship.

**contacts**

id | name | ..
--- | --------- | ---
1 | Opeyemi O. | ..

**numbers**

id | contact_id | number
--- | ---------------- | -------------
1 | 1 | 08181019_
2 | 1 | 08069018_

**emails**

id | contact_id | email
--- | ---------------- | ---------
1 | 1 | kehers@gmail.com
2 | 1 | ope@fonebaselabs.com

**organisations**

id | contact_id | title | position
--- | ---------------- | ----- | --------------
1 | 1 | Fonebase Labs | Co-founder
2 | 1 | Life | Learner

There, we have another data type we can introduce MongoDB to. With MongoDB, we can represent the model in one collection:

{% highlight json %}
//contacts
{
  name: "Opeyemi O",
  email: ["kehers@gmail.com", "ope@fonebaselabs.com"],
  numbers: ["08181019_", "08069018_"],
  organisations: [
     { title: "Fonebase Labs", position: "Co-founder"},
     { title: "Life", position: "Learner"}
  ]
}
{% endhighlight %}

Let's look at one more instance where using MongoDB makes sense. Imagine you are creating a platform as a service (PaaS) product and users can store data sets or metadata that can be anything - strings, arrays, e.t.c. 

User A may have the following data:

- mailgun_key: pubkey-02iismi5n5xozcmeyu3-ymqe3f9-0da9
- ses_id: AKIAIJAZC3A2OYRSUGVA
- ses_key: aXTd5VlLfremkG5UyoB76tnTTo2jB9FrZVywFz

User B may have this:

- app_key: pGX1NjfDEUV5i60vvKRjeA
- oauth
  - token: 16110519-JOpMUsEWcAVSr2ft4jYKrbD2o6K
  - secret: B1yH5DPHZ3qHe9y29Ugoa0Dz7iDpWyvuNoMNYJ

And User C this:

- title: Callbase
- description: Set up a call center in 5 minutes
- author: Fonebase labs
- keywords: call center, telephony, customer care

Because the expected data from the user is not predefined and the same, using a SQL database for storage will be complex. You can't just go ahead creating columns for a data structure you have no idea of. With MongoDB however, this fits just perfectly as data down table (collection) rows do not need to have the same columns (name, data type or length). 

{% highlight json %}
// metadata
[
  {
    mailgun_key: "pubkey-02iismi5n5xozcmeyu3-ymqe3f9-0da9",
    ses_id: "AKIAIJAZC3A2OYRSUGVA",
    ses_key: "aXTd5VlLfremkG5UyoB76tnTTo2jB9FrZVywFz",
    user: ObjectId(167e3d8d95699af944000001)
  },
  {
    app_key: "pGX1NjfDEUV5i60vvKRjeA",
    oauth: {
      token: "16110519-JOpMUsEWcAVSr2ft4jYKrbD2o6K",
      secret: "B1yH5DPHZ3qHe9y29Ugoa0Dz7iDpWyvuNoMNYJ"
    },
    user: ObjectId(525e3fb3b218980d35000001)
  },
  {
    title: "Callbase",
    description: "Set up a call center in 5 minutes",
    author: "Fonebase labs",
    keywords: ["call center", "telephony", "customer care"],
    user: ObjectId(526fb1fa13d4432c6f000004)
  }
]
{% endhighlight %}

In conclusion, the key is to understand your data structure and the most efficient way to store it. Where it gets interesting is that you can even use both type of database for a single project. You can store your main data in MySQL and have your logs and events in MongoDB.