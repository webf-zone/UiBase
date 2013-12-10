/* global describe, expect, it */

(function(ub) {

    'use strict';

    describe('UIBase.View', function() {

        it('should throw error on render of invalid views', function() {
            var container = document.createElement('div');
            document.body.appendChild(container);

            expect(function() {
                ub.View.renderView(null, container);
            }).throw();
        });

        it('should correctly determine if a component is rendered', function() {
            var container = document.createElement('div');
            document.body.appendChild(container);
            var TestView = ub.Utils.Class({
                extends: ub.ComplexView,

                render: function() {
                    return new ub.Views.HtmlElement({
                        tag: 'div'
                    });
                }
            });

            var instance = new TestView();

            expect(instance.isRendered()).to.be.false;
            ub.View.renderView(instance, container);
            expect(instance.isRendered()).to.be.true;
        });

        it('should store child component references in components', function() {
            var container = document.createElement('div');
            document.body.appendChild(container);

            var inner, outer;

            var Component = ub.Utils.Class({
                extends: ub.ComplexView,
                render: function() {
                    inner = new ub.Views.HtmlElement({
                        tag: 'div',
                        props: { compName: 'inner' }
                    });
                    outer = new ub.Views.HtmlElement({
                        tag: 'div',
                        props: {
                            compName: 'outer',
                            children: [inner]
                        }
                    });
                    return outer;
                }
            });

            var instance = new Component({
                props: {
                    children: [
                        new ub.Views.HtmlElement({
                            tag: 'span'
                        })
                    ]
                }
            });

            ub.View.renderView(instance, container);
        });

        it('should know its simple mount depth', function() {
            var container = document.createElement('div');
            document.body.appendChild(container);

            var Parent = ub.Utils.Class({
                extends: ub.ComplexView,
                render: function() {
                    return new Child({
                        props: {
                            compName: 'child'
                        }
                    });
                }
            });

            var Child = ub.Utils.Class({
                extends: ub.ComplexView,
                render: function() {
                    return new ub.Views.HtmlElement({
                        tag: 'div'
                    });
                }
            });

            var instance = new Parent();
            ub.View.renderView(instance, container);
            expect(instance._depth).to.equal(0);
            expect(instance.components.child._depth).to.equal(1);
        });

        it('should know its (complicated) mount depth', function() {
            var container = document.createElement('div');
            document.body.appendChild(container);

            var Box = ub.Utils.Class({
                extends: ub.ComplexView,
                render: function() {
                    return new ub.Views.HtmlElement({
                        tag: 'div',
                        props: {
                            compName: 'boxDiv',
                            children: this.props.children
                        }
                    });
                }
            });

            var Child = ub.Utils.Class({
                extends: ub.ComplexView,
                render: function() {
                    return new ub.Views.HtmlElement({
                        tag: 'span',
                        props: {
                            compName: 'span',
                        }
                    });
                }
            });

            var Switcher = ub.Utils.Class({
                extends: ub.ComplexView,

                construct: function(config) {
                    this._super(config);
                    this.state.tabKey = 'hello';
                },
                render: function() {
                    var child = this.props.children[0];

                    return new Box({
                        props: {
                            compName: 'box',
                            children: [
                                new ub.Views.HtmlElement({
                                    tag: 'div',
                                    props: {
                                        compName: 'switcherDiv',
                                        style: {
                                            display: this.state.tabKey === child.props.key ? '' : 'none'
                                        },
                                        children: this.props.children
                                    }
                                })
                            ]
                        }
                    });
                }
            });

            var App = ub.Utils.Class({
                extends: ub.ComplexView,
                render: function() {
                    return new Switcher({
                        props: {
                            compName: 'switcher',
                            children: [
                                new Child({
                                    props: {
                                        compName: 'child',
                                        key: 'hello'
                                    }
                                })
                            ]
                        }
                    });
                }
            });

            var root = new App();

            ub.View.renderView(root, container);

            expect(root._depth).to.equal(0);
            expect(root.components.switcher._depth).to.equal(1);
            expect(root.components.switcher.components.box._depth).to.equal(2);
            expect(root.components.switcher.components.switcherDiv._depth).to.equal(4);
            expect(root.components.child._depth).to.equal(5);
            expect(root.components.switcher.components.box.components.boxDiv._depth).to.equal(3);
            expect(root.components.child.components.span._depth).to.equal(6);
        });
    });

})(window.uibase);
