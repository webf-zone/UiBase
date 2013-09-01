;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    /**
     * Notify observers of a new value in an observable sequence. Each
     * observable has an associated Dispatcher.
     *
     * @class Dispatcher
     */
    var Dispatcher = utils.Class({

        /**
         * @class Dispatcher
         * @constructor
         * @param {Function} subscribe Associated observable's subscribe method.
         */
        construct: function(subscribe) {
            this._subscribe = utils.func(subscribe);
            this._subscriptions = [];
        },

        /**
         * @method hasObservers
         * @return {Boolean}
         */
        hasObservers: function() {
            return this._subscriptions.length > 0;
        },

        removeObserver: function(subscription) {
            //TODO: Define this function
            //Eg: http://lodash.com/docs#without
            utils.without(this._subscriptions, subscription);
        },

        push: function() {
            var args = Array.prototype.slice(arguments, 0);

            this._subscriptions.forEach(function(observer) {
                if (observer) {
                    setTimeout(function() {
                        observer.onNext.apply(observer, args);
                    }, 0);
                }
            });
        },

        subscribe: function(obs) {
            var oThis = this,
                subscription,
                observer = utils.instanceOf(ub.Observer)(obs),
                unsubscribe = function() {};

            subscription = {
                observer: observer
            };

            this._subscriptions.push(subscription);

            //The Magic
            if (this._subscriptions.length === 1) {
                //TODO: Add error and complete callbacks
                unsubscribe = this._subscribe(new ub.Observer(function() {
                    oThis.push.apply(oThis, arguments);
                }));
            }

            return function() {
                this.removeObserver(subscription);

                if (!oThis.hasObservers()) {
                    return unsubscribe();
                }
            };
        }
    });

    ub.Dispatcher = Dispatcher;

})(window.uibase);