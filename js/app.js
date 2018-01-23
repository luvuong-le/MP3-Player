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
        songToPlay.volume = musicPlayer.e.volume.value / 100;
        musicPlayer.e.currentlyPlaying.push(songToPlay);
        console.log(songToPlay);
        songToPlay.play();

        setInterval(() => {
            console.log(Math.floor(songToPlay.currentTime));
        }, 1000);
        musicPlayer.updateDetails();

        //Change SVG to Pause
        musicPlayer.e.playpauseicon.setAttribute("xlink:href", "icons/sprite.svg#icon-pause2")
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
        for (let song of musicPlayer.e.songItems) {
            // Add event listener 
            song.addEventListener("click", (e) => {
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

        musicPlayer.e.next.addEventListener("click", () => {
            let songIndex = musicPlayer.findIndex() == musicPlayer.e.songItems.length - 1 ? 0 : musicPlayer.findIndex() + 1;

            let songName = musicPlayer.e.songItems[songIndex].innerHTML;

            musicPlayer.playSong(songName);
        });

        musicPlayer.e.volume.addEventListener("input", () => {
            if (musicPlayer.e.currentlyPlaying.length != 0) {
                musicPlayer.e.currentlyPlaying[0].volume = musicPlayer.e.volume.value / 100;
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
        musicPlayer.e.nowPlaying.innerHTML = musicPlayer.e.currentlyPlaying[0].innerHTML;
    },

    init: () => {
        musicPlayer.createButtons();
    },
};

musicPlayer.init();