"use strict";

// https://developer.chrome.com/extensions/devtools
// https://github.com/Maluen/Backbone-Debugger/blob/master/js/background.js

/*
  NB : The background is shared between the browser tabs, therefore it
 identifies the various panel communication ports by using the id of the
 tab they belong to.

 Connexions mapping contains for each tab id called connection :
    - port:             The port, which enable communication between devtools and background script
    - cachedSiebelApp:  The SiebelApp cached object associated with the current tab
*/
var connexionManager = {};

// Listen for a connection creation from devtools and save this connection
chrome.runtime.onConnect.addListener(function (port) {

    var onDevToolsConnectionListener = function onDevToolsConnectionListener(message, sender, sendResponse) {
        // The tab ID is provided in Devtools message because the background page has no tab access
        if (message.name === "initConnection" && message.tabId != null) {
            if (!connexionManager[message.tabId]) {
                connexionManager[message.tabId] = {};
            }

            // Update the port. The connection may have been already created if a cached siebel app
            // was emitted from the content-script
            connexionManager[message.tabId].port = port;

            return;
        }
    };

    // Listen to connection message sent from the DevTools page, then save the connection
    port.onMessage.addListener(onDevToolsConnectionListener);

    port.onDisconnect.addListener(function (port) {
        port.onMessage.removeListener(onDevToolsConnectionListener);

        var tabs = Object.keys(connexionManager);
        for (var i = 0; i < tabs.length; i++) {
            if (connexionManager[tabs[i]].port == port) {
                delete connexionManager[tabs[i]];
                break;
            }
        }
    });
});

// Listen for content-script messages
chrome.runtime.onMessage.addListener(function (siebelApp, sender) {
    if (sender.tab) {
        var tabId = sender.tab.id;

        if (!connexionManager[tabId]) {
            connexionManager[tabId] = {};
        }

        connexionManager[tabId].cachedSiebelApp = siebelApp;

        if (connexionManager[tabId].port) {
            connexionManager[tabId].port.postMessage(request);
        } else {
            console.log("Devtools port is not initialize yet");
        }
    } else {
        console.log('sender.tab not defined');
    }
});