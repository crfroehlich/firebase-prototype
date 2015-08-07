var browserify = require('browserify');
var watchify = require('watchify');
var Logger = require('../util/bundleLogger');
var notify = require('../util/notify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var pkg = require('../../package.json');
var riotify = require('riotify');
var argv = require('yargs').argv;
var transforms = [riotify];

var config = function (app) {
    app = app || 'ThinkWater';
    var path = '';
    switch (app) {
        case 'ThinkWater':
            path = '/' + app;
            break;
        case 'frontend':
            path = '/' + app;
            break;
    }
    return {
        dev: {
            entries: '.' + path + '/src/entry.js',
            export: {
                glob: '.' + path + '/src/tags/**/*.tag',
                cwd: '.' + path + '/src/tag'
            },
            filename: app + '.js',
            dest: '.' + path + '/dist',
            transforms: transforms,
            debug: true,
            fullPaths: true
        },
        release: {
            entries: '.' + path + '/src/entry.js',
            export: {
                glob: '.' + path + '/src/tags/**/*.tag',
                cwd: '.' + path + '/src/tags'
            },
            filename: app + '.min.js',
            transforms: transforms,
            debug: true,
            dest: '.' + path + '/dist',
            fullPaths: false
        }
    }
};

var runbrowserify = function (name, app) {
    var standalone = '';
    switch (app) {
        case 'ThinkWater':
            standalone = 'ThinkWater';
            break;
        case 'frontend':
            standalone = 'FrontEnd';
            break;
    }

    var module;
    var bundleLogger = new Logger(name);
    var cfg = config(app)[name];
    var bundleMethod = (global.isWatching ? watchify : browserify);
    var bundleCfg = {
        entries: cfg.entries,
        fullPaths: false,
        extensions: ['.tag'],
        debug: true,
        bundleExternal: false,
        standalone: standalone
    };
    var bundler = bundleMethod(bundleCfg);
    //_ref = cfg.transforms;
    //for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    //    transform = _ref[_i];
    //    switch (transform) {
    //    case 'uglifyify':
    //        bundler.transform({
    //            global: true
    //        }, transform);
    //        break;
    //    case 'minifyify':
    //        bundler.plugin(transform, {
    //            output: cfg.dest + '/' + cfg.filename
    //        });
    //        break;
    //    default:
    //        bundler.transform(riotify);
    //    }
    //}

    for (module in pkg['dependencies']) {
        bundler.external(module);
    }
    for (module in pkg['browser']) {
        bundler.external(module);
    }
    var bundle = function () {
        bundleLogger.start();
        return bundler.bundle()
            .on('error', handleErrors)
            .pipe(source(cfg.filename))
            .pipe(gulp.dest(cfg.dest))
            .pipe(notify.message('Finished bundling ' + name))
            .on('end', function () {
                return bundleLogger.end();
            });
    };
    if (global.isWatching) {
        bundler.on('update', bundle);
    }
    return bundle();
};

gulp.task('browserify', ['browserify-dev', 'browserify-release']);

gulp.task('browserify-dev', function () {
    var app = argv.app || 'ThinkWater';
    return runbrowserify('dev', app);
});

gulp.task('browserify-release', function () {
    var app = argv.app || 'ThinkWater';
    return runbrowserify('release', app);
});