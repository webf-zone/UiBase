(function(ub) {
    
    "use strict";

    ub.Services = ub.Services || {};

    var QueryTodos = ub.Utils.Class({
        
        extends: ub.Component,

        construct: function(repository) {
            var self = this;

            self._super();

            self._repository = repository;

            self._inPorts.filter = new ub.Observer(function(filter) {
                self._repository.query(filter, function(todos) {
                    if (self._observer) {
                        self._update(todos);
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

    ub.Services.QueryTodos = QueryTodos;

})(window.uibase);
