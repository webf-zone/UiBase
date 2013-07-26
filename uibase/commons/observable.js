;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    var Observable = utils.Class({
        construct: function(subscribe) {
            this._subscribe = subscribe;
        },
        subscribe: function(observer) {
            return this._subscribe(observer);
        },
        map: function(mapper) {
            var o = this;
            return new Observable(function(observer) {
                observer = observer;
                var ob = new ub.Observer(function(val) {
                    observer.onNext(mapper.call(o, val));
                });
                return o.subscribe(ob);
            });
        },
        accumulate: function(seed, op) {
            var o = this,
                acc = seed;

            return new Observable(function(observer) {
                var ob = new ub.Observer(function(val) {
                    acc = op(val, acc);
                    observer.onNext(acc);
                });
                return o.subscribe(ob);
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