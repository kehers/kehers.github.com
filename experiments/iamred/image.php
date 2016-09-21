<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <title>#IamRED ­- The RED Album From Tiwa Savage</title>
  <meta name="description" content="">
  <meta name="author" content="Opeyemi Obembe (@kehers)">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <link href='https://fonts.googleapis.com/css?family=Oswald:700' rel='stylesheet' type='text/css'>
  <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>

  <link rel="stylesheet" href="assets/css/normalize.css">
  <link rel="stylesheet" href="assets/css/skeleton.css">
  <link rel="stylesheet" href="assets/css/mobile.css?e">

  <script type="text/javascript" src="assets/js/jquery-2.1.3.min.js"></script>
  <script src="assets/js/exif.js"></script>

  <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
</head>
<body>

  <div class="btn-container">
    <div><a href="#" class="button" id="download">Download</a> <a href="mobile.html" class="button">Restart</a></div>
    <div><input type="range" id="scale-control" step="0.1"></div>
  </div>

  <div class="container" style="width:100%;padding:0">
    <div class="row">
      <div class="eight offset-by-two columns">
        <canvas id="c" width="640" height="640"></canvas>
        <p>&nbsp;</p>
      </div>
    </div>
  </div>

  <div class="image-wrp" style="text-align:center;display:none">
    <img id="image" download="red.png">
    <p style="box-sizing:border-box;padding:10px;font-size:140%">Long press image and select "Save Image" to download the image</p>
  </div>

  <script type="text/javascript" src="assets/js/fabric.js"></script>
  <script type="text/javascript">
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-71483131-1', 'auto');
    ga('send', 'pageview');

    var input = ['<?= $_POST['r']; ?>', '<?= $_POST['e']; ?>', '<?= $_POST['d']; ?>'];
  </script>
  <script type="text/javascript" src="assets/js/srcmobile.js?i"></script>
  <script type="text/javascript">
    var imgObj = new Image();
    imgObj.src = '<?= $_POST['src']; ?>';
    imgObj.onload = function () {
      var image = new fabric.Image(imgObj);
      var scale = 1;
      EXIF.getData(imgObj, function() {
        //console.log(EXIF.getTag(this, 'Orientation'));
        switch(EXIF.getTag(this, 'Orientation')){
           case 8:
             image.setAngle(-90);
             break;
           case 3:
             image.setAngle(180);
             break;
           case 6:
             image.setAngle(90);
             break;
        }

        if (image.width < image.height)
          scale = 640/image.width;
        else if (image.height < image.width ||
           (image.height == image.width && image.width < 640))
          scale = 640/image.height;

        image.set({
          id: 'image',
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          top: 320,
          left: 320,
          hasControls: false,
        });

        // Gradient
        fabric.Image.fromURL('assets/images/overlay.png', function(img) {
          img.evented = false;
          img.selectable = false;

          // Send ovelrlay to back
          canvas.add(img);
          canvas.sendToBack(img);

          // Send image
          canvas.add(image);
          canvas.sendToBack(image);
          canvas.setActiveObject(image);

          // Add frame
          canvas.add(new fabric.Rect({
            id: 'frame',
            top: 0,
            left: 0,
            width: 635,
            height: 635,
            fill: 'transparent',
            stroke: 'white',
            strokeWidth: 5,
            selectable: false,
            evented: false
          }));
        });

        //canvas.bringForward(image);
        canvas.renderAll();

        // Show slider and download button
        $('.btn-container').show();

        // Scale control
        // set minumum to current scale
        var min = image.getScaleX();
        $('#scale-control').attr({'min':min, 'value':min, 'max':min*3});

        $('#scale-control').on('change', function() {
          image.scale(parseFloat(this.value)).setCoords();
          image.set({
            top: 320,
            left: 320
          });
          canvas.renderAll();
        }); // scale control
      }); // exif
    }
  </script>
</body>
</html>
