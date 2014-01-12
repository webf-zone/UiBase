(function(ub) {
    'use strict';

    ub.Views = ub.Views || {};

    ub.Views.Button = ub.Utils.createView({

        config: {
            text: {
                optional: true,
                default: '',
                type: 'string',
                constant: false
            },
            disabled: {
                optional: true,
                default: false,
                type: 'boolean',
                constant: false
            }
        },

        inPorts: {
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
                    disabled: this.config.disabled,
                    compName: 'root',
                    events: [ 'click' ]
                }
            };
        }
    });

})(window.uibase);
