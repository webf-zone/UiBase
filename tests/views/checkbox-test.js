/* global describe, expect, it */
'use strict';

var uibase = require('uibase');
var $ = require('jquery');
var Checkbox = require('comp.Checkbox');

describe('Checkbox', function() {

    it('should extend ComplexView', function() {
        var chk = new Checkbox();

        expect(chk instanceof uibase.ComplexView).to.equal(true);
    });

    it('should render as an input tag with type=checkbox', function (done) {
        var chk = new Checkbox();

        uibase.View.renderView(chk, '#test-container');

        setTimeout(function() {
            expect($('#test-container input')).to.have.length.to.be(1);
            chk.removeView();
            done();
        }, 500);
    });

});
