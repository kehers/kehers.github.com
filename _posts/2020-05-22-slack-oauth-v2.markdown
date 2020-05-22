---
title: Slack OAuth v2
date: 2020-05-22 00:00:00 Z
layout: post
---

Slack has a new [OAuth v2](https://api.slack.com/authentication/oauth-v2) flow. Here are the major changes:

- Authorization URL has changed to `https://slack.com/oauth/v2/authorize`
- Authentication URL has changed to `https://slack.com/api/oauth.v2.access`
- You can now request bot and user scopes within same call by specifying `scope` and `user_scope` respectively. Most OAuth libraries allow you to only pass a `scope` parameter. If however you want to request user scopes as well, find a way to pass the parameter in your library. If your library does not support custom request parameters, one hack would be to add it to the authorization URL: `https://slack.com/oauth/v2/authorize?user_scope=identity.basic`
- If you are authenticating as a bot only, meaning you are only passing `scope` parameters, be sure your library is not using a profile URL that requires user scope/token. Most libraries use `https://api.slack.com/methods/users.identity` as the profile URL and that method requires `identity.scope` which is only available to user scopes (`user_scope`). You have two options. One is to add the user scope `identity.scope` during the auth request. The other option is to use a profile URL you can access with your bot token. An example of such is [`users.info`](https://slack.com/api/users.info) (requires [`users:read` bot scope](https://api.slack.com/scopes/users:read)).
- If you are looking for a Slack OAuth v2 library for Node, check out [@kehers/passport-slack](https://github.com/@kehers/passport-slack).