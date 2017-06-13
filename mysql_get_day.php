<?php
	require_once('../mysqli_connect.php');

	date_default_timezone_set('America/New_York'); //does this work with JS time??

	$firstDate = $_POST['firstCalDay'];
	$lastDate = $_POST['lastCalDay'];

	$query = "SELECT * FROM Events WHERE DATE(event_date) >= '$firstDate' AND DATE(event_date) <= '$lastDate' ORDER BY event_date, start_time;";

	$response = @mysqli_query($dbc, $query);

;	if ($response) {
		$outp = '['; 
		while ($row = mysqli_fetch_array($response)) {

			if ($outp != '[') {$outp .= ',';}

			//creates JSON encoded object for each event, with event details
			$event_array = json_encode(array("event_date"=>$row['event_date'],
				"event_id"=>$row['event_id'], "start_time"=>timeConversion($row['start_time']), "event_name"=>$row['event_name'], "club_name"=>$row['club_name']));
			$outp .= $event_array;
		}
		$outp .=']';
		echo $outp; //returns a JSON encoded array of event objects
	}
	else {
		echo "Couldn't issue database query <br/>";
		echo mysqli_error($dbc);
	}
//formats a time from hh:mm:ss to hh:mm AM/PM
function timeConversion($originalTime) {
	$newTime;

    $hours = substr($originalTime, 0, 2);
    $minutes = substr($originalTime, 3, 2);

    if      ($hours > 12)  $newTime = ($hours - 12) . ":" . $minutes . " PM";
    else if ($hours == 12) $newTime = $hours . ":" . $minutes . " PM";
    else if ($hours == 0)  $newTime = 12 . ":" . $minutes . " AM";
    else                   $newTime = substr($hours, 1) . ":" . $minutes . " AM";

  	return $newTime;
}

?>