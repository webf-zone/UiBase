(function(ub) {
    
    "use strict";

    ub.Services = ub.Services || {};

    var CreateTodo = ub.Utils.Class({
        
        extends: ub.Component,

        construct: function(repository) {
            var self = this;

            self._super();

            self._repository = repository;

            self._inPorts.description = new ub.Observer(function(desc) {
                var todo = new ub.Models.Todo(desc);

                self._repository.insert(todo, function() {
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

    ub.Services.CreateTodo = CreateTodo;

})(window.uibase);
