'use strict';

var ub = require('uibase');
var Map = require('comp.Map');

require('./layout.css');

var DIRECTIONS = {
    vertical: 'vertical',
    horizontal: 'horizontal'
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
                tag: 'div',
                props: {
                    class: 'ub-comp-layout ' + self.config.direction
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
                            class: CLASSES.item,
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