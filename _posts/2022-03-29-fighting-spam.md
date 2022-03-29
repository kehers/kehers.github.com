---
title: "[Building Engage] #3. Fighting spam"
date: 2022-03-22 00:00:00 Z
layout: post
---

If you give people any tool for engagement, expect it to be used for spam. This is worse for marketing tools. There are always bad actors looking to exploit this to send phishing emails and spam to people.

For Engage, the earliest fail-safe we placed was to not provide email sending infrastructure ourselves but allow customers connect their existing infrastructure. To Engage, you had to connect your ESP (email service provider). (We support Mailgun, AWS, Sparkpost and Sendgrid). This solved the issue on two fronts:

1. These services have processes in place to ensure you are genuine. For you to have a production-ready AWS SES account, for example, you needed to have [made a valid argument](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html) for your use case and successfully passed the review process.
2. These services track your use according to policy limits and penalize when necessary. They actively track things like your bounce rates and complaint rates and if these go above particular thresholds, your account gets disabled.

But there was a problem with this experience. Since our primary targets are product marketers/managers, telling them to connect an ESP before they get value on the product creates friction. They probably don’t know what ESP they use or care enough (yet) to connect the ESP. And not everyone wants to connect their ESP anyway. To reduce the path to value as much as possible, we had to automatically provision a default way to send outbound emails without the need for customers to connect an ESP. And we were back at solving the spam issue ourselves.

There are different approaches to solving spam depending on what you are building. For marketing tools, the general approach is to limit what customers can do, review the account and whitelist. There are slight variations of this approach but the general concept remains the same. This was the same approach we took. 

Our original plan was to limit to a particular allowed daily sends (50? 100? 10?). Customers can then request full access. One other approach we considered was starting accounts in sandbox mode where we only allow sends to a whitelisted list of emails (emails need to be verified to be added). To move to production, a request is made and we review. This is the common pattern with transactional ESPs. But it adds another layer of friction and complexity that we would rather not include. In the end, we decided to completely limit email sends for new accounts. Customers can explore and use other features 100% but email sending (both broadcast and automation) is disabled till we manually review.

The drawback with the approach is that we need to review every single signup (and quickly too). But that’s not a bad thing. It lets us know our customers. At scale, we may not be able to manually do it fast as necessary but there are ways to solve that, e.g. automated checks, machine learning flagging.

But signup is only the beginning. Fighting spam is continuous work. After signup and whitelisting, it is important to continually monitor and ensure people use the service responsibly. Bounces and complaints need to be regularly monitored to ensure it falls within an acceptable range. I particular love how [Intercom](https://www.intercom.com/help/en/articles/567399-intercom-s-workspace-review-process) also checks links in outbound messages for web threats and this is something we have also adopted.