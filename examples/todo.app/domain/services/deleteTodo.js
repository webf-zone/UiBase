'use strict';

var ub = require('uibase');
var LocalStorage = require('store.LocalStorage');

var Todo = require('../models/todo');

var DeleteTodo = ub.createComponent({
    
    config: {
        repository: {
            optional: true,
            default: new ub.Repository(Todo, LocalStorage, 'todos-uibase')
        }
    },
    
    inputs: { todo: {} },
    
    outputs: { todos: true },

    beh: {
        todo: {
            success: function (todo) {
                var self = this;
                
                return {
                    todos: function (done) {
                        self.config.repository.remove(todo, function () {
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

module.exports = DeleteTodo;

