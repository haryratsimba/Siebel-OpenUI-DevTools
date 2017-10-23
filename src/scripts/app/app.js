'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Export the panel app into the global window, to be accessible from the devtools script
window.PanelApp = new function () {

    /**
     * Create the panel using Vue.js and the siebel object.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     */
    this.createPanelApp = function (siebelApp) {
        // Keep the siebel object
        this.siebelApp = siebelApp;

        if (!this.panelAppVm) {
            this.panelAppVm = new Vue({
                el: '#app',
                data: populateModel({}, siebelApp),
                methods: {
                    displayAppletControls: function displayAppletControls(applet) {
                        this.controls = applet.controls;
                        this.recordSet = JSON.stringify(applet.recordSet, null, 2);
                    },
                    inspectApplet: function inspectApplet(applet) {
                        chrome.devtools.inspectedWindow.eval('inspect($("#' + applet.fullId + '"))', {
                            useContentScriptContext: true
                        });
                    },
                    inspectControl: function inspectControl(control) {
                        // Try to get the input by its name first, then by its label
                        chrome.devtools.inspectedWindow.eval('inspect($(\'' + control.cssSelectors.inputName + '\'))', {
                            useContentScriptContext: true
                        }, function (result, isException) {
                            if (isException) {
                                chrome.devtools.inspectedWindow.eval('inspect($(\'' + control.cssSelectors.fieldName + '\'))', {
                                    useContentScriptContext: true
                                });
                            }
                        });
                    }
                },
                computed: {
                    appExists: function appExists() {
                        return typeof this.viewName != 'undefined';
                    },
                    filteredApplets: function filteredApplets() {
                        var filtered = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = Object.entries(this.applets)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var _step$value = _slicedToArray(_step.value, 2),
                                    appletName = _step$value[0],
                                    applet = _step$value[1];

                                if (applet.fullId.toUpperCase().includes(this.appletQuery.toUpperCase())) {
                                    filtered.push(applet);
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return filtered;
                    },
                    filteredControls: function filteredControls() {
                        var filtered = [];
                        if (this.controlQuery.trim().length > 0) {
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = Object.entries(this.controls)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var _step2$value = _slicedToArray(_step2.value, 2),
                                        controlName = _step2$value[0],
                                        control = _step2$value[1];

                                    if ((control.inputName.toUpperCase() + control.displayName.toUpperCase()).includes(this.controlQuery.toUpperCase())) {
                                        filtered.push(control);
                                    }
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
                        } else if (this.controls) {
                            filtered = Object.values(this.controls);
                        }
                        return filtered;
                    }
                },
                watch: {
                    recordSet: function recordSet(val) {
                        var panel = document.querySelector('#record-set-panel pre code');
                        panel.innerHTML = val;
                        this.$nextTick(function () {
                            return Prism.highlightElement(panel);
                        });
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
    this.isAnotherViewApp = function (siebelApp) {
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
}();