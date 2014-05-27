'use strict';

var ub = require('uibase');
var Map = require('comp.Map');

require('./todoFilters.css');

var TodoFilters = ub.createView({

    config: {},

    inputs: {},

    outputs: {
        value: 'valueExtractor.output'
    },

    components: {
        allFilter: {
            type: ub.HtmlElement,
            tag: 'a',
            props: {
                children: 'All',
                href: 'todos/#/',
                events: [ 'click' ]
            }
        },
        activeFilter: {
            type: ub.HtmlElement,
            tag: 'a',
            props: {
                children: 'Active',
                href: 'todos/#/active',
                events: [ 'click' ]
            }
        },
        completedFilter: {
            type: ub.HtmlElement,
            tag: 'a',
            props: {
                children: 'Completed',
                href: 'todos/#/completed',
                events: [ 'click' ]
            }
        },
        valueExtractor: {
            type: Map,
            mapper: function (e) {
                var value = e.target.href.split('#')[1].split('/')[1];

                return value === '' ? 'all' : value;
            }
        }
    },

    connections: {
        handleAll: [ 'allFilter.events.click', 'valueExtractor.input' ],
        handleActive: [ 'activeFilter.events.click', 'valueExtractor.input' ],
        handleCompleted: [ 'completedFilter.events.click', 'valueExtractor.input' ]
    },

    picture: function () {
        return {
            type: ub.HtmlElement,
            tag: 'ul',
            props: {
                id: 'filters',
                children: [
                    {
                        type: ub.HtmlElement,
                        tag: 'li',
                        props: {
                            children: [ this.components.allFilter ]
                        }
                    },
                    {
                        type: ub.HtmlElement,
                        tag: 'li',
                        props: {
                            children: [ this.components.activeFilter ]
                        }
                    },
                    {
                        type: ub.HtmlElement,
                        tag: 'li',
                        props: {
                            children: [ this.components.completedFilter ]
                        }
                    }
                ]
            }
        };
    }
});

module.exports = TodoFilters;
