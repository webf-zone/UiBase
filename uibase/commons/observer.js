;(function(ub) {
    "use strict";

    ub.Observer = function(onNext, onError, onCompleted) {
        this._onNext = onNext;
        this._onError = onError;
        this._onCompleted = onCompleted;
    };
})(window.uibase);