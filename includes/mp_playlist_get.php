<?php 
    $file_path = "music_files.json";
    $music_array = [];
    $special_chars = array("&", "%", "$", "*");

    // Get each mp3 file name from the music directory 
    foreach(glob('music/*.mp3') as $filename) {
        $newSong = new stdClass();
        $newSong->name = str_replace($special_chars, "", basename($filename));

        rename($filename, str_replace($special_chars, "", $filename));

        array_push($music_array, $newSong);
    }

    file_put_contents($file_path, json_encode($music_array));
?>