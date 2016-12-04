<?php

DEFINE ('DB_USER', 'studentweb');
DEFINE ('DB_PASSWORD', 'student123');
DEFINE ('DB_HOST', '127.0.0.1');
DEFINE ('DB_NAME', 'test1');

$dbc = @mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
OR die('Could not connect to MySQL<br>' . mysqli_connect_error());

?>