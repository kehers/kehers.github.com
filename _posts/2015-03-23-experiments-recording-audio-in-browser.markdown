---
published: true
title: Recording audio in browser
layout: post
---
With advancements in HTML5, audio recording in browser is now easier than before. Even though the underlying technologies, Web Audio API + WebRTC, is [not fully supported across browsers](http://caniuse.com/#search=webrtc), it is a better alternative to having users install addons or download extensions to enable audio recording in browser.

## The how

In it's simplest form, [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia) is used to capture audio for [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) to then record. But of course, you know it's more complicated than that. Good news is [Recordjs](https://github.com/mattdiamond/Recorderjs) has done all the necessary work.

{% highlight javascript %}
// include recorder.js script

var recorder;
window.AudioContext = window.AudioContext 
                  || window.webkitAudioContext;
navigator.getUserMedia = (navigator.getUserMedia ||
               navigator.webkitGetUserMedia ||
               navigator.mozGetUserMedia ||
               navigator.msGetUserMedia);
var audioContext = new AudioContext;

navigator.getUserMedia({audio: true}, function(mediaStream) {
  var input = audioContext.createMediaStreamSource(mediaStream);
  recorder = new Recorder(input, {
    numChannels: 1
  });
}, function() {
  // No live audio input
});
{% endhighlight %}

## Optimizing

The audio is recorded in uncompressed wav format. If you will be uploading the recorded data, the size can be an issue. A one minute, 2 channels recording is around 10mb (one minute mono is around 5mb). What is the possible workaround? Compressing to mp3 - on the client! Don't fret yet, [libmp3lame.js](https://github.com/akrennmair/libmp3lame-js) got you covered. There is a good article on implementing with Recorderjs here: [nusofthq.com/blog/recording-mp3-using-only-html5-and-javascript-recordmp3-js/](https://nusofthq.com/blog/recording-mp3-using-only-html5-and-javascript-recordmp3-js/). Converting to mp3 reduces the size by about 97%. A converted mp3 file of one minute is about 300kb.

There are 2 minor issues with the [final working script](https://github.com/nusofthq/Recordmp3js) in that article though. One, it uses an old version of Recorderjs and hard-coded the channel as 1 in several parts of the source. The other issue is with libmp3lame. The converted mp3 file is twice the length of the original recording, with the other half blank. I created a fork that fixed both. I actually didn't do anything super. I just recreated using a newer version of Recorderjs, commented out a line causing audio feedback and made a tiny tweak in the libmp3lame source as recommended in a comment. You can check out the fork here: [github.com/kehers/Recordmp3js](https://github.com/kehers/Recordmp3js)

## Visualisation

![Visualisation](http://i.imgur.com/BA0uza4.png?1)

If you want to visualise the audio input live, check out the Microphone plugin of [wavesurfer](http://wavesurfer.fm): [wavesurfer.fm/example/microphone](http://www.wavesurfer.fm/example/microphone/). If you want to delve deeper, check out the [MDN Web Audio API docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

If you are interested in where this experiment leads, follow me on Twitter ([@kehers](https://twitter.com/kehers)) to follow what I am working on. I promise you will love it.