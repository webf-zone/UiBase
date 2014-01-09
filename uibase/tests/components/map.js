/* global describe, expect, it */

(function(ub) {

    'use strict';

    describe('Components.Map', function() {

        it('should extend from Component', function() {
            var map = new ub.Components.Map();

            expect(map instanceof ub.Component).to.equal(true);
        });

        /*
        it('should take a single configuration as mapper function', function() {
            var mapper = function(val) { return val + 1; },
                map = new ub.Components.Map({ mapper: mapper });

            expect(map.config.mapper).to.equal(mapper);
        });
        */

        it('should convert the input value to output per the mapper function', function(done) {
            var inputVal = 2,
                mapper = function(val) { return 3 * val; },
                outVal = mapper(inputVal),
                map = new ub.Components.Map({ mapper: mapper });

            console.log(map);
            map._outPorts.output.subscribe(new ub.Observer(function(val) {
                expect(val).to.equal(outVal);
                done();
            }));

            new ub.Observable(function(observer) {
                observer.onNext(inputVal);
            }).subscribe(map._inPorts.input);
        });

    });
}(window.uibase));
