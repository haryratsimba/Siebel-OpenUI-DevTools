"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SiebControlWrapper = function () {
    function SiebControlWrapper() {
        _classCallCheck(this, SiebControlWrapper);
    }

    _createClass(SiebControlWrapper, [{
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

exports.default = SiebControlWrapper;