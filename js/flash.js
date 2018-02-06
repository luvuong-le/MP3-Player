// Set the flash message to disappear after 5 seconds of being shown on the screen
let flash = {
    e: {
        flashSuccess: document.getElementById("alert-success"),
        flashDanger: document.getElementById("alert-danger"),
    },

    hideMessage: function () {
        setTimeout(() => {
            this.e.flashDanger.style.display = "none";
            this.e.flashSuccess.style.display = "none";
        }, 3500);
    },

    init: function () {
        this.hideMessage();
    }
};

flash.init();