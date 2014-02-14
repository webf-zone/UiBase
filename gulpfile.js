'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var webpackConfig = require('./webpack.config.js');

// Production build
gulp.task('build', ['webpack:build'], function() {
    console.log('Done');
});

var prodConfig = Object.create(webpackConfig);
prodConfig.entry = {
    'uibase.min': webpackConfig.entry.uibase,
    'ub-components.min': webpackConfig.entry.components
};

gulp.task('webpack:build', function(callback) {
    // modify some webpack config options
    prodConfig.plugins = prodConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('uibase.min.js')
    );

    // run webpack
    webpack(prodConfig, function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('build-dev', ['webpack:build-dev'], function() {
    console.log('Done');
});
// modify some webpack config options
var devConfig = Object.create(webpackConfig);
devConfig.devtool = 'inline-source-map';
devConfig.debug = true;
devConfig.output.filename = '[name].js';
devConfig.entry = {
    'uibase': webpackConfig.entry.uibase
};
devConfig.plugins = devConfig.plugins.concat(
    new webpack.optimize.CommonsChunkPlugin('uibase.js')
);

// create a single instance of the compiler to allow caching
var devCompiler = webpack(devConfig);

gulp.task('webpack:build-dev', ['lint'], function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError('webpack:build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('lint', function() {
    return gulp.src('./src/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

var testConfig = Object.create(webpackConfig);
testConfig.devtool = 'inline-source-map';
testConfig.debug = true;
testConfig.cache = true;
testConfig.entry = {
    'dummy': path.join(__dirname, 'tests/__dummy__.js'),
    'specs': [
        path.join(__dirname, 'tests/utils/utils.js'),
        path.join(__dirname, 'tests/views/button.js'),
        path.join(__dirname, 'tests/views/delay-test.js')
    ]
};
testConfig.output = {
    path: path.join(__dirname, 'tests/build'),
    publicPath: 'tests/build/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
};
testConfig.target = 'web';
testConfig.plugins = devConfig.plugins.concat(
    new webpack.optimize.CommonsChunkPlugin('uibase.js')
);

gulp.task('build-test', ['lint'], function(cb) {
    webpack(testConfig, function(err, stats) {
        if(err) throw new gutil.PluginError('test', err);
        gutil.log('[test]', stats.toString({
            colors: true
        }));

        fs.unlink('tests/build/dummy.js');
        cb(err);
    });
});

gulp.task('test', ['build-test'], function(cb) {
    var mochaPhantomjs = spawn('node_modules/.bin/mocha-phantomjs', ['tests/uibase-test.html']);
    mochaPhantomjs.stdout.pipe(process.stdout);
    mochaPhantomjs.stderr.pipe(process.stderr);
    mochaPhantomjs.on('exit', function(code){
        if (code === 127) { print("Perhaps phantomjs is not installed?\n"); }
        cb();
        process.exit(code);
    });
});
