<?php 

    function section($section_name) {
        // Loop through includes folder and check for matching name with .php if there is, grab the html contents and echo or return the html

        foreach(glob("includes/*.php") as $section) {
            if ($section_name == basename($section, ".php")) {
                $file_contents = file_get_contents($section, false);
                return $file_contents;
            }
        }

    }

?>