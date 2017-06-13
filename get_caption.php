<?php

//ISSUES DATABASE 'Images' TABLE QUERY AND GETS CURRENT CAPTION
require_once('../mysqli_connect.php');

$img_path_name = $_POST['img_path_name'];

$img_name = substr($img_path_name, 8); //assuming path name is "uploads/"...

//issue edit query
$query = "SELECT caption FROM Images WHERE image_name = '$img_name';";
$response = @mysqli_query($dbc, $query);

if ($response) {
	// echo 'something';
	while ($row = mysqli_fetch_array($response)) {
		echo $row['caption'].';%';
		echo $img_name;
	}
}
else {
	echo 'Error Occurred: Couldn\'t issue database \'get caption\' query.';
	echo mysqli_error($dbc);
}

?>