'use strict';

// Export the panel app into the global window, to be accessible from the devtools script
window.PanelApp = new function () {

    /**
     * Create the panel using Vue.js and the siebel object.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     */
    this.createPanelApp = function (siebelApp) {
        // Keep the siebel object
        this.siebelApp = siebelApp;

        this.panelApp = new Vue({
            el: '#app',
            data: {
                viewName: siebelApp.name,
                applets: siebelApp.applets,
                controls: siebelApp.controls,
                recordSet: siebelApp.recordSet
            }
        });

        return this.panelApp;
    };

    /**
     * Return true if the siebelApp object in parameter is different than the one used to create the panel.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     * @return {boolean} true if the siebelApp object in parameter is different than the one used to create the panel.
     */
    this.isAppDifferent = function (siebelApp) {
        return !this.siebelApp || siebelApp.GetName() != this.siebelApp.GetName();
    };
}();