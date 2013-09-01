;(function(ub, jQuery) {
    "use strict";

    var utils = ub.Utils;

    /**
     * Push-style collection
     *
     * @class Observable
     */
    var Observable = utils.Class({

        /**
         * @class Observable
         * @constructor
         * @param {Function} subscribe Describe the subscription logic. Such as
         *   when to call the observer's onNext method.
         */
        construct: function(subscribe) {
            var dispatcher = new ub.Dispatcher(subscribe);

            /**
             * @method subscribe
             */
            this.subscribe = dispatcher.subscribe;

            /**
             * @method hasObservers
             * @return {Boolean}
             */
            this.hasObservers = dispatcher.hasObservers;
        },

        static: {

            /**
             * Helper for creating an Observable from a DOM event.
             *
             * @method fromEvent
             * @static
             * @param {Object} element The DOM element
             * @param {String} eventName DOM event name
             * @return {Observable}
             */
            fromEvent: function(element, eventName) {
                return new Observable(function(observer) {
                    var el = jQuery(element),
                        handler = function(eventObject) {
                            observer.onNext(eventObject);
                        };

                    el.bind(eventName, handler);
                    return function() {
                        el.unbind(eventName, handler);
                    };
                });
            },

            /**
             * Helper for creating an Observable from a Ajax request.
             *
             * @method fromAjax
             * @param  {Object} ajaxConfig
             * @return {Observable}
             */
            fromAjax: function(ajaxConfig) {
                return new Observable(function(observer) {
                    var doneHandler = function(data, textStatus, jqXHR) {
                        observer.onNext({ data: data, textStatus: textStatus, jqXHR: jqXHR });
                    };

                    var failHandler = function(jqXHR, textStatus, errorThrown) {
                        observer.onError({ error: errorThrown, textStatus: textStatus, jqXHR: jqXHR });
                    };

                    var completeHandler = function() {
                        observer.onCompleted();
                    };

                    var jqXHR = jQuery.ajax(ajaxConfig);

                    jqXHR
                        .done(doneHandler)
                        .fail(failHandler)
                        .always(completeHandler);

                    return function() {
                        jqXHR.abort();
                    };
                });
            }
        }
    });

    ub.Observable = Observable;

})(window.uibase, jQuery);
