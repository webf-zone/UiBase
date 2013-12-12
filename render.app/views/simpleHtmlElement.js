(function(ub) {

    'use strict';

    ub.Views = ub.Views || {};

    var startSeconds = Number(new Date());

    ub.Views.SimpleHtmlElement = ub.Utils.Class({

        extends: ub.ComplexView,

        construct: function() {
            var self = this;

            self._super();

            self.state.seconds = 0;
            startSeconds = Number(new Date());

            setTimeout(function() {
                self._updateTime();
            }, 500);
        },

        _updateTime: function() {
            var view = this;

            view.setState({
                seconds: parseInt((Number(new Date()) - startSeconds) / 1000, 10)
            });

            setTimeout(function() {
                view._updateTime();
            }, 1000);
        },

        render: function() {
            var view = this;

            var unit = view.state.seconds === 0 ?
                undefined : view.state.seconds === 1 ?
                new ub.Views.HtmlElement({
                    tag: 'span',
                    props: {
                        children: 'Sec'
                    }
                })
                :
                new ub.Views.HtmlElement({
                    tag: 'span',
                    props: {
                        children: 'Secs'
                    }
                });

            var items = [
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
                            'font-weight': 'bold',
                            'color': view.state.seconds < 10 ? '#444' : '#FF0000'
                        },
                        children: view.state.seconds
                    }
                })
            ];

            if (unit) {
                items.push(unit);
            }

            return new ub.Views.HtmlElement({
                tag: 'div',
                props: {
                    children: items
                }
            });
        }
    });

})(window.uibase);