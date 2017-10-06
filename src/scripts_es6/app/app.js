// Export the panel app into the global window, to be accessible from the devtools script
window.PanelApp = new(function() {

    /**
     * Create the panel using Vue.js and the siebel object.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     */
    this.createPanelApp = function(siebelApp) {
        // Keep the siebel object
        this.siebelApp = siebelApp;

        if(!this.panelAppVm) {
            this.panelAppVm = new Vue({
                el: '#app',
                data: populateModel({}, siebelApp),
                methods: {
                    displayAppletControls(applet) {
                        this.controls = applet.controls;
                        this.recordSet = JSON.stringify(applet.recordSet, null, 2);
                    }
                },
                computed: {
                    appExists() {
                        return typeof this.viewName != 'undefined';
                    }
                }
            });
        } else {
            populateModel(this.panelAppVm, siebelApp);
        }

        return this.panelAppVm;
    };

    /**
     * Return true if the siebelApp object in parameter is different than the one used to create the panel.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     * @return {boolean} true if the siebelApp object in parameter is different than the one used to create the panel.
     */
    this.isAnotherViewApp = function(siebelApp) {
        return !this.siebelApp || siebelApp.name != this.siebelApp.name;
    };

    function populateModel(model, siebelApp) {
        model.viewName = siebelApp.name;
        model.applets = siebelApp.applets;
        model.controls = null;
        model.recordSet = null;

        return model;
    }

})();
