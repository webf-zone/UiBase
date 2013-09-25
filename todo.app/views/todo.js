(function(ub) {
    
    "use strict";

    var Todo = ub.Utils.Class({
        
        extends: ub.View,

        construct: function(todo) {
            var self = this;

            self._super();

            self._todo = todo;

            self._destroyBtn = new ub.Views.Button({
                text: "✖",
                props: {
                    class: "destroy"
                }
            });

            self._inPorts.todo = new ub.Observer(function(todo) {
                self._todo = todo;
            });

            self._outPorts.destroy = self._destroyBtn.get("click");
        },

        render: function() {
            var self = this;

            return new ub.Views.HtmlElement({
                tag: "div",
                children:[
                    new ub.Views.HtmlElement({
                        tag: "span",
                        props: {
                            class: self._todo.completed ? "completed" : "active"
                        },
                        text: self._todo.title
                    }),
                    self._destroyBtn
                ],
                props: {
                    class: "todo"
                }
            });
        }
    });

    ub.Views.Todo = Todo;

})(window.uibase);
