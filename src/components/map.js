'use strict';

var utils = require('utils');

var Map = utils.createComponent({

    config: {
        mapper: {
            optional: true,
            default: function(val) { return val; },
            type: 'function'
        }
    },

    beh: {
        input: {
            success: function(value) {
                return {
                    output: this.config.mapper(value)
                };
            },
            error: function(errors) {
                return {
                    output: errors
                };
            }
        }
    },

    inputs: {
        input: {}
    },

    outputs: {
        output: true
    }
});

module.exports = Map;
