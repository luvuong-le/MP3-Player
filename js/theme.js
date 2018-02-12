let themes = {
    e: {
        themesOptions: document.getElementById("mp__options-theme-options"),  
        mpCont: document.getElementById("mp"),
    },
    
    themeSelectListener: function(e) {
        this.e.themesOptions.addEventListener("change", (e) => {
            localStorage.setItem("currentThemeValue", this.e.themesOptions.value);
            switch(this.e.themesOptions.value) {
                case "default": 
                    this.updateTheme("mp");
                    break;
                case "light": 
                    this.updateTheme("mp--light");
                    break;
                case "materialistic":
                    this.updateTheme("mp--materialistic");
                    break;
                case "black-red":
                    this.updateTheme("mp--black-red");
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
        localStorage.setItem("currentTheme", themeName);
    },

    displayCurrentTheme: function() {
        if (localStorage.getItem("currentTheme") != null) {
            this.updateTheme(localStorage.getItem("currentTheme"));
            // Change default theme type in select box
            this.changeSelectDefault();
        }
    },

    removeSelectedDefault: function() {
        for (let option of this.e.themesOptions) {
            option.selected = false;
        } 
    },

    changeSelectDefault: function() {
        this.removeSelectedDefault();
        
        for (let option of this.e.themesOptions) {
            if (option.value == localStorage.getItem("currentThemeValue")) {
                option.selected = true;
            }
        }
    },

    init: function() {
        this.themeSelectListener();
        this.e.themesOptions.value = this.e.themesOptions[0].value;

        // Set the current theme in the local storage
        this.displayCurrentTheme();
    }
};

themes.init();