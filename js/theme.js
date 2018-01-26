let themes = {
    e: {
        themesOptions: document.getElementById("mp__options-theme-options"),  
        mpCont: document.getElementById("mp"),
    },
    
    themeSelectListener: (e) => {
        themeElements().themesOptions.addEventListener("change", (e) => {
            switch(themeElements().themesOptions.value) {
                case "default": 
                    themes.updateTheme("mp");
                    break;
                case "dark": 
                    themes.updateTheme("mp--dark");
                    break;
                case "light": 
                    themes.updateTheme("mp--light");
                    break;
                case "materialistic":
                    themes.updateTheme("mp--materialistic");
                    break;
                default: 
                    console.log("error");
            }
        });
    },

    updateTheme: (theme) => {
        themes.removeAllClasses();
        themes.changeTheme(theme);
    },

    removeAllClasses: () => {
        while (themeElements().mpCont.classList.length > 0) {
            themeElements().mpCont.classList.remove(themeElements().mpCont.classList.item(0));
        }
    },

    changeTheme: (themeName) => {
        themeElements().mpCont.classList.add("mp");
        themeElements().mpCont.classList.add(themeName);
    },

    init: () => {
        themes.themeSelectListener();
        themeElements().themesOptions.value = themeElements().themesOptions[0].value;
    }
};

themes.init();

function themeElements() {
    return themes.e;
}