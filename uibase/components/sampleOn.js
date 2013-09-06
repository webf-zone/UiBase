;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var SampleOn = ub.Utils.Class({

        extends: ub.Component,

        construct: function() {
            var self = this;

            self._super();

            self._val = null;

            self._outPorts = {
                output: new ub.Observable(function(observer) {
                    self._observer = observer;
                })
            };

            self._inPorts = {
                sampleOn: new ub.Observer(function() {
                    self._update();
                },
                function(errors) {
                    //TODO: Define this function
                    self._error(errors);
                },
                function() {
                    //TODO: Define this function
                    self._completed();
                }),
                value: new ub.Observer(function(val) {
                    self._val = val;
                })
            };
        },

        _update: function() {
            this._observer.onNext(this._val);
        }
    });

    ub.Components.SampleOn  = SampleOn;

})(window.uibase);
