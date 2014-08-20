'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var $ = require('jquery');

var Checkbox = ub.createView({

    components: {
        root: {
            type: ub.HtmlElement,
            tag: 'checkbox',
            props: {
                events: [
                    'change'
                ]
            }
        },
        mapValue: {
            type: Map,
            mapper: function(event) {
                return $(event.target).val();
            }
        }
    },

    connections: {
        valFromEvt: [ 'root.events.change', 'mapValue.input' ]
    },

    inputs: {},

    outputs: {
        value: 'mapValue.output',
        keypress: 'root.events.change'
    },

    picture: function() {
        return this.components.root;
    }
});

module.exports = Checkbox;