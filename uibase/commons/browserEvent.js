(function(ub) {

    "use strict";

    var registeredEvents = {};

    var BrowserEvent = {
        
        init: function() {
        },

        addListener: function(event, view) {
            return registeredEvents[event] || (registeredEvents[event] = ub.Observable.fromEvent("body", event));
        }
    };

    ub.BrowserEvent = BrowserEvent;

})(window.uibase);
