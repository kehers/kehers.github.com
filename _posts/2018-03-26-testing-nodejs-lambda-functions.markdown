---
title: "Testing [Nodejs] Lambda functions"
published: true
layout: post
---

Testing Lambda functions can be tricky. A typical cycle is to assume everything is fine, push up, get stuck, debug and make corrections locally, then push up again. A better approach would actually be to test locally before pushing up. 

Let’s consider a [typical Nodejs Lambda function](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)

{% highlight javascript %}
exports.handler = (event, context, callback) => {
  // Do stuff here
  return callback();
}
{% endhighlight %}

To be able to test this locally, we need to be able to pass in the required `event`, `context` and `callback` parameters. Interestingly, by looking into the `event`  and  `context` objects and of course knowing `callback` is just a function passed in to return information, we can similar objects and use them for our local test.

Let’s start with `event`. This is used to pass event data to the function. The data will depend on the event source connected to your Lambda function. You can find a list of [sample events published by event sources here](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-sns). For example, let’s see the data sent from SNS. Here is what the sample event data looks like:

{% highlight json %}
{
  "Records": [
    {
      "EventVersion": "1.0",
      "EventSubscriptionArn": eventsubscriptionarn,
      "EventSource": "aws:sns",
      "Sns": {
        "SignatureVersion": "1",
        "Timestamp": "1970-01-01T00:00:00.000Z",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
        "Message": "Hello from SNS!",
        "MessageAttributes": {
          "Test": {
            "Type": "String",
            "Value": "TestString"
          },
          "TestBinary": {
            "Type": "Binary",
            "Value": "TestBinary"
          }
        },
        "Type": "Notification",
        "UnsubscribeUrl": "EXAMPLE",
        "TopicArn": topicarn,
        "Subject": "TestInvoke"
      }
    }
  ]
}
{% endhighlight %}

For me though, (I use this on [TFP](https://thefeed.press/) to send data across the workers), two things:
1. The only value I’m interested in from the event data is `event.Records[0].Sns.Message` .
2. `Message` is a *stringified* JSON object.

Based on these, I can create my `event` object as this:

{% highlight javascript %}
var event = {
  Records: [{
    Sns: {
      Message: JSON.stringify(testdata)
    }
  }]
}
{% endhighlight %}

Next is the `context` parameter. We can see all the keys of the context object in [this document](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html). Let’s create a similar object.

{% highlight javascript %}
var context = {
  awsRequestId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5), // random string per request
  callbackWaitsForEmptyEventLoop: true,
  getRemainingTimeInMillis: function(){ return 0 },
  functionName: '',
  functionVersion: '',
  memoryLimitInMB: '',
  logGroupName: '',
  logStreamName: '',
  clientContext: null,
  identity: null
}
{% endhighlight %}

`callback` is the easy one. 

{% highlight javascript %}
var callback = function(err, result) {
  if (err)
    console.log(err);
  if (result)
    console.log(result);
  // Terminate execution once done
  process.exit(0);
}
{% endhighlight %}

Now that we have the 3 required parameters. We can put everything together.

{% highlight javascript %}
require('dotenv').config(); // Environmental variables
var lambda = require('./path/to/lambda/function/index.js')
;

// Event
var eventdata = {
    url: 'https://api.twitter.com/1.1/statuses/home_timeline.json'
    , qs: {
      tweet_mode: 'extended'
    }
    , user: '5ab7d745174f534889991a30'
    , oauth: {
      consumer_key: process.env['TWTR_CK']
      , consumer_secret: process.env['TWTR_CS']
      , token: process.env['TWTR_TOKEN']
      , token_secret: process.env['TWTR_SECRET']
    }
  }
var event = {
  Records: [{
    Sns: {
      Message: JSON.stringify(eventdata)
    }
  }]
}
// Context 
var context = {
  awsRequestId: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
  callbackWaitsForEmptyEventLoop: true,
  getRemainingTimeInMillis: function(){},
  functionName: '',
  functionVersion: '',
  memoryLimitInMB: '',
  logGroupName: '',
  logStreamName: '',
  clientContext: null,
  identity: null
}
// Callback
var callback = function(err, result) {
  if (err)
    console.log(err);
  if (result)
    console.log(result);
  // Terminate execution once done
  process.exit(0);
}

// Run
lambda.handler(event, context, callback);
{% endhighlight %}
