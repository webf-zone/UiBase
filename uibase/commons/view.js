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
         * @param mountDepth
         * @returns String
         */
        renderView: function(mountDepth) {
            var view = this;

            if (view.isRendered()) {
                throw new Error('renderView: Can only render a un-rendered view');
            }

            view._phase = ub.View.ViewPhase.RENDERED;
            view._mountDepth = mountDepth;

            return '';
        },

        renderChildren: function(childrenToUse) {
            var view = this;
            var children = childrenToUse.map(function(child) {
                return child.render();
            });

            view._renderedChildren = children;

            return children.map(function(child) {
                return child.renderView(view._mountDepth + 1);
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

            renderView: function(view, container) {
                var markup,
                    nextRenderedView = view.render(),
                    prevRenderedView = view._dom;

                if (prevRenderedView) {

                } else {
                    markup = nextRenderedView.renderView(1);
                    $(container).html(markup);
                }

                view._dom = nextRenderedView;

                return view;
            }
        }
    });

})(window.uibase);
