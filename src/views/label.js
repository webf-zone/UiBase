'use strict';

var ub = require('uibase');

var Label = ub.createView({

    config: {
        text: {
            optional: true,
            default: ''
        }
    },

    components: {
        root: {
            type: ub.HtmlElement,
            tag: 'span'
        }
    },

    inputs: {
        text: 'root.children'
    },

    outputs: {},

    picture: function() {
        return this.components.root;
    }
});

module.exports = Label;
