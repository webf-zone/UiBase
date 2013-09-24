;(function(ub) {
    "use strict";

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

            var todoFactory = new ub.Factories.TodoFactory();

            var collectTodo = new ub.Components.Collate([], function(acc, val) {
                acc.push(val);
                return acc;
            });

            var serializeTodos = new ub.Components.Map(function(todos) {
                return JSON.stringify(todos);
            });

            var writer = new ub.Components.Write("uibase-todos");
            var reader = new ub.Components.Read("uibase-todos");

            var todoListParser = new ub.Components.Map(function(val) {
                return JSON.parse(val);
            });

            var mergeWrites = new ub.Components.Merge();

            var todolistView = new ub.Views.TodoList();

            this.todolistView = todolistView;

            ub.Component.connect(v.textbox,      "keypress", enterFilter,    "input");
            ub.Component.connect(v.textbox,      "value",    sampleOn,       "value");
            ub.Component.connect(enterFilter,    "output",   sampleOn,       "sampleOn");
            ub.Component.connect(sampleOn,       "output",   todoFactory,    "input");
            ub.Component.connect(todoFactory,    "output",   collectTodo,    "input");
            ub.Component.connect(collectTodo,    "output",   serializeTodos, "input");
            ub.Component.connect(serializeTodos, "output",   writer,         "input");
            ub.Component.connect(writer,         "output",   mergeWrites,    "stream1");
            ub.Component.connect(mergeWrites,    "output",   reader,         "input");
            ub.Component.connect(reader,         "output",   todoListParser, "input");
            ub.Component.connect(todoListParser, "output",   todolistView,   "todolist");
        },

        render: function() {
            return new ub.Views.HtmlElement({
                tag: "div",
                children: [
                    this.textbox,
                    this.todolistView
                ]
            });
        }
    });

    ub.Views.TodoApp = TodoApp;

})(window.uibase);
