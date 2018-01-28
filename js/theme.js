let themes = {
    e: {
        themesOptions: document.getElementById("mp__options-theme-options"),  
        mpCont: document.getElementById("mp"),
    },
    
    themeSelectListener: function(e) {
        this.e.themesOptions.addEventListener("change", (e) => {
            switch(this.e.themesOptions.value) {
                case "default": 
                    this.updateTheme("mp");
                    break;
                case "dark": 
                    this.updateTheme("mp--dark");
                    break;
                case "light": 
                    this.updateTheme("mp--light");
                    break;
                case "materialistic":
                    this.updateTheme("mp--materialistic");
                    break;
                default: 
                    console.log("error");
            }
        });
    },

    updateTheme: function(theme) {
        this.removeAllClasses();
        this.changeTheme(theme);
    },

    removeAllClasses: function() {
        while (this.e.mpCont.classList.length > 0) {
            this.e.mpCont.classList.remove(this.e.mpCont.classList.item(0));
        }
    },

    changeTheme: function(themeName) {
        this.e.mpCont.classList.add("mp");
        this.e.mpCont.classList.add(themeName);
    },

    init: function() {
        this.themeSelectListener();
        this.e.themesOptions.value = this.e.themesOptions[0].value;
    }
};

themes.init();