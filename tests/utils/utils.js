/*global describe, expect, it */
'use strict';

var utils = require('uibase').Utils;

describe('UiBase.Utils', function() {

    it('should have a method extend', function() {
        expect(utils.extend).to.be.a('function');
    });
});

module.exports = {};
