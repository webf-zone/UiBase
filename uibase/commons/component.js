;(function(ub) {
    "use strict";

    var Component = ub.Utils.Class({

        construct: function() {
            this._inPorts = {};
            this._outPorts = {};
        },

        get: function(outPort) {
            var comp = this;

            if (!comp._outPorts[outPort]) return new ub.Observable(function() {});

            return comp._outPorts[outPort];
        },

        static: {
            connect: function(comp, inPort, observable) {
                if (!comp instanceof Component) throw new Error("expected a Component as first argument");

                var observer = comp._inPorts[inPort];

                if (observer instanceof ub.Observer) return observable.subscribe(observer);
                else return observer(observable);
            }
        }
    });

    ub.Component = Component;

})(window.uibase);