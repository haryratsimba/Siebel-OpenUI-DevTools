/**
 * Panel window.
 */
let panelWindow;

/**
 * Panel connection with background-script.
 */
let backgroundPageConnection = chrome.runtime.connect({
    name: "panel"
});

chrome.devtools.panels.create('Siebel OpenUI', 'img/icon128.png', 'panel.html', panel => {
    // Keep the panel window instance when the devtools tab has focused
    panel.onShown.addListener(pwindow => {
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

backgroundPageConnection.onMessage.addListener(function(cachedSiebelApp) {
    console.log(cachedSiebelApp);

    if (panelWindow) {
        let PanelApp = panelWindow.PanelApp;
        if (PanelApp.isAnotherViewApp(cachedSiebelApp)) {
            PanelApp.createPanelApp(cachedSiebelApp);
        }
    }
});
