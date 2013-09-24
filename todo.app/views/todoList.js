(function(ub) {
    
    "use strict";

    var TodoList = ub.Utils.Class({
        
        extends: ub.View,

        construct: function() {
            var self = this;

            self._super();

            self._todoViews = [];

            self.addInPort("todolist", function(todos) {
                var todoViews = todos.map(function(todo) {
                    return new ub.Views.Todo(todo);
                });
                self._todoViews = todoViews;
            });
        },

        render: function() {
            var self = this;

            return new ub.Views.HtmlElement({
                tag: "ul",
                props: {
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
