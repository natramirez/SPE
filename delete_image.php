<?php
//ISSUES DATABASE 'Images' TABLE QUERY AND DELETES SPECIFIED IMAGE
require_once('../mysqli_connect.php');

$img_path_name = $_POST['img_path_name']; 

$img_name = substr($img_path_name, 8); //assuming path name is "uploads/"...

//issue delete query
$query = "DELETE FROM Images WHERE image_name = '$img_name';";
$stmt = mysqli_prepare($dbc, $query);
mysqli_stmt_execute($stmt);
$affected_rows = mysqli_stmt_affected_rows($stmt);

if ($affected_rows == 1) { //means it was deleted correctly from db
	unlink($img_path_name); //delete from uploads/ folder
	echo 'Image successfully deleted.';
}
else {
	echo 'Error Occurred: Couldn\'t issue database \'delete\' query.';
	echo mysqli_error($dbc);
}
?>