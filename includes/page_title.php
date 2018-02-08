<?php 

    $pagename = basename($_SERVER['PHP_SELF']);
    $title = "";

    switch($pagename) {
        case "index.php":
            $title = "MP3 Player";
            break;
        default: 
            $title = "Error";
            break;
    }

    function title($title) {
        return $title;
    }
?>