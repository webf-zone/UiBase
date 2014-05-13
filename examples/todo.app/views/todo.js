'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var Button = require('comp.Button');

require('./todo.css');

var Todo = ub.createView({

    config: {
        todo: {
            optional: false
        }
    },
    
    components: {
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
        destroy: [ 'destroyBtn.click', 'destroyMap.input' ]
    },
    
    output: {
        destroy: 'destroyMap.output'
    },
    
    picture: function () {
        var self = this;

        return {
            type: ub.HtmlElement,
            tag: 'div',
            props: {
                children:[
                    {
                        type: ub.HtmlElement,
                        tag: 'span',
                        props: {
                            cls: self.config.todo.get('completed') ? 'completed' : 'active',
                            children: self.config.todo.get('description')
                        },
                        text: self.config.todo.get('description')
                    },
                    self.components.destroyBtn
                ],
                cls: 'todo'
            }
        };
    }
});

module.exports = Todo;
