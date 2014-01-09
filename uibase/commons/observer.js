;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    /**
     * Iteration over an push-style observable sequence.
     *
     * @class Observer
     */
    var Observer = utils.Class({

        /**
         * @class Observer
         * @constructor
         * @param {Function} onNext Action to execute on new Observable value.
         * @param {Function} [onError] Action to execute on when Observable
         *    sequence throws error.
         * @param {Function} [onCompleted] Action to execute when Observable
         *   sequence ends.
         */
        construct: function(onNext, onError, onCompleted) {
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        },

        /**
         * Execute the onNext handler of Observer.
         *
         * @method onNext
         */
        onNext: function() {
            this._onNext.apply(this, arguments);
        },

        onError: function() {
            this._onError.apply(this, arguments);
        },

        onCompleted: function() {
            this._onCompleted.apply(this, arguments);
        }
    });

    ub.Observer = Observer;

})(window.uibase);