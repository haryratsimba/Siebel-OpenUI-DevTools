import SiebControlWrapper from './siebcontrolwrapper';

export default class SiebAppletWrapper {

    static wrap(siebAppApplet) {
        let wrapper = new SiebAppletWrapper();

        wrapper.id = siebAppApplet.GetId();
        wrapper.fullId = siebAppApplet.GetFullId();
        wrapper.name = siebAppApplet.GetName();
        wrapper.recordSet = siebAppApplet.GetRecordSet();

        wrapper.controls = {};
        for(let [name, siebControl] of Object.entries(siebAppApplet.GetControls())) {
            let control = SiebControlWrapper.wrap(siebControl);
            wrapper.controls[name] = control;
        }

        return wrapper;
    }

    getId() {
        return this.id;
    }

    getFullId() {
        return this.fullId;
    }

    getName() {
        return this.name;
    }

    getControls() {
        return Object.values(this.controls);
    }

    getControl(controlName) {
        return this.controls[controlName];
    }

    getRecordSet() {
        return this.recordSet;
    }
}
