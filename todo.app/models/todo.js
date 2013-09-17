(function(ub) {
    "use strict";

    ub.Factories = ub.Factories || {};

    var Todo = ub.Utils.Class({
        
        extends: ub.Model,

        defaults: {
            title: "",
            completed: false
        },

        construct: function(title) {
            this._super();

            this.title = title;
        },

        toggle: function() {
            this.set("completed", !this.get("completed"));
        }
    });

    ub.Factories.TodoFactory = ub.Utils.getFactory(Todo);

})(window.uibase);
