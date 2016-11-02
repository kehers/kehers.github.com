---
published: true
title: OAuth 2 on Android
layout: post
---
Implementing OAuth 2 on Android follows the exact flow as is on web. Taking Github as an example provider, the OAuth [web] flow is this -

1. **Redirect users to GitHub for authentication**
The user clicks a button (say Login) on your website and you redirect him to ```https://github.com/login/oauth/authorize?client_id={id}&scope={scope}```. The page shows a login form.
2. **GitHub redirects back to your callback URL with a "code" URL parameter**
Once he logs in with the form above and allows your app, Github redirects to your callback URL. The callback URL is a URL you have configured with Github in your application settings. You can also pass one via the ```redirect_uri``` parameter to the authorization URL in 1 like this ```https://github.com/login/oauth/authorize?client_id={id}&scope={scope}&redirect_uri=http://example.com/github```. Github then redirects back to ```http://example.com/github?code=1234```
3. **You post the "code" to Github in exchange for the access token**
Using cURL or similar library, you POST the code to ```https://github.com/login/oauth/access_token```. The response will be something like this ```access_token=e72e16&scope=user%2Cgist&token_type=bearer```. Extract the access_token parameter.
4. **Access the API with the access token**

(You can find the Github's OAuth documentation here [developer.github.com/v3/oauth/](https://developer.github.com/v3/oauth/). This flow is basically the same with all OAuth 2 providers.)

While this is a supposed web flow, it is not a hard thing to replicate in an Android app. Android has a [WebView class](http://developer.android.com/reference/android/webkit/WebView.html) that allows you embed your own browser and interact with web pages. That solves 1 easily. So within our app, we can embed a webview that loads Github's login page for the user to authenticate himself.

{% highlight xml %}
// Remember, add internet permission to your manifest
// AndroidManifest.xml
<uses-permission android:name="android.permission.INTERNET" />

// The webview layout
// layout/webview.xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
  xmlns:android="http://schemas.android.com/apk/res/android"
  android:orientation="vertical"
  android:layout_width="fill_parent"
  android:layout_height="fill_parent"
  >
  <WebView
    android:id="@+id/webview"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent"
    />
</LinearLayout>
{% endhighlight %}

{% highlight java %}
public void githubBtnClicked(View v) {
  setContentView(R.layout.webview);
  final WebView webview = (WebView) findViewById(R.id.webview);
  // Load Github's auth URL
  webview.loadUrl("https://github.com/login/oauth/authorize?client_id={id}&scope={scope}");
}
{% endhighlight %}

![](http://i.imgur.com/7p0pGNx.png)

However, since this is a mobile application and not a web application, the callback URL in step 2 does us no good. Remember, what we need is the code parameter. So we want to be able to intercept the code parameter from the webview as Github tries to redirect back to the callback URL. Interestingly, there are a couple of ways to do that in the WebView class. But first, we have to let the WebView know we want to receive notifications and requests related to the view via a [WebViewClient](http://developer.android.com/reference/android/webkit/WebViewClient.html). So we set a WebViewClient and overwrite the onPageStarted method. onPageStarted is called when a page starts loading. We can use this to know when the callback URL is loading and intercept the code parameter.

{% highlight java %}
public void githubBtnClicked(View v) {
  setContentView(R.layout.webview);
  final WebView webview = (WebView) findViewById(R.id.webview);
  webview.loadUrl("https://github.com/login/oauth/authorize?client_id={id}&scope={scope}");
  webview.setWebViewClient(new WebViewClient() {
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
      // Is this the callback url?
      String fragment = "?code=";
      int start = url.indexOf(fragment);
      if (start > -1) {
        // Yeah, stop loading then
        webview.stopLoading();
        // And get the code parameter
        String code = url.substring(start+fragment.length(), url.length());
      }
    }
  });
}
{% endhighlight %}

Now we have our code, step 3, send it to Github in exchange for an access token.

{% highlight java %}
public void githubBtnClicked(View v) {
  setContentView(R.layout.webview);
  final WebView webview = (WebView) findViewById(R.id.webview);
  webview.loadUrl("https://github.com/login/oauth/authorize?client_id={id}&scope={scope}");
  webview.setWebViewClient(new WebViewClient() {
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
      String fragment = "?code=";
      int start = url.indexOf(fragment);
      if (start > -1) {
        webview.stopLoading();
        final String code = url.substring(start+fragment.length(), url.length());
        // Remember, never run network processes within UI threads
        // ...so we use asynctask instead
        AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>() {
          @Override
          protected Void doInBackground(Void... p) {
            try {
              // Create the JSON parameters to send to Github
              JSONObject params = new JSONObject();
              params.put("client_id", "UR_GITHUB_CLIENT_ID");
              params.put("client_secret", "UR_GITHUB_CLIENT_SECRET");
              params.put("code", code);

              // Post
              String data = null;
              URL url = new URL("https://github.com/login/oauth/access_token");
              String body = params.toString();  byte[] bytes = body.getBytes();
              HttpURLConnection conn = null;
              try {
                conn = (HttpURLConnection) url.openConnection();
                conn.setDoOutput(true);
                conn.setUseCaches(false);
                conn.setFixedLengthStreamingMode(bytes.length);
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("Accept", "application/json");
                // Github requires a user agent header
                conn.setRequestProperty("User-Agent", "My Oauth app");

                OutputStream out = conn.getOutputStream();
                out.write(bytes);
                out.close();

                InputStream is = null;
                try {
                  is = conn.getInputStream();
                }
                catch (IOException e) {
                  //e.printStackTrace();
                  // Hack for 4xx http headers
                  is = conn.getErrorStream();
                }

                BufferedReader rd = new BufferedReader(new InputStreamReader(is));
                StringBuffer response = new StringBuffer();
                String line;
                while((line = rd.readLine()) != null) {
                  response.append(line).append("\n");;
                }
                rd.close();
                data = response.toString();
              } finally {
                if (conn != null) {
                  conn.disconnect();
                }
              }

              try {
                JSONObject json = new JSONObject(data);
                String token = json.getString("access_token");

                // Now we have the token
                // Probably save it for subsequent API calls here

                return null;
              } catch (JSONException e) {
                // Log.e(TAG, e.getMessage());
              }
            }
            catch (IOException e) {
              // Log.e(TAG, e.getMessage());
            }
            catch (JSONException e) {
              // Log.e(TAG, e.getMessage());
            }

            return null;
          }

          @Override
          protected void onPostExecute(Void result) {
            // We are done and back to the UI thread
            // Show status or a screen here
          }
        };
        task.execute();
      }
    }
  });
}
{% endhighlight %}

As you can see, getting the access_token wasn't difficult. Now we just save it and use it to make subsequent requests to the API.

OAuth 1 on the other hand is more challenging. The flow is more complex and involves lots of crypto and signing kungfu. Your best bet is to find a library that has done the heavy lifting for you. And there are. I hope to write about that in the next piece.

For a real world example of OAuth 2 implementation, check out Tinypress for Android ([play.google.com/store/apps/details?id=co.tinypress.android](https://play.google.com/store/apps/details?id=co.tinypress.android))