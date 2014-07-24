'use strict';

var ub = require('uibase');
var Map = require('comp.Map');
var Label = require('comp.Label');

var TodoFilters = require('./todoFilters.js');

require('./todoFooter.css');

var TodoFooter = ub.createView({

    components: {
        activeCounter: {
            type: Map,
            mapper: function (todos) {
                return todos.filter(function (todo) {
                    return !todo.get('completed');
                }).length;
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

    inputs: {
        todos: {
            default: []
        }
    },

    body: function (inputs) {
        var count    = ub.apply('activeCounter', {input: inputs.todos});
        var itemsTxt = ub.apply('itemsTextGenerator', {input: count.output});
        var filter   = ub.apply('todoFilters', {});

        ub.apply('countLabel', {text: count.output}, { text: function (c) { return String(c); }});
        ub.apply('itemLabel', {text: itemsTxt.output});

        return {
            filterValue: filter.value
        };
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
