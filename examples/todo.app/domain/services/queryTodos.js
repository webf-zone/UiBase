'use strict';

var ub = require('uibase');
var LocalStorage = require('store.LocalStorage');

var Todo = require('../models/todo');

var QueryTodos = ub.createComponent({
    
    config: {
        repository: {
            optional: true,
            default: new ub.Repository(Todo, LocalStorage, 'todos-uibase')
        }
    },
    
    inputs: { filters: {} },
    
    outputs: { todos: true },
    
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
