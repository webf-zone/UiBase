;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Merge = ub.Utils.Class({

        extends: ub.Component,

        construct: function() {
            var self = this;

            self._super();

            self._outPorts = {
                output: new ub.Observable(function(observer) {
                    self._observer = observer;
                })
            };

            self._inPorts = {
                stream1: new ub.Observer(function() {
                    self._update.apply(self, Array.prototype.slice.call(arguments, 0));
                },
                function(errors) {
                    //TODO: Define this function
                    self._error(errors);
                },
                function() {
                    //TODO: Define this function
                    self._completed();
                }),
                stream2: new ub.Observer(function() {
                    self._update.apply(self, Array.prototype.slice.call(arguments, 0));
                })
            };
        },

        _update: function() {
            if (this._observer) {
                this._observer.onNext.apply(this._observer, Array.prototype.slice.call(arguments, 0));
            }
        }
    });

    ub.Components.Merge  = Merge;

})(window.uibase);
