<template>
    <div id="app">
        <template v-if="appExists">
            <div class="container devtools-container">
                <div class="row">
                    <div class="col devtools-panel">
                        <div class="devtools-subpanel">
                            <div class="panel-header">
                                <h2>Applets</h2>
                            </div>
                            <div>
                                <input type="text" v-model="appletQuery" class="form-control" placeholder="Search by id, eg: S_A1">
                                <div>
                                    <app-collapse-group>
                                        <app-collapse-item v-for="applet in filteredApplets" :summary="applet.name">
                                            <ul>
                                                <li>FullId : <span class="badge badge-primary">#{{applet.fullId}}</span></li>
                                                <li><a href="#" @click="displayAppletControls(applet)"><span class="oi oi-list"></span> See controls</a></li>
                                                <li><a href="#" @click="inspectApplet(applet)"><span class="oi oi-magnifying-glass"></span>&nbsp;Inspect</a></li>
                                            </ul>
                                        </app-collapse-item>
                                    </app-collapse-group>
                                </div>
                            </div>
                        </div>
                        <div class="devtools-subpanel">
                            <div class="jumbotron">
                                <h1 class="display-4">{{viewName}}</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col devtools-panel">
                        <div class="devtools-subpanel">
                            <div class="panel-header">
                                <h2>Controls</h2>
                            </div>
                            <div v-show="controls">
                                <input type="text" v-model="controlQuery" class="form-control" placeholder="Search by inputName or label, eg: s_1_1_1_0">
                                <div>
                                    <app-collapse-group>
                                        <app-collapse-item v-for="control in filteredControls" :summary="control.name">
                                            <ul>
                                                <li>Input name : <span class="badge badge-secondary">{{control.inputName}}</span></li>
                                                <li>Display name : <span class="badge badge-secondary">{{control.displayName}}</span></li>
                                                <li><a href="#" @click="inspectControl(control)"><span class="oi oi-magnifying-glass"></span>&nbsp;Inspect</a></li>
                                            </ul>
                                        </app-collapse-item>
                                    </app-collapse-group>
                                </div>
                            </div>
                        </div>
                        <div class="devtools-subpanel">
                            <div class="panel-header">
                                <h2>Record set</h2></div>
                            <div id="record-set-panel" v-show="recordSet">
                                <pre><code class="language-json">{{recordSet}}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import Collapse from './Collapse.vue';

export default Vue.component('app', {
    components: {
        Collapse
    },
    props: {
        sieb: {
            type: Object,
            default: ()=> {}
        }
    },
    data() {
        return {
            // Init data from props properties
            // and watch props changes to update component data
            viewName: this.sieb.viewName || '',
            applets: this.sieb.applets,
            controls: null,
            recordSet: null,
            appletQuery: '',
            controlQuery: ''
        };
    },
    methods: {
        displayAppletControls(applet) {
            this.controls = applet.controls;
            this.recordSet = JSON.stringify(applet.recordSet, null, 2);
        },
        inspectApplet(applet) {
            chrome.devtools.inspectedWindow.eval(`inspect($("#${applet.fullId}"))`, {
                useContentScriptContext: true
            });
        },
        inspectControl(control) {
            // Try to get the input by its name first, then by its label
            chrome.devtools.inspectedWindow.eval(`inspect($('${control.cssSelectors.inputName}'))`, {
                useContentScriptContext: true
            }, (result, isException) => {
                if (isException) {
                    chrome.devtools.inspectedWindow.eval(`inspect($('${control.cssSelectors.fieldName}'))`, {
                        useContentScriptContext: true
                    });
                }
            });
        }
    },
    computed: {
        appExists() {
            return typeof this.viewName != 'undefined';
        },
        filteredApplets() {
            let filtered = [];
            for (let [appletName, applet] of Object.entries(this.applets)) {
                if (applet.fullId.toUpperCase().includes(this.appletQuery.toUpperCase())) {
                    filtered.push(applet);
                }
            }
            return filtered;
        },
        filteredControls() {
            let filtered = [];
            if (this.controlQuery.trim().length > 0) {
                for (let [controlName, control] of Object.entries(this.controls)) {
                    if ((control.inputName.toUpperCase() + control.displayName.toUpperCase()).includes(this.controlQuery.toUpperCase())) {
                        filtered.push(control);
                    }
                }
            } else if (this.controls) {
                filtered = Object.values(this.controls);
            }
            return filtered;
        }
    },
    watch: {
        // Watch for sieb prop change to update component data
        // as the template rendering is based on component data and not props
        sieb: {
            handler() {
                this.viewName = this.sieb.viewName;
                this.applets = this.sieb.applets;
                this.controls = null;
                this.recordSet = null;
            },
            deep: true
        },
        recordSet(val) {
            let panel = document.querySelector('#record-set-panel pre code');
            panel.innerHTML = val;
            this.$nextTick(() => Prism.highlightElement(panel));
        }
    }
});
</script>
