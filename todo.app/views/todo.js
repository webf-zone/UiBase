(function(ub) {
    
    "use strict";

    var Todo = ub.Utils.Class({
        
        extends: ub.View,

        construct: function() {
            var self = this;

            self._super();

            self._el = $("<li>");

            self._inPorts.todo = new ub.Observer(function(todo) {

                if (todo.completed) self._el.addClass("strike");

                self._el.text(todo.title);
            });
        }
    });

    ub.Views.Todo = Todo;

})(window.uibase);
