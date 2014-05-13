'use strict';

var ub = require('uibase');
var Map = require('comp.Map');

require('./layout.css');

var DIRECTIONS = {
    vertical: 'down',
    horizontal: 'right',
    'to right': 'right',
    'to left': 'left',
    'to top': 'up',
    'to bottom': 'down'
};

var CLASSES = {
    item: 'layout-item'
};

var Layout = ub.createView({

    config: {
        direction: {
            optional: true,
            default: DIRECTIONS.vertical,
            assert: function(val) {
                return !!DIRECTIONS[val];
            }
        },
        children: {
            optional: true,
            default: []
        },
        wrapperTag: {
            optional: true,
            default: 'div'
        },
        itemTag: {
            optional: true,
            default: 'div'
        }
    },

    inputs: {
        children: 'wrapper.input'
    },

    components: {
        root: function(self) {
            return {
                type: ub.HtmlElement,
                tag: self.config.wrapperTag,
                props: {
                    cls: 'ub-comp-layout ' + DIRECTIONS[self.config.direction]
                }
            };
        },
        wrapper: {
            type: Map,
            mapper: function(children) {
                var wrapped = children.map(function(child) {
                    return {
                        type: ub.HtmlElement,
                        tag: 'div',
                        props: {
                            cls: CLASSES.item,
                            children: [ child ]
                        }
                    };
                });

                return wrapped;
            }
        }
    },

    connections: {
        insert: [ 'wrapper.output', 'root.children' ]
    },

    picture: function() {
        return this.components.root;
    }
});

module.exports = Layout;
