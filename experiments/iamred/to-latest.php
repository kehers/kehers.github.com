<?php
include_once 'db.php';
$image = preg_replace('|\?.*|', '', $_GET['file']);
$image = preg_replace('|[^a-z0-9\.]|i', '', $image);

if (file_exists('assets/files/'.$image{0}.'/'.$image))
	$mysqli->query("insert into uploads (src, date) values ('$image', now())");
?>