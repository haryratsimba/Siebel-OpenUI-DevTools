<template>
    <div class="app-collapse-group">
        <slot></slot>
    </div>
</template>

<script>
    /**
     * Custom component which act as a container element for the <app-collapse-item>
     * component, to display only one component item detail at a time (and collapse other components).
     */
    export default Vue.component('app-collapse-group', {
        components: {
            CollapseItem
        },
        data() {
            // Shared event bus as child components are included using slots
            return {
                eventBus: new Vue()
            };
        },
        created() {
            this.eventBus.$on('item-toggle', el=> {
                this.eventBus.$emit('items-collapse', el);
            });
        }
    });

    /**
     * <app-collapse-item> is used to display an item whose content could be
     * collapsed. It is used along with <app-collapse-group> as a child component
     * if only one item must be displayed each time. Its behavior is similar to the HTML <details> element.
     */
    const CollapseItem = Vue.component('app-collapse-item', {
        props: {
            summary: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                isOpen: false
            };
        },
        template: `
        <div class="app-collapse-item">
            <div class="item-summary"><a href="#" @click="onSummaryClick">{{summary}}</a></div>
            <div v-show="isOpen" class="item-detail">
                <slot></slot>
            </div>
        </div>
        `,
        created() {
            this.$parent.eventBus.$on('items-collapse', el=> {
                // When an item has been toggle, close other components
                if(!(this.$el === el)) {
                    this.isOpen = false;
                }
            });
        },
        methods: {
            onSummaryClick() {
                // Emit an event to parent component with the toggle HTML element
                this.isOpen = !this.isOpen;
                if(this.isOpen) {
                    this.$parent.eventBus.$emit('item-toggle', this.$el);
                }
            }
        }
    });
</script>
