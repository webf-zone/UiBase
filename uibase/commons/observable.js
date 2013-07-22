;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    var Observable = utils.Class({
        construct: function(subscribe) {
            this._subscribe = utils.func(subscribe);
        },
        subscribe: function(observer) {
            return this._subscribe(utils.instanceOf(ub.Observer)(observer));
        },
        map: function(mapper) {
            var o = this;
            return new Observable(function(observer) {
                observer = utils.instanceOf(ub.Observer)(observer);
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