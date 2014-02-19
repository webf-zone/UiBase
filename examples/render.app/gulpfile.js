'use strict';

var gulp = require('gulp');

var browserify = require('gulp-browserify');
var cssify = require('cssify');
var aliases = require('../../aliases');

gulp.task('build-dev', function() {
    return gulp.src('views/index.js')
        .pipe(browserify({
            debug : true,
            transform: [ cssify ],
            extensions: [ '.css' ],
            standalone: 'UIBCurrentViewConstructor',
            external: [ 'uibase', 'jquery' ]
        }))
        .on('prebundle', function(bundle) {
            Object.keys(aliases.aliases).forEach(function(alias) {
                if (/^comp\./.test(alias)) {
                    bundle.external(alias);
                }
            });
        })
        .pipe(gulp.dest('./build'));
});
