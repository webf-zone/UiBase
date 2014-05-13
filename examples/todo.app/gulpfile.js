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
            extensions: [ '.css' ]
        })
        /*
        .on('prebundle', function(bundle) {
            Object.keys(aliases.aliases).forEach(function(alias) {
                if (/^comp\./.test(alias)) {
                    bundle.external(alias);
                }
            });
        })
        */
        .external('uibase')
        .external('jquery')
        .transform(aliasify)
        .transform(cssify)
        .bundle({ standalone: 'UIBCurrentViewConstructor' })
        .pipe(source('index.js'))
        .pipe(gulp.dest('./build'));
});
