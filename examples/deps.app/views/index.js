var Index = uibase.utils.createView({
    picture: function() {
        return {
            name: uibase.HtmlElement,
            tag: 'span',
            children: 'Hello World from Deps application!',
            props: {
                id: 'btn'
            }
        };
    }
});

module.exports = Index;