(function(ub) {
    
    "use strict";

    var TodoList = ub.Utils.Class({
        
        extends: ub.View,

        construct: function() {
            var self = this;

            self._super();

            self._todoViews = [];

            var merge = new ub.Components.Merge();

            self.addInPort("todolist", function(todos) {
                var todoViews = todos.map(function(todo) {
                    var todov = new ub.Views.Todo(todo);

                    ub.Component.connect(todov, "destroy", merge, "input");

                    return todov;
                });
                self._todoViews = todoViews;
            });

            self._outPorts.destroy = merge.get("output");
        },

        render: function() {
            var self = this;

            return new ub.Views.HtmlElement({
                tag: "ul",
                props: {
                    id: "todo-list",
                    class: "todos"
                },
                children: self._todoViews.map(function(tv) {
                    return new ub.Views.HtmlElement({
                        tag: "li",
                        children: [tv]
                    });
                })
            });
        }
    });

    ub.Views.TodoList = TodoList;

})(window.uibase);
