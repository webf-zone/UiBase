;(function(ub) {
    "use strict";

    var Observable = function(subscribe) {
        this._subscribe = subscribe;
    };

    Observable.prototype.subscribe = function(observer) {
        return this._subscribe(observer);
    };

    Observable.fromEvent = function(element, eventName) {
        return new Observable(function(observer) {
            var handler = function(eventObject) {
                observer.onNext(eventObject);
            };
            element.bind(eventName, handler);
            return function() {
                element.unbind(eventName, handler);
            };
        });
    };

    ub.Observable = Observable;

})(window.uibase);