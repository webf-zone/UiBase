;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Collate = ub.Utils.Class({

        extends: ub.Components.Map,

        construct: function(seed, op) {
            this._acc = seed;
            this._op = ub.Utils.func(op);

            this._super(function(val) {
                return this._op(this._acc, val);
            });
        },

        _update: function(val) {
            this._acc = val;
            this._super(this._acc);
        }
    });

    ub.Components.Collate = Collate;
    ub.Components.Foldp   = Collate;
    ub.Components.Collect = Collate;

})(window.uibase);
