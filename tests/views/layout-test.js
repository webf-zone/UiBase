/* global describe, expect, it */
'use strict';

var uibase = require('uibase');
var $ = require('jquery');
var Label = require('comp.Label');
var Layout = require('comp.Layout');

describe('Layout', function() {

    it('should extend ComplexView', function() {
        var layout = new Layout();

        expect(layout instanceof uibase.ComplexView).to.equal(true);
    });

    it('should have configurable children', function(done) {
        var layout = new Layout({
            props: {
                id: 'layout1'
            },
            children: [
                {
                    type: Label,
                    props: {
                        id: 'l1-c1'
                    },
                    text: 'Text 1'
                },
                {
                    type: Label,
                    props: {
                        id: 'l1-c2'
                    },
                    text: 'Text 2'
                }
            ]
        });

        uibase.View.renderView(layout, '#test-container');

        setTimeout(function() {
            var c1 = $('#l1-c1');
            var c2 = $('#l1-c2');
            expect(c1.text()).to.equal('Text 1');
            expect(c2.text()).to.equal('Text 2');
            expect(c1.offset().left === c2.offset().left).to.equal(true);
            expect(c1.offset().top < c2.offset().top).to.equal(true);
            layout.removeView();
            done();
        }, 500);
    });

    it('should should stack children horizontally for direction horizontal', function(done) {
        var layout = new Layout({
            direction: 'horizontal',
            props: {
                id: 'layout2'
            },
            children: [
                {
                    type: Label,
                    props: {
                        id: 'l2-c1'
                    },
                    text: 'Text 1'
                },
                {
                    type: Label,
                    props: {
                        id: 'l2-c2'
                    },
                    text: 'Text 2'
                }
            ]
        });

        uibase.View.renderView(layout, '#test-container');

        setTimeout(function() {
            var c1 = $('#l2-c1');
            var c2 = $('#l2-c2');
            expect(c1.text()).to.equal('Text 1');
            expect(c2.text()).to.equal('Text 2');
            expect(c1.offset().left < c2.offset().left).to.equal(true);
            expect(c1.offset().top === c2.offset().top).to.equal(true);
            layout.removeView();
            done();
        }, 500);
    });
});
