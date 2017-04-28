---
published: true
title: Disabling retries on Amazon Lambda
layout: post
---

Amazon Lambda [retries asyncronous invocations](http://docs.aws.amazon.com/lambda/latest/dg/retries-on-errors.html) up to two more times if there is a failure (script error, timeout, etc). The drawback to this is that sometimes these retries are not necessary. Our functions may be time senstive or not important enough for a retry. Another thing is that the error may not be temporary, meaning retrying may not solve the issue. A database failure or syntax error is an example of this. If it's a function scheduled to be invoked recurrently, failure retries will stack up and your bill can seriously surge.

The bad news? There is no way to disable retries on Lambda. A simple trick is to store the **context**'s **AWS Request Id** of each invocation and check against that store. This Request Id is always the same for retried invocations. For how to get the Request Id, check the context object documentation in the language you are writing your functions in. For [NodeJs](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html) for example, this will be:

{% highlight javascript %}
exports.handler = function(event, context, callback) {

  dbClient.connect(dburl, function(err, db) {

    // DB connection error
    if (err) {
      // todo: Log and notify
      return callback(err);
    }

    // Is this a retry?
    db.collection('reqids').findOne({id: context.awsRequestId}, function(err, doc) {
      // Yup! Exit
      if (doc)
        return callback();

      // Else Log id to remember
      // todo: Dont forget to create an index on id
      db.collection('reqids').insert({id: context.awsRequestId});

      // Rest of our function here
    })

  })
}
{% endhighlight %}

It is the same for process for other languages supported on Amazon Lambda. Just check for the **context** object and see how you can get the **AWS Request Id**.