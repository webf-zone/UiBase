;(function(ub) {
    "use strict";

    var Component = ub.Utils.Class({

        construct: function() {
            this._inPorts = {};
            this._outPorts = {};
        },

        get: function(outPort) {
            var comp = this;

            if (!comp._outPorts[outPort]) {
                console.warn("No output port \"" + outPort + "\" for component");
                return new ub.Observable(function() {});
            }

            return comp._outPorts[outPort];
        },

        addOutPort: function(name, observable) {
            var comp = this;

            comp._outPorts[name] = observable;
        },

        static: {
            connect: function(sourceComp, sourcePort, sinkComp, sinkPort) {

                sinkComp = ub.Utils.instanceOf(ub.Component)(sinkComp);
                sourceComp = ub.Utils.instanceOf(ub.Component)(sourceComp);

                var observer = sinkComp._inPorts[sinkPort];

                return sourceComp.get(sourcePort).subscribe(observer);
            }
        }
    });

    ub.Component = Component;

})(window.uibase);
