<?php
if ($_FILES["file"]["error"] == UPLOAD_ERR_OK) {
  $paths = pathinfo($_FILES["file"]["name"]);
  $ext = $paths['extension'];
  $name = md5_file($_FILES["file"]["tmp_name"]).'.'.$ext;
  $src = "assets/files/".$name{0}.'/'.$name;
  if (!move_uploaded_file($_FILES["file"]["tmp_name"], $src)) {
    $_error = 'There has been an error uploading '.$_FILES["file"]["name"].'. Try again later.';
  }
}
else {
	$errorArray = array(
	    1=>"The uploaded file exceeds the upload_max_filesize directive in php.ini",
	    2=>"The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form",
	    3=>"The uploaded file was only partially uploaded",
	    4=>"No file was uploaded",
	    6=>"Missing a temporary folder"
	);
	$_error = $errorArray[$_FILES["file"]["error"]];
}

if (isset($_error)) {
	echo json_encode(array('error' => $_error));
	exit;
}

//$src = 'assets/images/me.jpg';
define('THUMBNAIL_IMAGE_MAX_WIDTH', 640);
define('THUMBNAIL_IMAGE_MAX_HEIGHT', 640);

function generate_image_thumbnail($source_image_path) {
    list($source_image_width, $source_image_height, $source_image_type) = getimagesize($source_image_path);
    switch ($source_image_type) {
        case IMAGETYPE_GIF:
            $source_gd_image = imagecreatefromgif($source_image_path);
            break;
        case IMAGETYPE_JPEG:
            $source_gd_image = imagecreatefromjpeg($source_image_path);
            break;
        case IMAGETYPE_PNG:
            $source_gd_image = imagecreatefrompng($source_image_path);
            break;
    }
    if ($source_gd_image === false) {
        return false;
    }
    $source_aspect_ratio = $source_image_width / $source_image_height;
    $thumbnail_aspect_ratio = THUMBNAIL_IMAGE_MAX_WIDTH / THUMBNAIL_IMAGE_MAX_HEIGHT;
    if ($source_image_width <= THUMBNAIL_IMAGE_MAX_WIDTH && $source_image_height <= THUMBNAIL_IMAGE_MAX_HEIGHT) {
        $thumbnail_image_width = $source_image_width;
        $thumbnail_image_height = $source_image_height;
    } elseif ($thumbnail_aspect_ratio > $source_aspect_ratio) {
        $thumbnail_image_width = (int) (THUMBNAIL_IMAGE_MAX_HEIGHT * $source_aspect_ratio);
        $thumbnail_image_height = THUMBNAIL_IMAGE_MAX_HEIGHT;
    } else {
        $thumbnail_image_width = THUMBNAIL_IMAGE_MAX_WIDTH;
        $thumbnail_image_height = (int) (THUMBNAIL_IMAGE_MAX_WIDTH / $source_aspect_ratio);
    }
    $thumbnail_gd_image = imagecreatetruecolor($thumbnail_image_width, $thumbnail_image_height);
    imagecopyresampled($thumbnail_gd_image, $source_gd_image, 0, 0, 0, 0, $thumbnail_image_width, $thumbnail_image_height, $source_image_width, $source_image_height);
    imagejpeg($thumbnail_gd_image, $source_image_path, 90);
    imagedestroy($source_gd_image);
    imagedestroy($thumbnail_gd_image);
    return true;
}

function crop($source_image_path) {
    list($source_image_width, $source_image_height, $source_image_type) = getimagesize($source_image_path);
    switch ($source_image_type) {
        case IMAGETYPE_GIF:
            $source_gd_image = imagecreatefromgif($source_image_path);
            break;
        case IMAGETYPE_JPEG:
            $source_gd_image = imagecreatefromjpeg($source_image_path);
            break;
        case IMAGETYPE_PNG:
            $source_gd_image = imagecreatefrompng($source_image_path);
            break;
    }
    if ($source_gd_image === false) {
        return false;
    }

    $dest_image_width = $dest_w = $source_image_width;
    $dest_image_height = $dest_h = $source_image_height;

    if ($source_image_width > $source_image_height) {
        $sx = abs(($source_image_width - $source_image_height) / 2);
        $sy = 0;
        $dest_image_width = $source_image_height;
        $dest_w = $dest_image_width - $sx;
    }
    if ($source_image_height > $source_image_width) {
        $sy = abs(($source_image_height - $source_image_width) / 2);
        $sx = 0;
        $dest_image_height = $source_image_width;
    }

    $thumbnail_gd_image = imagecreatetruecolor($dest_image_width, $dest_image_height);

    imagecopyresampled($thumbnail_gd_image, $source_gd_image, 0, 0, $sx, $sy, $dest_image_width, $dest_image_height, $dest_image_width, $dest_image_height);

    imagejpeg($thumbnail_gd_image, $source_image_path, 90);
    imagedestroy($source_gd_image);
    imagedestroy($thumbnail_gd_image);
    return true;
}

//Resize
list($width, $height) = getimagesize($src);
if ($width > THUMBNAIL_IMAGE_MAX_WIDTH || $height > THUMBNAIL_IMAGE_MAX_HEIGHT) {
	generate_image_thumbnail($src);
}

// Crop
list($width, $height) = getimagesize($src);
if ($width != $height)
    crop($src);

$im = imagecreatefromjpeg($src);
$width = imagesx($im);
$height = imagesy($im);
$output = imagecreatetruecolor($width, $height);

// Colors
$white = imagecolorallocate($im, 255, 255, 255);
$red = imagecolorallocate($im, 219,64,43);
$red_gradient = [219,64,43];
$black_gradient = [24,1,1];
$red_range = round($width * 1);
$black_range = $width/2;
$start = 0;

// Fonts
$font = 'assets/fonts/Oswald-Bold.ttf';
$fontb = 'assets/fonts/montserrat.otf';

/*
Gradients
*/

// put a transparent background on it
$trans_colour = imagecolorallocatealpha($output, 0, 0, 0, 127);
imagefill($output, 0, 0, $trans_colour);
// create red gradient
for ($x=0; $x < $width; ++$x) {
    $alpha = $x <= $start ? 0 : round(min(($x - $start)/$red_range, 1)*127);
    $new_color = imagecolorallocatealpha($output, $red_gradient[0], $red_gradient[1], $red_gradient[2], $alpha);
    imageline($output, $x, $height, $x, 0, $new_color);
}
// copy the gradient onto the input image
imagecopyresampled($im, $output, 0, 0, 0, 0, $width, $height, $width, $height);
// create black gradient
for ($x=0; $x < $width; ++$x) {
    $alpha = $x <= $start ? 0 : round(min(($x - $start)/$black_range, 1)*127);
    $new_color = imagecolorallocatealpha($output, $black_gradient[0], $black_gradient[1], $black_gradient[2], $alpha);
    imageline($output, $x, $height, $x, 0, $new_color);
}
// copy the gradient onto the input image
imagecopyresampled($im, $output, 0, 0, 0, 0, $width, $height, $width, $height);

/*
 Picture copy
*/
// TExt
$text = ['I Am'];
$text[1] = 'R'.$_POST['r'];
$text[2] = 'E'.$_POST['e'];
$text[3] = 'D'.$_POST['d'];

$y = $height - 450;
if ($y < 0)
    $y = 15;
foreach ($text as $k => $v) {
    $bbox = $k ? imagettfbbox(30, 0, $font, $v) :
                imagettfbbox(50, 0, $font, $v);
    $y += abs($bbox[7] - $bbox[1]) + 5;
    if ($k) {
        imagettftext($im, 30, 0, 30, $y, $white, $font, $v);
        imagettftext($im, 30, 0, 30, $y, $red, $font, $v{0});
    }
    else
        imagettftext($im, 50, 0, 30, $y, $white, $font, $v);
}
imagettfbbox(50, 0, $font, 'I');
$y += abs($bbox[7] - $bbox[1]) + 5;

// #iamred
$txt = '#iamred | iamred.com';
imagettftext($im, 15, 0, 30, $y, $white, $fontb, $txt);
$bbox = imagettfbbox(13, 0, $fontb, $txt);
$y += abs($bbox[7] - $bbox[1]);
imageline($im, 15, $y, $width - 30, $y, $white);
$y += 15;
// Album art
imagefilledrectangle($im, 30, $y , 130, $y+100 , $white);
// Footer
$txt = "Africa's no. 1 female artist Tiwa Savage is releasing her R.E.D album which is an Acronym that defines her and will be revealed on the album release date. She has invited her fans and the whole internet to define themselves in RED by visiting iamred.com";
$word = explode("\n", wordwrap($txt, 55));
$y -= 5;
foreach ($word as $txt) {
    $bbox = imagettfbbox(13, 0, $fontb, $txt);
    $y += abs($bbox[7] - $bbox[1]) + 4;
    imagettftext($im, 13, 0, 150, $y, $white, $fontb, $txt);
}

imagejpeg($im, $src, 100);
imagedestroy($im);

echo json_encode(array('file' => $src));
