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

        renderView: function(mountDepth) {
            this._super(mountDepth);

            this._phase = ub.ComplexView.RENDERING;

            this._renderedView = this.render();

            var markup = this._renderedView.renderView(mountDepth + 1);

            return markup;
        },

        isRendered: function() {
            return this._compoundPhase !== ub.ComplexView.ViewPhase.RENDERING &&
                this._phase === ub.View.ViewPhase.RENDERED;
        },

        static: {

            ViewPhase: {
                RENDERING: 'RENDERING'
            }
        }
    });

})(window.uibase);