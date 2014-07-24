'use strict';

var ub = require('uibase');

var Collate = ub.createComponent({

    inputs: {
        seed: {},
        input: {},
        reset: {},
        op: {}
    },

    body: function (inputs) {
        var next;

        if (inputs.reset) {
            next = inputs.seed;
        } else {
            next = inputs.op(this.outputv.output || inputs.seed, inputs.input);
        }

        return {
            output: next
        };
    }
});

module.exports = Collate;
