;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Test = ub.Utils.Class({

        extends: ub.Component,

        construct: function() {
            var v = this;

            this._super();

            v.textbox = new ub.Views.Textbox();
            v.lbl = new ub.Views.Label({ text: "No Value" });

            var values = v.textbox.get("value").accumulate("", function(a, b) {
                return a + " " + b;
            });

            var dispose = ub.Component.connect(v.lbl, "text", values);
        },

        render: function() {
            return $("<div>")
                .append(this.select.render())
                .append(this.lbl.render())
                .append(this.anotherLbl.render());
        }
    });

    ub.Views.Test = Test;

})(window.uibase);
