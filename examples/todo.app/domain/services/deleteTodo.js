(function(ub) {
    
    "use strict";

    ub.Services = ub.Services || {};

    var DeleteTodo = ub.Utils.Class({
        
        extends: ub.Component,

        construct: function(repository) {
            var self = this;

            self._super();

            self._repository = repository;

            self._inPorts.todo = new ub.Observer(function(todo) {
                var mtodo = new ub.Models.Todo(todo);
                self._repository.remove(mtodo, function() {
                    if (self._observer) {
                        self._update();
                    }
                });
            });

            self._outPorts.output = new ub.Observable(function(observer) {
                self._observer = observer;
            });
        },

        _update: function() {
            var self = this;

            self._observer.onNext.apply(self._observer, arguments);
        }
    });

    ub.Services.DeleteTodo = DeleteTodo;

})(window.uibase);
