(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var LocalStorageWriter = ub.Utils.Class({
        
        extends: ub.Components.Map,

        construct: function(baseKey) {
            var self = this;

            self._super(function(value) {
                localStorage.setItem(baseKey, value);
                return value;
            });
        }
    });

    ub.Components.LocalStorageWriter = LocalStorageWriter;

    var Write = ub.Utils.Class({
        
        extends: ub.Component,

        construct: function(location) {
            var self = this,
                writer;

            /*
            if (ub.Utils.isURL(location)) {
                reader = new ub.Components.AjaxWriter(location);
                self._type = "ajax";
            } else {
                self._type = "localStorage";
                reader = new ub.Components.LocalStorageWriter(location);
            }
            */

            writer = new ub.Components.LocalStorageWriter(location);

            var dummySink = new ub.Component();

            dummySink._inPorts.input = new ub.Observer(function() {});

            self._inPorts = writer._inPorts;
            self._outPorts = writer._outPorts;

            ub.Component.connect(self, "output", dummySink, "input");
        }
    });

    ub.Components.Write = Write;

})(window.uibase);
