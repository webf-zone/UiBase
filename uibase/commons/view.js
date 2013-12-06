(function(ub) {

    'use strict';

    /**
     * This is the main View class. It is Component that can be rendered.
     *
     * @class View
     * @extends Component
     */
    ub.View = ub.Utils.Class({

        extends: ub.Component,

        /**
         * @constructor
         */
        construct: function(config) {
            var self = this;

            config = config || {};
            self.props = config.props || {};
            self.parent = null;
            self._phase = ub.View.ViewPhase.REMOVED;
            self._futureProps = null;
            self._futureParent = null;
            self._events = config.events || [];

            self.children = config.children;

            self._super();
        },

        /**
         * @method renderView
         * @param depth
         * @returns String
         */
        renderView: function(depth) {
            var view = this;

            if (view.isRendered()) {
                throw new Error('renderView: Can only render a un-rendered view');
            }

            view._phase = ub.View.ViewPhase.RENDERED;
            view._depth = depth;

            return '';
        },

        updateView: function() {
            if (!this._futureProps) {
                return;
            }

            var prevProps = this.props,
                prevParent = this.parent;

            this.props = this._futureProps;
            this.parent = this._futureParent;
            this._futureProps = null;

            this._updateView(prevProps, prevParent);
        },

        _updateView: function(prevProps, prevParent) {
            //TODO: Handle parent reference maintenance
        },

        renderChildren: function(childrenToUse) {
            var view = this;
            var children = childrenToUse.map(function(child) {
                return child.render();
            });

            view._renderedChildren = children;

            return children.map(function(child) {
                return child.renderView(view._depth + 1);
            });
        },

        addInPort: function(name, onNext, onError, onCompleted) {
            var self = this;

            self._inPorts[name] = new ub.Observer(function() {
                onNext.apply(self, arguments);
                self.performUpdateIfRequired();
            });
        },

        isRendered: function() {
            return this._phase === ub.View.ViewPhase.RENDERED;
        },

        static: {

            ViewPhase: {
                RENDERED: 'RENDERED',
                REMOVED: 'REMOVED'
            },

            dirtyViews: [],

            isBatching: false,

            renderView: function(view, container) {
                var markup;

                markup = view.renderView(1);
                $(container).html(markup);

                //view._dom = nextRenderedView;

                return view;
            },

            enqueueUpdate: function(view) {
                ub.View.dirtyViews.push(view);

                if (ub.View.dirtyViews.length === 1 && !ub.View.isBatching) {
                    ub.View.isBatching = true;
                    ub.View.startTicking();
                }
            },

            flushUpdates: function() {
                try {
                    ub.View.runUpdates();
                } catch(e) {
                    throw e;
                } finally {
                    ub.View.clearUpdateQueue();
                }
            },

            clearUpdateQueue: function() {
                ub.View.dirtyViews.length = 0;
                ub.View.isBatching = false;
            },

            runUpdates: function() {
                var views = ub.View.dirtyViews;

                console.log('Dirty Views length: ' + views.length);

                views.sort(function(v1, v2) {
                    return v1._mountDepth - v2._mountDepth;
                });

                for (var i = 0; i < views.length; i++) {
                    var view = views[i];
                    if (view.isRendered()) {
                        view.updateView();
                    }
                }
            },

            startTicking: function() {
                window.requestAnimationFrame(function() {
                    ub.View.flushUpdates();
                });
            }
        }
    });

})(window.uibase);
