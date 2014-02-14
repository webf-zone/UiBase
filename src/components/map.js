'use strict';

var ub = require('uibase');

var Map = ub.createComponent({

    config: {
        mapper: {
            optional: true,
            default: function(val) { return val; }
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
