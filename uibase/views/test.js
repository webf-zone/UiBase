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
        v.anotherLbl = new ub.Views.Label({ text: "No Value" });

        ub.Component.connect(v.lbl, "text", v.select.get("value"));
        ub.Component.connect(v.anotherLbl, "text", v.select.get("value").map(function(v) { return parseInt(v,10) + 1; }));
    });

    Test.prototype.render = function() {
        return $("<div>")
            .append(this.select.render())
            .append(this.lbl.render())
            .append(this.anotherLbl.render());
    };

    ub.Views.Test = Test;
})(window.uibase);