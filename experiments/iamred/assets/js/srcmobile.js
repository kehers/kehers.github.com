// Opeyemi Obembe (@kehers)

var canvas = this.__canvas = new fabric.Canvas('c');
cw = 640;


//function createCanvas() {
  // I Am
  canvas.add(new fabric.Text('I Am', {
    fontFamily: 'Oswald',
    fontWeight: 700,
    fontSize: 100,
    left: 30,
    top: 30,
    fill: 'white',
    hasControls: false,
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
    var left = 80;
    if (i == 1)
      left = 83;
    else if (i == 2)
      left = 92;
    canvas.add(new fabric.Text(input[i], {
      fontFamily: 'Oswald',
      fontWeight: 700,
      cursorColor: 'white',
      fontSize: 60,
      left: 75,
      top: y+10,
      fill: 'white',
      selectable: false
    }));

    y += 100;
  }

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
  fabric.Image.fromURL('assets/images/cover.jpg', function(img) {
    img.evented = false;
    img.selectable = false;
    img.left = 25;
    img.top = y
    canvas.add(img);
  });

  // Text
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

// Load fonts
WebFontConfig = {
  google: { families: [ 'Oswald:700', 'Montserrat' ] }
};
var src = ('https:' === document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
$.getScript(src, function(data) {
    canvas.setActiveObject(canvas.item(0));
    canvas.renderAll();
});

$('#download').on('click', function(){

  // Hide lines and frame
  canvas.forEachObject(function(obj){
    if (obj.id && (obj.id.indexOf('line_') > -1 || obj.id.indexOf('frame') > -1))
      obj.set({opacity: 0});
  });

  if (ga)
    ga('send', 'event', 'Image', 'download');

  var ios = /iPad|iPhone|iPod/.test(navigator.platform);
  //if (true) {
  if (ios) {
    // Save as image and to another page
    $('#image').attr({
      src: canvas.toDataURL("image/png")
    });
    $('.image-wrp').show();
    $('.image-wrp').css({width: $('canvas').width()+'px'});
    $('.container').hide();
    $('.btn-container').hide();
    //$('.grid-wrp').hide();
    return false;
  }
  else {
    $(this).attr({
      href: canvas.toDataURL("image/png"),
      download: 'red.png'
    });
  }

  // Show lines and frame
  canvas.forEachObject(function(obj){
    if (obj.id && (obj.id.indexOf('line_') > -1 || obj.id.indexOf('frame') > -1))
      obj.set({opacity: 1});
  });

  canvas.renderAll();
});

$('.btn-container').hide();

// Scale

var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
if (width < 640) {
  var scaleRatio = width/640;
  var dim = 640*scaleRatio;
  canvas.setWidth(dim);
  canvas.setHeight(dim);
  canvas.setZoom(scaleRatio);
  cw = dim;
  // Get canvas width
  $('.btn-container').css({width: $('canvas').width()+'px'});
  //$('.grid-wrp').css({width: $('canvas').width()+'px'});
}

// Set image boundaries
var bounds = {top: cw/2, left: cw/2};
canvas.on("object:moving", function(e){
    if (e.target.id && e.target.id.indexOf('image') > -1) {
      var obj = e.target;
      obj.setCoords();
      if (obj.getBoundingRect().top > 0 ||
          obj.getBoundingRect().top + obj.getBoundingRect().height < cw)
        obj.top = bounds.top;
      else
        bounds.top = obj.top
      if (obj.getBoundingRect().left > 0 ||
          obj.getBoundingRect().left  + obj.getBoundingRect().width < cw)
        obj.left = bounds.left;
      else
        bounds.left = obj.left;
    }
});
