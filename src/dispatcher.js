'use strict';

var utils = require('utils');
var Observer = require('observer');

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
        this._subscribe = subscribe;
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
        this._subscriptions.splice(this._subscriptions.indexOf(subscription), 1);
    },

    push: function() {
        var args = Array.prototype.slice.call(arguments, 0);

        this._subscriptions.forEach(function(subscription) {
            var observer = subscription.observer;

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
            observer = obs,
            unsubscribe = function() {};

        subscription = {
            observer: observer
        };

        this._subscriptions.push(subscription);

        //The Magic
        if (this._subscriptions.length === 1) {
            //TODO: Add error and complete callbacks
            unsubscribe = this._subscribe(new Observer(function() {
                oThis.push.apply(oThis, arguments);
            }));
        }

        return function() {
            this.removeObserver(subscription);

            if (!oThis.hasObservers()) {
                if (typeof unsubscribe === 'function') {
                    return unsubscribe();
                }
            }
        }.bind(oThis);
    }
});

module.exports = Dispatcher;
