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

    readFile: function(filename, callback) {
        let httpreq = new XMLHttpRequest();
        httpreq.overrideMimeType('application/json');

        httpreq.open("GET", filename, true);

        httpreq.onreadystatechange = function () {
            if (httpreq.readyState == 4 && httpreq.status == "200") {
                callback(httpreq.responseText);
            }
        }

        httpreq.send();
    },

    createButtons: function() {
        this.readFile('music_files.json', (response) => {
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

    updateCurrentSong: function() {
        if (this.e.currentlyPlaying[0] != null) {
            // If current song is not equal to null then update local storage with the currently playing song and all its details in an object

            // Session Storage will keep track of:
            /*
                Song Name:
                Song Duration:
                Song Current Time:
            */
            let currently_playing = {
                "name": this.e.currentlyPlaying[0].textContent,
                "duration": this.e.currentlyPlaying[0].duration,
                "current_time": this.e.currentlyPlaying[0].currentTime,
            };

            localStorage.setItem("currently_playing", JSON.stringify(currently_playing));
        }
    },

    removeCurrentSong: function() {
        localStorage.removeItem("currently_playing");
    },

    playSong: function(songName) {
        this.stopAllSongs();
        let songToPlay = new Audio(`music/${songName}.mp3`);
        songToPlay.innerHTML = songName;

        songToPlay.addEventListener("loadedmetadata", () => {
            // Set the initial volume of the song based on where the slider is
            songToPlay.volume = musicPlayer.e.volume.value / 100;

            this.e.currentlyPlaying.push(songToPlay);

            let data = JSON.parse(localStorage.getItem("currently_playing"));

            if (data != null && songName == data.name) {
                this.e.currentlyPlaying[0].currentTime = data.current_time;
                this.e.songProgressBar.value = data.current_time;
            }

            songToPlay.play();

            // Set the range slider min and max to current Time and Duration
            this.e.songProgressBar.min = 0;
            // this.e.songProgressBar.max = this.e.currentlyPlaying[0].duration;
            this.e.songProgressBar.max = this.e.currentlyPlaying[0].duration;

            // Update
            this.updateDetails();

            //Change SVG to Pause
            this.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-pause2");

            this.removeCurrentSong();
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
        this.checkMultipleSongPlaying();
        let songIndex = 0;

        if (this.e.currentlyPlaying[0] != undefined) {
            songIndex = (this.e.shuffleCheckbox.checked == true) ? Math.floor(Math.random() * this.e.songItems.length) :
            (musicPlayer.findIndex() == this.e.songItems.length - 1) ? 0 : this.findIndex() + 1;
        }

        let songName = this.e.songItems[songIndex].innerHTML;

        this.playSong(songName);

        this.e.songItems[songIndex].classList.add("mp__playlist-btn--selected");
    },

    playPreviousSong: function() {
        this.checkMultipleSongPlaying();
        let songIndex = this.e.songItems.length - 1;

        if (this.e.currentlyPlaying[0] != undefined) {
            songIndex = (this.e.shuffleCheckbox.checked == true) ? Math.floor(Math.random() * this.e.songItems.length) :
            (musicPlayer.findIndex() == 0) ? this.e.songItems.length - 1 : this.findIndex() - 1;
        }

        let songName = this.e.songItems[songIndex].innerHTML;

        this.playSong(songName);

        this.e.songItems[songIndex].classList.add("mp__playlist-btn--selected");
    },

    resumeSong: function() {
        this.e.currentlyPlaying[0].play();
        //Change SVG to Pause
        this.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-pause2");
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

    checkMultipleSongPlaying: function() {
        if (this.e.currentlyPlaying.length >= 2) {
            console.log(this.e.currentlyPlaying);
            for(let i = 1; i < this.e.currentlyPlaying.length; i++) {
                this.e.currentlyPlaying[i].pause();
            }
            this.e.currentlyPlaying.splice(1);
        }
    },

    turnOnShuffle: function() {
        this.e.shuffleBtn.style.backgroundColor = "#aaa";
        this.e.shuffleCheckbox.checked = true;
    },

    turnOnRepeat: function() {
        this.e.repeatBtn.style.backgroundColor = "#aaa";
        this.e.repeatCheckbox.checked = true;
    },

    turnOffShuffle: function () {
        this.e.shuffleBtn.style.backgroundColor = "#fff";
        this.e.shuffleCheckbox.checked = false;
    },

    turnOffRepeat: function () {
        this.e.repeatBtn.style.backgroundColor = "#fff";
        this.e.repeatCheckbox.checked = false;
    },

    changeVolumeIcon: function() {
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

        this.e.volume.addEventListener("mouseout", () => {
            this.e.volume.blur();
        });

        this.e.playpause.addEventListener("mouseout", () => {
            this.e.playpause.blur();
        });

        window.addEventListener("keydown", (e) => {
            const LEFT = 37, RIGHT = 39, SPACE = 32, UP = 38, DOWN = 40;
            switch (e.keyCode) {
                case LEFT:
                    this.removeSelected();
                    this.playPreviousSong();
                    break;
                case RIGHT:
                    this.removeSelected();
                    this.playNextSong();
                    break;
                case SPACE:
                    if (e.target.parentElement.id !== "mp__playlist-items") {
                        this.playToggle();
                    } else {
                        e.preventDefault();
                    }
                    break;
                case UP:
                    this.e.volume.value++;
                    this.e.volumeValue.textContent = this.e.volume.value;
                    this.e.currentlyPlaying[0].volume = this.e.volume.value / 100;
                    this.changeVolumeIcon();
                    break;
                case DOWN:
                    this.e.volume.value--;
                    this.e.volumeValue.textContent = this.e.volume.value;
                    this.e.currentlyPlaying[0].volume = this.e.volume.value / 100;
                    this.changeVolumeIcon();
                    break;
                default:
                    console.log("error");
                    break;
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
                    console.log(this.e.currentlyPlaying[0].currentTime);
                    this.e.songProgressBar.value = this.e.currentlyPlaying[0].currentTime;
                }, 30);
                this.e.currentlyPlaying[0].play();
            }, 500);
        });

        this.e.next.addEventListener("mouseout", () => {
            this.e.next.blur();
            clearTimeout(this.timeOutPress);
            clearInterval(this.speedSkip);
        });

        this.e.previous.addEventListener("mouseout", () => {
            this.e.previous.blur();
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
                this.turnOffShuffle();
            } else {
                this.turnOnShuffle();
            }
        });

        // Repeat
        this.e.repeatBtn.addEventListener("click", () => {
            if (this.e.repeatCheckbox.checked == true) {
                this.turnOffRepeat();
            } else {
                this.turnOnRepeat();
            }
        });

        this.e.volume.addEventListener("input", () => {
            this.changeVolumeIcon();
        });

        this.e.optionToggle.addEventListener("click", () => {
            if (this.e.optionCont.clientHeight != 0) {
                this.e.optionCont.style.height = "0rem";
                this.e.optionCont.style.padding = "0rem";
            } else {
                this.e.optionCont.style.height = "70rem";
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

        // If there is a current song in the local storage play it, otherwise set to default values
        let currently_playing = JSON.parse(localStorage.getItem("currently_playing"));

        if (currently_playing != null) {
            this.playSong(currently_playing.name);
            this.e.volume.value = 0.5 * 100;
            this.e.songProgressBar.value = currently_playing.current_time;
            this.e.volumeValue.innerHTML = this.e.volume.value;
            this.e.repeatCheckbox.checked = false;
            this.e.shuffleCheckbox.checked = false;
        } else {
            this.e.volume.value = 0.5 * 100;
            this.e.songProgressBar.value = 0;
            this.e.volumeValue.innerHTML = this.e.volume.value;
            this.e.repeatCheckbox.checked = false;
            this.e.shuffleCheckbox.checked = false;
        }

        setInterval(() => {
            this.checkMultipleSongPlaying();
        }, 500);
    },
};

musicPlayer.init();

function initTypeWriter(songName) {
    var i = 0;
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