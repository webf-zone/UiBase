'use strict';

var ub = require('uibase');
var LocalStorage = require('store.LocalStorage');

var Todo = require('../models/todo');

var QueryTodos = ub.createComponent({

    inputs: {
        filters: {},
        repository: {
            default: new ub.Repository(Todo, LocalStorage, 'todos-uibase')
        }
    },

    components: {
        filter: {
            type: 'Map',
            mapper: function (todos) {
                todos.filter(function (todo) {
                    return inputs.filters === 'completed' ? todo.completed :
                            inputs.filters === 'active' ? !todo.completed : true;
                });
            }
        }
    },

    body: function (inputs) {
        var todos = inputs.repository.query(inputs.filters);
        var filtered = this.apply('mapper', {input: todos});

        return {
            todos: filtered
        };
    },
    
    beh: {
        filters: {
            success: function (filters) {
                var self = this;
                
                return {
                    todos: function (done) {
                        self.config.repository.query(filters, function (todos) {
                            done(todos.filter(function (todo) {
                                return filters === 'completed' ? todo.completed :
                                    filters === 'active' ? !todo.completed : true;
                            }));
                        });
                    }
                };
            }
        }
    }
    
});

module.exports = QueryTodos;
