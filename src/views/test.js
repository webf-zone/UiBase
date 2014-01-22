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

            var collateText = new ub.Components.Collate("", function(acc, val) {
                return acc + val;
            });

            ub.Component.connect(v.textbox, "value", collateText, "input");
            var dispose = ub.Component.connect(collateText, "output", v.lbl, "text");
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
