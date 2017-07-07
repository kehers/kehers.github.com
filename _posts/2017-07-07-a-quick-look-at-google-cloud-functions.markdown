---
published: true
title: A quick look at HTTP triggers on Google Cloud Functions
layout: post
---
When writing [Suet's](https://suet.co/) webhook, I went with Amazon's [API gateway](https://aws.amazon.com/api-gateway/) + [Lambda](https://aws.amazon.com/lambda/) by default. After spending a couple of hours to write and deploy, I found out Amazon's API gateway has no support for multipart/form-data, a content type Mailgun sends some webhook data in. Pheeew. Well, the good news is that allowed me to give [Google Cloud Functions](https://cloud.google.com/functions/) a spin.

The good parts:

1. Google Cloud Function allows creating HTTP triggers directly. (A trigger is what tells your functions to run). You simply check a box and that's it. If you need an HTTP trigger for your Lambda function, you need to connect it to API gateway which is another curve on its own.
2. Because Cloud Function allows creating HTTP triggers directly, you can easily work with the request and response objects within the functions as exposed to the function
```
exports.myfunction = function(req, res) {
  // Play with req and res easily
}
```
3. Consequently, it is easy to handle request and response objects with middlewares. As an example, multipart/form-data can easily be handled in Cloud Functions with multer
```
const multer = require('multer')
  , parser = multer().none()
  ;
exports.hook = function(req, res) {
  // Add multipart/form-data support
  parser(req, res, function(){
    //...
    res.json({status: 'Ok'});
  }
}
```
4. Unlike Lambda, there is no need to upload the node_modules folder. Cloud Functions installs the modules from the package.json file.

The bad parts:

1. No environmental variables. This is top on my list. I was really amazed Google would miss a feature like that.
2. No custom domain support. This means I can't map a Cloud Function URL like `https://us-central1-suet-170506.cloudfunctions.net/suethooks` behind a URL like `https://hooks.suet.co/`
3. I know this is not HTTP related or for my use case but Cloud Functions could use scheduler triggers. (A scheduler allows you set when or a recurrent interval to run a function. This makes a good use for running cron jobs).

In defence of Google, Cloud Functions is still in beta though. I look forward to seeing it mature and can't wait to see what they have up their sleeves.
