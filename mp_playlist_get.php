<?php 
    $file_path = "music_files.json";
    $music_array = [];
    // Get each mp3 file name from the music directory 
    foreach(glob('music/*.mp3') as $filename) {
        $newSong = new stdClass();
        $newSong->name = basename($filename);

        array_push($music_array, $newSong);
    }

    file_put_contents($file_path, json_encode($music_array));
?>