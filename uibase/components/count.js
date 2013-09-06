;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Count = ub.Utils.Class({

        extends: ub.Components.Collate,

        construct: function() {
            this._super(0, function(count) {
                return count + 1;
            });
        }
    });

    ub.Components.Count = Count;

})(window.uibase);
