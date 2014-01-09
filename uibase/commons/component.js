;(function(ub) {
    "use strict";

    var Component = ub.Utils.Class({

        construct: function() {
            this._inPorts = {};
            this._outPorts = {};
            this.components = {};
        },

        get: function(outPort) {
            var comp = this;

            if (!comp.outPorts[outPort]) {
                console.warn('No output port "' + outPort + '" for component');
                return new ub.Observable(function() {});
            }

            return comp._outPorts[outPort];
        },

        addOutPort: function(name, observable) {
            var comp = this;

            comp._outPorts[name] = observable;
        },

        addCompToCreator: function(comp, name) {
            this.components[name] = comp;
        },

        removeCompFromCreator: function(comp, name) {
            if (this.components[name] === comp) {
                delete this.components[name];
            }
        },

        static: {
            connect: function(sourceComp, sourcePort, sinkComp, sinkPort) {
                var observer = sinkComp._inPorts[sinkPort];

                return sourceComp.get(sourcePort).subscribe(observer);
            }
        }
    });

    ub.Component = Component;

})(window.uibase);
