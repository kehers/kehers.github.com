---
title: "Email/Password Authentication Checklist"
date: 2024-09-17 00:00:00 Z
layout: post
---

Here is a fairly rough checklist of things you should think of when building an email/password authentication system for a fairly sensitive application. This assumes the basics like securely hashing passwords, proper session management, and transmitting data over SSL are already covered. For a more comprehensive list, see the [OWASP Cheat Sheet on Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

- Ensure passwords are a minimum of 8 characters. Support all printable ASCII characters and spaces.
- Implement two-factor authentication with an authenticator app at the minimum.
- If your app allows multiple users, allow the admin to be able to “force” 2FA for all members.
- Require password to update password or email.
- Send an email notification on password update.
- Send email notifications to both old and new email when email changes.
- Lock account (could be for a specific period) after multiple failed login attempts. (OWASP recommends also logging the failed attempts)
- Log authentication events with metadata like IP, client, and OS details.
- If a user is accessing from a "new location", and has no 2FA on account, send an email verification code. "New location" can be based on the client, IP, or a special fingerprint algorithm.
- Throttle codes sent via email (or SMS) to the same user. You can use an exponential backoff strategy to increase delay between each message sent and have a limit over a specific period, e.g., maximum of 4 verification codes to the same user over a 1 hour period.
- Allow users to be able to log out of all devices they are currently logged in on. This can be a button on their settings page. To implement this, you need to be able to map users to their session IDs and delete sessions by IDs. This may mean adding a DB store (Redis is a good choice) to your session layer.
- When users change their password, log them out of all other devices they are currently logged in on. A more subtle implementation of this that I have seen makes this optional. A provided checkbox lets you decide if you want to or not.

If I remember more, I will update the list.