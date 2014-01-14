(function(ub) {
    'use strict';

    ub.Views = ub.Views || {};

    ub.Views.Button = ub.Utils.createView({

        config: {
            text: {
                optional: true,
                default: '',
                type: 'string'
            },
            disabled: {
                optional: true,
                default: false,
                type: 'boolean'
            }
        },

        inputs: {
            click: {},
            text: {},
            disabled: {}
        },

        outputs: {
            click: true
        },

        beh: {
            click: {
                success: function(e) { return { click: e }; }
            },
            text: {
                success: function(txt) {
                    return {
                        picture: { text: txt }
                    };
                }
            },
            disabled: {
                success: function(disabled) {
                    var nextClick = disabled ? function() {} : function(e) { return {click: e}; };
                    return {
                        next: {
                            click: {success: nextClick}
                        },
                        picture: { disabled: disabled }
                    };
                }
            }
        },

        picture: function(config) {
            return {
                name: ub.Views.HtmlElement,
                tag: 'button',
                children: config.text,
                props: {
                    disabled: config.disabled,
                    compName: 'root',
                    events: [ 'click' ]
                }
            };
        }
    });

})(window.uibase);
