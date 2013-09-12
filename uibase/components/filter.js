;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Filter = ub.Utils.Class({

        extends: ub.Component,

        construct: function(filter) {
            var self = this;

            self._super();

            self._filter = filter;

            self._outPorts = {
                output: new ub.Observable(function(observer) {
                    self._observer = ub.Utils.instanceOf(ub.Observer)(observer);
                })
            };

            self._inPorts = {
                input: new ub.Observer(function(val) {
                    if (self._observer && self._filter(val) === true) {
                        self._update(val);
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

    ub.Components.Filter  = Filter;

})(window.uibase);

