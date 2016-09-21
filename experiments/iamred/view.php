<?php
$url = "http://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
$image = preg_replace('/view.+$/', '', $url).'assets/files/'.$_GET['file']{0}.'/'.$_GET['file'];
?>
<!DOCTYPE html>
<html lang="en">
<head>

  <!-- Basic Page Needs
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">
  <title>Hey I am officially Green, you can create yours on officialgreen.org</title>
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- Mobile Specific Metas
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- FONT
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link href="//fonts.googleapis.com/css?family=Montserrat|Fjalla+One" rel="stylesheet" type="text/css">

  <!-- CSS
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="stylesheet" href="assets/css/normalize.css">
  <link rel="stylesheet" href="assets/css/skeleton.css">
  <link rel="stylesheet" href="assets/css/style.css">

<meta property="og:title" content="#iamred" />
<meta property="og:type" content="Sharing Widgets" />
<meta property="og:url" content="<?= $url; ?>" />
<meta property="og:image" content="<?= $image; ?>" />
<meta property="og:site_name" content="I am green" />

</head>
<body>

  <div class="container avi">
    <div class="row">
      <div class="three columns">&nbsp;</div>
      <div class="six columns">
        <div>
          <img src="<?= $image; ?>" id="avi">
	        <p style="text-align:center"><a href="./" class="button">Get yours</a> <a href="<?= $image; ?>" class="download button">Download</a></p>
      	</div>
      </div>
    </div>
  </div>

</body>
</html>
