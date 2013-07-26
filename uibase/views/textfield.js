;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var TextField = ub.Component.extend(function(config) {
        var v = this;

        v._value = config.value || "";
        v._el = $("<input>").prop("type", "text")
			.value(v._text);

        v._inPorts.value = function(observable) {
            v._outPorts.value = observable; //observable.clone()
            var ob = new ub.Observer(function(text) {
                v._value = text;
                v._el.value(text);
            });
            return observable.subscribe(ob);
        };
    });

    TextField.prototype.render = function() {
        return this._el;
    };

    ub.Views.TextField = Label;
})(window.uibase);
