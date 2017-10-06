'use strict';

/**
 * Panel window.
 */
var panelWindow = void 0;

/**
 * Panel connection with background-script.
 */
var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

chrome.devtools.panels.create('Siebel OpenUI', 'img/devtools.png', 'panel.html', function (panel) {
    // Keep the panel window instance when the devtools tab has focused
    panel.onShown.addListener(function (pwindow) {
        // When the panel has focused, request the SiebelApp cached object to update the view
        // as we have now access to the panel window instance
        backgroundPageConnection.postMessage({
            name: 'requestSiebelAppInstance',
            tabId: chrome.devtools.inspectedWindow.tabId
        });

        panelWindow = pwindow;
    });
});

backgroundPageConnection.postMessage({
    name: 'initConnection',
    tabId: chrome.devtools.inspectedWindow.tabId
});

backgroundPageConnection.onMessage.addListener(function (message) {
    console.log(message);

    if (panelWindow) {
        // Panel global variable defined in panel.js
        console.log(panelWindow.globalVariable);

        var div = panelWindow.document.createElement('div');
        div.innerHTML = JSON.stringify(message);
        panelWindow.document.body.appendChild(div);
    }
});