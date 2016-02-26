---
published: true
title: Transferring website ownership
layout: post
---
I experiment on ideas for the fun and to learn new things from time to time. Once I run these projects for a while, I either [open source](http://github.com/kehers/tinypress) or sell them. What this means is I get to transfer site assets and services to a new maintainer from time to time. This transfer can be a little tricky. While some services make it easy to do, it is difficult on others. Here is a how-to guide for some of the things I get to deal with. PS: This is not a definitive list. These are just some of the services I use for personal experiments.

### Domain name, SSL and Email (Namecheap)

[Namecheap](http://namecheap.com/) makes things easy. Note that transferring ownership to another user is different from transferring the domain name to another registrar.

- Go to your domain management page (this is the default page on login anyway)
- Click on `Manage` just by the domain you want to transfer
    ![](http://i.imgur.com/16tnp1k.png)
- Click the `Sharing & Transfer` tab
    ![](http://i.imgur.com/DN4Wzy0.png)
- Go to `Change Ownership`
    ![](http://i.imgur.com/3lvHKT8.png)
- Enter new user's email or username.

### DNS (DigitalOcean)

I use [DigitaOcean](http://digitalocean.com/) for my DNS. Transferring DNS on DigitalOcean is a pain especially when it's a lot of settings. You will have to list out the settings for the new owner to recreate. You also need to delete the domain and DNS settings from your account before he/she starts.

### Hosting (DigitalOcean)

Bummer. No easy way to transfer droplets between accounts on Digitalocean. One option is to change the account's details to that of the new user. But for someone like me that runs an average of 5 different droplets in a single account, transferring the whole account because of a droplet is not feasible. The way to it is to take a snapshot of the droplet and transfer to the user. The user then creates a new droplet from the snapshot.

- Login and select the droplet
- Click the `Power` option and power it off
    ![](http://i.imgur.com/iQZAQYF.png)
- Click on `Snapshots` and create a snapshot
    ![](http://i.imgur.com/EwvhH3J.png)
- Once done, go to `Images`
    ![](http://i.imgur.com/8qBcrZD.png)
- Click the `More` option by the snapshot and select `Change owner`
    ![](http://i.imgur.com/uVwAKLP.png)
- Enter the receipient's name

Once done, you can delete the snapshot and destroy the droplet from your own account. Shameless plug: you can use my referral link https://m.do.co/c/921564962064 to create a new DigitalOcean account. You get $10 in credit.

### Code (Bitbucket, Github)

Transferring repos on Bitbucket and Github are the same process.

For [Bitbucket](http://bitbucket.com/):

![](http://i.imgur.com/uL745PA.png)

- Go to repository
- Click on `Settings`
- Select `Transfer Ownership` and enter the new user's email

Github:

- Go to the repository
- Click on `Settings`
    ![](http://i.imgur.com/q5B0GAg.png)
- Scroll to the end of the page to the transfer ownership section and click on `Transfer`
    ![](http://i.imgur.com/6I9Qpae.png)

### Transactional email (Mailgun)

[Mailgun](http://mailgun.com/) has a feature for adding new users to an account (availabile in `Account settings` for users that have their payment info on file) but the limitation is that the account owner, i.e you, cannot be removed. There are two options besides this.

![](http://i.imgur.com/cji7Lv2.png)
![](http://i.imgur.com/kP0JwYv.png)

1. Update the account's details-name, email to that of the new user. He/she can then login, update billing info and take over.
2. Delete the domain from your Mailgun account. The new owner adds the domain to his/her Mailgun account, verifies and update other necessary settings.

### Queues and Workers (Iron.io)

![](http://i.imgur.com/w2qBA0U.png)

[Ironio](https://iron.io) allows you share projects. But that gives both of you access to the project (the owner cannot be removed). If the account has only the single project you want to share, you can change the account details to that of the new user. If like me you run an account with multiple separate projects, this won't work. The new owner will need to create an Ironio account, create the project and replicate the workers and queues.

### Analytics (Google, Mixpanel)

Transferring Google Analytics is straight forward. You add the new user to the account and remove yourself.

![](http://i.imgur.com/BmgORSN.png)
![](http://i.imgur.com/t6yatRo.png)
![](http://i.imgur.com/2m3SOKm.png)

- Visit your dashboard
- Go to Admin
- Select the website from the first column
- Click `Add user` and add the new user's email address. You may want to check `Notify by email` so that the user gets an email notification.
- Give him/her all rights to the account
- Delete your own account

[Mixpanel](http://mixpanel.com/) is similar.

- Login
- Click the `Invite team member` icon at the bottom of the page. It is small and easy to miss.
    ![](http://i.imgur.com/6xtZ4dG.png)
- Enter new user's email
    ![](http://i.imgur.com/wiKAWgY.png)
- (Once the user accepts the invitation, you can then do the transfer)
- Click the settings icon (just before the Invite icon earlier) OR if you still have the account settings modal opened, select the `Management` tab
- Click on `Transfer Project`
    ![](http://i.imgur.com/tKA4TQg.png)
- Select the user from the `Owner` dropdown

### Social media accounts

Transferring social media accounts are simple. All you need to do is to change to a temporary password for the new user. He/She then updates to a preferred one. (As at the time of writing this) Instagram automatically logs out every app already logged in once the password is changed. This is a very good thing. Not like that on Twitter.

### Blog (Tumblr)

If it is a secondary blog, you can add a user to the blog and remove yourself. A secondary blog is any additional blog you add to your Tumblr account. Your default Tumblr blog is the primary blog. (See [the difference here](https://www.tumblr.com/docs/en/blog_management)). Bad news is primary blogs can't have multiple users. So you will have to change the account's email to the new user's email and change your password to a temporary one for the new user too.

For a secondary blog:

![](http://i.imgur.com/ny7VEGz.png)

- Click the `Account` icon
- Click the profile icon just next to the blog's name
- Click on `Members`
- Invite the user
- Remove yourself

### Payment (Stripe)

You can just change the account's email details to that of the new user. [Stripe](http://stripe.com/) will take it from there. Another alternative is to add the person as a team member and transfer ownership to him/her.

- Login to your dashboard
- Go to `Account Settings`
- Click on the `Team` tab
- Click the `Invite User` and invite the user
- One invited, click on the pencil icon next to the user to transfer ownership

### [Google] Play Store application

You have to submit a request to transfer an application to another account on the Play store. There are some requirements that should be met before you do though. Full details available here: https://support.google.com/googleplay/android-developer/answer/6230247?hl=en

### OAuth Apps

**Facebook:**

![](http://i.imgur.com/QeDRMyj.png)

- Visit the application page
- Click on `Roles`
- Click on `Administrators`
- Enter the person's name. Note that you must be friends on Facebook already.
- Once accepted, you can delete yourself from the same role page

**Instagram:**

Sorry, no way to transfer Instagram applications. The new user will have to recreate the application and update the application key where necessary.

**Twitter:**

No direct way to transfer a Twitter application as well. But you can request a transfer by filling the form at https://support.twitter.com/forms/platform

**LinkedIn:**

LinkedIn is similar to Facebook

![](http://i.imgur.com/Lc77UkH.png)

- Visit the application page
- Click on `Roles`
- Enter the person's name. (You must be connected on LinkedIn already)
- Remove yourself once done

One thing you must have noticed is that it is easier if you run a single project in an account. You can just change the account details to that of the new owner. Of course, this is not always feasible. It sounds crazy creating a new namecheap account for every domain name you want to register. Or creating a separate Github account for every repo you want to create. But if you know that you will eventually be transferring ownership of the project, and for a particular service transfer will be difficult, you can create a separate account for the project on that service. What I recommend is that for projects you will transfer, create a new email address and use that to register for necessary services. Just give the new owner the email, when the time comes.

My recommendation for OAuth applications is that you create the application under the project's account. If for example you created a project with the Twitter handle "waynecorp" and you need to create a Twitter application for it, create the application when logged in as "waynecorp" and not your personal account. When you need to transfer it to Batman, you just change the Twitter account's email address and he will have ownership of both the Twitter account and OAuth app.

One more note. Please conclude agreements and be sure you really want to go ahead with transfers. Once you transfer ownership of a service, that's it. No undo; no turning back.

That's about all the services I could think of now. If I remember others, I will update. Feel free to add others in comments too.