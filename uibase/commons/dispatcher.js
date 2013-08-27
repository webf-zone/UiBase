;(function(ub) {
    "use strict";

    var utils = ub.Utils;

    var Dispatcher = utils.Class({
        construct: function(subscribe) {
            this._subscribe = subscribe;
            this._subscriptions = [];
        },

        hasObservers: function() {
            return this._subscriptions.length > 0;
        },

        removeObserver: function(subscription) {
            //TODO: Define this function
            //Eg: http://lodash.com/docs#without
            utils.without(this._subscriptions, subscription);
        },

        push: function() {
            this._subscriptions.forEach(function(observer) {
                observer.onNext.apply(observer, arguments);
            });
        },

        subscribe: function(observer) {
            var oThis = this,
                subscription,
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