module.exports = {

    aliases: {
        browserEvent: './src/browserEvent.js',
        complexView: './src/complexView.js',
        component: './src/component.js',
        dispatcher: './src/dispatcher.js',
        htmlElement: './src/htmlElement.js',
        model: './src/model.js',
        observable: './src/observable',
        observer: './src/observer.js',
        repository: './src/repository.js',
        router: './src/router.js',
        view: './src/view.js',
        utils: './src/utils/utils.js',

        'comp.Label': './src/views/label.js',
        'comp.Button': './src/views/button.js',
        'comp.Layout': './src/views/layout.js',
        'comp.Textbox': './src/views/textbox.js',
        'comp.Map': './src/components/map.js',
        'comp.Delay': './src/components/delay.js',
        'comp.Collate': './src/components/collate.js',
        'comp.Count': './src/components/count.js',
        'comp.Filter': './src/components/filter.js',
        'comp.SampleOn': './src/components/sampleOn.js',
        
        'store.LocalStorage': './src/stores/localstorage.js'
    },
    configDir: __dirname,
    verbose: false
};
