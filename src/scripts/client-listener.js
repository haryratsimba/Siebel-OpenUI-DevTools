(function () {
'use strict';

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





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
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

var SiebControlWrapper = function () {
    function SiebControlWrapper() {
        classCallCheck(this, SiebControlWrapper);
    }

    createClass(SiebControlWrapper, [{
        key: "getCSSSelector",


        /**
         * CSS selector which allow to target the control HTML element (ex : [name=controlName], #controlID)
         */
        value: function getCSSSelector() {
            this.cssSelector;
        }
    }, {
        key: "getName",
        value: function getName() {
            this.name;
        }
    }, {
        key: "getDisplayName",
        value: function getDisplayName() {
            return this.displayName;
        }
    }, {
        key: "getInputName",
        value: function getInputName() {
            return this.inputName;
        }
    }, {
        key: "getFieldName",
        value: function getFieldName() {
            return this.fieldName;
        }
    }], [{
        key: "wrap",
        value: function wrap(siebAppControl) {
            var wrapper = new SiebControlWrapper();

            wrapper.name = siebAppControl.GetName();
            wrapper.displayName = siebAppControl.GetDisplayName();
            wrapper.inputName = siebAppControl.GetInputName();
            wrapper.fieldName = siebAppControl.GetFieldName();

            wrapper.cssSelector = "[name=\"" + wrapper.inputName + "\"], [aria-label=\"" + wrapper.displayName + "\"]";

            return wrapper;
        }
    }]);
    return SiebControlWrapper;
}();

var SiebAppletWrapper = function () {
    function SiebAppletWrapper() {
        classCallCheck(this, SiebAppletWrapper);
    }

    createClass(SiebAppletWrapper, [{
        key: 'getId',
        value: function getId() {
            return this.id;
        }
    }, {
        key: 'getFullId',
        value: function getFullId() {
            return this.fullId;
        }
    }, {
        key: 'getName',
        value: function getName() {
            return this.name;
        }
    }, {
        key: 'getControls',
        value: function getControls() {
            return Object.values(this.controls);
        }
    }, {
        key: 'getControl',
        value: function getControl(controlName) {
            return this.controls[controlName];
        }
    }, {
        key: 'getRecordSet',
        value: function getRecordSet() {
            return this.recordSet;
        }
    }], [{
        key: 'wrap',
        value: function wrap(siebAppApplet) {
            var wrapper = new SiebAppletWrapper();

            wrapper.id = siebAppApplet.GetId();
            wrapper.fullId = siebAppApplet.GetFullId();
            wrapper.name = siebAppApplet.GetName();
            wrapper.recordSet = siebAppApplet.GetRecordSet();

            wrapper.controls = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(siebAppApplet.GetControls())[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = slicedToArray(_step.value, 2),
                        name = _step$value[0],
                        siebControl = _step$value[1];

                    var control = SiebControlWrapper.wrap(siebControl);
                    wrapper.controls[name] = control;
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

            return wrapper;
        }
    }]);
    return SiebAppletWrapper;
}();

var SiebViewWrapper = function () {
    function SiebViewWrapper() {
        classCallCheck(this, SiebViewWrapper);
    }

    createClass(SiebViewWrapper, [{
        key: 'getName',
        value: function getName() {
            return this.name;
        }
    }, {
        key: 'getApplets',
        value: function getApplets() {
            Object.values(this.applets);
        }
    }, {
        key: 'getApplet',
        value: function getApplet(appletName) {
            this.applets[appletName];
        }
    }], [{
        key: 'wrap',


        /**
         * Construct a wrapper around the SiebelApp.S_App.View object.
         * @param {object} siebAppView must be an instance of SiebelApp.S_App.View
         *
         * @return {object} siebAppView wrapper.
         */
        value: function wrap(siebAppView) {
            var wrapper = new SiebViewWrapper();

            wrapper.name = siebAppView.GetName();
            wrapper.applets = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(siebAppView.GetAppletMap())[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = slicedToArray(_step.value, 2),
                        name = _step$value[0],
                        siebApplet = _step$value[1];

                    var applet = SiebAppletWrapper.wrap(siebApplet);
                    wrapper.applets[name] = applet;
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

            return wrapper;
        }
    }]);
    return SiebViewWrapper;
}();

var ClientListener = new function () {

    /**
     * Number of attempt to test if the SiebelApp is on the global context, before loading the extension.
     */
    var MAX_LOADING_ATTEMPT = 5;

    /**
     * Delay in ms between each attempt loading.
     */
    var ATTEMPT_LOADING_INTERVAL = 500;

    /**
     * Element selector on which a custom event will be sent.
     * Injected script and content script communicate through DOM events as their share the same DOM access.
     */
    var MESSAGING_EVENT_TARGET_SELECTOR = '#_sweview';

    /**
     * Element which will be observed in order to detect view changes.
     */
    var SIEB_DOM_OBSERVABLE_SELECTOR = '#_sweview';

    // Because the content script has no access to page global variables, this script is injected
    // to get the Siebel global variable and pass it as an DOM event since content page and script share the DOM access.
    this.initialize = function () {
        var _this = this;

        window.addEventListener('load', function () {
            _this.listenToSiebelLoad();
            _this.listenToSWEViewUpdate();
        });
    };

    this.listenToSiebelLoad = async function () {
        try {
            var activeView = await getSiebelApp();

            this.sendEventToContentScript(activeView);
        } catch (e) {
            console.log(e);
        }
    };

    this.listenToSWEViewUpdate = async function () {
        var _this2 = this;

        var observer = new MutationObserver(async function (mutations) {
            console.log('swe DOM has changed');

            var activeView = await getSiebelApp();
            _this2.sendEventToContentScript(activeView);
        });

        var sweDOM = await getSWEDOM();
        observer.observe(sweDOM, {
            attributes: true,
            childList: true
        });
    };

    this.sendEventToContentScript = function (data) {
        var clientEvent = new CustomEvent('onSiebAppLoaded', {
            detail: data
        });

        document.querySelector(MESSAGING_EVENT_TARGET_SELECTOR).dispatchEvent(clientEvent);
    };

    this.initialize();

    function getSiebelApp() {
        return new Promise(function (resolve, reject) {
            var id = setInterval(function () {
                var loadingAttempt = 0;
                var activeView = 'SiebelApp' in window && SiebelApp.S_App.GetActiveView();

                if (loadingAttempt++ > MAX_LOADING_ATTEMPT) {
                    reject(Error("Couldn't retrive SiebelApp object"));
                } else if (activeView) {
                    clearInterval(id);
                    resolve(SiebViewWrapper.wrap(activeView));
                }
            }, ATTEMPT_LOADING_INTERVAL);
        });
    }

    function getSWEDOM() {
        return new Promise(function (resolve, reject) {
            var id = setInterval(function () {
                var loadingAttempt = 0;
                var sweElement = document.querySelector(SIEB_DOM_OBSERVABLE_SELECTOR);

                if (loadingAttempt++ > MAX_LOADING_ATTEMPT) {
                    reject(Error('Couldnt retrive ' + SIEB_DOM_OBSERVABLE_SELECTOR));
                } else if (sweElement) {
                    clearInterval(id);
                    resolve(sweElement);
                }
            }, ATTEMPT_LOADING_INTERVAL);
        });
    }
}();

}());

//# sourceMappingURL=client-listener.js.map
