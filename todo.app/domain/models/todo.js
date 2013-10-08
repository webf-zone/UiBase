(function(ub) {

    "use strict";

    ub.Models = ub.Models || {};

    var Todo  = ub.Utils.Class({
        
        extends: ub.Model,

        defaults: {
            id: 0,
            description: "",
            completed: false
        },

        construct: function(description) {
            this._super();

            this._init(description);
        },

        _init: function(description) {
            this.set("id", this._generateUuid());
            this.set("description", description);
        },

        isIdenticalTo: function(other) {
            return other && this.get("id") === other.id;
        },

        _generateUuid: function() {
            /* jshint bitwise:false */
            var i,
                random,
                uuid = "";

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += "-";
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                .toString(16);
            }

            return uuid;
        },

        toggle: function() {
            this.set("completed", !this.get("completed"));
        },

        static: {
            rebuild: function(attributes) {
                var todo = new Todo();

                todo.set("id", attributes.id);
                todo.set("description", attributes.description);
                todo.set("completed", attributes.completed);

                return todo;
            }
        }
    });

    ub.Models.Todo = Todo;

})(window.uibase);
