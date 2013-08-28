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
            connect: function(inComp, inPort, outComp, outPort) {

                if (!(inComp instanceof Component)) throw new Error("expected a Component as first argument");

                var observer = inComp._inPorts[inPort],
                    observable,
                    dispose = function() {};

                if (outComp instanceof ub.Observable) {
                    observable = outComp;
                } else {
                    observable = outComp.get(outPort);
                }

                dispose = observable.subscribe(observer);

                return dispose;
            }
        }
    });

    ub.Component = Component;

})(window.uibase);
