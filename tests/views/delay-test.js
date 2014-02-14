/* global describe, expect, it */
'use strict';

var ub = require('uibase');
var $ = require('jquery');
var Delay = require('comp.Delay');

describe('Delay', function() {
    it('should delay the output by specified amount after receiving an input', function(done) {

        var delayAmt = 1300;
        var delay = new Delay({ amount: delayAmt });

        var startSeconds = Number(new Date());
        delay.outputs.output.subscribe(new ub.Observer(function(val) {
            var endSeconds = Number(new Date());

            expect(val).to.equal(2);
            expect(endSeconds > startSeconds + delayAmt).to.equal(true);
            done();
        }));

        var obv = new ub.Observable(function(observer) {
            this.write = function(value) {
                observer.onNext(value);
            };
        });

        obv.subscribe(delay.inputs.input);

        obv.write(2);
    });
});

module.exports = {};
