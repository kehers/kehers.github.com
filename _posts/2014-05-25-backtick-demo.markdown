---
published: true
title: Another demo
layout: post
---
Details:

RoR => [Cube](http://github.com/square/cube) => MongoDB

Schema in MongoDB (example):

    {

      "_id": <object_id>,
      "t": <iso_timestamp>,
      "d": {
         "resource": "A",
         "action": "create",
         "id": <A_instance_id>
      }
    }