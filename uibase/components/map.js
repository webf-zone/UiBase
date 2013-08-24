;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Map = ub.Utils.Class({

        extends: ub.Component,

        construct: function(mapper) {
            this._mapper = mapper;
            this._observers = [];
        },

        _update: function(val) {
            this._observers.forEach(function(observer) {
                setTimeout(function() {
                    // TODO: Decide the context
                    observer.onNext.call(observer, val);
                }, 0);
            });
        },

        inPorts: {
            input: new ub.Observer(function(val) {
                this._update(this._mapper.call(this, val));
            },
            function(errors) {
                //TODO: Define this function
                this._error(errors);
            },
            function() {
                //TODO: Define this function
                this._completed();
            })
        },

        outPorts: {
            output: new ub.Observable(function(observer) {
                this._observers.push(observer);
                //TODO: Return a dispose function
            })
        }
    });

    ub.Components.Map  = Map;
    ub.Components.Lift = Map;

})(window.uibase);
