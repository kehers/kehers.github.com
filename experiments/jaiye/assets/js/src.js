// Opeyemi Obembe (@kehers)

$(window).load(function() {
  var canvas = this.__canvas = new fabric.Canvas('c');
  var added_photo = false; // There a photo now?
  var black_stamped = true;
  var watermark = document.getElementById('watermark');
  var stamp, cropper, image, frame;
  var scale, scaleRatio = 1;
  var screenWidth = 640;

  function addStamp(imgElement, left, top) {
    /*if (!left) {
      // Get pos
      left = stamp.left;
      top = stamp.top;
      canvas.remove(stamp);
      stamp = null;
    }*/

    stamp = new fabric.Image(imgElement, {
        evented: true,
        selectable: true,
        hasControls: false,
        originX: "center",
        originY: "center",
        left: left,
        top: top,
        scaleX: 0.6,
        scaleY: 0.6,
        hasBorders: false
      });
    canvas.add(stamp);
  }

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  // Gradient
  fabric.Image.fromURL('assets/images/overlay.png', function(img) {
    img.evented = false;
    img.width = screenWidth;
    img.height = screenWidth;
    img.selectable = false;
    canvas.add(img);
    canvas.sendToBack(img);
  });

  // Border
  frame = new fabric.Rect({
    id: 'frame',
    top: 0,
    left: 0,
    width: screenWidth - 2,
    height: screenWidth - 2,
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 2,
    selectable: false,
    evented: false
  });
  canvas.add(frame);

  // Upload image

  $('#file-input').change(function(e) {
    var file = e.target.files[0],
        imageType = /image.*/;

    if (!file.type.match(imageType))
        return;

    var reader = new FileReader();
    reader.onload = function (e) {
      var imgObj = new Image();
      imgObj.src = e.target.result;
      imgObj.onload = function () {
        // Remove added photo if exist
        if (added_photo) {
          canvas.item(1).remove();
        }

        added_photo = true;
        image = new fabric.Image(imgObj);
        EXIF.getData(imgObj, function() {
          // Exif stuff
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

          scale = 1;

          var crop_dim = screenWidth - 20, _top = screenWidth/2, _left = screenWidth/2;
          if (image.height == image.width) {
            scale = screenWidth/image.height;
            // /alert(screenWidth+" "+scale+" "+image.width+" "+image.height);
          }
          else if (image.width > image.height) {
            scale = screenWidth/image.width;
            var _h = Math.round(screenWidth * image.height/image.width);
            canvas.setHeight(_h);
            frame.setHeight(_h - 2);
            //alert(_h+" "+screenWidth+" "+scale+" "+image.width+" "+image.height);
            _top = _h/2;
            crop_dim = _h - 20;
          }
          else if (image.width < image.height) {
            scale = screenWidth/image.height;
            var _w = Math.round(screenWidth * image.width/image.height);
            // alert(_w+" "+screenWidth+" "+scale+" "+image.width+" "+image.height);
            $('.container').css({width: _w+'px'});
            canvas.setWidth(_w);
            frame.setWidth(_w - 2);
            _left = _w/2;
            crop_dim = _w - 20;
          }

          // Adjust frames & overlay
          image.set({
            id: 'image',
            originX: "center",
            originY: "center",
            scaleX: scale,
            scaleY: scale,
            top: _top,
            left: _left,
            hasControls: false,
            selectable: false,
            evented: false
          });

          canvas.add(image);
          // index of 1
          canvas.sendToBack(image);
          canvas.bringForward(image);

          addStamp(watermark, _top, _left);

          canvas.renderAll();

          $('.pre').hide();
          $('.canvas').show();

          $('.dwn-wrp').show();

          // Show slider and download button
          //$('#scale-control').show();
        });
      }
    }
    reader.readAsDataURL(file);
  });

  $('.add').on('click', function(){
    $('#file-input').trigger('click');
    return false;
  });
  /*$('#restart').on('click', function(){
    // Remove photo.
    if (added_photo) {
      canvas.item(1).remove();
      added_photo = false;
    }
    canvas.renderAll();
  });//*/
  $('#download').on('click', function(){

    //ga('send', 'event', 'Image', 'download');

    // Hide frame
    /*canvas.forEachObject(function(obj){
      if (obj.id && obj.id.indexOf('frame') > -1)
        obj.set({opacity: 0});
    });*/
    frame.visible = false;

    // Zoom in to download
    // canvas.setWidth(1080);
    // canvas.setHeight(1080);
    // canvas.setZoom(1080/screenWidth);

    var ios = /iPad|iPhone|iPod/.test(navigator.platform);
    if (ios) {
      // Save as image and to another page
      $('#image').attr({
        src: canvas.toDataURL("image/png")
      });
      $('.image-wrp').show();
      $('.container, .btn-container').hide();
    }
    else {
      var blob = dataURLtoBlob(canvas.toDataURL("image/png"));

      $(this).attr({
        href: URL.createObjectURL(blob),
        download: 'jaiye.png'
      });
    }

    // // Revert zoom
    // canvas.setWidth(screenWidth);
    // canvas.setHeight(screenWidth);
    // canvas.setZoom(1);
    resizeCanvas();

    // Show lines and frame
    /*canvas.forEachObject(function(obj){
      if (obj.id && obj.id.indexOf('frame') > -1)
        obj.set({opacity: 1});
    });*/
    frame.visible = true;

    canvas.renderAll();
  });

  // Set image boundaries
  /*var bounds = {top: 320, left: 320};
  canvas.on("object:moving", function(e){
      if (e.target.id && e.target.id.indexOf('cropper') > -1) {
        var obj = e.target;
        obj.setCoords();
        console.log(obj.top);
        console.log(obj.left);
        if (obj.getBoundingRect().top > 0 ||
            obj.getBoundingRect().top + obj.getBoundingRect().height < 640)
          obj.top = bounds.top;
        else
          bounds.top = obj.top
        if (obj.getBoundingRect().left > 0 ||
            obj.getBoundingRect().left  + obj.getBoundingRect().width < 640)
          obj.left = bounds.left;
        else
          bounds.left = obj.left;
      }
  });//*/

  function resizeCanvas() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 640) {
      /*scaleRatio = width/640;
      var dim = 640*scaleRatio;
      console.log("Scale ratio: "+scaleRatio);*/
      screenWidth = width;
      canvas.setWidth(screenWidth);
      canvas.setHeight(screenWidth);
      frame.setWidth(screenWidth - 2);
      frame.setHeight(screenWidth - 2);

      $('.container').css({width: screenWidth+'px'});

      /*$('.canvas-wrp, .container').css({width: dim+'px', height: dim+'px', marginTop: '0'});
      $('.canvas-wrp, .logo-wrp').css({float: 'none'});
      $('.logo-wrp').css({marginTop: 0, textAlign: 'center', width: '100%'});
      $('.btn-container').css({width: dim+'px'});
      $('.logo-wrp img').css({width: '45%'});//
      canvas.setWidth(dim);
      canvas.setHeight(dim);
      canvas.setZoom(scaleRatio);//*/
    }
  }

  // Responsive scaling
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, false);
});
