'use strict';

var utils = require('utils');
var Observable = require('observable');

var Component = utils.Class({

    construct: function() {
        this.inputs = {};
        this.outputs = {};
        this.components = {};
    },

    get: function(outPort) {
        var comp = this;

        if (!comp.outputs[outPort]) {
            console.warn('No output port "' + outPort + '" for component');
            return new Observable(function() {});
        }

        return comp.outputs[outPort];
    },

    addOutPort: function(name, observable) {
        var comp = this;

        comp.outputs[name] = observable;
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
            var observer = sinkComp.inputs[sinkPort];

            return sourceComp.get(sourcePort).subscribe(observer);
        }
    }
});

module.exports = Component;
