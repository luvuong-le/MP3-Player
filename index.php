<!DOCTYPE html>
<html lang="en">
<?php require "includes/header.php" ?>
<body>
    <div id="mp" class="mp mp--dark" draggable>
        <div class="mp__options-toggle">
            <div id="alert-danger" class="alert alert-danger">
            <?php if (isset($_SESSION["message-danger"])) {
                    echo $_SESSION["message-danger"];
                    unset($_SESSION["message-danger"]);
                }
            ?>
            </div>  
            <div id="alert-success" class="alert alert-success">
            <?php if (isset($_SESSION["message-success"])) {
                    echo $_SESSION["message-success"];
                    unset($_SESSION["message-success"]);
                }
            ?>
            </div>  
        <svg id="mp__options-toggle-icon" class="mp__options-toggle-icon">
            <use xlink:href="icons/sprite.svg#icon-dots-three-horizontal"></use>
        </svg>
    </div>
    
    <?= section("contents") ?>
    
    <?php require "includes/scripts.php"?>
</body>
</html>