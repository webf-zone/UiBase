'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var Button = require('comp.Button');
var Checkbox = require('comp.Checkbox');

require('./todo.css');

var Todo = ub.createView({

    config: {
        todo: {
            optional: false
        }
    },
    
    components: {
        markComplete: {
            type: Checkbox,
            props: {
                cls: 'mark-complete'
            }
        },
        completeMap: function(self) {
            return {
                type: Map,
                mapper: function() {
                    return self.config.todo
                }
            };
        },
        destroyBtn: {
            type: Button,
            text: '✖',
            props: {
                cls: 'destroy'
            }
        },
        destroyMap: function (self) {
            return {
                type: Map,
                mapper: function () {
                    return self.config.todo;
                }
            };
        }
    },
    
    connections: {
        complete: [ 'markComplete.change', 'completeMap.input' ],
        destroy: [ 'destroyBtn.click', 'destroyMap.input' ]
    },
    
    outputs: {
        destroy: 'destroyMap.output'
    },
    
    picture: function () {
        var self = this;

        return {
            type: ub.HtmlElement,
            tag: 'div',
            props: {
                children: [
                    {
                        type: ub.HtmlElement,
                        tag: 'span',
                        props: {
                            children: self.config.todo.get('description')
                        },
                        text: self.config.todo.get('description')
                    },
                    self.components.destroyBtn
                ],
                cls: 'todo ' + (self.config.todo.get('completed') ? 'completed' : 'active')
            }
        };
    }
});

module.exports = Todo;