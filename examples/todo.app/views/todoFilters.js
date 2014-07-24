'use strict';

var ub = require('uibase');
var Map = require('comp.Map');

require('./todoFilters.css');

var TodoFilters = ub.createView({

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

    body: function () {
        var allClickE       = this.apply('allFilter');
        var activeClickE    = this.apply('activeFilter');
        var completedClickE = this.apply('completedFilter');

        return {
            value: ub.apply('valueExtractor', {
                input: [allClickE.click, activeClickE.click, completedClickE.click]
            })
        };
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
