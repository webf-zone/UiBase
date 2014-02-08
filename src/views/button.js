'use strict';

var utils = require('../utils/utils');
var HtmlElement = require('../htmlElement');

var Button = utils.createView({

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
            name: HtmlElement,
            tag: 'button',
            props: {
                events: [ 'click' ]
            }
        }
    },

    inputs: {
        click: {},
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
