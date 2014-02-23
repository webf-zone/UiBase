'use strict';

var ub = require('uibase');
var Collate = require('comp.Collate');

var Count = ub.createComponent({

    components: {
        collate: {
            type: Collate,
            seed: 0,
            op: function(result) { return result + 1; }
        }
    },

    inputs: {
        reset: 'collate.reset',
        input: 'collate.input'
    },

    outputs: {
        output: 'collate.output'
    }
});

module.exports = Count;
