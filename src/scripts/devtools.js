'use strict';

// Create the custom devtools panel
chrome.devtools.panels.create('Siebel OpenUI', 'img/devtools.png', 'panel.html');

var backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

backgroundPageConnection.postMessage({
    name: 'initConnection',
    tabId: chrome.devtools.inspectedWindow.tabId
});