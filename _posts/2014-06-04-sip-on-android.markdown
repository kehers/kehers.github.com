---
published: true
title: SIP on Android
layout: post
---
#SIP on Android

What's cool about [Callbase](https://callbase.co/) is allowing businesses manage their calls right there on the browser. Just a sign up; available anywhere; no installs. But what about extending this flexibility to mobile devices? What about giving agents the flexibility of receiving and making calls on their mobile device anywhere, anytime? Since Callbase is built on the SIP protocol, platform portability should be an easy one. The Android platform is one I have been working on for some days now.

## The Android SIP stack

Android provides a high level [SIP API](http://developer.android.com/guide/topics/connectivity/sip.html) from versions 2.3 (Gingerbread) and above. The implementation is straight forward:

- Initialize the SipManager
- Build the local Sip profile
- Start the manager with a pending intent for incoming calls
- Send registration requests

So here is our SipDemo class

{% highlight java %}
public String sipAddress = null;

public SipManager manager = null;
public SipProfile me = null;
public SipAudioCall call = null;

...

public void initializeManager() {
  
  // Initialize manager
  if(manager == null) {
    manager = SipManager.newInstance(this);
  }

  try {
    // Build the SIP profile
    SipProfile.Builder builder = 
                new SipProfile.Builder("sip_username", "domain");
    builder.setPassword("sip_password");
    me = builder.build();

    // Register a pending intent for incoming calls
    Intent i = new Intent();
    i.setAction("android.SipDemo.INCOMING_CALL");
    PendingIntent pi = 
        PendingIntent.getBroadcast(this, 0, i, Intent.FILL_IN_DATA);
    manager.open(me, pi, null);
    
    // Send registration requests
    manager.setRegistrationListener(me.getUriString(),
                    new SipRegistrationListener() {
        public void onRegistering(String localProfileUri) {
          // Registering with SIP Server...
        }

        public void onRegistrationDone(String localProfileUri,
                                long expiryTime) {
          // Ready
        }

        public void onRegistrationFailed(String localProfileUri,
                            int errorCode, String errorMessage) {
          // Registration failed.  Check SIP details
        }
      });
  } catch (ParseException pe) {
    // Connection error
  } catch (SipException se) {
    // Connection error
  }
}

{% endhighlight %}

It is that straight forward. In less than an hour, you can build a simple client that can make and receive calls. To receive calls, you just register a broadcast receiver for the pending intent you registered earlier.

So in our SipDemo class,

{% highlight java %}
...
public IncomingCallReceiver callReceiver;

@Override
public void onCreate(Bundle savedInstanceState) {

  super.onCreate(savedInstanceState);
  setContentView(R.layout.main);
  
  IntentFilter filter = new IntentFilter();
  filter.addAction("android.SipDemo.INCOMING_CALL");
  callReceiver = new IncomingCallReceiver();
  this.registerReceiver(callReceiver, filter);
  
  ...
}
{% endhighlight %}
    
And here, the broadcast receiver:

{% highlight java %}
public class IncomingCallReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {
    
    SipAudioCall incomingCall = null;
    final SIPDemoActivity siActivity = (SIPDemoActivity) context;
    
    try {
      // listener for sip manager takeaudio call
      SipAudioCall.Listener listener = new SipAudioCall.Listener() {
        @Override
        public void onRinging(SipAudioCall call, SipProfile caller) {
          // Ringing UI
        }
        
        @Override
        public void onCallEstablished(SipAudioCall call) {
          // Call picked UI
        }
        
        @Override
        public void onCallEnded(SipAudioCall call) {
          // Call ended. Back to normal UI
        }
      };
      incomingCall = siActivity.manager.takeAudioCall(intent, listener);

    } catch (Exception e) {
      if (incomingCall != null) {
        incomingCall.close();
      }
    }
  }
}
{% endhighlight %}

Making calls is as well easy. You don't need to build a dialer to get started with. For something quick, you can simply intercept calls from the phone's dialer ([the beauty of Android](http://kehers.github.io/2014/05/17/back-on-android.html)). Just register for the [NEW\_OUTGOING\_CALL](http://developer.android.com/reference/android/content/Intent.html#ACTION_NEW_OUTGOING_CALL) intent in your manifest

{% highlight xml %}
<receiver android:name=".OutgoingCallReceiver">
  <intent-filter>
    <action android:name="android.intent.action.NEW_OUTGOING_CALL" />
    <category android:name="android.intent.category.DEFAULT" />
  </intent-filter>
</receiver>
{% endhighlight %}

Here is our broadcast receiver:

{% highlight java %}
public class OutgoingCallReceiver extends BroadcastReceiver {
  
  @Override
  public void onReceive(Context context, Intent intent) {
    // Get phone number
    String phoneNumber = getResultData();
    if (phoneNumber == null) {
      phoneNumber = 
        intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);
    }
    
    // Ideally, you will want to prompt the user here
    //  ...to confirm using the SipDemo app to call
    
    // For now, let's just 'hijack' the call
    setResultData(null);
    
    // Start and pass the phone number to our SipDemo class
    Intent i = new Intent(context.getApplicationContext(), 
            SipDemo.class);
    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    i.putExtra("OUTBOUND_NUMBER", phoneNumber);
    context.startActivity(i);
  }
}
{% endhighlight %}

...and back to our SipDemo class

{% highlight java %}
@Override
public void onCreate(Bundle savedInstanceState) {
  ...
  initializeManager();
  
  // Outbound call?
  Bundle extras = getIntent().getExtras();
  if(extras != null) {
    outBound(extras.getString("OUTBOUND_NUMBER"));
  }
}

public void outBound(final String number) {
  try {
    SipAudioCall.Listener listener = new SipAudioCall.Listener() {

      @Override
      public void onCalling(SipAudioCall call) {
        // Calling UI
      }

      @Override
      public void onCallBusy(SipAudioCall call) {
        // Busy UI?
      }
      
      @Override
      public void onCallEstablished(SipAudioCall call) {
        // Call picked UI
        call.startAudio();
      }
      
      @Override
      public void onCallEnded(SipAudioCall call) {
        // Ended. Back to normal UI
      }

      @Override
      public void onRingingBack(SipAudioCall call) {
        // Ringing UI
      }
    };

    call = manager.makeAudioCall(me.getUriString(), 
                sipAddress, listener, 30);
  }
  catch (Exception e) {
    if (me != null) {
      try {
        manager.close(me.getUriString());
      } catch (Exception ee) {
        ee.printStackTrace();
      }
    }
    if (call != null) {
      call.close();
    }
  }
}
{% endhighlight %}

That's as easy as it can get. You will find more interesting methods to end, mute, hold and all that in the [SipAudioCall](http://developer.android.com/reference/android/net/sip/SipAudioCall.html) class. The only other things you have to take care of are normal manifest permissions  and class clean up (unregistering broadcast receivers, closing the manager).

Manifest permissions and feature requests:

{% highlight xml %}
<!-- Permissions -->
<uses-permission android:name="android.permission.PROCESS_OUTGOING_CALLS" /> 
<uses-permission android:name="android.permission.USE_SIP" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<!-- ...and features -->
<uses-feature android:name="android.hardware.sip.voip" android:required="true" />
<uses-feature android:name="android.hardware.wifi" android:required="true" />
<uses-feature android:name="android.hardware.microphone" android:required="true" />
{% endhighlight %}

Cleaning up, once our [SipDemo] activity is done:

{% highlight java %}
@Override
public void onDestroy() {
  super.onDestroy();
  if (call != null) {
    call.close();
  }
  
  try {
    if (me != null) {
      manager.close(me.getUriString());
    }
  } catch (Exception ee) {
    //
  }

  if (callReceiver != null) {
    unregisterReceiver(callReceiver);
  }
}
{% endhighlight %}

## The problem

Even though the specs states the SIP API is available for Android devices from 2.3, it is not. **The Android SIP API is not supported on all devices.** Interestingly, it is supported on my old 2.3 LG P970 and not my 4.4 Moto G. (By the way, you have to test on real device and not the Android emulator).

We can do a simple test. The [SipManager class](http://developer.android.com/reference/android/net/sip/SipManager.html) has some methods to test device support.

{% highlight java %}
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    ...
    
    TextView tv = (TextView) findViewById(R.id.textview);
    if (SipManager.isVoipSupported(this) && SipManager.isApiSupported(this)){
        // Good to go!        
        tv.setText("Congrats, your device made it!");
    }
    else {
        // Device not supported
        tv.setText("Not supported :/"); 
    }
}
{% endhighlight %}

In most cases, the API will be supported but not VOIP. And that is a big bummer there. This makes the Android SIP API limiting if you are planning to build something targeted at different devices.

## Finding an alternative

With the Android SIP API out, what are the alternatives? Well, there are a couple of open source SIP stacks for Android. The popular ones people talk about are:

- [JAIN](https://java.net/projects/jain-sip/)
- [MjSIP](http://www.mjsip.org/)
- [PjSIP](http://www.pjsip.org/)
- [Doubango](http://www.doubango.org/)

Now another problem - chosing. After a full day of experimenting and digging, I finally settled for Doubango. But why Doubango? Two reasons:

1. High level API    
Some of the stacks offer only low level APIs. They require you to have a good knowledge of the SIP protocol. Nothing is handed to you on a platter of gold. You must know what headers, what messages, what requests to send at the right time. There is nothing like calling a simple **register()** method to help you handle SIP server registration.    
Doubango offers a high level API that makes SIP development a lot easier and faster.     
2. Platform ready    
Doubango has an Android library that can be integrated easily. All the hard C/Android JNI integration already done.

## Setting up Doubango

The journey starts from downloading the Android NGN stack from [code.google.com/p/imsdroid/](https://code.google.com/p/imsdroid/). (The core project is available at [code.google.com/p/doubango/source/checkout](https://code.google.com/p/doubango/source/checkout)). There is a PDF (android-ngn-stack-00.pdf) in /branch/2.0 that explains the library setup - importing to Eclipse and creating your project. Once that is done, you can start building.

For me, the PDF documentation didn't help much as regards development. I had to figure a lot of things by experimenting. The sample source codes and imsdroid source were also helpful.

## Building on the [high level] API

The implementation is similar to that of Android SIP API

- Start the 'library engine' and SIP service
- Set configuration details
- Register call state and registration state broadcast receivers
- Send registration request 

Let's start with the initializing the engine and SIP service and registering the broadcast receivers.

{% highlight java %}
private NgnEngine mEngine;
private INgnSipService mSipService;
private RegistrationBroadcastReceiver regBroadcastReceiver;
private CallStateReceiver callStateReceiver;

@Override
public void onCreate() {  
  // Get engines
  mEngine = NgnEngine.getInstance();
  mSipService = mEngine.getSipService();
  
  // Register broadcast receivers
  regBroadcastReceiver = new RegistrationBroadcastReceiver();
  final IntentFilter intentFilter = new IntentFilter();
  intentFilter.addAction(NgnRegistrationEventArgs.ACTION_REGISTRATION_EVENT);
  registerReceiver(regBroadcastReceiver, intentFilter);
  // Incoming call broadcast receiver
  final IntentFilter intentRFilter = new IntentFilter();
  callStateReceiver = new CallStateReceiver();
  intentRFilter.addAction(NgnInviteEventArgs.ACTION_INVITE_EVENT);
  registerReceiver(callStateReceiver, intentRFilter);
}
{% endhighlight %}

Here are the receivers:

{% highlight java %}
public class RegistrationBroadcastReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {
    final String action = intent.getAction();
    // Registration Event
    if(NgnRegistrationEventArgs.ACTION_REGISTRATION_EVENT.equals(action)){
      NgnRegistrationEventArgs args = intent.getParcelableExtra(NgnEventArgs.EXTRA_EMBEDDED);
      if(args == null){
        Log.d("DEBUG", "Invalid event args");
        return;
      }
      switch(args.getEventType()){
        case REGISTRATION_NOK:
          Log.d("DEBUG", "Failed to register :(");
          break;
        case UNREGISTRATION_OK:
          Log.d("DEBUG", "You are now unregistered :)");
          break;
        case REGISTRATION_OK:
          Log.d("DEBUG", "You are now registered :)");
          break;
        case REGISTRATION_INPROGRESS:
          Log.d("DEBUG", "Trying to register...");
          break;
        case UNREGISTRATION_INPROGRESS:
          Log.d("DEBUG", "Trying to unregister...");
          break;
        case UNREGISTRATION_NOK:
          Log.d("DEBUG", "Failed to unregister :(");
          break;
      }

    }
  }
}

public class CallStateReceiver extends BroadcastReceiver {

  @Override
  public void onReceive(Context context, Intent intent) {

    final String action = intent.getAction();
    
    if(NgnInviteEventArgs.ACTION_INVITE_EVENT.equals(action)){
      NgnInviteEventArgs args = 
                intent.getParcelableExtra(NgnEventArgs.EXTRA_EMBEDDED);
      if(args == null){
        Log.d("DEBUG", "Invalid event args");
        return;
      }

      NgnAVSession avSession
                = NgnAVSession.getSession(args.getSessionId());
      if (avSession == null) {
        return;
      }

      final InviteState callState = avSession.getState();
      NgnEngine mEngine = NgnEngine.getInstance();
      
      switch(callState){
        case NONE:
        default:
        break;
        case INCOMING:
          Log.i("DEBUG", "Incoming call");
          // Ring
          mEngine.getSoundService().startRingTone();
          break;
        case INCALL:
          Log.i("DEBUG", "Call connected");
          mEngine.getSoundService().stopRingTone();
          break;
        case TERMINATED:
          Log.i("DEBUG", "Call terminated");
          mEngine.getSoundService().stopRingTone();
          mEngine.getSoundService().stopRingBackTone();
          break;
      }
    }
  }

}
{% endhighlight %}

Before we can call send a registeration request, we need to set necessary SIP configuration details. The NGN stack has a configuration utility for this.

{% highlight java %}
NgnEngine mEngine = NgnEngine.getInstance();
INgnConfigurationService mConfigurationService
            = mEngine.getConfigurationService();
mConfigurationService.putString(NgnConfigurationEntry.IDENTITY_IMPI,
                                    "sip_username");
mConfigurationService.putString(NgnConfigurationEntry.IDENTITY_IMPU, 
        String.format("sip:%s@%s", "sip_username", "sip_domain"));
mConfigurationService.putString(NgnConfigurationEntry.IDENTITY_PASSWORD,
                                    "sip_password");
mConfigurationService.putString(NgnConfigurationEntry.NETWORK_PCSCF_HOST, 
                                    "sip_server_host");
mConfigurationService.putInt(NgnConfigurationEntry.NETWORK_PCSCF_PORT, 
                                    "sip_server_port");
mConfigurationService.putString(NgnConfigurationEntry.NETWORK_REALM,
                                    "sip_domain");
// By default, using 3G for calls disabled
mConfigurationService.putBoolean(NgnConfigurationEntry.NETWORK_USE_3G,
                                    true);
// You may want to leave the registration timeout to the default 1700 seconds
mConfigurationService.putInt(NgnConfigurationEntry.NETWORK_REGISTRATION_TIMEOUT,
                                3600);
mConfigurationService.commit();
{% endhighlight %}

The configuration service is persistent. This means you only have to set this values once - say the first time the user logs in. If this has been done (doesn't matter what activity or when), then you can send the registration request.

{% highlight java %}
public void initializeManager {
  if(!mEngine.isStarted()){
    if(!mEngine.start()){
      Log.e("DEBUG", "Failed to start the engine :(");
      return;
    }
  }
  
  // Register
  if(!mSipService.isRegistered()){
    mSipService.register(this);
  }
}
{% endhighlight %}

So how do we make calls? Simple. Create an outgoing call session. For the sake of this post, we will do the same thing we did earlier with Android SIP API - intercept calls from the phone's dialer

{% highlight java %}
public class OutgoingCallReceiver extends BroadcastReceiver {
  
  @Override
  public void onReceive(Context context, Intent intent) {
    String phoneNumber = getResultData();
    if (phoneNumber == null) {
      phoneNumber = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER);
    }
    
    setResultData(null);

    final String validUri = NgnUriUtils.makeValidSipUri(
      String.format("sip:%s@%s", phoneNumber, Constants.Plivo.SIP_DOMAIN));
    if(validUri == null){
      Log.e("DEBUG", "Invalid number");
      return;
    }
    
    NgnAVSession avSession = NgnAVSession.createOutgoingSession(
      NgnEngine.getInstance().getSipService().getSipStack(), NgnMediaType.Audio);
    avSession.makeCall(validUri);
  }
}
{% endhighlight %}

You will want to start a new activity (let's call it MakeCallActivity) in that broadcast that will show the user the necessary action buttons (at least an "End call" button) and interact call state with the user. You should also find a way to pass call state from the CallStateReceiver (shown earlier) to this MakeCallActivity. What I did was send call state broadcasts from CallStateReceiver and create listeners within my MakeCallActivity (and ReceiveCallActivity). This will enable you know call states within calls and how to update the UI as necessary. 

Receiving calls is just as easy. Remember our CallStateReceiver? Just start a new activity (let's call it ReceiveCallActivity) to handle incoming calls in the **incoming** call state.

{% highlight java %}
...
switch(callState){
  case INCOMING:
    Log.i("DEBUG", "Incoming call");
    // Ringtone
    mEngine.getSoundService().startRingTone();
    // Start a ReceiveActivity                	
    Intent i = new Intent(context.getApplicationContext(),
            ReceiveCallActivity.class);
    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    i.putExtra(Constants.SIP_SESSION_ID, avSession.getId());
    i.putExtra(Constants.PHONE_NUMBER_EXTRA, 
            avSession.getRemotePartyDisplayName());
    context.startActivity(i);
{% endhighlight %}

The activity:

{% highlight java %}
public class ReceiveCallActivity extends Activity {

  private NgnAVSession mSession;
    
  @Override
  public void onCreate(Bundle savedInstanceState) {   	
    super.onCreate(savedInstanceState);
    // Receive UI ('Accept' & 'Reject' button, caller number and co)
    setContentView(R.layout.call_in);

    Bundle extras = getIntent().getExtras();
        if(extras != null){
        mSession = NgnAVSession.getSession(extras.getLong(Constants.SIP_SESSION_ID));
        // Phone number -> extras.getString(Constants.PHONE_NUMBER_EXTRA)
    }
    
    // Wake the screen and ignore "face touches"
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON|
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED|
                WindowManager.LayoutParams.FLAG_IGNORE_CHEEK_PRESSES);
    
  }

  public void acceptBtnClicked(View v){
    mSession.acceptCall();
  }
  
  public void rejectBtnClicked(View v){
        if(mSession != null){
            mSession.hangUpCall();
        }
  }
  ...
{% endhighlight %}

## In conclusion

It is interesting to see and experiment with the many possibilities of SIP on Android. Doubango may not be the perfect library for you. If you are a core SIP developer, you may want to consider the low level APIs like JAIN and MjSIP.

I have been using the Callbase for Android app (alpha) to make and receive calls on my Moto G. (I don't have a SIM. I created a personal organisation and purchased a US number on Callbase). It works ok but still needs some face lift here and there. Once the app is ok for public use, we will release for beta.

![Icon](http://i.imgur.com/710nEGW.jpg)![Login screen](http://i.imgur.com/wXn77tZ.jpg)
