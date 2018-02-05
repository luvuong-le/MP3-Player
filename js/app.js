let musicPlayer = {

    typeWriter: null,
    retype: null,
    speedSkip: null,
    speedRewind: null,
    mousedownFired: null,
    timeOutPress: null,

    e: {
        playlistItems: document.getElementById("mp__playlist-items"),
        songItems: document.getElementsByClassName("mp__playlist-btn"),
        currentlyPlaying: [],

        nowPlaying: document.getElementById("mp__playing-now"),

        // Options toggle
        optionCont: document.getElementById("mp__options"),
        optionToggle: document.getElementById("mp__options-toggle-icon"),

        // Controls  
        previous: document.getElementById("mp__controls-previous"),
        playpause: document.getElementById("mp__controls-playpause"),
        next: document.getElementById("mp__controls-next"),
        playpauseicon: document.getElementById("playpauseicon"),
        volumeicon: document.getElementById("volumeicon"),

        // Shuffle and Repeat Button and Checkboxes
        repeatBtn: document.getElementById("mp__controls-repeat"),
        repeatCheckbox: document.getElementById("mp__controls-check-repeat"),
        shuffleBtn: document.getElementById("mp__controls-shuffle"),
        shuffleCheckbox: document.getElementById("mp__controls-check-shuffle"),

        // Slider
        volume: document.getElementById('mp__volume-slider'),
        volumeValue: document.getElementById("mp__volume-value"),

        // Duration
        songStartTime: document.getElementById("mp__song-duration-start"),
        songProgressBar: document.getElementById("mp__song-duration-bar"),
        songEndTime: document.getElementById("mp__song-duration-end"),
    },

    readFile: function(callback) {
        let httpreq = new XMLHttpRequest();
        httpreq.overrideMimeType('application/json');

        httpreq.open("GET", 'music_files.json', true);

        httpreq.onreadystatechange = function () {
            if (httpreq.readyState == 4 && httpreq.status == "200") {
                callback(httpreq.responseText);
            }
        }

        httpreq.send();
    },

    createButtons: function() {
        this.readFile((response) => {
            let jsondata = JSON.parse(response);

            for(let mp of jsondata) {
                let newSongItem = document.createElement("button");
                newSongItem.className = "mp__playlist-btn";
                newSongItem.innerHTML = mp.name.substring(0, mp.name.length - 4);

                this.e.playlistItems.appendChild(newSongItem);
            }
            this.addListeners();
        });
    },

    playSong: function(songName) {
        this.stopAllSongs();
        let songToPlay = new Audio(`music/${songName}.mp3`);
        songToPlay.innerHTML = songName;

        songToPlay.addEventListener("loadedmetadata", () => {
            // Set the initial volume of the song based on where the slider is 
            songToPlay.volume = musicPlayer.e.volume.value / 100;

            this.e.currentlyPlaying.push(songToPlay);
            songToPlay.play();

            // Set the range slider min and max to current Time and Duration
            this.e.songProgressBar.min = 0;
            // this.e.songProgressBar.max = this.e.currentlyPlaying[0].duration;
            this.e.songProgressBar.max = this.e.currentlyPlaying[0].duration;

            // Update 
            this.updateDetails();

            //Change SVG to Pause
            this.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-pause2");
        });

        songToPlay.addEventListener("timeupdate", () => {
            let time = songToPlay.currentTime * 1000;
            let currentTime = moment.utc(time).format("mm:ss");
            
            // Update song timer
            this.e.songStartTime.innerHTML = currentTime;

            // Update the progress bar value 
            this.e.songProgressBar.value = (this.e.currentlyPlaying[0] == null) 
                                                  ? 0 : this.e.currentlyPlaying[0].currentTime;

            // Logging the Current Time of the Song
            // console.log("progress: " + musicPlayer.e.songProgressBar.value);
            // console.log(musicPlayer.e.currentlyPlaying[0].currentTime);
        });

        // Check if song has ended if so play the next song
        songToPlay.addEventListener("ended", () => {
            if (this.e.repeatCheckbox.checked == true) {
                this.e.currentlyPlaying[0].play();
            } else {
                this.removeSelected();
                this.playNextSong();
            }
        });
    },

    playNextSong: function() {
        let songIndex = 0;
        
        if (this.e.currentlyPlaying[0] != undefined) {
            songIndex = (this.e.shuffleCheckbox.checked == true) ? Math.floor(Math.random() * this.e.songItems.length) :
            (musicPlayer.findIndex() == this.e.songItems.length - 1) ? 0 : this.findIndex() + 1;
        }

        let songName = this.e.songItems[songIndex].innerHTML;

        this.e.songItems[songIndex].classList.add("mp__playlist-btn--selected");

        this.playSong(songName);
    },

    playPreviousSong: function() {
        let songIndex = this.e.songItems.length - 1;

        if (this.e.currentlyPlaying[0] != undefined) {
            songIndex = (this.e.shuffleCheckbox.checked == true) ? Math.floor(Math.random() * this.e.songItems.length) :
            (musicPlayer.findIndex() == 0) ? this.e.songItems.length - 1 : this.findIndex() - 1;
        }

        let songName = this.e.songItems[songIndex].innerHTML;

        this.e.songItems[songIndex].classList.add("mp__playlist-btn--selected");

        this.playSong(songName);
    },

    resumeSong: function() {
        this.e.currentlyPlaying[0].play();
        //Change SVG to Pause
        this.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-pause2")
    },

    playToggle: function() {
        if (this.e.currentlyPlaying.length != 0) {
            if (this.e.currentlyPlaying[0].paused == true) {
                this.resumeSong();
            } else {
                this.pauseSong();
            }
        } else {
            this.e.songItems[0].classList.add("mp__playlist-btn--selected");
            this.playSong(this.e.songItems[0].innerHTML);
        }
    },

    pauseSong: function() {
        if (this.e.currentlyPlaying.length != 0) {
            this.e.currentlyPlaying[0].pause();
            //Change SVG to Play
            this.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-play3");
        }
    },

    stopAllSongs: function() {
        if (this.e.currentlyPlaying.length != 0) {
            this.e.currentlyPlaying[0].pause();
            this.e.currentlyPlaying = [];
        }
    },

    addListeners: function() {
        for (let i = 0; i < this.e.songItems.length; i++) {
            // Add event listener 
            this.e.songItems[i].addEventListener("click", (e) => {
                this.removeSelected();
                this.e.songItems[i].classList.add("mp__playlist-btn--selected");
                this.playSong(e.target.innerHTML);
            });
        }

        window.addEventListener("keypress", (e) => {
            const LEFT = 37, RIGHT = 39, SPACE = 0;
            switch (e.keyCode) {
                case LEFT: 
                    this.playPreviousSong();
                    break;
                case RIGHT: 
                    this.playNextSong();
                    break;
                case SPACE: 
                    this.playToggle();
                    break;
                default:
                    console.log("error");
            }
        });

        this.e.playpause.addEventListener("click", () => {
            this.playToggle();
        });

        this.e.songProgressBar.addEventListener("input", (e) => {
            this.e.currentlyPlaying[0].currentTime = e.target.value;
            this.e.songProgressBar.value = e.target.value;
        });

        this.e.next.addEventListener("click", (e) => {
            // Clear time out press to determine click or not
            clearTimeout(this.timeOutPress);
            clearInterval(this.speedSkip);
            if (this.mousedownFired) {
                this.mousedownFired = false;
            } else {
                this.removeSelected();
                this.playNextSong();
            }
        });

        this.e.next.addEventListener("mousedown", () => {
            this.timeOutPress = setTimeout(() => {
                this.mousedownFired = true;
                this.e.currentlyPlaying[0].pause();
                this.speedSkip = setInterval(() => {
                    this.e.currentlyPlaying[0].currentTime++;
                    this.e.songProgressBar.value = this.e.currentlyPlaying[0].currentTime;
                }, 30);
                this.e.currentlyPlaying[0].play();
            }, 500);
        });

        this.e.next.addEventListener("mouseout", () => {
            clearTimeout(this.timeOutPress);
            clearInterval(this.speedSkip); 
        });

        this.e.previous.addEventListener("mouseout", () => {
            clearTimeout(this.timeOutPress);
            clearInterval(this.speedRewind);
        });

        this.e.previous.addEventListener("click", (e) => {
            // Clear time out press to determine click or not
            clearTimeout(this.timeOutPress);
            clearInterval(this.speedRewind);
            if (this.mousedownFired) {
                this.mousedownFired = false;
            } else {
                this.removeSelected();
                this.playPreviousSong();
            }
        });

        this.e.previous.addEventListener("mousedown", () => {
            this.timeOutPress = setTimeout(() => {
                this.mousedownFired = true;
                this.e.currentlyPlaying[0].pause();
                this.speedRewind = setInterval(() => {
                    this.e.currentlyPlaying[0].currentTime--;
                    this.e.songProgressBar.value = this.e.currentlyPlaying[0].currentTime;
                }, 30);

                this.e.currentlyPlaying[0].play();
            }, 500);
        });

        // Shuffle Button
        this.e.shuffleBtn.addEventListener("click", () => {
            if (this.e.shuffleCheckbox.checked == true) {
                this.e.shuffleCheckbox.checked = false;
                this.e.shuffleBtn.style.backgroundColor = "#fff";
            } else {
                this.e.shuffleCheckbox.checked = true;
                this.e.shuffleBtn.style.backgroundColor = "#aaa";
            }
        });
        
        // Repeat
        this.e.repeatBtn.addEventListener("click", () => {
            if (this.e.repeatCheckbox.checked == true) {
                this.e.repeatCheckbox.checked = false;
                this.e.repeatBtn.style.backgroundColor = "#fff";
            } else {
                this.e.repeatCheckbox.checked = true;
                this.e.repeatBtn.style.backgroundColor = "#aaa";
            }
        });

        this.e.volume.addEventListener("input", () => {
            if (this.e.currentlyPlaying.length != 0) {
                this.e.currentlyPlaying[0].volume = this.e.volume.value / 100;
                this.e.volumeValue.innerHTML = this.e.volume.value;
                if (this.e.currentlyPlaying[0].volume == 0) {
                    this.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-mute");
                } 

                if (this.e.currentlyPlaying[0].volume > 0 && this.e.currentlyPlaying[0].volume < 0.35) {
                    this.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-low");
                }

                if (this.e.currentlyPlaying[0].volume > 0.35 && this.e.currentlyPlaying[0].volume < 0.75) {
                    this.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-medium");
                }

                if (this.e.currentlyPlaying[0].volume > 0.75 && this.e.currentlyPlaying[0].volume <= 1) {
                    this.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-high");
                }
            }
        });

        this.e.optionToggle.addEventListener("click", () => {
            if (this.e.optionCont.clientHeight != 0) {
                this.e.optionCont.style.height = "0rem";
                this.e.optionCont.style.padding = "0rem";
            } else {
                this.e.optionCont.style.height = "40rem";
                this.e.optionCont.style.padding = "1rem";
            }
        });
    },

    findIndex: function() {
        if (this.e.songItems.length != null) {
            for (let i = 0; i < this.e.songItems.length; i++) {
                // Add event listener 
                if (this.e.songItems[i].innerHTML == this.e.currentlyPlaying[0].innerHTML) {
                    return i;
                }
            }
        }
    },

    removeSelected: function() {
        for (let i = 0; i < this.e.songItems.length; i++) {
            this.e.songItems[i].classList.remove("mp__playlist-btn--selected");
        }
    },

    clearTyping: function() {
        clearInterval(this.retype);
    },

    updateDetails: function() {
        initTypeWriter(this.e.currentlyPlaying[0]);

        if (this.retype == null) {
            this.retype = setInterval(() => {
                initTypeWriter(this.e.currentlyPlaying[0]);
            }, 60000); 
        } else {
            this.clearTyping(this.retype);
            this.retype = setInterval(() => {
                initTypeWriter(this.e.currentlyPlaying[0]);
            }, 60000); 
        }
        
        // Update Song Duration
        this.e.songEndTime.innerHTML = moment.utc(musicPlayer.e.currentlyPlaying[0].duration * 1000).format("mm:ss");
    },

    init: function() {
        this.createButtons();
        this.e.volume.value = 0.5 * 100;
        this.e.songProgressBar.value = 0;
        this.e.volumeValue.innerHTML = this.e.volume.value;
        this.e.repeatCheckbox.checked = false;
        this.e.shuffleCheckbox.checked = false;
    },
};

musicPlayer.init();


function initTypeWriter(songName) {
    let i = 0;
    const textLength = songName.innerHTML.length;
    const actualText = songName.innerHTML;
    musicPlayer.e.nowPlaying.innerHTML = "";

    // Clear Timeout before writing new text 
    if (musicPlayer.typeWriter != null) { clearTimeout(musicPlayer.typeWriter); }
    type(i, textLength, actualText);
}

function type(i, textLength, actualText) {
    if (i < textLength) {
        musicPlayer.e.nowPlaying.innerHTML += actualText.charAt(i);
        i++;
        musicPlayer.typeWriter = setTimeout(function () {
            type(i, textLength, actualText);
        }, 10);
    }
}