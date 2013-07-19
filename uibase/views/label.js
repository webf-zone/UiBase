;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Label = ub.Component.extend(function(config) {
        var v = this;

        v._text = config.text || "";
        v._el = $("<span>").text(v._text);

        v._inPorts.text = function(observable) {
            v._outPorts.text = observable; //observable.clone()
            var ob = new ub.Observer(function(text) {
                v._text = text;
                v._el.text(text);
            });
            observable.subscribe(ob);
            return ob;
        };
    });

    Label.prototype.render = function() {
        return this._el;
    };

    ub.Views.Label = Label;
})(window.uibase);
