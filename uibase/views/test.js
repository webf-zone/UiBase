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

        v.txtFld = new ub.Views.TextField({ value: "No Value" });
        v.anotherTxtFld = new ub.Views.TextField({ value: "No Value" });

        ub.Component.connect(v.txtFld, "value", v.select.get("value"));
        ub.Component.connect(v.anotherTxtFld, "value", v.select.get("value").map(function(v) { return parseInt(v,10) + 1; }));
    });

    Test.prototype.render = function() {
        return $("<div>")
            .append(this.select.render())
            .append(this.txtFld.render())
            .append(this.anothertxtFld.render());
    };

    ub.Views.Test = Test;
})(window.uibase);
