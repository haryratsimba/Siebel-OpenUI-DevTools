import SiebAppletWrapper from './SiebAppletWrapper';

export default class SiebViewWrapper {

    /**
     * Construct a wrapper around the SiebelApp.S_App.View object.
     * @param {object} siebAppView must be an instance of SiebelApp.S_App.View
     *
     * @return {object} siebAppView wrapper.
     */
    static wrap(siebAppView) {
        let wrapper = new SiebViewWrapper();

        wrapper.name = siebAppView.GetName();
        wrapper.applets = {};
        for(let [name, siebApplet] of Object.entries(siebAppView.GetAppletMap())) {
            let applet = SiebAppletWrapper.wrap(siebApplet);
            wrapper.applets[name] = applet;
        }

        return wrapper;
    }

    getName() {
        return this.name;
    }

    getApplets() {
        Object.values(this.applets);
    }

    getApplet(appletName) {
        this.applets[appletName];
    }

};
