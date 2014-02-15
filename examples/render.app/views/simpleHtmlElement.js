'use strict';

var ub = require('uibase');
var Label = require('comp.Label');
var Delay = require('comp.Delay');
var Collate = require('comp.Collate');

var startSeconds = Number(new Date());

var SimpleHtmlElement = ub.createView({

    config: {},

    components: {
        display: {
            name: Label
        },
        delay: {
            name: Delay,
            amount: 1000
        },
        adder: {
            name: Collate,
            seed: 0,
            op: function(total, val) { return total + val; }
        }
    },

    connections: {
        start: [ 'this.load',    'adder.reset'  ],
        count: [ 'delay.output', 'adder.input'  ],
        show:  [ 'adder.output', 'display.text' ]
    },

    picture: function() {
        return {
            name: ub.HtmlElement,
            tag: 'div',
            children: [ this.components.display ]
        };
    }

});

module.exports = SimpleHtmlElement;
