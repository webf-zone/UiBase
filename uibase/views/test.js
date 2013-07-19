;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Test = ub.Component.extend(function() {
        var v = this;

        v.select = new ub.Views.Selectbox({
            items: [{
                value: 1,
                text: "One"
            }, {
                value: 2,
                text: "Two"
            }]
        });

        v.lbl = new ub.Views.Label({ text: "No Value" });

        ub.Component.connect(v.lbl, "text", v.select.get("value"));
    });

    Test.prototype.render = function() {
        return $("<div>")
            .append(this.select.render())
            .append(this.lbl.render());
    };

    ub.Views.Test = Test;
})(window.uibase);