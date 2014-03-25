'use strict';

var ub = require('uibase');
var Label = require('comp.Label');
var Delay = require('comp.Delay');
var Map = require('comp.Map');
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
        },
        typeConverter: {
            type: Map,
            mapper: function (c) { return c.toString(); }
        }
    },

    connections: {
        start: [ 'this.load',    'adder.reset'  ],
        count: [ 'delay.output', 'adder.input'  ],
        convert: [ 'adder.output', 'typeConverter.input' ],
        show:  [ 'typeConverter.output', 'display.text' ],
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
