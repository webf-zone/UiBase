'use strict';

var uibase = require('uibase');

var Button = uibase.createView({

    config: {
        text: {
            optional: true,
            default: ''
        },
        disabled: {
            optional: true,
            default: false
        }
    },

    components: {
        root: {
            type: uibase.HtmlElement,
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
