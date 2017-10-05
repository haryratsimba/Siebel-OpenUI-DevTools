'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SiebControlWrapper = require('./SiebControlWrapper');

var _SiebControlWrapper2 = _interopRequireDefault(_SiebControlWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SiebAppletWrapper = function () {
    function SiebAppletWrapper() {
        _classCallCheck(this, SiebAppletWrapper);
    }

    _createClass(SiebAppletWrapper, [{
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
                    var _step$value = _slicedToArray(_step.value, 2),
                        name = _step$value[0],
                        siebControl = _step$value[1];

                    var control = _SiebControlWrapper2.default.wrap(siebControl);
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

exports.default = SiebAppletWrapper;