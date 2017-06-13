<!--DISPLAYS AN IMAGE GALLERY W/ MODAL CAROUSEL BASED ON CLUB OR EVENT QUERIES TO MYSQL-->

<!DOCTYPE html>
<html>
<head>
	<title>Event Image Gallery</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
	<script src="jquery.min.js"></script>
	<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="image_gallery.js"></script>
	
	<style>
	.thumbnails-container {
		-moz-column-width: 300px;
	    -webkit-column-width: 300px;
	    column-width: 300px;
	}
	.divrow {
		display: inline-block;
	}
	.carousel-caption {
	    position: relative;
	    left: auto;
	    right: auto;
	    top: 0;
	    color: #A09D9E;
	    text-shadow: 1px 1px 2px #E7E5E6;
	}

	.thumbnail {
	    position:relative;
	}
	.thumbnail .delete {
		position: absolute;
	    top:5px;
	    right:5px;
	    z-index:1;
	    color: #626161;
	    opacity: 0.70;
	    text-shadow: 1px 2px 2px #929091;
	    display: none;
	}
	.thumbnail:hover .delete{
 		display:block;
	}

	.thumbnail .edit {
		position: absolute;
	    top:5px;
	    left:5px;
	    z-index:2;
	    color: #626161;
	    opacity: 0.70;
	    text-shadow: 1px 2px 2px #929091;
	    display: none;
	}
	.thumbnail:hover .edit{
 		display:block;
	}

	#editModal {
		position: absolute;
		top: 20%;
	}

	</style>
</head>
<body>

<div class="container">
    <div class="row">
        <div class="row">
        <h1>View Your Images</h1>
        <hr>
            <!-- The data encoding type, enctype, MUST be specified as below -->
            <!-- <form enctype="multipart/form-data" action="image_gallery.php" method="POST"> -->
            <form action="image_gallery.php" method="POST">
            	<p><b>Search by:</b></p>
                <p>Club Name: 
                <input name="club_name" type="text" size="50" value=""/>
                </p>

                <p>OR</p>

                <p>Event Id: 
                <input name="event_id" type="text" size="50" value=""/>
                </p>
                
                <input type="submit" name="submit" value="Submit" />
            </form>
        </div>
        <!-- <hr> -->
    </div>
</div></br>

<?php 
require_once('../mysqli_connect.php');

$dirname = "uploads/"; //CHANGE TO CURRENT DIRECTORY IF  NECESSARY.

function issueImageQuery ($query, $connection) {
require_once('../mysqli_connect.php');

	$image_query = @mysqli_query($connection, $query);
	if ($image_query) { //if query worked
		if ($image_query->num_rows === 0) {  //if nothing is returned
			echo '<span style="color:black">No images added yet for this event.</span><br/>'; //STYLE AS NECESSARY
			mysqli_close($connection);
		}
		else { //if event has images already, then display them
			$imageCount = 0;
			$dirname = "uploads/"; //CHANGE TO CURRENT DIRECTORY IF  NECESSARY.
			while ($row = mysqli_fetch_array($image_query)) {
		        echo '<div class="divrow"><a class="thumbnail" href="#myGallery" data-slide-to="'.$imageCount.'"><button type="button" class="edit" title="Edit Caption"><span class="glyphicon glyphicon-pencil"></span></button><button type="button" class="delete" title="Delete Image"><span class="glyphicon glyphicon-remove"></span></button><img class="img-responsive" src="'.$dirname.$row['image_name'].'" data-toggle="modal" data-target="#myModal" style="width:120%; height: auto;"></a></div>';
		        $imageCount++;
			}
		}
	}
	else {
	    echo '<span style="color:red">Error Occurred: Couldn\'t issue database image query. </span><br/>';

	    echo mysqli_error($connection);
	    mysqli_close($connection);
	} 
}

if (isset($_POST['submit'])) {

	//CHANGE LATER TO RETRIEVE FROM SESSIONS//
	$event_id = $_POST['event_id'];
	$club_name = $_POST['club_name']; 
	$event_name = 'Event Name'; //just for now
	//////////////////////////////////////////
	echo '<div class="container">';
	echo '<div class="row">';
	
	if (!empty($club_name) && !empty($event_id)) {
		echo '<span style="color:red">Please enter information in ONLY one of the above fields.</span>';
	}

	else if (!empty($club_name) || !empty($event_id)) {
		// require_once('../mysqli_connect.php');
		

		if (!empty($club_name)) {
			$query =  "SELECT * FROM Images WHERE club_name = '$club_name' ORDER BY date_taken;"; //gets all club images
			$event_name = $club_name; //just for now

			echo '<h1>'. $event_name .'</h1><hr>';
			echo '<div class="thumbnails-container">';

			$club_exists_query = @mysqli_query($dbc, "SELECT 1 FROM Images WHERE club_name ='$club_name' LIMIT 1;"); //CHANGE //CHANGED
			if ($club_exists_query) { //if query worked
				if (mysqli_fetch_row($club_exists_query)) { //if club exists in database table
					issueImageQuery($query, $dbc);
				}
				else {
					echo '<span style="color:red">Error Occurred: Club name does not exist in database.</span><br/>'; //CHANGE //CHANGED
					mysqli_close($dbc);
				}
			}
			else {
				echo '<span style="color:red">Error Occurred: Couldn\'t issue database \'club exists\' query.</span><br/>';

			    echo mysqli_error($dbc);
			    mysqli_close($dbc);
			}
		}
		if (!empty($event_id)) {
			$query =  "SELECT * FROM Images WHERE event_id = '$event_id' ORDER BY date_taken;"; //gets all event images
			$event_name ='Event Name'; //just for now

			echo '<h1>'. $event_name .'</h1><hr>';
			echo '<div class="thumbnails-container">';

			$event_exists_query = @mysqli_query($dbc, "SELECT 1 FROM Images WHERE event_id ='$event_id' LIMIT 1;"); //CHANGE //CHANGED
				if ($event_exists_query) { //if query worked
					if (mysqli_fetch_row($event_exists_query)) { //if event exists in database table
						issueImageQuery($query, $dbc);
					}
					else {
						echo '<span style="color:red">Error Occurred: Event ID does not exist in database.</span><br/>'; //CHANGE //CHANGED
						mysqli_close($dbc);
					}
				}
				else {
					echo '<span style="color:red">Error Occurred: Couldn\'t issue database \'event exists\' query.</span><br/>';

				    echo mysqli_error($dbc);
				    mysqli_close($dbc);
				}
		}

		echo '</div>';
		echo '<hr>';
		echo '</div>';
		echo '</div>'; //end of thumbnails

	}
	else {
		echo '<span style="color:red">Please enter information in one of the above fields.</span>';
	}
}

?>


<!--begin modal window-->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
<div class="modal-dialog">
<div class="modal-content">
<div class="modal-header">

<?php echo '<div class="pull-left">'.$event_name.'</div>'; ?>

<button type="button" class="close" data-dismiss="modal" title="Close">
<span class="glyphicon glyphicon-remove"></span></button>
</div>
<div class="modal-body">

<!--begin carousel-->
    <div id="myGallery" class="carousel carousel-fit" data-interval="false">
    <div class="carousel-inner">

<?php
    $imageCount = 0;
    $image_query = @mysqli_query($dbc, $query);
    if ($image_query) { //if query worked
		while ($row = mysqli_fetch_array($image_query)) {
			$caption = $row['caption'];
			if (empty($caption)) { //if no caption
				if ($imageCount == 0) echo '<div class="item active"><img class="img-responsive" src="'.$dirname.$row['image_name'].'" alt="item'.($imageCount+1).'"></div>'; //includes active class for first image
		        else                  echo '<div class="item"><img class="img-responsive" src="'.$dirname.$row['image_name'].'" alt="item'.($imageCount+1).'"></div>';
			}
			else {
		        if ($imageCount == 0) echo '<div class="item active"><img class="img-responsive" src="'.$dirname.$row['image_name'].'" alt="item'.($imageCount+1).'"><div class="carousel-caption"><p>'.$caption.'</p></div></div>'; //includes active class for first image
		        else                  echo '<div class="item"><img class="img-responsive" src="'.$dirname.$row['image_name'].'" alt="item'.($imageCount+1).'"><div class="carousel-caption"><p>'.$caption.'</p></div></div>';
	        }
	        $imageCount++;
		}
	}
	else {
	    echo '<span style="color:red">Error Occurred: Couldn\'t issue database image query </span><br/>';
	    echo mysqli_error($dbc);
	} 
	mysqli_close($dbc);
?>

    <!--end carousel-inner--></div>

<!--Begin Previous and Next buttons-->
<a class="left carousel-control" href="#myGallery" role="button" data-slide="prev">
<span class="glyphicon glyphicon-chevron-left"></span></a> 
<a class="right carousel-control" href="#myGallery" role="button" data-slide="next">
<span class="glyphicon glyphicon-chevron-right"></span></a>
<!--end myGallery--></div>

<!--end modal-body--></div>
<div class="modal-footer">
<div class="pull-left">
<!-- <small>Photographs by <a href="http://lorempixel.com" target="new">Lorempixel.com</a></small> -->
</div>
<button class="btn-sm close" type="button" data-dismiss="modal">Close</button>
<!--end modal-footer--></div>
<!--end modal-content--></div>
<!--end modal-dialoge--></div>
<!--end myModal--></div>


<!-- <div class="container"> -->

<!-- Edit Modal -->
  <div class="modal fade" id="edit-modal" role="dialog">
    <div class="modal-dialog">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Edit Image</h4>
        </div>
        <div class="modal-body">
          <form id="edit-form"  method="post">
          	<p>Edit Caption (Max 255 chars): </p>
            <textarea name="new_caption" cols="40" rows="5" maxlength="255" /></textarea><br/><br/>
            <input type="hidden" id="img-name-field" name="image_name" value=""/>
            <input id="edit-submit-btn" type="submit" name="submit" value="Update" /><br/><br/>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>
      </div>
      
    </div>
  </div>

<!-- </div> -->





</body>
</html>
