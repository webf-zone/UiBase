(function(ub) {
    'use strict';

    ub.Components = ub.Components || {};

    ub.Components.Map = ub.Utils.createComponent({

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

        inPorts: {
            input: {}
        },

        outPorts: {
            output: true
        }
    });

})(window.uibase);

