'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _siebappletwrapper = require('./siebappletwrapper');

var _siebappletwrapper2 = _interopRequireDefault(_siebappletwrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SiebViewWrapper = function () {
    function SiebViewWrapper() {
        _classCallCheck(this, SiebViewWrapper);
    }

    _createClass(SiebViewWrapper, [{
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
                    var _step$value = _slicedToArray(_step.value, 2),
                        name = _step$value[0],
                        siebApplet = _step$value[1];

                    var applet = _siebappletwrapper2.default.wrap(siebApplet);
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

exports.default = SiebViewWrapper;
;