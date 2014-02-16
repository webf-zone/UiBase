'use strict';

var path = require('path');

module.exports = {
    cache: true,
    entry: {
        'uibase': './src/core.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/',
        filename: '[name].js',
        chunkFilename: '[chunkhash].js',
        library: 'uibase'
    },
    module: {
        loaders: [
            // required to write "require('./style.css')"
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    },
    plugins: [],
    resolve: {
        alias: {
            browserEvent: path.join(__dirname, 'src/browserEvent.js'),
            complexView: path.join(__dirname, 'src/complexView.js'),
            component: path.join(__dirname, 'src/component.js'),
            dispatcher: path.join(__dirname, 'src/dispatcher.js'),
            htmlElement: path.join(__dirname, 'src/htmlElement.js'),
            model: path.join(__dirname, 'src/model.js'),
            observable: path.join(__dirname, 'src/observable'),
            observer: path.join(__dirname, 'src/observer.js'),
            repository: path.join(__dirname, 'src/repository.js'),
            router: path.join(__dirname, 'src/router.js'),
            view: path.join(__dirname, 'src/view.js'),
            utils: path.join(__dirname, 'src/utils/utils.js'),
            uibase: path.join(__dirname, 'src/core.js'),

            'comp.Label': path.join(__dirname, 'src/views/label.js'),
            'comp.Button': path.join(__dirname, 'src/views/button.js'),
            'comp.Delay': path.join(__dirname, 'src/components/delay.js'),
            'comp.Collate': path.join(__dirname, 'src/components/collate.js'),
            'comp.Count': path.join(__dirname, 'src/components/count.js')
        }
    }
};