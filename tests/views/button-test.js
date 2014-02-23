/* global describe, expect, it */
'use strict';

var uibase = require('uibase');
var $ = require('jquery');
var Button = require('comp.Button');

describe('Button', function() {

    it('should extend ComplexView', function() {
        var btn = new Button();

        expect(btn instanceof uibase.ComplexView).to.equal(true);
    });

    it('should have configurable text', function(done) {
        var btn = new Button({
            props: {
                id: 'btn1'
            },
            text: 'Button Text 1'
        });

        uibase.View.renderView(btn, '#test-container');

        setTimeout(function() {
            expect($('#test-container button').html()).to.equal('Button Text 1');
            btn.removeView();
            done();
        }, 500);
    });

    it('should have an output click and should be clickable', function(done) {
        var btn = new Button({
            props: {
                id: 'btn2'
            },
            text: 'Button Text'
        });
        uibase.View.renderView(btn, '#test-container');

        var clicks = 0;
        btn.outputs.click.subscribe(new uibase.Observer(function(e) {
            clicks += 1;
            if (clicks === 2) {
                expect(clicks).to.equal(2);
                btn.removeView();
                done();
            }
        }));

        $('#test-container button').click();
        $('#test-container button').click();
    });

    it('should have an configuration, disabled, to create a button in disabled state', function(done) {
        var btn = new Button({
            props: {
                id: 'btn3'
            },
            disabled: true,
            text: 'Button Text'
        });
        uibase.View.renderView(btn, '#test-container');

        setTimeout(function() {
            expect(!!$('#test-container button').attr('disabled')).to.equal(true);
            btn.removeView();
            done();
        }, 500);
    });

    it('should have disabled input, to enable/disable the button', function(done) {
        var btn = new Button({
            props: {
                id: 'btn4'
            },
            text: 'Button Text'
        });
        uibase.View.renderView(btn, '#test-container');

        var disableTrigger = new uibase.Observable(function(obs) {
            this.write = function(val) {
                obs.onNext(val);
            };
        });
        disableTrigger.subscribe(btn.inputs.disabled);

        disableTrigger.write(true);

        setTimeout(function() {
            expect(!!$('#test-container button').attr('disabled')).to.equal(true);
            btn.removeView();
            done();
        }, 100);
    });


    it('should have text input, to update the text', function(done) {
        var btn = new Button({
            props: {
                id: 'btn6'
            },
            text: 'Button Text'
        });
        uibase.View.renderView(btn, '#test-container');

        var textTrigger = new uibase.Observable(function(obs) {
            this.write = function(val) {
                obs.onNext(val);
            };
        });
        textTrigger.subscribe(btn.inputs.text);

        textTrigger.write('New Button Text');

        setTimeout(function() {
            expect($('#test-container button').html()).to.equal('New Button Text');
            btn.removeView();
            done();
        }, 500);
    });

    it('should work when embedded inside another view', function(done) {
        var TestView = uibase.createView({
            picture: function() {
                return {
                    type: Button,
                    props: {
                        id: 'btnEmbed'
                    },
                    text: 'Embedded Button'
                };
            }
        });

        var tstView = new TestView();

        uibase.View.renderView(tstView, '#test-container');

        setTimeout(function() {
            expect($('#test-container button').html()).to.equal('Embedded Button');
            tstView.removeView();
            done();
        }, 500);
    });
});
