'use strict';

var ub = require('uibase');

var SampleOn = ub.createComponent({

    inputs: {
        value: {},
        sampleOn: {}
    },

    outputs: {
        output: true
    },

    beh: {
        value: {
            success: function(val) {
                return {
                    next: {
                        sampleOn: function() {
                            return { output: val };
                        }
                    }
                };
            }
        },
        sampleOn: function() {
            return {};
        }
    }
});

module.exports = SampleOn;
