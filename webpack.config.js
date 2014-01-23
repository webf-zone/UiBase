'use strict';

var path = require('path');

module.exports = {
    cache: true,
    entry: {
        uibase: './src/core.js'
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
            { test: /\.css$/,    loader: 'style-loader!css-loader' },
        ]
    },
    plugins: []
};