;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var TodoApp = ub.Utils.Class({

        extends: ub.View,

        construct: function() {
            var v = this;

            this._super();

            v.textbox = new ub.Views.Textbox({
                props: {
                    id: "new-todo",
                    placeholder: "What needs to be done?"
                }
            });
            var enterFilter = new ub.Components.Filter(function(e) {
                return e.which === 13;
            });

            var sampleOn = new ub.Components.SampleOn();

            var todoRepository = new ub.Repository(ub.Models.Todo, "LocalStorage", "uibase-todos");
            var createTodo = new ub.Services.CreateTodo(todoRepository);
            //var editTodo = new ub.Models.Todos.EditTodo();
            var deleteTodo = new ub.Services.DeleteTodo(todoRepository);
            var queryTodos = new ub.Services.QueryTodos(todoRepository);

            var mergeWrites = new ub.Components.Merge();

            var todolistView = new ub.Views.TodoList();

            this.todolistView = todolistView;

            ub.Component.connect(v.textbox,      "keypress", enterFilter,    "input");
            ub.Component.connect(v.textbox,      "value",    sampleOn,       "value");
            ub.Component.connect(enterFilter,    "output",   sampleOn,       "sampleOn");
            ub.Component.connect(sampleOn,       "output",   createTodo,     "description");
            ub.Component.connect(createTodo,     "output",   mergeWrites,    "input");
            ub.Component.connect(todolistView,   "destroy",  deleteTodo,     "todo");
            ub.Component.connect(deleteTodo,     "output",   mergeWrites,    "input");
            ub.Component.connect(mergeWrites,    "output",   queryTodos,     "filter");
            ub.Component.connect(queryTodos,     "output",   todolistView,   "todolist");
        },

        render: function() {
            return new ub.Views.HtmlElement({
                tag: "section",
                props: {
                    id: "todoapp"
                },
                children: [
                    new ub.Views.HtmlElement({
                        tag: "header",
                        props: {
                            id: "header"
                        },
                        children: [
                            new ub.Views.HtmlElement({
                                tag: "h1",
                                text: "todos"
                            }),
                            this.textbox
                        ]
                    }),
                    new ub.Views.HtmlElement({
                        tag: "section",
                        props: {
                            id: "main"
                        },
                        children: [
                            this.todolistView
                        ]
                    })
                ]
            });
        }
    });

    ub.Views.TodoApp = TodoApp;

})(window.uibase);
