<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
</head>
<body>

<?php

// $exif = exif_read_data($_FILES['userfile']['tmp_name']);
// print_r($exif);

if(isset($_POST['submit'])){ //if anything was submitted to this page

$data_missing = array();

    if(empty($_POST['club_name'])) {
        //Adds name to array
        $data_missing[] = 'Club Name';
    } else {
        //Trim whitespace from name and stores name
        $club_name = trim($_POST['club_name']);
    }

    if(empty($_POST['event_id'])) {
        //Adds name to array
        $data_missing[] = 'Event ID';
    } else {
        //Trim whitespace from name and stores name
        $event_id = trim($_POST['event_id']);
    }

    //Trim whitespace from caption and stores caption
    $caption = $_POST['caption'];

    //if no data is missing...
    if(empty($data_missing)) {
        //try and catch used for checking uploaded image
        try {
            // Undefined | Multiple Files | $_FILES Corruption Attack
            // If this request falls under any of them, treat it invalid.
            if (
                !isset($_FILES['userfile']['error']) ||
                is_array($_FILES['userfile']['error'])
            ) {
                throw new RuntimeException('<span style="color:red">Invalid parameters.</span><br/>');
            }

            // Check $_FILES['upfile']['error'] value.
            switch ($_FILES['userfile']['error']) {
                case UPLOAD_ERR_OK:
                    break;
                case UPLOAD_ERR_NO_FILE:
                    throw new RuntimeException('<span style="color:red">No file sent.</span><br/>');
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    throw new RuntimeException('<span style="color:red">Exceeded filesize limit.</span><br/>');
                default:
                    throw new RuntimeException('<span style="color:red">Unknown errors.</span><br/>');
            }

            // You should also check filesize here. 
            if ($_FILES['userfile']['size'] > 10000000) {
                throw new RuntimeException('<span style="color:red">Exceeded filesize limit.</span><br/>');
            }

            // DO NOT TRUST $_FILES['upfile']['mime'] VALUE !!
            // Check MIME Type by yourself.
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            if (false === $ext = array_search(
                $finfo->file($_FILES['userfile']['tmp_name']),
                array(
                    'jpg' => 'image/jpeg'
                ),
                true
            )) {
                throw new RuntimeException('<span style="color:red">Invalid file format.</span><br/>');
            }

            $exif = exif_read_data($_FILES['userfile']['tmp_name']);
            if (!empty($exif['DateTimeOriginal'])) {
                $date_taken = $exif['DateTimeOriginal']; //for inputting into database
            }

            // You should name it uniquely.
            // DO NOT USE $_FILES['upfile']['name'] WITHOUT ANY VALIDATION !!
            // On this example, obtain safe unique name from its binary data.
            $hash_name = sha1_file($_FILES['userfile']['tmp_name']);
            $image_name = sprintf('%s.%s', $hash_name, $ext); //for inputting into database

            //FILE WILL BE MOVED ONCE IT IS INPUT CORRECTLY INTO DATABASE TABLE


            //uploaded_by_user currently null. Make this happen later!

            require_once('../mysqli_connect.php');

            $compare_query = @mysqli_query($dbc, "SELECT 1 FROM Images WHERE image_name ='$image_name' LIMIT 1;");
            if ($compare_query) { //if compare query worked
                if (mysqli_fetch_row($compare_query)) { //if image exists in database table
                    $message = '<span style="color:red">Image is already uploaded.</span><br/>'. mysqli_error($dbc);
                    mysqli_close($dbc);
                }
                else { //else insert into database table
                
                    if(empty($_POST['caption'])) { //if a caption was not entered
                        if (!isset($date_taken)) { //if a date_taken was not found
                            $insert_query = "INSERT INTO Images (image_id, event_id, club_name, image_name, date_taken, caption, date_uploaded, uploaded_by_user) VALUES (NULL, ?, ?, ?, NULL, NULL, NOW(), NULL);";
                        }
                        else { //if a date_taken was found
                            $insert_query = "INSERT INTO Images (image_id, event_id, club_name, image_name, date_taken, caption, date_uploaded, uploaded_by_user) VALUES (NULL, ?, ?, ?, TIMESTAMP('$date_taken'), NULL, NOW(), NULL);";
                        }
                         /*
                            i Integers
                            d Doubles
                            b Blobs
                            s Everything Else */
                        $stmt = mysqli_prepare($dbc, $insert_query);
                        mysqli_stmt_bind_param($stmt, "iss", $event_id, $club_name, $image_name);
                    }
                    else { //if a caption was entered
                        if (!isset($date_taken)) { //if a date_taken was not found
                            $insert_query = "INSERT INTO Images (image_id, event_id, club_name, image_name, date_taken, caption, date_uploaded, uploaded_by_user) VALUES (NULL, ?, ?, ?, NULL, ?, NOW(), NULL);";
                            
                        }
                        else {  //if a date_taken was found
                            $insert_query = "INSERT INTO Images (image_id, event_id, club_name, image_name, date_taken, caption, date_uploaded, uploaded_by_user) VALUES (NULL, ?, ?, ?, TIMESTAMP('$date_taken'), ?, NOW(), NULL);";
                        }
                        $stmt = mysqli_prepare($dbc, $insert_query);
                        mysqli_stmt_bind_param($stmt, "isss", $event_id, $club_name, $image_name, $caption);
                    }

                    mysqli_stmt_execute($stmt);

                    $affected_rows = mysqli_stmt_affected_rows($stmt);

                    if ($affected_rows == 1) { //means it was inserted correctly
                        
                        $uploads_file_name = sprintf('./uploads/%s.%s', $hash_name, $ext); 
                        //move file to uploads folder
                        if (!move_uploaded_file($_FILES['userfile']['tmp_name'], $uploads_file_name)) {
                            //if error occurs, delete the database table entry
                            $delete_query = @mysqli_query($dbc, "DELETE FROM Images WHERE image_name = '$image_name';");
                            if (!$delete_query) { 
                                $message = '<span style="color:red">Error issuing delete image query. Image information was inserted into database but file was not uploaded. </span><br/>'. mysqli_error($dbc);
                                mysqli_close($dbc);
                            }
                            throw new RuntimeException('<span style="color:red">Failed to move uploaded file. <br/>');
                        }
                        $message = '<span style="color:blue">Image Successfully Uploaded.</span><br />';

                        mysqli_stmt_close($stmt);
                        mysqli_close($dbc);
                    } 
                    else {
                        $message = '<span style="color:red">Error Occurred: Image information was not inserted into database. </span><br />'. mysqli_error($dbc);

                        mysqli_stmt_close($stmt);
                        mysqli_close($dbc);
                    }
                }
            }
            else {
                $message = '<span style="color:red">Couldn\'t issue database compare query </span><br/>'. mysqli_error($dbc);
                mysqli_close($dbc);
            } 
        } 
        catch (RuntimeException $e) {
            $exception = $e->getMessage();
            // print_r($_FILES);
        }
    }
    else { //data is missing
        $message = '<div style="color:red"><b>You need to enter the following data:</b> <br />';
        foreach ($data_missing as $missing){
            $message.= "$missing<br />";
        }
        $message.= '</div>';
    }
}


?>
<div class="container">
    <div class="row">
        <div class="row">
        <h1>Upload Images for Your Event</h1>
        <hr>
            <!-- The data encoding type, enctype, MUST be specified as below -->
            <form enctype="multipart/form-data" action="image_upload.php" method="POST">
                <!-- MAX_FILE_SIZE must precede the file input field -->
                <input type="hidden" name="MAX_FILE_SIZE" value="10000000" />
                <!-- Name of input element determines name in $_FILES array -->
                <span style="font-size:16px">Upload .jpg/.jpeg files only. 
                Max file size: 10MB.</span><br/><br/>
                <input name="userfile" type="file" /><br/>

                <p>Club Name: 
                <input name="club_name" type="text" size="50" value=""/>
                </p>

                <p>Event ID: 
                <input name="event_id" type="text" size="50" value=""/>
                </p>

                <p>Caption (Max 255 chars): </p>
                <textarea name="caption" cols="40" rows="5" maxlength="255" /></textarea><br/><br/> 

                <input type="submit" name="submit" value="Upload File" />
                <p> <?php echo $exception . " <br/>" . $message; ?> </p>
            </form>
            <a class="btn btn-default" href="image_gallery.php">Go to Image Gallery</a>
        </div>
        
    </div>

</div>


</body>
</html>

