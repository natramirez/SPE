<?php
//ISSUES DATABASE 'Images' TABLE QUERY AND UPDATES CAPTION TO NEW CAPTION
require_once('../mysqli_connect.php');
 
$new_caption = $_POST['new_caption'];
$img_name = $_POST['image_name'];

$compare_query = @mysqli_query($dbc, "SELECT 1 FROM Images WHERE image_name ='$img_name' AND caption = '$new_caption' LIMIT 1;");
if ($compare_query) { //if compare caption query worked
    if (mysqli_fetch_row($compare_query)) { //if image with this caption exists in database table
        echo 'This caption is already set.<br/>'; 
        echo mysqli_error($dbc);
    }
    else { //else update caption

		//issue edit query
		$edit_query = "UPDATE Images SET caption = '$new_caption' WHERE image_name = '$img_name';";
		$stmt = mysqli_prepare($dbc, $edit_query);
		mysqli_stmt_execute($stmt);
		$affected_rows = mysqli_stmt_affected_rows($stmt);

		if ($affected_rows == 1) { //means it was updated correctly in db
			echo 'Caption successfully updated.';
		}
		else {
			echo 'Error Occurred: Couldn\'t issue database \'edit caption\' query.<br/>';
			echo mysqli_error($dbc);
		}
	}
}
else {
	echo 'Error Occurred: Couldn\'t issue database \'compare caption\' query.<br/>';
	echo mysqli_error($dbc);
}
mysqli_close($dbc);
?>