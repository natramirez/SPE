<?php 
	require_once('../mysqli_connect.php');
	$event_id = $_POST['event_id'];

	$query = mysqli_query($dbc, "SELECT * FROM Events WHERE event_id = '$event_id';");

	if (!$query) {
		echo mysqli_error($dbc);
	}
	else {
		$event = mysqli_fetch_assoc($query);
		// var_dump($event);
		$event_array = json_encode(array("event_name"=>$event['event_name'],"club_name"=>$event['club_name'], "location"=>$event['location'], "date_entered"=>$event['date_entered']));
		echo $event_array;
	}
?>