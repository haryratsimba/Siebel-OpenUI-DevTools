(function () {
'use strict';

/**
 * Custom component which act as a container element for the <app-collapse-item>
 * component, to display only one component item detail at a time (and collapse other components).
 */
var Collapse = Vue.component('app-collapse-group', { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "app-collapse-group" }, [_vm._t("default")], 2);
    }, staticRenderFns: [],
    components: {
        CollapseItem: CollapseItem
    },
    data: function data() {
        // Shared event bus as child components are included using slots
        return {
            eventBus: new Vue()
        };
    },
    created: function created() {
        var _this = this;

        this.eventBus.$on('item-toggle', function (el) {
            _this.eventBus.$emit('items-collapse', el);
        });
    }
});

/**
 * <app-collapse-item> is used to display an item whose content could be
 * collapsed. It is used along with <app-collapse-group> as a child component
 * if only one item must be displayed each time. Its behavior is similar to the HTML <details> element.
 */
var CollapseItem = Vue.component('app-collapse-item', {
    props: {
        summary: {
            type: String,
            required: true
        }
    },
    data: function data() {
        return {
            isOpen: false
        };
    },

    template: '\n    <div class="app-collapse-item">\n        <div class="item-summary"><a href="#" @click="onSummaryClick">{{summary}}</a></div>\n        <div v-show="isOpen" class="item-detail">\n            <slot></slot>\n        </div>\n    </div>\n    ',
    created: function created() {
        var _this2 = this;

        this.$parent.eventBus.$on('items-collapse', function (el) {
            // When an item has been toggle, close other components
            if (!(_this2.$el === el)) {
                _this2.isOpen = false;
            }
        });
    },

    methods: {
        onSummaryClick: function onSummaryClick() {
            // Emit an event to parent component with the toggle HTML element
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.$parent.eventBus.$emit('item-toggle', this.$el);
            }
        }
    }
});

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();



































var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var App = Vue.component('app', { render: function render() {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { attrs: { "id": "app" } }, [_vm.appExists ? [_c('div', { staticClass: "container devtools-container" }, [_c('div', { staticClass: "row" }, [_c('div', { staticClass: "col devtools-panel" }, [_c('div', { staticClass: "devtools-subpanel" }, [_c('div', { staticClass: "h-100" }, [_vm._m(0), _vm._v(" "), _c('div', { staticClass: "h-75" }, [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.appletQuery, expression: "appletQuery" }], staticClass: "form-control", attrs: { "type": "text", "placeholder": "Search by id, eg: S_A1" }, domProps: { "value": _vm.appletQuery }, on: { "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.appletQuery = $event.target.value;
                } } }), _vm._v(" "), _c('app-collapse-group', { staticClass: "h-100" }, _vm._l(_vm.filteredApplets, function (applet) {
            return _c('app-collapse-item', { attrs: { "summary": applet.name } }, [_c('ul', [_c('li', [_vm._v("FullId : "), _c('span', { staticClass: "badge badge-primary" }, [_vm._v("#" + _vm._s(applet.fullId))])]), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "#" }, on: { "click": function click($event) {
                        _vm.displayAppletControls(applet);
                    } } }, [_c('span', { staticClass: "oi oi-list" }), _vm._v(" See controls")])]), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "#" }, on: { "click": function click($event) {
                        _vm.inspectApplet(applet);
                    } } }, [_c('span', { staticClass: "oi oi-magnifying-glass" }), _vm._v(" Inspect")])])])]);
        }))], 1)])]), _vm._v(" "), _c('div', { staticClass: "devtools-subpanel" }, [_c('div', { staticClass: "jumbotron" }, [_c('h1', { staticClass: "display-4" }, [_vm._v(_vm._s(_vm.viewName))])])])]), _vm._v(" "), _c('div', { staticClass: "col devtools-panel" }, [_c('div', { staticClass: "devtools-subpanel" }, [_c('div', { staticClass: "h-100" }, [_vm._m(1), _vm._v(" "), _c('div', { directives: [{ name: "show", rawName: "v-show", value: _vm.controls, expression: "controls" }], staticClass: "h-75" }, [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.controlQuery, expression: "controlQuery" }], staticClass: "form-control", attrs: { "type": "text", "placeholder": "Search by inputName or label, eg: s_1_1_1_0" }, domProps: { "value": _vm.controlQuery }, on: { "input": function input($event) {
                    if ($event.target.composing) {
                        return;
                    }_vm.controlQuery = $event.target.value;
                } } }), _vm._v(" "), _c('app-collapse-group', { staticClass: "h-100" }, _vm._l(_vm.filteredControls, function (control) {
            return _c('app-collapse-item', { attrs: { "summary": control.name } }, [_c('ul', [_c('li', [_vm._v("Input name : "), _c('span', { staticClass: "badge badge-secondary" }, [_vm._v(_vm._s(control.inputName))])]), _vm._v(" "), _c('li', [_vm._v("Display name : "), _c('span', { staticClass: "badge badge-secondary" }, [_vm._v(_vm._s(control.displayName))])]), _vm._v(" "), _c('li', [_c('a', { attrs: { "href": "#" }, on: { "click": function click($event) {
                        _vm.inspectControl(control);
                    } } }, [_c('span', { staticClass: "oi oi-magnifying-glass" }), _vm._v(" Inspect")])])])]);
        }))], 1)])]), _vm._v(" "), _c('div', { staticClass: "devtools-subpanel" }, [_vm._m(2), _vm._v(" "), _c('div', { directives: [{ name: "show", rawName: "v-show", value: _vm.recordSet, expression: "recordSet" }], staticClass: "h-75", attrs: { "id": "record-set-panel" } }, [_c('pre', [_c('code', { staticClass: "language-json" }, [_vm._v(_vm._s(_vm.recordSet))])])])])])])])] : _vm._e()], 2);
    }, staticRenderFns: [function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "panel-header" }, [_c('h2', [_vm._v("Applets")])]);
    }, function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "panel-header" }, [_c('h2', [_vm._v("Controls")])]);
    }, function () {
        var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "panel-header" }, [_c('h2', [_vm._v("Record set")])]);
    }],
    components: {
        Collapse: Collapse
    },
    props: {
        sieb: {
            type: Object,
            default: function _default() {}
        }
    },
    data: function data() {
        return {
            // Init data from props properties
            // and watch props changes to update component data
            viewName: this.sieb.viewName || '',
            applets: this.sieb.applets,
            controls: null,
            recordSet: null,
            appletQuery: '',
            controlQuery: ''
        };
    },

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
                    var _step$value = slicedToArray(_step.value, 2),
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
                        var _step2$value = slicedToArray(_step2.value, 2),
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
        // Watch for sieb prop change to update component data
        // as the template rendering is based on component data and not props
        sieb: {
            handler: function handler() {
                this.viewName = this.sieb.viewName;
                this.applets = this.sieb.applets;
                this.controls = null;
                this.recordSet = null;
            },

            deep: true
        },
        recordSet: function recordSet(val) {
            var panel = document.querySelector('#record-set-panel pre code');
            panel.innerHTML = val;
            this.$nextTick(function () {
                return Prism.highlightElement(panel);
            });
        }
    }
});

/**
 * This file will be bundled with components dependency into an app.js file which will be included into the panel HTML file.
 */

// Export the panel app into the global window, to be accessible from the devtools script
window.PanelApp = new function () {

    /**
     * Create the panel using Vue.js and the siebel object.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     */
    this.createPanelApp = function (siebelApp) {
        // Keep the siebel object
        this.siebelApp = siebelApp;

        this.panelAppVm = new Vue({
            el: '#app',
            components: {
                App: App
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
    this.updatePanelApp = function (siebelApp) {
        this.siebelApp = siebelApp;

        this.panelAppVm.siebApp.viewName = siebelApp.name;
        this.panelAppVm.siebApp.applets = siebelApp.applets;
    };

    /**
     * Return true if a siebelApp object already exists and is used to display the panel.
     *
     * @return {object} true if a siebelApp object already exists and is used to display the panel.
     */
    this.isViewAppExists = function () {
        return this.siebelApp != undefined;
    };

    /**
     * Return true if the siebelApp object in parameter is different than the one used to create the panel.
     * @param {object} siebelApp an instance of wrappers/SiebViewWrapper.
     * @return {boolean} true if the siebelApp object in parameter is different than the one used to create the panel.
     */
    this.isAnotherViewApp = function (siebelApp) {
        return !this.siebelApp || siebelApp.name != this.siebelApp.name;
    };
}();

}());
