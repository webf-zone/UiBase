'use strict';

var ub = require('uibase');

var Selectbox = ub.createView({

    config: {
        options: {
            optional: true,
            default: []
        }
    },
    
    picture: function () {
        return {
            type: ub.HtmlElement,
            tag: 'select',
            events: [ 'change' ],
            children: this.config.options.map(function (option) {
                return {
                    type: ub.HtmlElement,
                    tag: 'option',
                    text: option.text,
                    props: {
                        value: option.value
                    }
                };
            })
        };
    }
});

module.exports = Selectbox;
