(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var HtmlElement = ub.Utils.Class({

        extends: ub.View,

        construct: function(config) {
            var self = this;

            self._super(config);

            self._tag = config.tag;
            self._props = config.props || {};
            self._text = config.text || "";
            self._children = config.children || [];
            self._events = config.events || [];

            if (Array.isArray(self._events)) {
                self._events.forEach(function(event) {
                    self.addOutPort(event, ub.BrowserEvent.addListener(event, config.view));
                });
            }
        },

        render: function() {
            var self = this;

            /*
            return {
                tag: self._tag,
                props: self._props,
                text: self._text,
                children: self._children.map(function(child) {
                    return child.render();
                })
            };
            */
            return self;
        }
    });

    ub.Views.HtmlElement = HtmlElement;

})(window.uibase);
