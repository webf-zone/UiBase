'use strict';

var uibase = require('uibase');

var Button = uibase.createView({

    config: {
        text: {
            optional: true,
            default: '',
            type: 'string'
        },
        disabled: {
            optional: true,
            default: false,
            type: 'boolean'
        }
    },

    components: {
        root: {
            name: uibase.HtmlElement,
            tag: 'button',
            props: {
                events: [ 'click' ]
            }
        }
    },

    inputs: {
        text: 'root.children',
        disabled: 'root.props.disabled'
    },

    outputs: {
        click: 'root.events.click'
    },

    picture: function() {
        return this.components.root;
    }
});

module.exports = Button;
