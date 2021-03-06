/*
 The background is shared between the browser tabs, therefore it
 identifies the various panel communication ports by using the id of the
 tab they belong to.

 Connections mapping contains for each tab id called connection :
    - port:             The port, which enable communication between devtools and background-script
    - cachedSiebelApp:  The SiebelApp cached object associated with the current tab, this object is updated
    whenever the user switch to another view on client side
*/

const BackgroundScript = new(function() {

    const connectionManager = {};

    this.initialize = function() {
        this.listenToDevtoolsEvents();
        this.listenToContentScriptEvent();
    };

    this.listenToDevtoolsEvents = function() {
        // Listen for a connection creation from devtools and save this connection
        chrome.runtime.onConnect.addListener((port) => {

            let onDevToolsConnectionListener = (message, sender, sendResponse) => {
                // The tab ID is provided in Devtools message because the background page has no tab access
                if (message.tabId == null) {
                    return;
                }

                let tabID = message.tabId;
                switch (message.name) {
                    // When the devtools is open
                    case 'initConnection':
                        if (!connectionManager[tabID]) {
                            connectionManager[tabID] = {};
                        }

                        // Update the port. The connection may have been already created if a cached siebel app
                        // was emitted from the content-script
                        connectionManager[tabID].port = port;
                        break;
                    // When the devtools panel has focus
                    case 'requestSiebelAppInstance':
                        // If a Siebel app is already cached for the current tab, forward it to the new created devtools
                        let tabConnection = connectionManager[tabID];
                        if (tabConnection && tabConnection.cachedSiebelApp) {
                            tabConnection.port.postMessage(tabConnection.cachedSiebelApp);
                        }
                        break;
                }

                return;
            };

            // Listen to connection message sent from the DevTools page, then save the connection
            port.onMessage.addListener(onDevToolsConnectionListener);

            port.onDisconnect.addListener((port) => {
                port.onMessage.removeListener(onDevToolsConnectionListener);
            });
        });
    };

    this.listenToContentScriptEvent = function() {
        // Listen for content-script messages
        chrome.runtime.onMessage.addListener((siebelApp, sender) => {
            if (sender.tab) {
                let tabId = sender.tab.id;

                if (!connectionManager[tabId]) {
                    connectionManager[tabId] = {};
                }

                connectionManager[tabId].cachedSiebelApp = siebelApp;

                if (connectionManager[tabId].port) {
                    connectionManager[tabId].port.postMessage(siebelApp);
                } else {
                    console.log("Devtools port is not initialize yet");
                }
            } else {
                console.log('sender.tab not defined');
            }

        });
    };

    this.initialize();

})();
