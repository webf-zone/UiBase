'use strict';

var ub = require('uibase');
var LocalStorage = require('store.LocalStorage');

var Todo = require('../models/todo');

var CreateTodo = ub.createComponent({
    
    config: {
        repository: {
            optional: true,
            default: new ub.Repository(Todo, LocalStorage, 'todos-uibase')
        }
    },
    
    inputs: { description: {} },
    
    outputs: { todos: true },
    
    beh: {
        description: {
            success: function (desc) {
                var self = this,
                    todo = new Todo(desc);
                
                return {
                    todos: function (done) {
                        self.config.repository.insert(todo, function () {
                            self.config.repository.query({}, function (todos) {
                                done(todos);
                            });
                        });
                    }
                };
            }
        }
    }
    
});

module.exports = CreateTodo;
