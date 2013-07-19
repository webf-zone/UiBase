;(function(ub) {
    "use strict";

    var Component = function() {
        this._inPorts = {};
        this._outPorts = {};
    };

    Component.prototype.get = function(outPort) {
        var comp = this;

        if (!comp._outPorts[outPort]) return new ub.Observable(function() {});

        return comp._outPorts[outPort];
    };

    Component.connect = function(comp, inPort, observable) {
        if (!comp instanceof Component) throw new Error("expected a Component as first argument");

        var observer = comp._inPorts[inPort];

        if (observer instanceof ub.Observer) return observable.subscribe(observer);
        else return observer(observable);
    };

    Component.extend = function(constructor) {
        var Child = function(config) {
            Component.call(this);
            constructor.call(this, config);
        };

        Child.prototype = Object.create(Component.prototype);
        Child.prototype.constructor = Child;

        return Child;
    };

    ub.Component = Component;

})(window.uibase);