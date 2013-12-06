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

        renderView: function(depth) {
            this._super(depth);

            this._compoundPhase = ub.ComplexView.RENDERING;

            this._renderedView = this.render();

            var markup = this._renderedView.renderView(depth + 1);

            return markup;
        },

        setState: function(partialState) {
            this.replaceState($.extend({}, this._futureState || this.state, partialState));
        },

        replaceState: function(state) {
            if (!(this.isRendered() || this._compoundPhase === ub.ComplexView.RENDERING)) {
                throw new Error('State can be updated only when view is rendered or rendering.');
            }

            if (this._compoundPhase !== ub.ComplexView.UPDATING_STATE &&
                this._compoundPhase !== ub.ComplexView.REMOVING) {
                throw new Error('Cannot update state for a view when it is being removed or when it\'s state is being updated');
            }

            this._futureState = state;

            ub.View.enqueueUpdate(this);
        },

        updateView: function() {
            if (this._futureProps == null &&
                this._futureState == null) {
                return;
            }


        },
        _updateView: function() {

        },

        static: {

            ViewPhase: {
                RENDERING: 'RENDERING',
                UPDATING_STATE: 'UPDATING_STATE',
                REMOVING: 'REMOVING'
            }
        }
    });

})(window.uibase);