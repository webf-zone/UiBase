'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var Label = require('comp.Label');

var TodoFilters = require('./todoFilters.js');

require('./todoFooter.css');

var TodoFooter = ub.createView({

    config: {},

    inputs: {
        todos: 'activeCounter.input'
    },

    outputs: {
        filterValue: 'todoFilters.value',
        clearCompleted: true
    },

    components: {
        activeCounter: {
            type: Map,
            mapper: function (todos) {
                return todos.filter(function (todo) {
                    return !todo.get('completed');
                }).length;
            }
        },

        countStrGenerator: {
            type: Map,
            mapper: function (count) {
                return String(count);
            }
        },

        itemsTextGenerator: {
            type: Map,
            mapper: function (count) {
                return count === 1 ? 'item' : 'items';
            }
        },

        countLabel: {
            type: ub.HtmlElement,
            tag: 'strong'
        },

        itemLabel: {
            type: Label,
            text: 'items'
        },

        todoFilters: {
            type: TodoFilters
        }
    },

    connections: {
        countStr: [ 'activeCounter.output', 'countStrGenerator.input' ],
        itemStr: [ 'activeCounter.output', 'itemsTextGenerator.input' ],

        updateCountStr: [ 'countStrGenerator.output', 'countLabel.children' ],
        updateItemStr: [ 'itemsTextGenerator.output', 'itemLabel.text' ]
    },

    picture: function () {
        return {
            type: ub.HtmlElement,
            tag: 'footer',
            props: {
                id: 'footer',
                children: [
                    {
                        type: ub.HtmlElement,
                        tag: 'span',
                        props: {
                            id: 'todo-count',
                            children: [
                                this.components.countLabel,
                                {
                                    type: Label,
                                    props: {
                                        children: ' '
                                    }
                                },
                                this.components.itemLabel,
                                {
                                    type: Label,
                                    props: {
                                        children: ' left'
                                    }
                                }
                            ]
                        }
                    },
                    this.components.todoFilters
                ]
            }
        };
    }
});

module.exports = TodoFooter;
