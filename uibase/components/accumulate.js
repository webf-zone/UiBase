;(function(ub) {
    "use strict";

    ub.Components = ub.Components || {};

    var Accumulate = ub.createComponent({

        construct: function(seed, op) {
            this.acc = seed;
            this.op = op;

            new ub.Observable(function(observer) {
                var ob = new ub.Observer(function(val) {
                    acc = op(acc, val);
                    observer.onNext(acc);
                });
                return o.subscribe(ob);
            });
        },

        onNext: function(val) {
        },

        setAcc: function(val) {
            this.acc = val;
            this.outPorts.output.
        },

        inPorts: {
            input: new ub.Observer(function(val) {
                this.setAcc(this.op(this.acc, val));
            })
        },

        outPorts: {
            output: new ub.Observable(function(observer) {
                var ob = new ub.Observer(function(val) {
                    acc = op(acc, val);
                    observer.onNext(acc);
                });
            })
        }
    });

    ub.Views.Accumulate = Accumulate;

})(window.uibase);
