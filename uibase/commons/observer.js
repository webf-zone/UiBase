;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    ub.Observer = function(onNext, onError, onCompleted) {
        this._onNext = utils.func(onNext);
        this._onError = utils.func(onError);
        this._onCompleted = utils.func(onCompleted);
    };

    ub.Observer.prototype.onNext = function() {
        this._onNext.apply(this, arguments);
    };
})(window.uibase);