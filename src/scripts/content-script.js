'use strict';

var ContentScript = new function () {

    /**
     * Element selector on which a custom event will be sent.
     * Injected script and content script communicate through DOM events as their share the same DOM access.
     */
    var MESSAGING_EVENT_TARGET_ID = '_sweview';

    this.initialize = function () {
        this.injectScript();
        this.listenToClientListenerEvent();
    };

    /**
     * Content script has access to DOM but not to page variables.
     * It need to inject a script into the page to capture global variables.
     */
    this.injectScript = function () {
        var script = document.createElement('script');
        script.setAttribute('src', chrome.extension.getURL('scripts/client-listener.js'));
        document.body.appendChild(script);
    };

    // The injected script will trigger a custom event when SiebelApp will be loaded
    // https://stackoverflow.com/questions/21731635/chrome-extension-access-document-page-variable-from-extension
    /**
     * When a custome event will be dispatch on window, get the SiebelApp object and send it to the bg page.
     */
    this.listenToClientListenerEvent = function () {
        document.body.addEventListener('onSiebAppLoaded', function (e) {
            if (e.target.getAttribute('id') === MESSAGING_EVENT_TARGET_ID) {
                chrome.runtime.sendMessage(e.detail);
            }
        }, true);
    };

    this.initialize();
}();