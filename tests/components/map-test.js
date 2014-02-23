/* global describe, expect, it */

'use strict';

var ub = require('uibase');
var Map = require('comp.Map');

describe('Map', function() {

    it('should extend from Component', function() {
        var map = new Map({ mapper: function() {} });

        expect(map instanceof ub.Component).to.equal(true);
    });

    it('should convert the input value to output per the mapper function', function(done) {
        var inputVal = 2,
            mapper = function(val) { return 3 * val; },
            outVal = mapper(inputVal),
            map = new Map({ mapper: mapper });

        map.outputs.output.subscribe(new ub.Observer(function(val) {
            expect(val).to.equal(outVal);
            done();
        }));

        new ub.Observable(function(observer) {
            observer.onNext(inputVal);
        }).subscribe(map.inputs.input);
    });

});
