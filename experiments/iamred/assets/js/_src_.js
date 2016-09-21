  (function() {
      var canvas = this.__canvas = new fabric.Canvas('c');
      var added_photo = false;


        // Border
        var rect = new fabric.Rect({
          top: 0,
          left: 0,
          width: 635,
          height: 635,
          fill: 'transparent',
          stroke: 'white',
          strokeWidth: 5,
          selectable: false,
          evented: false
      });
      canvas.add(rect);
      //function createCanvas() {
        // Gradient
        fabric.Image.fromURL('assets/images/overlay.png', function(img) {
          img.evented = false;
          img.selectable = false;
          canvas.add(img);
          canvas.sendToBack(img);
        });
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
          var it = new fabric.Textbox('', {
            id: 'textbox_'+i,
            fontFamily: 'Oswald',
            fontWeight: 700,
            fontSize: 60,
            width: 240,
            left: 80,
            top: y+10,
            fill: 'white',
            editingBorderColor: 'transparent',
            lockMovementX: true,
            lockMovementY: true,
            hasControls: false,
            hoverCursor: 'text'
          });
          canvas.add(new fabric.Line([80, y+80, 300, y+80], {
              id: 'line_'+i,
              stroke: 'white',
              selectable: true
          }));
          canvas.add(it);
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
        canvas.add(new fabric.Text('#IamRED | i­-am-­red.com', {
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
        canvas.add(new fabric.Rect({
          left: 30,
          top: y,
          fill: 'white',
          width: 120,
          height: 120,
          selectable: false
        }));

        // Text
        //
        var txt = "Tiwa Savage is releasing her R.E.D. album on 12/15/15\nwhich is an Acronym that defines her. It stands for\nRomance, Expression and Dance. She has invited her fans\nand the whole internet to define themselves in R.E.D. by\nvisiting i­-am-­red.com";
        canvas.add(new fabric.Text(txt, {
          fontFamily: 'Montserrat',
          fontSize: 15,
          left: 170,
          top: y+10,
          fill: 'white',
          selectable: false
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
                canvas.item(0).remove();
              }

              added_photo = true;
              var image = new fabric.Image(imgObj);
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
              canvas.sendToBack(image);
              canvas.renderAll();

              // Show slider and download button
              $('#scale-control').show();
              $('#download').show();

              // Scale control
              // set minumum to current scale
              var min = image.getScaleX();
              $('#scale-control').attr({'min':min, 'value':min, 'max':min*3});

              $('#scale-control').on('change', function() {
                image.scale(parseFloat(this.value)).setCoords();
                canvas.renderAll();
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
      });

      $('button.add').on('click', function(){
        $('#file-input').trigger('click');
      });
      $('#download').on('click', function(){
        // Hide lines
        canvas.forEachObject(function(obj){
          if (obj.id && obj.id.indexOf('line_') > -1)
            obj.set({opacity: 0});
        });

        $(this).attr({
          href: canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"),
          download: 'red.png'
        });

        // Show lines
        canvas.forEachObject(function(obj){
          if (obj.id && obj.id.indexOf('line_') > -1)
            obj.set({opacity: 1});
        });
        canvas.renderAll();
      });

      $('#scale-control').hide();
      $('#download').hide();
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

  })();