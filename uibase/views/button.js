(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var Button = ub.Utils.Class({

        extends: ub.View,

        construct: function(config) {
            var self = this;

            self._super(config);

            self._props = config.props || {};
            self._text = config.text || "";

            self.addInPort("text", function(text) {
                self._text = text;
            });

            self.addOutPort("click", ub.BrowserEvent.addListener("click", self));
        },

        render: function() {
            var self = this;

            return new ub.Views.HtmlElement({
                tag: "button",
                view: self,
                props: self._props,
                text: self._text
            });
        }
    });

    ub.Views.Button = Button;

})(window.uibase);
