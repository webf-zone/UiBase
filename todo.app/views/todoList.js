(function(ub) {
    
    "use strict";

    var TodoList = ub.Utils.Class({
        
        extends: ub.View,

        construct: function() {
            var self = this;

            self._super();

            self._el = $("<ul>").addClass("todos");

            self._inPorts.todolist = new ub.Observer(function(todos) {
                var todoViews = todos.map(function(todo) {
                    return new ub.Views.Todo(todo);
                });
                self._el.html(todoViews.render());
            });
        }
    });

    ub.Views.TodoList = TodoList;

})(window.uibase);
