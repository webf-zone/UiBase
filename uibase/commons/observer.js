;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    ub.Observer = function(onNext, onError, onCompleted) {
        this._onNext = ub.func(onNext);
        this._onError = ub.func(onError);
        this._onCompleted = ub.func(onCompleted);
    };

    ub.Observer.prototype.onNext = function() {
        this._onNext.apply(this, arguments);
    };
})(window.uibase);