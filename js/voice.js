let mic = document.getElementById("mp__controls-microphone");
let micCheck = document.getElementById("mp__controls-check-mic");

if (annyang) {
    var commands = {
        'skip song': function() {
            musicPlayer.removeSelected();
            musicPlayer.playNextSong();
        },

        'previous song': function() {
            musicPlayer.removeSelected();
            musicPlayer.playPreviousSong();
        },

        'pause song': function() {
            musicPlayer.pauseSong();
        },

        'play song': function() {
            musicPlayer.playToggle();
        },

        'turn on shuffle': function() {        
            musicPlayer.turnOnShuffle();
        },
        
        'turn on repeat': function() {
            musicPlayer.turnOnRepeat();
        },

        'turn off shuffle': function () {
            musicPlayer.turnOffShuffle();
        },

        'turn off repeat': function () {
            musicPlayer.turnOffRepeat();
        },
    };

    annyang.addCommands(commands);
    
    // Add Listener
    mic.addEventListener("click", (e) => {
        if (micCheck.checked == true) {
            mic.style.backgroundColor = "#fff";
            micCheck.checked = false;
            annyang.pause();
        } else {
            mic.style.backgroundColor = "#aaa";
            micCheck.checked = true;
            annyang.resume();
        }
    });
}