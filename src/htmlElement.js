'use strict';

var $ = require('jquery');
var utils = require('./utils/utils');
var View = require('./view');
var BrowserEvent = require('./browserEvent.js');

var CONTENT_TYPE = {'string': true, 'number': true};

/**
 * Basic DOM element view. This should be used for all defining HTML tags.
 * @class HtmlElement
 * @extends View
 */
var HtmlElement = utils.Class({

    extends: View,

    /**
     * @constructor
     * @param config
     */
    construct: function(config) {
        var self = this;

        self._super(config);

        self.tag = config.tag;
    },

    /**
     * Render this view the first time
     * @method renderView
     * @param depth Number
     * @returns String
     */
    renderView: function(rootId, depth) {
        this._super(rootId, depth);
        //TODO: Validate props
        return this._createElement().html(this._createContentMarkup()).prop('outerHTML');
    },

    updateView: function(prevProps, prevParent) {
        this._super(prevProps, prevParent);

        this._updateDomProps(prevProps);
        this._updateDomChildren(prevProps);
    },

    removeView: function() {
        //TODO: Detach event listeners
        this._super();
        this.removeChildren();
    },

    /**
     * Create a jQuery object of the element
     * @method _createElement
     * @returns jQuery
     * @private
     */
    _createElement: function() {
        var self = this,
            props = this.props,
            ret = $('<' + this.tag + '>');

        function addEventListener(event) {
            self.addOutPort(event, BrowserEvent.addListener(event, self));
        }

        for (var propKey in props) {
            if (!props.hasOwnProperty(propKey)) {
                continue;
            }
            var propValue = props[propKey];
            if (propValue == null) {
                continue;
            }
            if (propKey === 'events') {
                propValue.forEach(addEventListener);
            } else {
                if (propKey === 'style') {
                    if (propValue) {
                        propValue = $.extend({}, props.style, propValue);
                    }
                    ret.css(propValue);
                }
                ret.prop(propKey, propValue);
            }
        }

        return ret.attr(View.UBID_ATTR_NAME, this._rootId);
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

    _updateDomProps: function(prevProps) {
        var self = this,
            nextProps = this.props,
            propKey,
            prevStyle,
            styleName,
            styleUpdates = {};

        function addEventListener(event) {
            self.addOutPort(event, BrowserEvent.addListener(event, self));
        }

        for (propKey in prevProps) {
            // If this property is being added
            if (nextProps.hasOwnProperty(propKey) ||
                !prevProps.hasOwnProperty(propKey)) {
                continue;
            }

            if (propKey === 'style') {
                prevStyle = prevProps[propKey];
                for (styleName in prevStyle) {
                    if (prevStyle.hasOwnProperty(styleName)) {
                        styleUpdates[styleName] = '';
                    }
                }
            } else if (propKey === 'events') {
                // Don't know what to do yet
            } else {
                this.removeProperty(propKey);
            }
        }
        for (propKey in nextProps) {
            var nextProp = nextProps[propKey];
            var prevProp = prevProps[propKey];

            // If the property value has not changed
            if (!nextProps.hasOwnProperty(propKey) || nextProp === prevProp) {
                continue;
            }

            if (propKey === 'style') {
                if (nextProp) {
                    nextProps.style = nextProp;
                }
                if (prevProp) {
                    for (styleName in prevProp) {
                        if (prevProp.hasOwnProperty(styleName) &&
                            !nextProp.hasOwnProperty(styleName)) {
                            styleUpdates[styleName] = '';
                        }
                    }
                    for (styleName in nextProp) {
                        if (nextProp.hasOwnProperty(styleName) &&
                            prevProp[styleName] !== nextProp[styleName]) {
                            styleUpdates = styleUpdates || {};
                            styleUpdates[styleName] = nextProp[styleName];
                        }
                    }
                } else {
                    styleUpdates = nextProp;
                }
            } else if (propKey === 'events') {
                nextProp.forEach(addEventListener);
            } else {
                if (propKey !== 'children') {
                    this.updateProperty(propKey, nextProp);
                }
            }

            if (styleUpdates) {
                this.updateStyles(styleUpdates);
            }
        }
    },

    _updateDomChildren: function(prevProps) {
        var nextProps = this.props;

        var prevContent = CONTENT_TYPE[typeof prevProps.children] ?
            prevProps.children : null;
        var nextContent = CONTENT_TYPE[typeof nextProps.children] ?
            nextProps.children : null;

        var prevChildren = prevContent != null ? null : prevProps.children;
        var nextChildren = nextContent != null ? null : nextProps.children;

        if (prevChildren != null && nextChildren == null) {
            this.updateChildren(null);
        } else if (prevContent != null && !(nextContent != null)) {
            this.updateTextContent('');
        }

        if (nextContent != null) {
            if (prevContent !== nextContent) {
                this.updateTextContent(nextContent);
            }
        } else {
            this.updateChildren(nextChildren);
        }
    },

    removeProperty: function(prop) {
        var node = this.getNode();
        node.removeProp(prop);
    },

    updateProperty: function(name, value) {
        var node = this.getNode();
        if (value != null) {
            node.prop(name, value);
        } else {
            this.removeProperty(name);
        }
    },

    updateStyles: function(styles) {
        var node = this.getNode();

        node.css(styles);
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

module.exports = HtmlElement;