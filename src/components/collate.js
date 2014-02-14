'use strict';

var ub = require('uibase');

var Collate = ub.createComponent({

    config: {
        seed: {
            optional: false
        },
        op: {
            optional: false,
            type: 'function'
        }
    },

    inputs: {
        input: {},
        reset: {}
    },

    outputs: {
        output: true
    },

    _aux: function(acc, v) {
        var self = this,
            result = self.config.op(acc, v);

        return {
            output: result,
            next: {
                success: function(val) { return self._aux(result, val); }
            }
        };
    },

    beh: {
        input: {
            success: function(value) {
                var self = this;

                return self._aux(self.config.seed, value);
            },
            error: function(errors) {
                return {
                    output: errors
                };
            }
        },
        reset: {
            success: function() {
                return {
                    output: this.config.seed,
                    next: {
                        input: {
                            success: this._aux.bind(this, this.config.seed)
                        }
                    }
                };
            }
        }
    }
});

module.exports = Collate;
