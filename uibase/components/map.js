;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Map = ub.Utils.Class({

        extends: ub.Component,

        construct: function(mapper) {
            var self = this;

            self._super();

            self._mapper = mapper;

            self._outPorts = {
                output: new ub.Observable(function(observer) {
                    self._observer = ub.Utils.instanceOf(ub.Observer)(observer);
                })
            };

            self._inPorts = {
                input: new ub.Observer(function(val) {
                    if (self._observer) {
                        self._update(self._mapper.call(self, val));
                    }
                },
                function(errors) {
                    //TODO: Define this function
                    self._error(errors);
                },
                function() {
                    //TODO: Define this function
                    self._completed();
                })
            };
        },

        _update: function(val) {
            this._observer.onNext(val);
        }
    });

    ub.Components.Map  = Map;
    ub.Components.Lift = Map;

})(window.uibase);

