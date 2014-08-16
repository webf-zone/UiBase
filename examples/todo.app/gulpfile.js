'use strict';

var gulp = require('gulp');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var cssify = require('cssify');
var aliases = require('../../aliases');
var aliasify = require('aliasify').configure(aliases);

gulp.task('build-dev', function() {
    return browserify({
            entries: [ './views/todoapp.js' ],
            debug : true,
            standalone: 'UIBCurrentViewConstructor'
        })
        .external('uibase')
        .external('jquery')
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./build'));
});
