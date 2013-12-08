(function(ub) {

    'use strict';

    /**
     * @class ComplexView
     * @extends View
     */
    ub.ComplexView = ub.Utils.Class({

        extends: ub.View,

        /**
         * @constructor
         * @param config
         */
        construct: function(config) {
            var self = this;

            self._super(config);

            self.state = {};
            self._futureState = {};

            self._compoundPhase = null;
        },

        isRendered: function() {
            return this._compoundPhase !== ub.ComplexView.ViewPhase.RENDERING &&
                this._phase === ub.View.ViewPhase.RENDERED;
        },

        renderView: function(rootId, depth) {
            this._super(rootId, depth);

            this._compoundPhase = ub.ComplexView.ViewPhase.RENDERING;

            ub.View.currentParent = this;

            try {
                this._renderedView = this.render();
            } catch (error) {
                throw error;
            } finally {
                ub.View.currentParent = null;
            }

            this._compoundPhase = null;

            var markup = this._renderedView.renderView(rootId, depth + 1);

            return markup;
        },

        setState: function(partialState) {
            this.replaceState(ub.Utils.extend({}, this._futureState || this.state, partialState));
        },

        replaceState: function(state) {
            if (!(this.isRendered() || this._compoundPhase === ub.ComplexView.RENDERING)) {
                throw new Error('State can be updated only when view is rendered or rendering.');
            }

            if (this._compoundPhase === ub.ComplexView.ViewPhase.UPDATING_STATE ||
                this._compoundPhase === ub.ComplexView.ViewPhase.REMOVING) {
                throw new Error('Cannot update state for a view when it is being removed or when it\'s state is being updated');
            }

            this._futureState = state;

            ub.View.enqueueUpdate(this);
        },

        updateViewIfRequired: function() {
            var compoundPhase = this._compoundPhase;

            if (compoundPhase === ub.ComplexView.ViewPhase.RENDERING ||
                compoundPhase === ub.ComplexView.ViewPhase.UPDATING_PROPS) {
                return;
            }
            this._super();
        },

        _updateViewIfRequired: function() {
            if (this._futureProps == null &&
                this._futureState == null) {
                return;
            }

            var nextProps = this.props;
            if (this._futureProps != null) {
                nextProps = this._futureProps;
                this._futureProps = null;

                this._compoundPhase = ub.ComplexView.ViewPhase.UPDATING_PROPS;
                // TODO: Have a hook here
            }

            this._compoundPhase = ub.ComplexView.ViewPhase.UPDATING_STATE;

            var nextParent = this._futureParent;

            var nextState = this._futureState || this.state;
            this._futureState = null;

            this._updateView(nextProps, nextParent, nextState);

            this._compoundPhase = null;
        },

        _updateView: function(nextProps, nextParent, nextState) {
            var prevProps = this.props;
            var prevParent = this.parent;
            var prevState = this.state;


            this.props = nextProps;
            this.parent = nextParent;
            this.state = nextState;


            this.updateView(prevProps, prevParent, prevState);
        },

        updateView: function(prevProps, prevParent, prevState) {
            this._super(prevProps, prevParent);

            var prevView = this._renderedView;
            var nextView = null;

            ub.View.currentParent = this;
            try {
                nextView = this.render();
            } catch (error) {
                throw error;
            } finally {
                ub.View.currentParent = null;
            }

            if (prevView && nextView &&
                prevView.constructor === nextView.constructor &&
                prevView.parent === nextView.parent) {
                prevView.copyFrom(nextView);
            } else {
                prevView.removeView();
                this._renderedView = nextView;
                var nextMarkup = nextView.renderView(this._depth + 1);
                //TODO: Insert nextMarkup into root node of this view
            }
        },

        copyFrom: function(nextView) {
            //May require extra logic
            this._super(nextView);
        },

        static: {

            ViewPhase: {
                RENDERING: 'RENDERING',
                UPDATING_PROPS: 'UPDATING_PROPS',
                UPDATING_STATE: 'UPDATING_STATE',
                REMOVING: 'REMOVING'
            }
        }
    });

})(window.uibase);