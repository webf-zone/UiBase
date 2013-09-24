(function(ub) {
    
    "use strict";

    var Todo = ub.Utils.Class({
        
        extends: ub.View,

        construct: function(todo) {
            var self = this;

            self._super();

            self._todo = todo;

            self._inPorts.todo = new ub.Observer(function(todo) {
                self._todo = todo;
            });
        },

        render: function() {
            var self = this;

            return new ub.Views.HtmlElement({
                tag: "div",
                props: {
                    class: self._todo.completed ? "completed" : "active"
                },
                text: self._todo.title
            });
        }
    });

    ub.Views.Todo = Todo;

})(window.uibase);
