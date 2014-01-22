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
    renderView: function(rootId, depth) {
        this._super(rootId, depth);
        //TODO: Validate props
//            return this._createOpenTagMarkup() + this._createContentMarkup() + this._tagClose;
        return this._createOpenTagMarkup().html(this._createContentMarkup()).prop('outerHTML');
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
     * Create markup string for the opening tag of the HTML view
     * @method _createOpenTagMarkup
     * @returns String
     * @private
     */
    /*
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

     return ret + ' ' + ub.View.UBID_ATTR_NAME + '="' + this._rootId + '">';
     },
     */
    _createOpenTagMarkup: function() {
        var self = this,
            props = this.props,
            ret = $('<' + this.tag + '>');

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
                    self.addOutPort(event, BrowserEvent.addListener(event, self));
                });
            } else {
                if (propKey === 'style') {
                    if (propValue) {
                        propValue = $.extend({}, props.style, propValue);
                    }
                    ret.css(propValue);
                }
                //var markup = this._createMarkupForProperty(propKey, propValue);
                ret.prop(propKey, propValue);
            }
        }

//            return ret + ' ' + ub.View.UBID_ATTR_NAME + '="' + this._rootId + '">';
        return ret.attr(View.UBID_ATTR_NAME, this._rootId);
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

    _updateDomProps: function(prevProps) {
        var self = this,
            nextProps = this.props,
            propKey,
            prevStyle,
            styleName,
            styleUpdates;

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
                        styleUpdates = styleUpdates || {};
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
                            styleUpdates = styleUpdates || {};
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
                nextProp.forEach(function(event) {
                    self.addOutPort(event, BrowserEvent.addListener(event, this));
                });
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
        node.removeProp(name);
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