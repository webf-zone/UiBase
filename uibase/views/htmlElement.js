(function(ub) {
    "use strict";

    ub.Views = ub.Views || {};

    var CONTENT_TYPE = {'string': true, 'number': true};

    /**
     * Basic DOM element view. This should be used for all defining HTML tags.
     * @class HtmlElement
     * @extends View
     */
    ub.Views.HtmlElement = ub.Utils.Class({

        extends: ub.View,

        /**
         * @constructor
         * @param config
         */
        construct: function(config) {
            var self = this,
                hasClosingTag;

            self._super(config);

            self.tag = config.tag;
            self.props.text = config.text;

            hasClosingTag = config.hasClosingTag !== undefined ? config.hasClosingTag : true;
            self._tagClose = hasClosingTag ? '</' + this.tag + '>' : '';
        },

        /**
         * Render this view the first time
         * @method renderView
         * @param depth Number
         * @returns String
         */
        renderView: function(depth) {
            this._super(depth);
            //TODO: Validate props
            return this._createOpenTagMarkup() + this._createContentMarkup() + this._tagClose;
        },

        _updateView: function(prevProps, prevParent) {
            this._super(prevProps, prevParent);

            this._updateProps(prevProps);
            this._updateChildren();
        },

        /**
         * Create markup string for the opening tag of the HTML view
         * @method _createOpenTagMarkup
         * @returns String
         * @private
         */
        _createOpenTagMarkup: function () {
            var self = this,
                props = this.props,
                ret = '<' + this.tag;

            for (var propKey in props) {
                if (!props.hasOwnProperty(propKey)) {
                    continue;
                }
                var propValue = props[propKey];
                if (propValue == null) {
                    continue;
                }
                if (propKey === 'events') {
                    propValue.forEach(function(event) {
                        self.addOutPort(event, ub.BrowserEvent.addListener(event, self));
                    });
                } else {
                    if (propKey === 'style') {
                        if (propValue) {
                            propValue = $.extend({}, props.style, propValue);
                        }
                        propValue = this._createMarkupForStyles(propValue);
                    }
                    var markup = this._createMarkupForProperty(propKey, propValue);

                    if (markup) {
                        ret += ' ' + markup;
                    }
                }
            }

            return ret + ' >';
        },

        /**
         * Create HTML markup for property value pair
         * @method _createMarkupForProperty
         * @param name
         * @param value
         * @returns String
         * @private
         */
        _createMarkupForProperty: function(name, value) {
            if (name === 'children') {
                return '';
            } else {
                return name + '=' + value;
            }
        },

        /**
         * Create HTML markup for style property
         * @method _createMarkupForStyles
         * @param styles
         * @returns String|null
         * @private
         */
        _createMarkupForStyles: function(styles) {
            var serialized = '';
            for (var styleName in styles) {
                if (!styles.hasOwnProperty(styleName)) {
                    continue;
                }
                var styleValue = styles[styleName];
                if (styleValue !== null && styleValue !== undefined) {
                    serialized += styleName + ':';
                    serialized += styleValue + ';';
                }
            }
            return serialized || null;
        },

        /**
         * @method _createContentMarkup
         * @returns String
         * @private
         */
        _createContentMarkup: function() {
            var contentToUse = CONTENT_TYPE[typeof this.props.children] ? this.props.children : null;
            var childrenToUse = contentToUse != null ? null : this.props.children;

            if (contentToUse != null) {
                return contentToUse;
            } else if(childrenToUse != null) {
                var renderedChildren = this.renderChildren(childrenToUse);

                return renderedChildren.join('');
            }
            return '';
        },

        _updateProps: function(prevProps) {
            var currentProps = this.props,
                propKey;
            var prevStyle;
            var styleName;
            var styleUpdates;

            for (propKey in prevProps) {
                if (currentProps.hasOwnProperty(propKey) ||
                    !prevProps.hasOwnProperty(propKey)) {
                    continue;
                }

                if (propKey === 'style') {
                    prevStyle = prevProps[propKey];
                    for (styleName in prevStyle) {
                        if (prevStyle.hasOwnProperty(styleName)) {
                            styleUpdates = styleUpdates || {};
                            styleUpdates[styleName] = '';
                        }
                    }
                } else if (propKey === 'events') {
                    //Don't know what to do yet
                } else {
                    this.removeProperty(propKey);
                }
            }
            for (propKey in currentProps) {
                var currentProp = currentProps[propKey];
                var prevProp = prevProps[propKey];

                if (!currentProp.hasOwnProperty(propKey) || currentProp === prevProp) {
                    continue;
                }

                if (propKey === 'style') {
                    if (currentProp) {
                        currentProps.style = currentProp;
                    }
                    if (prevProp) {
                        for (styleName in prevProp) {
                            if (prevProp.hasOwnProperty(styleName) &&
                                !currentProp.hasOwnProperty(styleName)) {
                                styleUpdates = styleUpdates || {};
                                styleUpdates[styleName] = '';
                            }
                        }
                        for (styleName in currentProp) {
                            if (currentProp.hasOwnProperty(styleName) &&
                                prevProp[styleName] !== prevProp[styleName]) {
                                styleUpdates = styleUpdates || {};
                                styleUpdates[styleName] = nextProp[styleName];
                            }
                        }
                    } else {
                        styleUpdates = currentProp;
                    }
                } else if (propKey === 'events') {
                    currentProp.forEach(function(event) {
                        self.addOutPort(event, ub.BrowserEvent.addListener(event, self));
                    });
                } else {
                    this.updateProperty(propKey, currentProp);
                }

                if (styleUpdates) {
                    this.updatesStyles(styleUpdates);
                }
            }
        },

        _updateChildren: function() {

        },

        /**
         * @method render
         * @returns HtmlElement
         */
        render: function() {
            var self = this;

            return self;
        }
    });

})(window.uibase);
