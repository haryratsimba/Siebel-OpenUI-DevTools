// Export the panel app into the global window, to be accessible from the devtools script
window.PanelApp = new(function() {

    /**
     * Create the panel using Vue.js and the siebel object.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     */
    this.createPanelApp = function(siebelApp) {
        // Keep the siebel object
        this.siebelApp = siebelApp;

        if (!this.panelAppVm) {
            this.panelAppVm = new Vue({
                el: '#app',
                data: populateModel({}, siebelApp),
                methods: {
                    displayAppletControls(applet) {
                        this.controls = applet.controls;
                        this.recordSet = JSON.stringify(applet.recordSet, null, 2);
                    },
                    inspectApplet(applet) {
                        chrome.devtools.inspectedWindow.eval(`inspect($("#${applet.fullId}"))`, {
                            useContentScriptContext: true
                        });
                    },
                    inspectControl(control) {
                        // Try to get the input by its name first, then by its label
                        chrome.devtools.inspectedWindow.eval(`inspect($('${control.cssSelectors.inputName}'))`, {
                            useContentScriptContext: true
                        }, (result, isException) => {
                            if (isException) {
                                chrome.devtools.inspectedWindow.eval(`inspect($('${control.cssSelectors.fieldName}'))`, {
                                    useContentScriptContext: true
                                });
                            }
                        });
                    }
                },
                computed: {
                    appExists() {
                        return typeof this.viewName != 'undefined';
                    },
                    filteredApplets() {
                        let filtered = [];
                        for (let [appletName, applet] of Object.entries(this.applets)) {
                            if (applet.fullId.toUpperCase().includes(this.appletQuery.toUpperCase())) {
                                filtered.push(applet);
                            }
                        }
                        return filtered;
                    },
                    filteredControls() {
                        let filtered = [];
                        if (this.controlQuery.trim().length > 0) {
                            for (let [controlName, control] of Object.entries(this.controls)) {
                                if ((control.inputName.toUpperCase() + control.displayName.toUpperCase()).includes(this.controlQuery.toUpperCase())) {
                                    filtered.push(control);
                                }
                            }
                        } else if (this.controls) {
                            filtered = Object.values(this.controls);
                        }
                        return filtered;
                    }
                },
                watch: {
                    recordSet: function(val) {
                        let panel = document.querySelector('#record-set-panel pre code');
                        panel.innerHTML = val;
                        this.$nextTick(() => Prism.highlightElement(panel));
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
        model.appletQuery = '';
        model.controlQuery = '';

        return model;
    }

})();
