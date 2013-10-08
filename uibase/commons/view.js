(function(ub) {
    "use strict";

    var View = ub.Utils.Class({

        extends: ub.Component,

        construct: function() {
            var self = this;

            self._super();
        },

        addInPort: function(name, onNext, onError, onCompleted) {
            var self = this,
                reRender = self.reRender.bind(self);

            self._inPorts[name] = new ub.Observer(function() {
                onNext.apply(self, arguments);
                reRender();
            });
        },

        reRender: function(compareWithView) {
            ub.View.renderView(this, compareWithView);
        },

        render: function() {
            return this._el;
        },

        static: {
            renderView: function(view, compareWith, replaceView) {
                if (view.isRendered || (compareWith)) {
                    View.updateView(view, compareWith);
                } else {
                    var dom = view.render(),
                        children = dom._children.slice(),
                        props = dom._props,
                        el;

                    view._dom = dom;
                    view._dom._children = [];

                    el = $("<" + dom._tag + ">").text(dom._text);

                    for (var propName in props) {
                        if (!props.hasOwnProperty(propName)) {
                            continue;
                        }

                        //TODO: Add check for style attribute to be
                        //a map instead of a string.

                        el.prop(propName, props[propName]);
                    }
                    view._el = el;

                    if (view.parent) {
                        if (replaceView) {
                            replaceView.replaceWith(view._el);
                            var idx = view.parent._dom._children.indexOf(replaceView);
                            view.parent._dom._children.slice(idx, 1, view);
                        } else {
                            $(view.parent._el).append(el);
                            view.parent._dom._children.push(view);
                        }
                    } else {
                        $("body").append(el);
                    }

                    if (Array.isArray(children)) {
                        children.forEach(function(child) {
                            child.parent = view;
                            ub.View.renderView(child);
                        });
                    }

                    /*
                    if (Array.isArray(dom._events)) {
                        dom._events.forEach(function(event) {
                            view.addOutPort(event, ub.Observable.fromEvent(view._el, event));
                        });
                    }
                    */

                    view.isRendered = true;
                }
            },

            /*
            updateView: function(view, compareWithView) {
                var dom = view.render(),
                    props = dom._props;

                compareWithView = compareWithView || view;
                    
                if (dom._tag !== compareWithView._dom._tag) {
                    //$(view._el).remove();
                    ub.View.renderView(view, undefined, view);
                } else {
                    if (dom._text !== compareWithView._dom._text) {
                        $(view._el).text(dom._text);
                    }

                    if (Array.isArray(dom._children)) {
                        dom._children.forEach(function(child, i) {
                            child.parent = view;
                            child.reRender(compareWithView._dom._children && compareWithView._dom._children[i]);
                        });
                    }
                }
            }
            */
            updateView: function(view, newView) {
                var dom,
                    props;

                newView = newView || view;

                dom = newView.render();
                props = dom._props;
                    
                if (dom._tag !== view._dom._tag) {
                    ub.View.renderView(view, undefined, view);
                } else {
                    if (dom._text !== view._dom._text) {
                        $(view._el).text(dom._text);
                    }

                    if (Array.isArray(dom._children)) {
                        dom._children.forEach(function(child, i) {
                            if (view._dom._children && view._dom._children[i]) {
                                view._dom._children[i].reRender(child);
                            } else {
                                child.parent = view;
                                child.reRender();
                            }
                        });
                    }
                }
            }
        }
    });

    ub.View = View;

})(window.uibase);
