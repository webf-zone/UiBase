(function(ub) {

    "use strict";

    var registeredEvents = {};

    var BrowserEvent = {
        
        init: function() {
        },

        addListener: function(event, view) {
            var topLevelEvent = registeredEvents[event] ||
                (registeredEvents[event] = new ub.Observable(function(observer) {
                        var handler = function(event) {
                            observer.onNext.call(observer, event);
                        };
                        document.body.addEventListener(event, handler, true);
                    }
                ));

            return (function () {
                return new ub.Observable(function(observer) {
                    var ob = new ub.Observer(function(event) {
                        if (view._el.get(0) === event.target) {
                            observer.onNext.apply(observer, arguments);
                        }
                    });
                    topLevelEvent.subscribe(ob);
                });
            })();
        }
    };

    ub.BrowserEvent = BrowserEvent;

})(window.uibase);
