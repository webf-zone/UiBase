(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Textbox = ub.Utils.Class({

        extends: ub.View,

        construct: function(config) {
            var self = this;

            self._super(config);

            self.element = new ub.Views.HtmlElement({
                tag: "input",
                props: ub.Utils.extend({}, config.props, {
                    type: "text"
                }),
                events: [
                    "input",
                    "keypress"
                ],
                view: self
            });

            var mapValue = new ub.Components.Map(function(event) {
                return $(event.target).val();
            });

            ub.Component.connect(self.element, "input", mapValue, "input");

            self.addOutPort("value", mapValue.get("output"));
            self.addOutPort("keypress", self.element.get("keypress"));
        },

        render: function() {
            return this.element;
        }
    });

    ub.Views.Textbox = Textbox;

})(window.uibase);
