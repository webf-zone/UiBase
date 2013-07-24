;(function(ub) {
    "use strict";

    var Observer = ub.Utils.Class({
        construct: function(onNext, onError, onCompleted) {
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        },

        onNext: function() {
            this._onNext.apply(this, arguments);
        }
    });

    ub.Observer = Observer;

})(window.uibase);