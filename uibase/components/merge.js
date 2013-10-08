;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Merge = ub.Utils.Class({

        extends: ub.Component,

        construct: function() {
            var self = this;

            self._super();

            self._observers = [];

            self._outPorts = {
                output: new ub.Observable(function(observer) {
                    self._observers.push(observer);
                })
            };

            self._inPorts = {
                input: new ub.Observer(function() {
                    self._update.apply(self, Array.prototype.slice.call(arguments, 0));
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

        _update: function() {
            var self = this,
                args = Array.prototype.slice.call(arguments, 0);

            if (self._observers.length) {
                self._observers.forEach(function(observer) {
                    setTimeout(function() {
                        observer.onNext.apply(observer, args);
                    }, 0);
                });
            }
        }
    });

    ub.Components.Merge  = Merge;

})(window.uibase);
