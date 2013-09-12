;(function(ub) {
    "use strict";

    var comp = ub.Component;

    ub.Views = ub.Views || {};

    var TodoApp = ub.Utils.Class({

        extends: ub.Component,

        construct: function() {
            var v = this;

            this._super();

            v.textbox = new ub.Views.Textbox();
            var enterFilter = new ub.Components.Filter(function(e) {
                return e.which === 13;
            });

            var sampleOn = new ub.Components.SampleOn();

            var collectTodo = new ub.Components.Collate([], function(acc, val) {
                acc.push(val);
                console.log(acc);
            });

            ub.Component.connect(v.textbox, "keypress", enterFilter, "input");

            ub.Component.connect(v.textbox, "value", sampleOn, "value");
            ub.Component.connect(enterFilter, "output", sampleOn, "sampleOn");

            ub.Component.connect(sampleOn, "output", collectTodo, "input");
        },

        render: function() {
            return $("<div>")
                .append(this.textbox.render());
        }
    });

    ub.Views.TodoApp = TodoApp;

})(window.uibase);
