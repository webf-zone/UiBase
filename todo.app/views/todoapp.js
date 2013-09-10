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
            v.collectTodo = new ub.Components.Collect([], function(acc, val) {
                acc.push(val);
            });
            //v.todolist = new ub.Collection(ub.Models.Todo);

            comp.connect(v.textbox, "value", v.collectTodo, "input");
            //comp.connect(v.collectTodo, "output", v.todolistview, "data");
        },

        render: function() {
            return $("<div>")
                .append(this.textbox.render());
        }
    });

    ub.Views.TodoApp = TodoApp;

})(window.uibase);
