import SiebViewWrapper from './models/SiebViewWrapper';

const ClientListener = new(function() {

    /**
     * Number of attempt to test if the SiebelApp is on the global context, before loading the extension.
     */
    const MAX_LOADING_ATTEMPT = 5;

    /**
     * Delay in ms between each attempt loading.
     */
    const ATTEMPT_LOADING_INTERVAL = 500;

    /**
     * Element selector on which a custom event will be sent.
     * Injected script and content script communicate through DOM events as their share the same DOM access.
     */
    const MESSAGING_EVENT_TARGET_SELECTOR = '#_sweview';

    /**
     * Element which will be observed in order to detect view changes.
     */
    const SIEB_DOM_OBSERVABLE_SELECTOR = '#_sweview';

    // Because the content script has no access to page global variables, this script is injected
    // to get the Siebel global variable and pass it as an DOM event since content page and script share the DOM access.
    this.initialize = function() {
        window.addEventListener('load', () => {
            this.listenForSiebelLoad();
            this.listenForSWEViewUpdate();
        });
    }

    this.listenForSiebelLoad = async function() {
        try {
            let activeView = await getSiebelApp();

            this.sendEventToContentScript(activeView);
        } catch (e) {
            console.log(e);
        }
    };

    this.listenForSWEViewUpdate = async function() {
        let observer = new MutationObserver(async mutations => {
            console.log('swe DOM has changed');

            let activeView = await getSiebelApp();
            this.sendEventToContentScript(activeView);
        });

        let sweDOM = await getSWEDOM();
        observer.observe(sweDOM, {
            attributes: true,
            childList: true
        });
    };

    this.sendEventToContentScript = function(data) {
        let clientEvent = new CustomEvent('onSiebAppLoaded', {
            detail: data
        });

        document.querySelector(MESSAGING_EVENT_TARGET_SELECTOR).dispatchEvent(clientEvent);
    };

    this.initialize();

    function getSiebelApp() {
        return new Promise((resolve, reject) => {
            let id = setInterval(() => {
                let loadingAttempt = 0;
                let activeView = 'SiebelApp' in window && SiebelApp.S_App.GetActiveView();

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
        return new Promise((resolve, reject) => {
            let id = setInterval(() => {
                let loadingAttempt = 0;
                let sweElement = document.querySelector(SIEB_DOM_OBSERVABLE_SELECTOR);

                if (loadingAttempt++ > MAX_LOADING_ATTEMPT) {
                    reject(Error('Couldnt retrive ' + SIEB_DOM_OBSERVABLE_SELECTOR));
                } else if (sweElement) {
                    clearInterval(id);
                    resolve(sweElement);
                }
            }, ATTEMPT_LOADING_INTERVAL);
        });
    }

})();
