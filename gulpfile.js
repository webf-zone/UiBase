'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;

var _ = require('lodash');

var gulp = require('gulp');
var gutil = require('gulp-util');
var istanbul = require('gulp-istanbul');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var browserify = require('browserify');
var cssify = require('cssify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var buffer = require('gulp-buffer');
var source = require('vinyl-source-stream');

var aliases = require('./aliases');
var aliasify = require('aliasify').configure(aliases);

var coreBrowserifyConfig = {
    debug : false,
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

var getFilesInDir = function (dir) {
    return fs.readdirSync(dir).map(function (path) {
        return dir + '/' + path;
    });
};

/* Production build */
gulp.task('build', function() {
    return browserify(_.merge(coreBrowserifyConfig, {
            entries: [__dirname + '/src/core.js']
        }))
        .transform(aliasify)
        .transform(cssify)
        .bundle({ standalone: 'uibase' })
        .pipe(source('uibase.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-dev', function() {
    return browserify(_.merge(coreBrowserifyConfig, {
            debug: true,
            entries: [__dirname + '/src/core.js']
        }))
        .transform(aliasify)
        .transform(cssify)
        .bundle({ standalone: 'uibase' })
        .pipe(source('uibase.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-instrumented', function(cb) {
    var aliases = require('./aliases');
    aliases.aliases = Object.keys(aliases.aliases).reduce(function(store, alias) {
        store[alias] = './instrumented/' + aliases.aliases[alias];
        return store;
    }, {});
    var aliasify = require('aliasify').configure(aliases);

    gulp.src([ 'src/**/*.js' ])
        .pipe(istanbul())
        .pipe(gulp.dest('./instrumented/src'))
        .on('end', function() {
            browserify(_.merge(coreBrowserifyConfig, {
                entries: ['instrumented/src/core.js']
            }))
            .transform(aliasify)
            .transform(cssify)
            .bundle({ standalone: 'uibase' })
            .pipe(source('uibase.inst.js'))
            .pipe(gulp.dest('./dist'))
            .on('end', cb);
        });
});

gulp.task('coverage-report', [ 'build-instrumented' ], function(cb) {
    var mochaPhantomjs = spawn('node_modules/.bin/mocha-phantomjs', [
        '-R', 'tap',
        'tests/uibase-test-instrumented.html'
    ]);
    var covStream = fs.createWriteStream('coverage.json', { flags: 'a' });
    mochaPhantomjs.stdout.pipe(covStream);
    mochaPhantomjs.stderr.pipe(process.stderr);
    mochaPhantomjs.on('exit', function(code) {
        if (code === 127) { print('Perhaps phantomjs is not installed?\n'); }

        fs.readFile('coverage.json', function(err, data) {
            if (err) throw err;

            var lines = data.toString('utf-8').split('\n');

            var testCases = lines[0].split('..')[1];
            var coverageData = lines[+testCases + 1];

            fs.writeFileSync('coverage-cleaned.json', coverageData);

            var istanbulCmd = spawn('node_modules/.bin/istanbul', ['report', 'html', 'coverage-cleaned.json']);
            istanbulCmd.on('exit', function() {
                fs.unlink('coverage.json');
                fs.unlink('coverage-cleaned.json');
                fs.unlink('dist/uibase.inst.js');
                cb();
                process.exit(code);
            });
        });
    });
});

var components = getFilesInDir('./src/components')
    .concat(getFilesInDir('./src/views'));

gulp.task('build-components-dev', function() {
    return browserify(_.merge(componentsBrowserifyConfig, {
        debug: true,
        entries: components
    }))
    .external('uibase')
    .external('jquery')
    .on('prebundle', function(bundle) {
        Object.keys(aliases.aliases).forEach(function(alias) {
            if (/^comp\./.test(alias)) {
                bundle.require(path.join(__dirname, aliases.aliases[alias]), { expose: alias });
            }
        });
    })
    .transform(aliasify)
    .transform(cssify)
    .bundle()
    .pipe(source('uibase-components.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-components', function() {
    return browserify(_.merge(componentsBrowserifyConfig, {
        entries: components
    }))
    .external('uibase')
    .external('jquery')
    .on('prebundle', function(bundle) {
        Object.keys(aliases.aliases).forEach(function(alias) {
            if (/^comp\./.test(alias)) {
                bundle.require(path.join(__dirname, aliases.aliases[alias]), { expose: alias });
            }
        });
    })
    .transform(aliasify)
    .transform(cssify)
    .bundle()
    .pipe(source('uibase-components.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
    return gulp.src(['./src/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

var testFiles = getFilesInDir('./tests/utils')
    .concat(getFilesInDir('./tests/components'))
    .concat(getFilesInDir('./tests/views'));

gulp.task('build-test', ['lint'], function() {
    return browserify(_.merge(componentsBrowserifyConfig, {
        debug: true,
        entries: testFiles
    }))
    .external('uibase')
    .external('jquery')
    .transform(aliasify)
    .transform(cssify)
    .bundle()
    .pipe(source('specs.js'))
    .pipe(buffer())
    .pipe(concat('specs.js'))
    .pipe(gulp.dest('./tests/build'));
});

gulp.task('build-all', [
    'build-dev',
    'build',
    'build-components-dev',
    'build-components',
    'build-test'
], function() {});

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
