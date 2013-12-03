(function(ub) {

    'use strict';

    ub.Views = ub.Views || {};

    ub.Views.SimpleHtmlElement = ub.Utils.Class({

        extends: ub.ComplexView,

        construct: function() {
            var self = this;

            self._super();

            self.state.seconds = 0;

            setTimeout(function() {
                self._updateTime();
            }, 500);
        },

        _updateTime: function() {
            var view = this;

            view.setState({
                seconds: view.state.seconds + 1
            });

            setTimeout(function() {
                view._updateTime();
            }, 1000);
        },

        render: function() {
            var view = this;

            return new ub.Views.HtmlElement({
                tag: 'div',
                props: {
                    children: [
                        new ub.Views.HtmlElement({
                            tag: 'span',
                            props: {
                                children: 'Seconds Passed: '
                            }
                        }),
                        new ub.Views.HtmlElement({
                            tag: 'span',
                            props: {
                                style: {
                                    'font-weight': 'bold'
                                },
                                children: view.state.seconds
                            }
                        })
                    ]
                }
            });
        }
    });

})(window.uibase);