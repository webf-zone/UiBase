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
        reset: {},
        input: {}
    },

    body: function (inputs) {
        return {
            output: ub.apply('collate', {
                input: inputs.input,
                reset: inputs.reset
            })
        }.output;
    }
});

module.exports = Count;
