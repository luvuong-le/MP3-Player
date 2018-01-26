<?php 

    $pagename = basename($_SERVER['PHP_SELF']);
    $title = "";

    switch($pagename) {
        case "index.php":
            $title = "Custom Player | UI";
            break;
        default: 
            $title = "Error";
            break;
    }
?>