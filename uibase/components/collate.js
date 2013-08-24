;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Collate = ub.createComponent({

        construct: function(seed, op) {
            this._acc = seed;
            this._op = op;
            this._observers = [];
        },

        _setAcc: function(val) {
            this._acc = val;
            this._observers.forEach(function(observer) {
                setTimeout(function() {
                    // TODO: Decide the context
                    observer.onNext.call(observer, this.acc);
                }, 0);
            });
        },

        inPorts: {
            input: new ub.Observer(function(val) {
                this._setAcc(this._op(this._acc, val));
            },
            function(errors) {
                //TODO: Define this function
                this._error(errors);
            },
            function() {
                //TODO: Define this function
                this._completed();
            })
        },

        outPorts: {
            output: new ub.Observable(function(observer) {
                this._observers.push(observer);
                //TODO: Return a dispose function
            })
        }
    });

    ub.Views.Collate = Collate;

})(window.uibase);
