'use strict';

var ub = require('uibase');
var Textbox = require('comp.Textbox');
var Filter = require('comp.Filter');
var SampleOn = require('comp.SampleOn');

var Todos = require('./todos');
var TodoFooter = require('./todoFooter');
var CreateTodo = require('../domain/services/createTodo');
var QueryTodos = require('../domain/services/queryTodos');
var DeleteTodo = require('../domain/services/deleteTodo');

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

        todoFooter: { type: TodoFooter },

        sampleOn: { type: SampleOn },

        createTodo: { type: CreateTodo },
        
        queryTodos: { type: QueryTodos },

        queryTodosNoFilters: { type: QueryTodos },

        deleteTodos: { type: DeleteTodo },
        
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
        showCountOnLoad: [ 'this.load', 'queryTodosNoFilters.filters' ],
        detectEnter: [ 'textbox.keypress', 'enterFilter.input' ],
        getValue: [ 'textbox.value', 'sampleOn.value' ],
        storeValue: [ 'enterFilter.output', 'sampleOn.sampleOn' ],
        createNew: [ 'sampleOn.output', 'createTodo.description' ],
        deleteTodo: [ 'todos.destroy', 'deleteTodos.todo' ],
        updateList: [ 'createTodo.todos', 'todos.todos' ],
        updateList2: [ 'queryTodos.todos', 'todos.todos' ],
        updateList3: [ 'deleteTodos.todos', 'todos.todos' ],
        updateCount: [ 'createTodo.todos', 'todoFooter.todos' ],
        updateCount2: [ 'queryTodosNoFilters.todos', 'todoFooter.todos' ],
        updateCount3: [ 'deleteTodos.todos', 'todoFooter.todos' ],
        filterList: [ 'todoFooter.filterValue', 'queryTodos.filters' ]
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
                                    props: {
                                        children: 'todos'
                                    }
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
                    },
                    this.components.todoFooter
                ]
            }
        };
    }
});

module.exports = TodoApp;