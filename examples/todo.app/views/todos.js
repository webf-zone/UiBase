'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var Switch = require('comp.Switch');

var TodoView = require('./todo');

var Todos = ub.createView({
    
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

    inputs: {
        todos: {
            default: []
        }
    },

    body: function (inputs) {
        var todoViews = ub.apply('createTodoViews', {input: inputs.todos});
        var lis = ub.apply('wrapInLi', {input: todoViews.output});
        ub.send('root', {children: lis.output});

        return {
            destroy: todoViews.output.map(function (tv) { return tv.outputs.destroy; })
        };
    },

    picture: function () {
        return this.components.root;
    }

});

module.exports = Todos;

