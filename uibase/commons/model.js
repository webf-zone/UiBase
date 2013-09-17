(function(ub) {
    "use strict";

    var Model = ub.Utils.Class({

        construct: function() {
            var self = this;

            Object.keys(self.defaults).forEach(function(prop) {
                self[prop] = self.defaults[prop];
            });
        }
    });

    ub.Utils.getFactory = function(model) {

        var Factory = ub.Utils.Class({
        
            extends: ub.Components.Map,

            construct: function() {
                var self = this;

                self._super(function(config) {
                    return (new model(config));
                });
            }
        });

        return Factory;
    };

    ub.Model = Model;

})(window.uibase);
