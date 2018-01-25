let musicPlayer = {
    e: {
        playlistItems: document.getElementById("mp__playlist-items"),
        songItems: document.getElementsByClassName("mp__playlist-btn"),
        currentlyPlaying: [],

        nowPlaying: document.getElementById("mp__playing-now"),

        // Controls 
        previous: document.getElementById("mp__controls-previous"),
        playpause: document.getElementById("mp__controls-playpause"),
        next: document.getElementById("mp__controls-next"),
        playpauseicon: document.getElementById("playpauseicon"),
        volumeicon: document.getElementById("volumeicon"),

        // Slider
        volume: document.getElementById('mp__volume-slider'),
        volumeValue: document.getElementById("mp__volume-value"),

        // Duration
        songStartTime: document.getElementById("mp__song-duration-start"),
        songProgressBar: document.getElementById("mp__song-duration-bar"),
        songEndTime: document.getElementById("mp__song-duration-end"),
        
        // Progress Bar

    },

    readFile: (callback) => {
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

    createButtons: () => {
        musicPlayer.readFile((response) => {
            let jsondata = JSON.parse(response);

            for(let mp of jsondata) {
                let newSongItem = document.createElement("button");
                newSongItem.className = "mp__playlist-btn";
                newSongItem.innerHTML = mp.name;

                musicPlayer.e.playlistItems.appendChild(newSongItem);
            }
            musicPlayer.addListeners();
        });
    },

    playSong: (songName) => {
        musicPlayer.stopAllSongs();
        let songToPlay = new Audio(`music/${songName}`);
        songToPlay.innerHTML = songName;

        songToPlay.addEventListener("loadedmetadata", () => {
            // Set the initial volume of the song based on where the slider is 
            songToPlay.volume = musicPlayer.e.volume.value / 100;

            musicPlayer.e.currentlyPlaying.push(songToPlay);
            songToPlay.play();

            // Set the range slider min and max to current Time and Duration
            musicPlayer.e.songProgressBar.min = 0;
            // musicPlayer.e.songProgressBar.max = musicPlayer.e.currentlyPlaying[0].duration;
            musicPlayer.e.songProgressBar.max = musicPlayer.e.currentlyPlaying[0].duration;

            // Update 
            musicPlayer.updateDetails();

            //Change SVG to Pause
            musicPlayer.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-pause2")
        });

        songToPlay.addEventListener("timeupdate", () => {
            let time = songToPlay.currentTime * 1000;
            let currentTime = moment.utc(time).format("mm:ss");
            
            // Update song timer
            musicPlayer.e.songStartTime.innerHTML = currentTime;

            // Update the progress bar value 
            musicPlayer.e.songProgressBar.value = musicPlayer.e.currentlyPlaying[0].currentTime;

            // Logging the Current Time of the Song
            // console.log("progress: " + musicPlayer.e.songProgressBar.value);
            // console.log(musicPlayer.e.currentlyPlaying[0].currentTime);
        });

        // Check if song has ended if so play the next song
        songToPlay.addEventListener("ended", () => {
            musicPlayer.playNextSong();
        });
    },

    playNextSong: () => {
        let songIndex = musicPlayer.findIndex() == musicPlayer.e.songItems.length - 1 ? 0 : musicPlayer.findIndex() + 1;

        let songName = musicPlayer.e.songItems[songIndex].innerHTML;

        musicPlayer.playSong(songName);
    },

    resumeSong: () => {
        musicPlayer.e.currentlyPlaying[0].play();
        //Change SVG to Pause
        musicPlayer.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-pause2")
    },

    pauseSong: () => {
        if (musicPlayer.e.currentlyPlaying.length != 0) {
            musicPlayer.e.currentlyPlaying[0].pause();
            //Change SVG to Play
            musicPlayer.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-play3");
        }
    },

    stopAllSongs: () => {
        if (musicPlayer.e.currentlyPlaying.length != 0) {
            musicPlayer.e.currentlyPlaying[0].pause();
            musicPlayer.e.currentlyPlaying = [];
        }
    },

    addListeners: () => {
        for (let i = 0; i < musicPlayer.e.songItems.length; i++) {
            // Add event listener 
            musicPlayer.e.songItems[i].addEventListener("dblclick", (e) => {
                musicPlayer.playSong(e.target.innerHTML);
            });
        }

        musicPlayer.e.previous.addEventListener("click", () => {
            let songIndex = musicPlayer.findIndex() == 0 ? musicPlayer.e.songItems.length - 1 : musicPlayer.findIndex() - 1;

            let songName = musicPlayer.e.songItems[songIndex].innerHTML;

            musicPlayer.playSong(songName);
        });

        musicPlayer.e.playpause.addEventListener("click", () => {
            if (musicPlayer.e.currentlyPlaying.length != 0) {
                if (musicPlayer.e.currentlyPlaying[0].paused == true) {
                    musicPlayer.resumeSong();
                } else {
                    musicPlayer.pauseSong();
                }
            } else {
                musicPlayer.playSong(musicPlayer.e.songItems[0].innerHTML);
            }
        });

        musicPlayer.e.songProgressBar.addEventListener("input", (e) => {
            musicPlayer.e.currentlyPlaying[0].currentTime = e.target.value;
            musicPlayer.e.songProgressBar.value = e.target.value;
        });

        musicPlayer.e.next.addEventListener("click", () => {
            musicPlayer.playNextSong();
        });

        musicPlayer.e.volume.addEventListener("input", () => {
            if (musicPlayer.e.currentlyPlaying.length != 0) {
                musicPlayer.e.currentlyPlaying[0].volume = musicPlayer.e.volume.value / 100;
                musicPlayer.e.volumeValue.innerHTML = musicPlayer.e.volume.value;
                if (musicPlayer.e.currentlyPlaying[0].volume == 0) {
                    musicPlayer.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-mute");
                } 

                if (musicPlayer.e.currentlyPlaying[0].volume > 0 && musicPlayer.e.currentlyPlaying[0].volume < 0.35) {
                    musicPlayer.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-low");
                }

                if (musicPlayer.e.currentlyPlaying[0].volume > 0.35 && musicPlayer.e.currentlyPlaying[0].volume < 0.75) {
                    musicPlayer.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-medium");
                }

                if (musicPlayer.e.currentlyPlaying[0].volume > 0.75 && musicPlayer.e.currentlyPlaying[0].volume <= 1) {
                    musicPlayer.e.volumeicon.setAttribute("xlink:href", "icons/sprite.svg#icon-volume-high");
                }
            }
        });
    },

    findIndex: () => {
         for (let i = 0; i < musicPlayer.e.songItems.length; i++) {
             // Add event listener 
             if (musicPlayer.e.songItems[i].innerHTML == musicPlayer.e.currentlyPlaying[0].innerHTML) {
                 return i;
             } 
         }
    },

    updateDetails: () => {
        // Update Title Name
        //musicPlayer.e.nowPlaying.innerHTML = musicPlayer.e.currentlyPlaying[0].innerHTML;
        initTypeWriter(musicPlayer.e.currentlyPlaying[0]);
        setInterval(() => {
            initTypeWriter(musicPlayer.e.currentlyPlaying[0]);
        }, 60000);
        
        // Update Song Duration
        musicPlayer.e.songEndTime.innerHTML = moment.utc(musicPlayer.e.currentlyPlaying[0].duration * 1000).format("mm:ss");
    },

    init: () => {
        musicPlayer.createButtons();
        musicPlayer.e.volume.value = 0.5 * 100;
        musicPlayer.e.songProgressBar.value = 0;
        musicPlayer.e.volumeValue.innerHTML = musicPlayer.e.volume.value;
    },
};

musicPlayer.init();


function initTypeWriter(songName) {
    let i = 0;
    const textLength = songName.innerHTML.length;
    const actualText = songName.innerHTML;
    musicPlayer.e.nowPlaying.innerHTML = "";
    type(i, textLength, actualText);
}

function type(i, textLength, actualText) {
    if (i < textLength) {
        musicPlayer.e.nowPlaying.innerHTML += actualText.charAt(i);
        i++;
        setTimeout(function () {
            type(i, textLength, actualText);
        }, 10);
    }
}