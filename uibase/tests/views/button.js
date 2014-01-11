/* global describe, expect, it */

(function(ub) {

    'use strict';

    describe('Views.Button', function() {

        it('should extend ub.ComplexView', function() {
            var btn = new ub.Views.Button();

            expect(btn instanceof ub.ComplexView).to.equal(true);
        });

        it('should have configurable text', function() {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn1'
                },
                text: 'Button Text'
            });

            ub.View.renderView(btn, '#test-container');
        });

        it('should have an output \'click\' and should be clickable', function(done) {
            var btn = new ub.Views.Button({
                props: {
                    id: 'btn2'
                },
                text: 'Button Text'
            });
            ub.View.renderView(btn, '#test-container');

            var clicks = 0;
            btn._outPorts.click.subscribe(new ub.Observer(function(val) {
                console.log('clicked');
                clicks += 1;
                if (val === 2) {
                    expect(clicks).to.equal(2);
                    done();
                }
            }));

            var clickTrigger = new ub.Observable(function(obs) {
                this.write = function(val) {
                    obs.onNext(val);
                };
            });
            clickTrigger.subscribe(btn._inPorts.click);

            clickTrigger.write(1);
            clickTrigger.write(2);
        });
    });

}(window.uibase));
