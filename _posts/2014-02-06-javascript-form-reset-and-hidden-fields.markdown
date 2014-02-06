---
published: true
title: Javascript, form reset and hidden fields
layout: post
---
Quick heads up, form reset doesn't clear values of hidden fields. To properly clear form fields and hidden inputs, you can do this in JQuery

    $("#form")[0].reset();
    $("input[type=hidden]").val('');