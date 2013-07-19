;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Label = ub.Component.extend(function(config) {
        this._el = $("<span>");
        this._text = config.text || "";

        this._inPorts.text = new ub.Observer(function(text) {
            this._text = text;
            this._el.text(text);
        });
    });

    Label.prototype.render = function() {
        return this._el.text(this._text);
    };

    ub.Views.Label = Label;
})(window.uibase);
