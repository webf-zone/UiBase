;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Textbox = ub.Utils.Class({

        extends: ub.Component,

        construct: function(config) {
            this._super(config);

            this._el = $("<input type=\"text\">");

            var value = new ub.Component();

            value._outPorts.output = ub.Observable.fromEvent(this._el, "input");

            var valueMap = new ub.Components.Map(function(event) {
                return $(event.target).val();
            });

            ub.Component.connect(value, "output", valueMap, "input");

            this._outPorts.value = valueMap.get("output");

            this._outPorts.keypress = ub.Observable.fromEvent(this._el, "keypress");
        },

        render: function() {
            return this._el;
        }
    });

    ub.Views.Textbox = Textbox;

})(window.uibase);
