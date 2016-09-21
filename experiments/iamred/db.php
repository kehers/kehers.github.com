<?php
$mysqli = ($_SERVER['HTTP_HOST'] == 'localhost') ?
            new mysqli("localhost", "root", "root", "iamred") :
            new mysqli("localhost", "root", 'flitpass123', 'iamred');

if (mysqli_connect_errno()) {
    exit;
}
?>