(function(ub) {
    
    "use strict";

    var Todos = ub.Utils.Class({
        
        extends: ub.Model,

        defaults: {
            todos: []
        },

        construct: function(todos) {
            this._super();

            if (!(this instanceof Todo)) {
                this._rebuild(todos);
            } else {
                this._init(todos);
            }
        },

        _rebuild: function(todos) {
            if (Array.isArray(todos)) {
                this.set("todos", todos);
            }
        },

        _init: function(todos) {
            if (Array.isArray(todos)) {
                this.set("todos", todos);
            }
        },

        create: function(title) {
            var todo = new ub.Models.Todo(title);

            this.set("todos", this.get("todos").push(todo));

            return this.get("todos");
        },

        edit: function() {},

        delete: function(id) {
            var todos = this.get("todos");
            
            todos.forEach(function(todo, idx) {
                if (todo.get("id") === id) {
                    this.set("todos", this.get("todos").splice(idx, 1));
                }
            });

            return this.get("todos");
        },

        read: function(param) {
            var filteredTodos = [];

            if (param === undefined) {
                filteredTodos = this.get("todos");
            } else {
                filteredTodos = this.get("todos").filter(function(todo) {
                    return todo.get("completed") === param;
                });
            }

            return filteredTodos;
        }
    });

    ub.Models.Todos = Todos;

})(window.uibase);
