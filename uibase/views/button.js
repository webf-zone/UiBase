(function(ub) {
    'use strict';

    ub.Views = ub.Views || {};

    ub.Views.Button = ub.Utils.createView({

        config: {
            text: {
                optional: true,
                default: '',
                type: 'string'
            }
        },

        inPorts: {
            text: {},
            click: {}
        },

        outPorts: {
            click: true
        },

        beh: {
            click: {
                success: function(e) { return { click: e }; }
            }
        },

        picture: function() {
            return {
                name: ub.Views.HtmlElement,
                tag: 'button',
                children: this.config.text,
                props: {
                    compName: 'root',
                    events: [ 'click' ]
                }
            };
        }
    });

})(window.uibase);
