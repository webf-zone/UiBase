'use strict';

var ub = require('uibase');
var Textbox = require('comp.Textbox');
var Filter = require('comp.Filter');
var SampleOn = require('comp.SampleOn');

var Todos = require('./todos');
var CreateTodo = require('../domain/services/createTodo');
var QueryTodos = require('../domain/services/queryTodos');

require('./todoapp.css');

var TodoApp = ub.createView({

    components: {

        enterFilter: {
            type: Filter,
            test: function(e) {
                return e.which === 13;
            }
        },
        
        todos: { type: Todos },

        sampleOn: { type: SampleOn },

        createTodo: { type: CreateTodo },
        
        queryTodos: { type: QueryTodos },
        
        /** Views **/
        textbox: {
            type: Textbox,
            props: {
                id: 'new-todo',
                placeholder: 'What needs to be done?'
            }
        }
    },
    
    connections: {
        showOnLoad: [ 'this.load', 'queryTodos.filters' ],
        detectEnter: [ 'textbox.keypress', 'enterFilter.input' ],
        getValue: [ 'textbox.value', 'sampleOn.value' ],
        storeValue: [ 'enterFilter.output', 'sampleOn.sampleOn' ],
        createNew: [ 'sampleOn.output', 'createTodo.description' ],
        updateList: [ 'createTodo.todos', 'todos.todos' ],
        updateList2: [ 'queryTodos.todos', 'todos.todos' ]
    },
    
    picture: function() {
        return {
            type: ub.HtmlElement,
            tag: 'section',
            props: {
                id: 'todoapp',
                children: [
                    {
                        type: ub.HtmlElement,
                        tag: 'header',
                        props: {
                            id: 'header',
                            children: [
                                {
                                    type: ub.HtmlElement,
                                    tag: 'h1',
                                    text: 'todos'
                                },
                                this.components.textbox
                            ]
                        }
                    },
                    {
                        type: ub.HtmlElement,
                        tag: 'section',
                        props: {
                            id: 'main',
                            children: [
                                this.components.todos
                            ]
                        }
                    }
                ]
            }
        };
    }
});

module.exports = TodoApp;
