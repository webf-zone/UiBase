;(function(ub) {
    "use strict";

    var Observable = ub.Utils.Class({
        construct: function(subscribe) {
            this._subscribe = subscribe;
        },
        subscribe: function(observer) {
            return this._subscribe(observer);
        },
        map: function(mapper) {
            var o = this;
            return new Observable(function(observer) {
                var ob = new ub.Observer(function(event) {
                    observer.onNext(mapper.call(o, event));
                });
                o.subscribe(ob);
            });
        },
        static: {
            fromEvent: function(element, eventName) {
                return new Observable(function(observer) {
                    var handler = function(eventObject) {
                        observer.onNext(eventObject);
                    };
                    element.bind(eventName, handler);
                    return function() {
                        element.unbind(eventName, handler);
                    };
                });
            }
        }
    });

    ub.Observable = Observable;

})(window.uibase);