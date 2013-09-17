(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var LocalStorageReader = ub.Utils.Class({
        
        extends: ub.Components.Map,

        construct: function(baseKey) {
            var self = this;

            self._super(function(key) {
                key = key || baseKey;

                return localStorage.getItem(key);
            });
        }
    });

    ub.Components.LocalStorageReader = LocalStorageReader;

    var Read = ub.Utils.Class({
        
        extends: ub.Component,

        construct: function(location) {
            var self = this,
                reader;

            if (ub.Utils.isURL(location)) {
                reader = new ub.Components.AjaxReader(location);
                self._type = "ajax";
            } else {
                self._type = "localStorage";
                reader = new ub.Components.LocalStorageReader(location);
            }

            self._inPorts = reader._inPorts;
            self._outPorts = reader._outPorts;
        }
    });

    ub.Components.Read = Read;

})(window.uibase);
