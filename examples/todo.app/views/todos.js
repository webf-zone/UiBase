'use strict';

var ub = require('uibase');
var Map = require('comp.Map');

var TodoView = require('./todo');

var Todos = ub.createView({
    
    config: {
        todos: {
            optional: true,
            default: []
        }
    },
    
    inputs: {
        todos: 'mapper.input'
    },
    
    outputs: {
        destroy: true
    },
    
    components: {
        root: {
            type: ub.HtmlElement,
            tag: 'ul',
            props: {
                id: 'todo-list',
                cls: 'todos'
            }
        },
        mapper: {
            type: Map,
            mapper: function (todos) {
                return todos.map(function(t) {
                    return {
                        type: ub.HtmlElement,
                        tag: 'li',
                        props: {
                            children: [{
                                type: TodoView,
                                todo: t
                            }]
                        }
                    };
                });
            }
        }
    },

    connections: {
        update: [ 'mapper.output', 'root.children' ]
    },
    
    picture: function () {
        var self = this;

        return this.components.root;
    }

});

module.exports = Todos;

