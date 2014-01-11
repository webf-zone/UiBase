(function(ub) {
    'use strict';

    ub.Components = ub.Components || {};

    ub.Components.Delay = ub.Utils.createComponent({

        config: {
            amount: {
                optional: true,
                default: 1000,
                type: 'number'
            }
        },

        components: {},

        connections: {},

        inPorts: {
            input: {
                success: function(value) {
                    var self = this;

                    setTimeout(function() {
                        self.outPorts.output.write(value);
                    }, self.config.amount);
                }
            }
        },

        outPorts: {
            output: function(observer) {
                var self = this;

                self._outPorts.output.write = function(type, value) {
                    if (type === 'success') {
                        observer.onNext(value);
                    } else if (type === 'error') {
                        observer.onError(value);
                    }
                };
            }
        }
    });

}(window.uibase));
