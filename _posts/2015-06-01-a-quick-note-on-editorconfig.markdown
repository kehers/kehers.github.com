---
published: true
title: A quick note on .editorconfig
layout: post
---
I really love [good code indentation](http://obem.be/2012/09/29/code-indention-it-is-this-simple.html). And writing a good code starts from a good indentation. While this is a conscious effort, your editor can make it very easy. And that is where [EditorConfig](http://editorconfig.org/) comes in. EditorConfig allows you define style rules an editor should adhere to. This makes it easy to have a consistent style even across editors.

In its simplest form, you create an "**.editorconfig**" file that will contain the rules in your source directory. (This means you can have different rules for different projects/directory). Here is the EditorConfig file for a [sample project](https://github.com/kehers/fave):
