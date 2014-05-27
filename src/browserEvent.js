'use strict';

var $ = require('jquery');
var Observable = require('observable');
var Observer = require('observer');

var registeredEvents = {};

var BrowserEvent = {

    init: function() {
    },

    addListener: function(event, view) {
        var topLevelEvent = registeredEvents[event] ||
            (registeredEvents[event] = new Observable(function(observer) {
                    var handler = function(e) {
                        observer.onNext.call(observer, e, true);
                    };
                    document.body.addEventListener(event, handler, true);
                }
            ));

        return new Observable(function(observer) {
            var ob = new Observer(function(event) {
                if (view.isRendered() && $('[data-ubid="' + view._rootId + '"]').get(0) === event.target) {
                    observer.onNext.apply(observer, arguments);
                }
            });
            topLevelEvent.subscribe(ob);
        });
    }
};

module.exports = BrowserEvent;
