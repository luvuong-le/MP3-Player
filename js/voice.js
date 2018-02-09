const mic = document.getElementById("mp__controls-microphone");
const micCheck = document.getElementById("mp__controls-check-mic");
const synth = window.speechSynthesis;

if (annyang) {
    var commands = {
        'skip song': function() {
            speak("Skipping Song");
            musicPlayer.removeSelected();
            musicPlayer.playNextSong();
        },

        'previous song': function() {
            speak("Going to previous song");
            musicPlayer.removeSelected();
            musicPlayer.playPreviousSong();
        },

        'pause song': function() {
            speak("Song is paused");
            musicPlayer.pauseSong();
        },

        'play song': function() {
            speak("Playing Song");
            musicPlayer.playToggle();
        },

        'turn on shuffle': function() {   
            musicPlayer.turnOnShuffle();
            speak("Shuffle is on");
        },
        
        'turn on repeat': function() {
            musicPlayer.turnOnRepeat();
            speak("Repeat is on");
        },

        'turn off shuffle': function () {
            musicPlayer.turnOffShuffle();
            speak("Shuffle is off");
        },

        'turn off repeat': function () {
            musicPlayer.turnOffRepeat();
            speak("Repeat is off");
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

function speak(text) {
    let msg = new SpeechSynthesisUtterance(text);
    synth.speak(msg);
}