'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var Switch = require('comp.Switch');

var TodoView = require('./todo');

var Todos = ub.createView({
    
    config: {
        todos: {
            optional: true,
            default: []
        }
    },
    
    inputs: {
        todos: 'createTodoViews.input'
    },
    
    outputs: {
        destroy: 'switch.destroy'
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
        createTodoViews: {
            type: Map,
            mapper: function (todos) {
                return todos.map(function(t) {
                    return ub.Component.create({
                        type: TodoView,
                        todo: t
                    });
                });
            }
        },
        switch: {
            type: Switch
        },
        wrapInLi: {
            type: Map,
            mapper: function (todovs) {
                return todovs.map(function(tv) {
                    return {
                        type: ub.HtmlElement,
                        tag: 'li',
                        props: {
                            children: [ tv ],
                            key: tv.config.todo.get('id')
                        }
                    };
                });
            }
        }
    },

    connections: {
        collectTodos: [ 'createTodoViews.output', 'wrapInLi.input' ],
        storeTodos: [ 'createTodoViews.output', 'switch.input' ],
        update: [ 'wrapInLi.output', 'root.children' ]
    },

    picture: function () {
        return this.components.root;
    }

});

module.exports = Todos;

