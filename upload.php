<?php 
    // Target Directory for the uploaded files to go in
    $target = getcwd() . "/music/";
    $uploaded = 0;
    $special_chars = array("&", "%", "$", "*", "-");
    $SIZE_LIMIT = 10000;

    // Check if submit is isset
    if (isset($_POST["submit"])) {
        $ITER = 0;
        foreach($_FILES["mp__options-songs"]["tmp_name"] as $file) {

            $filename = getFileName($ITER);

            // Get the actual name and rename the files first 
            $renamed_file = str_replace($special_chars, "", $filename);
     
            if (file_exists($target . $renamed_file)) {
                // Send back to music player with a message 
                $_SESSION["message-danger"] = $renamed_file . " File Already Exists";
                header("location: index.php");
                exit(0);
            }

            // Check if mp3 files are less than 10MB
            if (checkFileSize($SIZE_LIMIT) == true) {
                $_SESSION["message-danger"] = "File size is too large, Please make sure each file size is below 10MB";
                header("location: index.php");
                exit(0);
            }

            // Check if the files uploaded are all MP3 Files
            if (pathinfo($target . $renamed_file, PATHINFO_EXTENSION) != "mp3") {
                $_SESSION["message-danger"] = "Invalid File Type: Files must be .mp3";
                header("location: index.php");
                exit(0);
            }

            $uploaded = 1;

            // If after all this the uploaded is still 0, report upload failed
            if ($uploaded == 0) {
                $_SESSION["message-danger"] = "Upload Failed";
                header("location: index.php");
                exit(0);
            } else {
                // Upload File Here
                if (move_uploaded_file($file, $target . $renamed_file)) {
                    // $renamed_file . " uploaded successfuly" .  "<br>"
                } else {
                    $_SESSION["message-danger"] = "File could not be uploaded";
                    header("location: index.php");
                    exit(0);
                }
            }

            $ITER++;
        }
        $_SESSION["message-success"] = "Songs uploaded successfully"; 
        header("location: index.php");
        require "includes/mp_playlist_get.php";
        exit(0);
    }

    // print_r(count($_FILES["mp__options-songs"]["name"]));

    function getTotalSize() {
        $size = 0;
        foreach($_FILES["mp__options-songs"]["size"] as $filesize) {
            $size += $filesize;
        }
        return $size;
    }

    function checkFileSize($limit) {
        foreach($_FILES["mp__options-songs"]["size"] as $filesize) {
            if ($filesize / 1000 > $limit) {
                return true;
            }
        }
        return false;
    }

    function getFileName($index) {
        return $_FILES["mp__options-songs"]["name"][$index];
    }
?>