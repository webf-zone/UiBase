'use strict';

var ub = require('uibase');

var Filter = ub.createComponent({

    config: {
        test: {
            optional: false,
            type: 'function'
        }
    },

    inputs: {
        input: {}
    },

    outputs: {
        output: true
    },

    beh: {
        input: {
            success: function(val) {
                if (this.config.test(val) === true) {
                    return { output: val };
                }
            }
        }
    }
});

module.exports = Filter;
