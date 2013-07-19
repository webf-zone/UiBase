;(function(ub) {
    "use strict";

    ub.Observer = function(onNext, onError, onCompleted) {
        this._onNext = onNext;
        this._onError = onError;
        this._onCompleted = onCompleted;
    };

    ub.Observer.prototype.onNext = function() {
        this._onNext.apply(this, arguments);
    };
})(window.uibase);