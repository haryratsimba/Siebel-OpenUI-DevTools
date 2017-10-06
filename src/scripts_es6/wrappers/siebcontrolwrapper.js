export default class SiebControlWrapper {

    static wrap(siebAppControl) {
        let wrapper = new SiebControlWrapper();

        wrapper.name = siebAppControl.GetName();
        wrapper.displayName = siebAppControl.GetDisplayName();
        wrapper.inputName = siebAppControl.GetInputName();
        wrapper.fieldName = siebAppControl.GetFieldName();

        wrapper.cssSelector = `[name="${wrapper.inputName}"], [aria-label="${wrapper.displayName}"]`;

        return wrapper;
    }

    /**
     * CSS selector which allow to target the control HTML element (ex : [name=controlName], #controlID)
     */
    getCSSSelector() {
        this.cssSelector;
    }

    getName() {
        this.name;
    }

    getDisplayName() {
        return this.displayName;
    }

    getInputName() {
        return this.inputName;
    }

    getFieldName() {
        return this.fieldName;
    }
}
