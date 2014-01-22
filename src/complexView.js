'use strict';

var utils = require('./utils/utils');
var Class = require('./utils/class');
var View = require('./view');

/**
 * @class ComplexView
 * @extends View
 */
var ComplexView = Class({

    extends: View,

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
        return this._compoundPhase !== ComplexView.ViewPhase.RENDERING &&
            this._phase === View.ViewPhase.RENDERED;
    },

    renderView: function(rootId, depth) {
        this._super(rootId, depth);

        this._compoundPhase = ComplexView.ViewPhase.RENDERING;
        this._renderedView = this._getRenderedView();
        this._compoundPhase = null;

        var markup = this._renderedView.renderView(rootId, depth + 1);

        return markup;
    },

    _getRenderedView: function() {
        var renderedView = null;

        View.currentParent = this;

        try {
            renderedView = this.render();
        } catch (error) {
            throw error;
        } finally {
            View.currentParent = null;
        }

        return renderedView;
    },

    setState: function(partialState) {
        this.replaceState(utils.extend({}, this._futureState || this.state, partialState));
    },

    replaceState: function(state) {
        if (!(this.isRendered() || this._compoundPhase === ComplexView.RENDERING)) {
            throw new Error('State can be updated only when view is rendered or rendering.');
        }

        if (this._compoundPhase === ComplexView.ViewPhase.UPDATING_STATE ||
            this._compoundPhase === ComplexView.ViewPhase.REMOVING) {
            throw new Error('Cannot update state for a view when it is being removed or when it\'s state is being updated');
        }

        this._futureState = state;

        View.enqueueUpdate(this);
    },

    updateViewIfRequired: function() {
        var compoundPhase = this._compoundPhase;

        if (compoundPhase === ComplexView.ViewPhase.RENDERING ||
            compoundPhase === ComplexView.ViewPhase.UPDATING_PROPS) {
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

            this._compoundPhase = ComplexView.ViewPhase.UPDATING_PROPS;
            // TODO: Have a hook here
        }

        this._compoundPhase = ComplexView.ViewPhase.UPDATING_STATE;

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

        nextView = this._getRenderedView();

        if (prevView && nextView &&
            prevView.constructor === nextView.constructor &&
            prevView.parent === nextView.parent) {
            prevView.copyFrom(nextView);
        } else {
            prevView.removeView();
            this._renderedView = nextView;
            var nextMarkup = nextView.renderView(this._depth + 1);

            this.getNode().html(nextMarkup);
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

module.exports = ComplexView;