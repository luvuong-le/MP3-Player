<div id="mp" class="mp">
    <div class="mp__options-toggle">
        <svg id="mp__options-toggle-icon" class="mp__options-toggle-icon">
            <use xlink:href="icons/sprite.svg#icon-dots-three-horizontal"></use>
        </svg>
    </div>
    <div id="mp__options" class="mp__options">
        <a href="#" class="mp__options-upload-btn">Upload</a>
        <select name="themes" id="mp__options-theme-options" class="mp__options-theme-select">
            <option value="default" selected>Default</option>
            <option value="materialistic">Materialistic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </div>
    <div class="mp__details">
        <img src="http://via.placeholder.com/150x150" alt="Cover">
        <div class="mp__playing">
            <h3>Now Playing </h3>
            <p id="mp__playing-now" class="mp__playing-now"></p>
            <div class="mp__controls">
                <button id="mp__controls-previous" class="mp__controls-btn">
                    <svg class="mp__controls-icon">
                        <use  xlink:href="icons/sprite.svg#icon-previous2"></use>
                    </svg>
                </button>
                <button id="mp__controls-playpause" class="mp__controls-btn">                                
                    <svg class="mp__controls-icon">
                        <use id="playpauseicon"xlink:href="icons/sprite.svg#icon-play3"></use>
                    </svg>
                </button>
                <button id="mp__controls-next" class="mp__controls-btn">                                
                    <svg class="mp__controls-icon">
                        <use xlink:href="icons/sprite.svg#icon-next2"></use>
                    </svg>
                </button>
            </div>
        </div>
        <div class="mp__song-duration">
            <span id="mp__song-duration-start" class="mp__song-duration-start">00:00</span>
            <input type="range" id="mp__song-duration-bar" class="mp__song-duration-bar"></input>
            <span id="mp__song-duration-end" class="mp__song-duration-end">00:00</span>
        </div>
        <div class="mp__volume">
            <svg class="mp__volume-icon">
                <use id="volumeicon" xlink:href="icons/sprite.svg#icon-volume-low"></use>
            </svg>
            <input type="range" id="mp__volume-slider" class="mp__volume-slider" value="0" min="0" max="100">
            <span id="mp__volume-value" class="mp__volume-value"></span>
        </div>
    </div>
    <div class="mp__playlist">
        <h4>Song List</h4>
        <div id="mp__playlist-items"class="mp__playlist-items">   
        </div>
    </div>
</div>