'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var $ = require('jquery');

var Textbox = ub.createView({

    components: {
        root: {
            name: ub.HtmlElement,
            tag: 'input',
            props: {
                type: 'text'
            },
            events: [
                'input',
                'keypress'
            ]
        },
        mapValue: {
            name: Map,
            mapper: function(event) { return $(event.target).val(); }
        }
    },

    connections: {
        valFromEvt: [ 'root.events.input', 'mapValue.input' ]
    },

    inputs: {},

    outputs: {
        value: 'mapValue.output',
        keypress: 'root.events.keypress'
    },

    picture: function() {
        return this.components.root;
    }
});

module.exports = Textbox;
