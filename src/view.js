'use strict';

var $ = require('jquery');
var utils = require('utils');
var Component = require('component');
var Observer = require('observer');

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
            window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var updateDepth = 0;

/**
 * This is the main View class. It is Component that can be rendered.
 *
 * @class View
 * @extends Component
 */
var View = utils.Class({

    extends: Component,

    /**
     * @constructor
     */
    construct: function(config) {
        var self = this;

        config = config || {};
        self.props = config.props || {};
        self.parent = View.currentParent;
        self._phase = View.ViewPhase.REMOVED;
        self._futureProps = null;
        self._futureParent = null;
        self._events = config.events || [];

        self._super();
    },

    /**
     * @method renderView
     * @param rootId
     * @param depth
     * @returns String
     */
    renderView: function(rootId, depth) {
        var view = this;

        if (view.isRendered()) {
            throw new Error('renderView: Can only render a un-rendered view');
        }

        if (this.props.compName != null) {
            this.parent.addCompToCreator(this, this.props.compName);
        }

        view._rootId = rootId;
        view._phase = View.ViewPhase.RENDERED;
        view._depth = depth;

        return '';
    },

    updateViewIfRequired: function() {
        this._updateViewIfRequired();
    },

    _updateViewIfRequired: function() {
        if (!this._futureProps) {
            return;
        }

        var prevProps = this.props,
            prevParent = this.parent;

        this.props = this._futureProps;
        this.parent = this._futureParent;
        this._futureProps = null;

        this.updateView(prevProps, prevParent);
    },

    updateView: function(prevProps, prevParent) {
        var props = this.props;

        if (this.parent !== prevParent || props.compName !== prevProps.compName) {
            if (prevProps.compName != null) {
                prevParent.removeCompFromCreator(this, prevProps.compName);
            }
            if (this.props.compName != null) {
                this.parent.addCompToCreator(this, this.props.compName);
            }
        }
    },

    setProps: function(partialProps) {
        this.replaceProps(utils.extend({}, this._futureProps || this.props, partialProps));
    },

    replaceProps: function(props) {
        if (!this.isRendered()) {
//            throw new Error('Props can be updated only when view is rendered.');
            this.props = utils.extend(this.props, props);
            return;
        }

        this._futureProps = props;

        View.enqueueUpdate(this);
    },

    copyFrom: function(nextView) {
        if (!this.isRendered()) {
            throw new Error('Only a rendered view can be updated');
        }

        this._futureParent = nextView.parent;
        this._futureProps = nextView.props;
        this._updateViewIfRequired();
    },

    removeView: function() {
        if (!this.isRendered()) {
            throw new Error('Can only remove a rendered view');
        }

        var props = this.props;
        if (props.compName != null) {
            this.parent.removeCompFromCreator(this, this.props.compName);
        }

        this._phase = View.ViewPhase.REMOVED;
    },

    renderChildren: function(childrenToUse) {
        var view = this;
        var index = 0;
        var renderedMarkup = [];
        var children = childrenToUse.reduce(function(result, child, idx) {
            var name = child.getKey(idx);
            result[name] = child;

            return result;
        }, {});

        view._renderedChildren = children;

        for (var name in children) {
            var child = children[name];

            if (children.hasOwnProperty(name) && child) {
                var renderImage = child.renderView(view._rootId + name, view._depth + 1);

                child._renderImage = renderImage;
                child._renderIndex = index;

                renderedMarkup.push(renderImage);

                index += 1;
            }
        }

        return renderedMarkup;
    },

    removeChildren: function() {
        var renderedChildren = this._renderedChildren;

        for (var name in renderedChildren) {
            var renderedChild = renderedChildren[name];
            if (renderedChild && renderedChild.removeView) {
                renderedChild.removeView();
            }
        }

        this._renderedChildren = null;
    },

    updateChildren: function(nextChildren) {
        updateDepth += 1;

        try {
            this._updateChildren(nextChildren);
        } catch (error) {
            updateDepth -= 1;
            if (updateDepth === 0) {
                View.clearChildUpdateQueue();
            }
            throw error;
        }
        updateDepth--;
        if (updateDepth === 0) {
            View.processChildUpdateQueue();
        }
    },

    _updateChildren: function(children) {
        if (children == null) { return; }
        var nextChildren = children.reduce(function(result, child, idx) {
            var name = child.getKey(idx);
            result[name] = child;

            return result;
        }, {});
        var prevChildren = this._renderedChildren;

        if (!nextChildren && !prevChildren) {
            return;
        }


        var name;
        // `nextIndex` will increment for each child in `nextChildren`, but
        // `lastIndex` will be the last index visited in `prevChildren`.
        var lastIndex = 0;
        var nextIndex = 0;

        for (name in nextChildren) {
            if (!nextChildren.hasOwnProperty(name)) {
                continue;
            }

            var prevChild = prevChildren && prevChildren[name];
            var nextChild = nextChildren[name];

            if (prevChild && nextChild &&
                prevChild.constructor === nextChild.constructor &&
                prevChild.parent === nextChild.parent) {

                this.moveChild(prevChild, nextIndex, lastIndex);
                lastIndex = Math.max(prevChild._renderIndex, lastIndex);
                prevChild.copyFrom(nextChild);
                prevChild._renderIndex = nextIndex;
            } else {
                if (prevChild) {
                    lastIndex = Math.max(prevChild._renderIndex, lastIndex);
                    this.removeChildByName(prevChild, name);
                }
                if (nextChild) {
                    this.renderChildByNameAtIndex(nextChild, name, nextIndex);
                }
            }
            if (nextChild) {
                nextIndex++;
            }
        }

        for (name in prevChildren) {
            if (prevChildren.hasOwnProperty(name) &&
                prevChildren[name] &&
                !(nextChildren && nextChildren[name])) {
                this.removeChildByName(prevChildren[name], name);
            }
        }
    },

    renderChildByNameAtIndex: function(child, name, index) {
        var rootID = this._rootId + name;

        child._renderImage = child.renderView(rootID, this._depth + 1);
        child._renderIndex = index;
        this.createChild(child);
        this._renderedChildren = this._renderedChildren || {};
        this._renderedChildren[name] = child;
    },

    createChild: function(child) {
        this.enqueueMarkup(child);
    },

    moveChild: function (child, toIndex, lastIndex) {
        if (child._renderIndex < lastIndex) {
            this.enqueueMove(this._rootId, child._renderIndex, toIndex);
        }
    },

    removeChild: function(child) {
        this.enqueueRemove(child._renderIndex);
    },

    removeChildByName: function(child, name) {
        if (child instanceof View) {
            this.removeChild(child);
            child._renderImage = null;
            child._renderIndex = null;
            child.removeView();

            delete this._renderedChildren[name];
        }
    },

    updateTextContent: function(nextContent) {
        updateDepth += 1;

        try {
            var prevChildren = this._renderedChildren;

            for (var name in prevChildren) {
                if (prevChildren.hasOwnProperty(name) &&
                    prevChildren[name]) {
                    this.removeChildByName(prevChildren[name], name);
                }
            }

            this.enqueueTextContent(nextContent);
        } catch (error) {
            updateDepth -= 1;
            if (updateDepth === 0) {
                View.clearChildUpdateQueue();
            }
        }

        updateDepth -= 1;
        if (updateDepth === 0) {
            View.processChildUpdateQueue();
        }
    },

    enqueueTextContent: function(nextContent) {
        View.childrenUpdateOpsQueue.push({
            type: View.ChildUpdateTypes.TEXT_CONTENT,
            parentNode: this,
            markup: null,
            textContent: nextContent,
            fromIndex: null,
            toIndex: null
        });
        /*
        View.childrenUpdateOpsQueue.push(function() {
            this.getNode().text(nextContent);
        }.bind(this));
        */
    },

    enqueueMarkup: function(child) {
        View.childrenUpdateOpsQueue.push({
            type: View.ChildUpdateTypes.INSERT_MARKUP,
            parentNode: this,
            markup: child._renderImage,
            textContent: null,
            fromIndex: null,
            toIndex: child._renderIndex
        });
        /*
        var parentNode = this.getNode();

        var children = parentNode.children();

        if (children[child._renderIndex] === child) {
            return;
        }

        if (child.parent === this) {
            this.removeChild(child);
        }

        if (child._renderIndex >= children.length) {
            parentNode.append(child._renderImage);
        } else {
            $(children[child._renderIndex]).before(child._renderImage);
        }
        */
    },

    enqueueRemove: function (renderIndex) {
        View.childrenUpdateOpsQueue.push({
            type: View.ChildUpdateTypes.REMOVE_NODE,
            parentNode: this,
            markup: null,
            textContent: null,
            fromIndex: renderIndex,
            toIndex: null
        });
        /*
        var parentNode = this.getNode();

        var childNode = parentNode.children().eq(renderIndex);

        childNode.remove();
        */
    },

    enqueueMove: function (rootId, renderIndex, toIndex) {
        View.childrenUpdateOpsQueue.push({
            type: View.ChildUpdateTypes.MOVE_EXISTING,
            parentNode: this,
            markup: null,
            textContent: null,
            fromIndex: renderIndex,
            toIndex: toIndex
        });
    },

    getKey: function(index) {
        if (this.props && this.props.key != null) {
            return '{' + this.props.key + '}';
        }

        return '[' + index + ']';
    },

    getNode: function() {
        return $('[' + View.UBID_ATTR_NAME + '=' + '"' + this._rootId + '"]');
    },

    addInPort: function(name, onNext) {
        var self = this;

        //TODO: Handle second argument being an Observer

        self.inputs[name] = new Observer(function() {
            onNext.apply(self, arguments);
//            View.enqueueUpdate(self);
        });
    },

    isRendered: function() {
        return this._phase === View.ViewPhase.RENDERED;
    },

    static: {

        UBID_ATTR_NAME: 'data-ubid',

        ubId: 5000,

        viewCache: {},

        currentParent: null,

        ViewPhase: {
            RENDERED: 'RENDERED',
            REMOVED: 'REMOVED'
        },

        dirtyViews: {},

        isBatching: false,

        ChildUpdateTypes: {
            INSERT_MARKUP: 0,
            MOVE_EXISTING: 1,
            REMOVE_NODE: 2,
            TEXT_CONTENT: 3
        },

        childrenUpdateOpsQueue: [],

        renderView: function(view, container) {

            if (!(view instanceof View)) {
                throw new Error('renderView(): passed in view is not valid');
            }

            var markup,
                rootId = 'ub[' + (View.ubId++).toString(23) + ']';

            View.viewCache[rootId] = view;

            markup = view.renderView(rootId, 0);
            $(container).html(markup);

//            if ('root' in view.components)
//                view.components.root.props.events.forEach(function(eventName) {
//                    if (view.inputs[eventName]) {
//                        Component.connect(
//                            view.components.root, eventName,
//                            view, eventName
//                        );
//                    }
//                });

            return view;
        },

        enqueueUpdate: function(view) {
            View.dirtyViews[view._rootId] = view;

            if (Object.keys(View.dirtyViews).length === 1 && !View.isBatching) {
                View.isBatching = true;
                View.startTicking();
            }
        },

        flushUpdates: function() {
            try {
                View.runUpdates();
            } catch(e) {
                throw e;
            } finally {
                View.clearUpdateQueue();
            }
        },

        clearUpdateQueue: function() {
            View.dirtyViews = {};
            View.isBatching = false;
        },

        runUpdates: function() {
            var views = Object.keys(View.dirtyViews).map(function(key) {
                return View.dirtyViews[key];
            }).sort(function(v1, v2) {
                    return v1._depth - v2._depth;
                });

            for (var i = 0; i < views.length; i++) {
                var view = views[i];
                if (view.isRendered()) {
                    view.updateViewIfRequired();
                }
            }
        },

        startTicking: function() {
            window.requestAnimationFrame(function() {
                View.flushUpdates();
            });
        },

        clearChildUpdateQueue: function() {
            View.childrenUpdateOpsQueue.length = 0;
        },

        processChildUpdateQueue: function() {
            /*
            View.childrenUpdateOpsQueue.forEach(function(op) {
                op();
            });
            */
            if (!View.childrenUpdateOpsQueue.length) {
                return;
            }
            var updates = View.childrenUpdateOpsQueue.slice(0);
            // Mapping from parent IDs to initial child orderings.
            var initialChildren = null;
            // List of children that will be moved or removed.
            var updatedChildren = null;

            updates.forEach(function (update) {
                if (update.type === View.ChildUpdateTypes.MOVE_EXISTING ||
                    update.type === View.ChildUpdateTypes.REMOVE_NODE) {
                    var updatedIndex = update.fromIndex;
                    var parentNode = update.parentNode.getNode().get(0);
                    var updatedChild = parentNode.childNodes[updatedIndex];
                    var parentId = update.parentNode._rootId;

                    initialChildren = initialChildren || {};
                    initialChildren[parentId] = initialChildren[parentId] || [];
                    initialChildren[parentId][updatedIndex] = updatedChild;

                    updatedChildren = updatedChildren || [];
                    updatedChildren.push(updatedChild);
                }
            });

            // Remove updated children first so that `toIndex` is consistent.
            if (updatedChildren) {
                for (var j = 0; j < updatedChildren.length; j++) {
                    updatedChildren[j].parentNode.removeChild(updatedChildren[j]);
                }
            }

            updates.forEach(function (update) {
                switch (update.type) {
                case View.ChildUpdateTypes.INSERT_MARKUP:
                    insertChildAt(
                        update.parentNode.getNode().get(0),
                        $(update.markup).get(0),
                        update.toIndex
                    );
                    break;
                case View.ChildUpdateTypes.MOVE_EXISTING:
                    insertChildAt(
                        update.parentNode.getNode().get(0),
                        initialChildren[update.parentNode._rootId][update.fromIndex],
                        update.toIndex
                    );
                    break;
                case View.ChildUpdateTypes.TEXT_CONTENT:
                    updateTextContent(
                        update.parentNode.getNode().get(0),
                        update.textContent
                    );
                    break;
                case View.ChildUpdateTypes.REMOVE_NODE:
                    // Already removed by the for-loop above.
                    break;
                }
            });

            View.clearChildUpdateQueue();
        }
    }
});

function insertChildAt (parentNode, childNode, index) {
    var childNodes = parentNode.childNodes;
    if ($(childNodes[index]).prop('outerHTML') === $(childNode).prop('outerHTML')) {
        return;
    }
    // If `childNode` is already a child of `parentNode`, remove it so that
    // computing `childNodes[index]` takes into account the removal.
    if (childNode.parentNode === parentNode) {
        parentNode.removeChild(childNode);
    }
    if (index >= childNodes.length) {
        parentNode.appendChild(childNode);
    } else {
        parentNode.insertBefore(childNode, childNodes[index]);
    }
}

var textContentAccessor = 'textContent' in document.createElement('div') ?
    'textContent' :
    'innerText';

var updateTextContent;
if (textContentAccessor === 'textContent') {
    /**
     * Sets the text content of `node` to `text`.
     *
     * @param {DOMElement} node Node to change
     * @param {string} text New text content
     */
    updateTextContent = function(node, text) {
        node.textContent = text;
    };
} else {
    /**
     * Sets the text content of `node` to `text`.
     *
     * @param {DOMElement} node Node to change
     * @param {string} text New text content
     */
    updateTextContent = function(node, text) {
        // In order to preserve newlines correctly, we can't use .innerText to set
        // the contents (see #1080), so we empty the element then append a text node
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        if (text) {
            var doc = node.ownerDocument || document;
            node.appendChild(doc.createTextNode(text));
        }
    };
}

module.exports = View;
