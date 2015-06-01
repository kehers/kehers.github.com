---
published: true
title: A quick note on .editorconfig
layout: post
---
I really love [good code indentation](http://obem.be/2012/09/29/code-indention-it-is-this-simple.html). And writing a good code starts from a good indentation. While this is a conscious effort, your editor can make it very easy. And that is where [EditorConfig](http://editorconfig.org/) comes in. EditorConfig allows you define style rules an editor should adhere to. This makes it easy to have a consistent style even across editors.

In its simplest form, you create an "**.editorconfig**" file that will contain the rules in your source directory. (This means you can have different rules for different projects/directory). Here is the EditorConfig file for a [sample project](https://github.com/kehers/fave):

{% highlight text %}
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
{% endhighlight %}

As you will notice, the syntax is simple and self-explanatory. The rule simple says - for all file types (__*__), use 2 spaces for indentation, remove trailing spaces and end the file with a new line. For **.md** (markdown) files, don't remove trailing spaces. (Remember, trailing spaces in markdown is used to differentiate line break and paragraph). Here is a [complete list of EditorConfig properties](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties).

However, note that not all editors have inbuilt support for these rules. Yet. But there are plugins you can install to enable it. For Sublime text (my editor on Mac), Install ```EditorConfig``` via Package control. If you don't have Package control, see [installation details here](https://packagecontrol.io/installation). For Notepad++ (what I use on Windows), see [here](https://github.com/editorconfig/editorconfig-notepad-plus-plus#readme).

The real beauty of EditorConfig comes when you work in a team. Because individuals have their own indentation style, it is easy to have a mix of different styles. Some will use tabs for indentation, others spaces. (I recommend spaces by the way). Even for spaces, some will use 2 spaces, others 4. Editorconfig can help achieve a unique style across shared codes. A style is agreed on, the EditorConfig file is created based on that style and everyone ensures his/her editor is enabled for EditorConfig.

Notes:

- While EditorConfig aims at allowing setting a consistent code "style", I emphasized "indentation" in this post. Code style is a broader term. This include things like how brackets, arguments, control structures, keywords and closures are written, in what case (lower, upper, sentence) and how spaces should come in. EditorConfig won't take care of this for you. That is something a developer or a team should agree on. If you are using PHP for example, the [PSR2 coding style](http://www.php-fig.org/psr/psr-2/) is a good standard.
- My use of the term "editors" in this post also include IDEs.