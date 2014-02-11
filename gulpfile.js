'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var webpackConfig = require('./webpack.config.js');

// Production build
gulp.task('build', ['lint', 'webpack:build'], function() {
    console.log('Done');
});

var prodConfig = Object.create(webpackConfig);
prodConfig.entry = {
    'uibase.min': webpackConfig.entry.uibase
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
        new webpack.optimize.UglifyJsPlugin()
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

gulp.task('build-dev', ['lint', 'webpack:build-dev'], function() {
    console.log('Done');
});
// modify some webpack config options
var devConfig = Object.create(webpackConfig);
devConfig.devtool = 'sourcemap';
devConfig.debug = true;
devConfig.output.filename = '[name].js';
devConfig.entry = {
    'uibase': webpackConfig.entry.uibase
};

// create a single instance of the compiler to allow caching
var devCompiler = webpack(devConfig);

gulp.task('webpack:build-dev', function(callback) {
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
