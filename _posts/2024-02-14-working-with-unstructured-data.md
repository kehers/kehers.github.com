---
title: "[Building Engage] #5. Working with unstructured data"
date: 2024-02-14 00:00:00 Z
layout: post
---

A lot of content around data wrangling talks about dealing with structured data—data with a well defined schema. You can clearly define your database columns based on this schema to fit the incoming data. Most apps deal with this kind of data, so I understand. But for the other few, [Engage](https://engage.so/) for example, dealing with unstructured data is big work.

I am not talking about storage here. Storing unstructured data is easy. If you are using an SQL db, you can normalize the unstructured data (JSON stringify for example) in a column. If you are using a NoSQL db, even better. MongoDB for example supports schemaless data by design. Just dump your data in JSON style and you are good. But how do you store the data in a way that is easy to "search" the different fields? How do you sort on any of the fields? What about aggregation?

At Engage, users can track custom user attributes, events and properties. This means, each business have unique user data points and can do things like segment users based on those data points.

<iframe width="560" height="315" src="https://www.youtube.com/embed/qZzA_NS4Ar8?si=esN2saKhZqXan106" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Consequently, this means in total, the different user attribute fields from all businesses can be in hundreds, thousands, and eventually millions. Let me explain properly. Business A can have the following user attributes:

- name
- gender
- location
- avatar
- city

Business B:
- name
- age
- website
- occupation
- address
- rating

By the time you take that across a thousand businesses, 4 unique user attributes per one, that’s about 4,000 unique attributes. How for example do you store this in a way that the business can easily do a search like "Find all users that live in Lagos"? 4k unique columns that are indexed? Then do this for user events data. And events properties.

Unfortunately, this is not an indepth post to explore this. I hope to be able to gather more conversations, posts, and talks about this. But here are some pointers based on our experience. 

1. Find a database suited for your need. What you should be looking at are databases that are specifically designed for logging. I know you are probably looking for a recommendation here but business needs varies. This sounds easy but it’s not. You will have to experiment with different options and finally decide on what really works for you. That is the hard work.
2. You can actually store "all" the unique fields using Elasticsearch’s dynamic mapping. The fields are indexed and you can perform search and aggregations on them. Well, maybe not all. There is a setting that limits this to 1k fields which of course you can change. But remember, the more the fields, the more degradation on performance and resources. 
3. "[Mapping explosion](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-explosion.html)" happens when the number of these mapped fields in Elasticsearch is too high. One trick to prevent hitting it is to create multiple versions of the same index and route each query to the right index. So for example, you can cluster every account into a specific group (I love using the 16 hex digits: 0-9 and a-f). Suffix your index with the group, e.g, "logs" become "logs-a", "logs-b", etc. Requests goes to the specific index for the account making the request. What this means is that each of these indices would have 1k fields (so 16k altogether). The performance impact is way better than using a single index (say "logs") and increasing the mapping limit to 16k.
4. ClickHouse has JSON fields that allow you store unstructured data as JSON objects. It also has JSON functions to extract data from these fields and manipulate them. PostHog has a [post](https://posthog.com/handbook/engineering/clickhouse/working-with-json) about working with this. Personally, I found the [Pairwise Arrays](https://clickhouse.com/docs/en/integrations/data-formats/json#using-pairwise-arrays) option more performant so it’s something you can also explore. (Read the whole post about [Working with JSON in ClickHouse](https://clickhouse.com/docs/en/integrations/data-formats/json))

I would love to hear about your own experiences, what has worked for you, talks, posts, videos and everything about working with unstructured data that you have seen. I will try and do more detailed posts about working with unstructured data as well. 

I am [@kehers](https://twitter.com/kehers) on Twitter (or X as it is now called). 
