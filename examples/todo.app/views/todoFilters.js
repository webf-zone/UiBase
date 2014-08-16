'use strict';

var ub = require('uibase');
var Map = require('comp.Map');

require('./todoFilters.css');

var SingleFilter = ub.createView({
    config: {
        text: {
            optional :false
        },
        value: {
            optional :false
        }
    },
    inputs: {
        filterValue: 'classNameGetter.input'
    },
    outputs: {
        click: 'root.events.click'
    },
    connections: {
        applyClass: [ 'classNameGetter.output', 'root.props.style' ]
    },
    components: {
        classNameGetter: function () {
            var self = this;
            return {
                type: Map,
                mapper: function (value) {
                    if (value !== self.config.value) {
                        return { 'font-weight': 'normal' };
                    } else {
                        return { 'font-weight': 'bold' };
                    }
                }
            };
        },
        root: function () {
            return {
                type: ub.HtmlElement,
                tag: 'a',
                props: {
                    children: this.config.text,
                    href: 'todos/#/' + this.config.value,
                    events: [ 'click' ]
                }
            };
        }
    },
    picture: function () {
        return this.components.root;
    }
});

var TodoFilters = ub.createView({

    config: {},

    inputs: {},

    outputs: {
        value: 'valueExtractor.output'
    },

    components: {
        allFilter: {
            type: SingleFilter,
            text: 'All',
            value: 'all'
        },
        activeFilter: {
            type: SingleFilter,
            tag: 'a',
            text: 'Active',
            value: 'active'
        },
        completedFilter: {
            type: SingleFilter,
            tag: 'a',
            text: 'Completed',
            value: 'completed'
        },
        valueExtractor: {
            type: Map,
            mapper: function (e) {
                var hash = location.href.split('#'),
                    value = '';

                if (hash.length > 1) {
                    value = hash[1].split('/')[1];
                }

                return value === '' ? 'all' : value;
            }
        }
    },

    connections: {
        calcFilterValOnLoad: [ 'this.load', 'valueExtractor.input' ],
        handleAll: [ 'allFilter.click', 'valueExtractor.input' ],
        handleActive: [ 'activeFilter.click', 'valueExtractor.input' ],
        handleCompleted: [ 'completedFilter.click', 'valueExtractor.input' ],
        listenToFilterChange: [ 'valueExtractor.output', [
            'allFilter.filterValue',
            'activeFilter.filterValue',
            'completedFilter.filterValue'
        ]]
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
