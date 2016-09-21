// Opeyemi Obembe (@kehers)

(function() {
    var canvas = this.__canvas = new fabric.Canvas('c');
    var added_photo = false;

    // Gradient
    fabric.Image.fromURL('assets/images/overlay.png', function(img) {
      img.evented = false;
      img.selectable = false;
      canvas.add(img);
      canvas.sendToBack(img);

      var bg = new fabric.Rect({
        top: 0,
        left: 0,
        width: 640,
        height: 640,
        fill: 'rgb(219,64,43)',
        selectable: false,
        evented: false
      });
      canvas.add(bg);
      canvas.sendToBack(bg);
    });

    // Border
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

    //function createCanvas() {
      // I Am
      canvas.add(new fabric.Text('I Am', {
        fontFamily: 'Oswald',
        fontWeight: 700,
        fontSize: 100,
        left: 30,
        top: 30,
        fill: 'white',
        selectable: false
      }));
      // RED
      var red = ['R', 'E', 'D'];
      var y = 140;var it = [];
      for(var i=0;i<3;i++) {
        canvas.add(new fabric.Text(red[i], {
          fontFamily: 'Oswald',
          fontWeight: 700,
          fontSize: 80,
          left: 30,
          top: y,
          fill: 'rgb(219,64,43)',
          selectable: false
        }));
        //
        canvas.add(new fabric.Line([80, y+80, 380, y+80], {
            id: 'line_'+i,
            stroke: 'white',
            selectable: false,
            hasControls: false
        }));
        canvas.add(new fabric.Textbox('', {
          id: 'textbox_'+red[i].toLowerCase(),
          fontFamily: 'Oswald',
          fontWeight: 700,
          cursorColor: 'white',
          fontSize: 60,
          width: 240,
          left: 80,
          top: y+10,
          fill: 'white',
          //backgroundColor: 'white',
          editingBorderColor: 'transparent',
          lockMovementX: true,
          lockMovementY: true,
          hasControls: false,
          hoverCursor: 'text'
        }));
        y += 100;
      }
      // Set Editing on box click
      canvas.on({
          'object:selected': function selectedObject(e) {
            if (e.target.id && e.target.id.indexOf('textbox_') > -1) {
              var id = canvas.getObjects().indexOf(e.target);
              canvas.item(id).enterEditing();
            }
          }
      });


      // #Iamred
      canvas.add(new fabric.Text('i­-am-­red.com #IamRED', {
        fontFamily: 'Montserrat',
        fontSize: 18,
        left: 30,
        top: y,
        fill: 'white',
        selectable: false
      }));
      y += 35;
      // HR
      canvas.add(new fabric.Line([20, y, 620, y], {
          stroke: 'white',
          selectable: false
      }));
      y += 20;

      // Album art
      /*canvas.add(new fabric.Rect({
        left: 30,
        top: y,
        fill: 'white',
        width: 120,
        height: 120,
        selectable: false
      }));*/
      fabric.Image.fromURL('assets/images/cover.jpg', function(img) {
        img.evented = false;
        img.selectable = false;
        img.left = 25;
        img.top = y
        canvas.add(img);
      });

      // Text
      //
      var txt = "Tiwa Savage has released her brand new album 'R.E.D' which\nis an acronym that defines the album and stands for 'Romance,\nExpression and Dance'. To celebrate this, Tiwa invites you\nall, especially her fans, to join her and define yourselves\nand things that you are passionate about in R.E.D by visiting\ni­-am­-red.com";
      canvas.add(new fabric.IText(txt, {
        fontFamily: 'Montserrat',
        fontSize: 15,
        left: 155,
        top: y+2,
        fill: 'white',
        selectable: false,
        editable: false,
        shadow: '1px 1px 1px #444',
        styles: {
          1: {
            53: { fontWeight: '700' }
          },
          2: {
            0: { fontWeight: '700' },
            15: { fontWeight: '700' }
          }
        }
      }));

    //}

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
            var image = new fabric.Image(imgObj);
            EXIF.getData(imgObj, function() {
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

              var scale = 1;
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

              canvas.add(image);
              // index of 1
              canvas.sendToBack(image);
              canvas.bringForward(image);
              canvas.renderAll();

              // Show slider and download button
              $('#scale-control').show();
              $('#download').show();
              $('#restart').show();

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
              });
            });
          }
        }
        reader.readAsDataURL(file);
    });

    // Load fonts
    WebFontConfig = {
      google: { families: [ 'Oswald:700', 'Montserrat' ] }
    };
    var src = ('https:' === document.location.protocol ? 'https' : 'http') +
          '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    $.getScript(src, function(data) {
        canvas.renderAll();
        canvas.renderAll();

        $('.add').show();
    });

    $('button.add').on('click', function(){
      $('#file-input').trigger('click');
    });
    $('#restart').on('click', function(){
      // Remove photo.
      if (added_photo) {
        canvas.item(1).remove();
        added_photo = false;
      }
      // Clear texts
      canvas.forEachObject(function(obj){
        if (obj.id && obj.id.indexOf('textbox_') > -1) {
          obj.setText('');
        }
      });

      canvas.renderAll();
    });
    $('#download').on('click', function(){

      ga('send', 'event', 'Image', 'download');

      // Hide lines and frame
      canvas.forEachObject(function(obj){
        if (obj.id && (obj.id.indexOf('line_') > -1 || obj.id.indexOf('frame') > -1))
          obj.set({opacity: 0});
      });

      $(this).attr({
        href: canvas.toDataURL("image/png"),
        download: 'red.png'
      });

      // Show lines and frame
      canvas.forEachObject(function(obj){
        if (obj.id && (obj.id.indexOf('line_') > -1 || obj.id.indexOf('frame') > -1))
          obj.set({opacity: 1});
      });

      canvas.renderAll();
    });

    $('#scale-control').hide();
    $('#download').hide();
    $('#restart').hide();

    // Set image boundaries
    var bounds = {top: 320, left: 320};
    canvas.on("object:moving", function(e){
        if (e.target.id && e.target.id.indexOf('image') > -1) {
          var obj = e.target;
          obj.setCoords();
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
    });

    var lastid = '';
    $('.recommended').on('click', function() {
      var id = $(this).data('id');
      $('.autocomplete-suggestions').hide();
      if (id == lastid) {
        lastid = '';
        return false;
      }
      $('#'+id).show();
      lastid = id;
      return false;
    });
    $('.autocomplete-suggestion').on('click', function(e) {
      e.preventDefault();
      var value = $(this).html().substring(1);
      // Set value
      canvas.forEachObject(function(obj){
        if (obj.id && obj.id.indexOf('textbox_'+lastid) > -1) {
          obj.setText(value);
          obj.enterEditing();
          canvas.setActiveObject(obj);
          canvas.renderAll();
          $('#'+lastid).hide();
          lastid = '-';
          return;
        }
      });
    });

    function resizeCanvas() {
      var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      if (width < 640) {
        var scaleRatio = width/640;
        var dim = 640*scaleRatio;
        $('.container').css({width: dim+'px', height: dim+'px', marginTop: '0'});
        $('.add').css({top: '20px', right: '20px', marginLeft: '0'});
        canvas.setWidth(dim);
        canvas.setHeight(dim);
        canvas.setZoom(scaleRatio);
      }
    }
    // Responsive scaling
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
})();