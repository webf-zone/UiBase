'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var _ = require('lodash');

var gulp = require('gulp');
var gutil = require('gulp-util');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var browserify = require('gulp-browserify');
var cssify = require('cssify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var aliases = require('./aliases');
var aliasify = require('aliasify').configure(aliases);

var coreBrowserifyConfig = {
    debug : true,
    transform: [ aliasify, cssify ],
    extensions: [ '.css' ],
    shim: {
        jquery: {
            path: 'node_modules/jquery/dist/jquery.js',
            exports: '$'
        }
    }
};

var componentsBrowserifyConfig = {
    debug : false,
    transform: [ aliasify, cssify ],
    extensions: [ '.css' ],
    external: [
        'uibase',
        'jquery'
    ]
};

/* Production build */
gulp.task('build', function() {
    return gulp.src('src/core.js', { read: false })
        .pipe(browserify(_.merge(coreBrowserifyConfig, { debug: false })))
        .on('prebundle', function(bundle) {
            bundle.require(__dirname + '/src/core.js', { expose: 'uibase' });
        })
        .pipe(uglify())
        .pipe(rename('uibase.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-dev', function() {
    return gulp.src('src/core.js', { read: false })
        .pipe(browserify(coreBrowserifyConfig))
        .on('prebundle', function(bundle) {
            bundle.require(__dirname + '/src/core.js', { expose: 'uibase' });
        })
        .pipe(rename('uibase.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-components-dev', function() {
    return gulp.src('src/components/*.js', { read: false })
        .pipe(browserify(componentsBrowserifyConfig))
        .on('prebundle', function(bundle) {
            Object.keys(aliases.aliases).forEach(function(alias) {
                if (/^comp\./.test(alias)) {
                    bundle.require(path.join(__dirname, aliases.aliases[alias]), { expose: alias });
                }
            });
        })
        .pipe(rename('uibase-components.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-components', function() {
    return gulp.src('src/components/*.js', { read: false })
        .pipe(browserify(componentsBrowserifyConfig))
        .on('prebundle', function(bundle) {
            Object.keys(aliases.aliases).forEach(function(alias) {
                if (/^comp\./.test(alias)) {
                    bundle.require(path.join(__dirname, aliases.aliases[alias]), { expose: alias });
                }
            });
        })
        .pipe(uglify())
        .pipe(rename('uibase-components.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
    return gulp.src(['./src/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('build-test', ['lint'], function() {
    return gulp.src([ './tests/utils/*.js', './tests/views/*.js' ])
        .pipe(concat('specs.js'))
        .pipe(browserify(componentsBrowserifyConfig))
        .pipe(rename('specs.js'))
        .pipe(gulp.dest('./tests/build'));
});

gulp.task('test', ['build-test'], function(cb) {
    var mochaPhantomjs = spawn('node_modules/.bin/mocha-phantomjs', ['tests/uibase-test.html']);
    mochaPhantomjs.stdout.pipe(process.stdout);
    mochaPhantomjs.stderr.pipe(process.stderr);
    mochaPhantomjs.on('exit', function(code){
        if (code === 127) { print('Perhaps phantomjs is not installed?\n'); }
        cb();
        process.exit(code);
    });
});
