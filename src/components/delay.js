'use strict';

var ub = require('uibase');

var Delay = ub.createComponent({

    config: {
        amount: {
            optional: true,
            default: 1000
        }
    },

    beh: {
        input: {
            success: function(value) {
                var self = this;
                return {
                    output: function(done) {
                        setTimeout(function() {
                            done(value);
                        }, self.config.amount);
                    }
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

module.exports = Delay;
