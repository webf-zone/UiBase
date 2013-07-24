;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    var Observer = utils.Class({
        construct: function(onNext, onError, onCompleted) {
            this._onNext = utils.func(onNext);
            this._onError = onError;
            this._onCompleted = onCompleted;
        },

        onNext: function() {
            this._onNext.apply(this, arguments);
        }
    });

    ub.Observer = Observer;

})(window.uibase);