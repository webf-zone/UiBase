;(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Selectbox = ub.Component.extend(function(config) {
        this._el = $("<select>");

        var html = "";
        config.items.forEach(function(option) {
            html += "<option value=" + option.value + ">" + option.text + "</option>";
        });
        this._el.html(html);

        this._outPorts.value = ub.Observable.fromEvent(this._el, "change").map(function(event) {
            return $(event.target).val();
        });
    });

    Selectbox.prototype.render = function() {
        return this._el;
    };

    ub.Views.Selectbox = Selectbox;
})(window.uibase);
