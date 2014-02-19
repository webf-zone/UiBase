'use strict';

var ub = require('uibase');
var Label = require('comp.Label');
var Delay = require('comp.Delay');
var Count = require('comp.Count');

var Index = ub.createView({

    config: {},

    components: {
        display: {
            name: Label,
            text: '0'
        },
        delay: {
            name: Delay,
            amount: 1000
        },
        adder: {
            name: Count
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
            name: ub.HtmlElement,
            tag: 'div',
            props: {
                children: [
                    {
                        name: Label,
                        text: 'Elapsed Seconds: '
                    },
                    this.components.display
                ]
            }
        };
    }

});

module.exports = Index;
