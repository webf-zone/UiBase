;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Textbox = ub.Utils.Class({

        extends: ub.Component,

        construct: function(config) {
            this._super(config);

            this._el = $("<input type=\"text\">");
console.log(ub.Observable.fromEvent(this._el, "change"));
            this._outPorts.value = ub.Observable.fromEvent(this._el, "change").map(function(event) {
                return $(event.target).val();
            });

            this._outPorts.keypress = ub.Observable.fromEvent(this._el, "keypress").map(function(event) {
                return event.which;
            });
        },

        render: function() {
            return this._el;
        }
    });

    ub.Views.Textbox = Textbox;

})(window.uibase);
