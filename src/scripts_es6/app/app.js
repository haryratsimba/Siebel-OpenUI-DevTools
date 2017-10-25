/**
 * This file will be bundled with components dependency into an app.js file which will be included into the panel HTML file.
 */

import App from './components/App.vue';

// Export the panel app into the global window, to be accessible from the devtools script
window.PanelApp = new(function() {

    /**
     * Create the panel using Vue.js and the siebel object.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     */
    this.createPanelApp = function(siebelApp) {
        // Keep the siebel object
        this.siebelApp = siebelApp;

        this.panelAppVm = new Vue({
            el: '#app',
            components: {
                App
            },
            // Pass to the app component using the component sieb prop
            template: '<app :sieb="siebApp"></app>',
            data: {
                siebApp: {
                    viewName: siebelApp.name,
                    applets: siebelApp.applets
                }
            }
        });

        return this.panelAppVm;
    };


    /**
     * Update the panel by updating the existing Vue instance.
     *
     * @param  {object} siebelApp an instance of wrappers/SiebViewWrapper.
     */
    this.updatePanelApp = function(siebelApp) {
        this.siebelApp = siebelApp;

        this.panelAppVm.siebApp.viewName = siebelApp.name;
        this.panelAppVm.siebApp.applets = siebelApp.applets;
    };


    /**
     * Return true if a siebelApp object already exists and is used to display the panel.
     *
     * @return {object} true if a siebelApp object already exists and is used to display the panel.
     */
    this.isViewAppExists = function() {
        return this.siebelApp != undefined;
    };

    /**
     * Return true if the siebelApp object in parameter is different than the one used to create the panel.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     * @return {boolean} true if the siebelApp object in parameter is different than the one used to create the panel.
     */
    this.isAnotherViewApp = function(siebelApp) {
        return !this.siebelApp || siebelApp.name != this.siebelApp.name;
    };

})();
