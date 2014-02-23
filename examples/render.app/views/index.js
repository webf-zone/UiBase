'use strict';

var ub = require('uibase');
var Label = require('comp.Label');
var Delay = require('comp.Delay');
var Count = require('comp.Count');

var Index = ub.createView({

    config: {},

    components: {
        display: {
            type: Label,
            text: '0'
        },
        delay: {
            type: Delay,
            amount: 1000
        },
        adder: {
            type: Count
        }
    },

    connections: {
        start: [ 'this.load',    'adder.reset'  ],
        count: [ 'delay.output', 'adder.input'  ],
        show:  [ 'adder.output', 'display.text' ],
        loop:  [ 'adder.output', 'delay.input' ]
    },

    picture: function() {
        return {
            type: ub.HtmlElement,
            tag: 'div',
            props: {
                children: [
                    {
                        type: Label,
                        text: 'Elapsed Seconds: '
                    },
                    this.components.display
                ]
            }
        };
    }

});

module.exports = Index;
