/* global describe, expect, it */

(function(ub) {

    'use strict';

    describe('Components.Collate', function() {

        it('should extend from Component', function() {
            var op = function(acc, val) { return acc + val; };
            var collate = new ub.Components.Collate({ seed: 1, op: op });

            expect(collate instanceof ub.Component).to.equal(true);
        });

        it('should throw error if seed is not passed as configuration', function() {
            expect(function() {
                new ub.Components.Collate({ op: function() {} });
            }).to.throw();
        });

        it('should throw error if op is not passed as configuration or it is not a function', function() {
            expect(function() {
                new ub.Components.Collate({ seed: 1 });
            }).to.throw();

            expect(function() {
                new ub.Components.Collate({ seed: 1, op: '' });
            }).to.throw();
        });

        it('should be able to reduce multiple values to one', function(done) {
            var op = function(acc, val) { return acc + val; },
                collate = new ub.Components.Collate({ seed: 1, op: op });

            var input = new ub.Observable(function(observer) {
                this.write = function(val) { observer.onNext(val); };
            });

            input.subscribe(collate._inPorts.input);

            input.write(2);
            input.write(3);

            var iter = 0;

            collate._outPorts.output.subscribe(new ub.Observer(function(val) {
                iter += 1;
                if (iter === 2) {
                    expect(val).to.equal(6);
                    done();
                }
            }));

        });

    });
}(window.uibase));

