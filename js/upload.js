let upload = {

    e: {
        fileUpload: document.getElementById("mp__options-upload-btn"),
        fileLabel: document.getElementById("mp__options-label"),
        fileText: document.getElementById("mp__options-label-caption"),
        draggableArea: document.getElementById("mp"),
        fileSubmit: document.getElementById("mp__options-file-submit"),
    },

    addDraggable: function() {
        this.e.draggableArea.addEventListener("dragenter", (e) => {
            e.preventDefault();
            this.e.draggableArea.style.opacity = .5;

            musicPlayer.updateCurrentSong();
            
        });

        this.e.draggableArea.addEventListener("dragleave", (e) => {
            e.preventDefault();
            this.e.draggableArea.style.opacity = 1;
            musicPlayer.removeCurrentSong();
        });

        this.e.draggableArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });

        this.e.draggableArea.addEventListener("drop", (e) => {
            e.preventDefault();
            musicPlayer.updateCurrentSong();
            this.e.draggableArea.style.opacity = 1;
            this.e.fileUpload.files = e.dataTransfer.files; 
            this.e.fileSubmit.click();
        });
    },

    init: function() {
        let label = this.e.fileLabel.textContent;

        this.e.fileLabel.addEventListener("click", (e) => {
            this.e.fileUpload.click();
        });

        this.e.fileSubmit.addEventListener("click", (e) => {
            if (this.e.fileUpload.files.length == 0) {
                e.preventDefault();
                this.e.fileText.textContent = "A file must be selected!";

                setTimeout(() => {
                    this.e.fileText.textContent = "No File Selected";
                }, 2000);
            }
        });

        this.e.fileUpload.addEventListener("change", (e) => {
            // If the file changes, if there are more than one files just change the text to label value to the number of files otherwise
            // If there is only one file make the label that file name
            if (e.target.files.length == 0) {
                this.e.fileText.textContent = "No Files Selected";
            } else if (e.target.files.length == 1) {
                this.e.fileText.textContent = e.target.files[0].name;
            } else {
                this.e.fileText.textContent = `${e.target.files.length} files selected`;
            }
            musicPlayer.updateCurrentSong();
        });

        this.addDraggable();
    }
};

upload.init();
