var browserify = require('browserify');
var Logger = require('../util/bundleLogger');
var notify = require('../util/notify');
var gulp = require('gulp');
var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var pkg = require('../../package.json');
var concat = require('gulp-concat');
var argv = require('yargs').argv;

var runconcat = function () {
    var module, path;
    var bundleLogger = new Logger('vendor');
    bundleLogger.start();
    var libs = (function () {
        var _ref = pkg['browser'];
        var _results = [];
        for (module in _ref) {
            path = _ref[module];
            _results.push(require.resolve('../.' + path));
        }
        return _results;
    })();
    return gulp.src(libs).pipe(concat('vendor.js')).pipe(gulp.dest('./dist')).pipe(notify.message('Vendor bundle complete.')).on('error', handleErrors).on('end', function () {
        return bundleLogger.end();
    });
};

var runbrowserify = function (app) {
    var module;
    var bundleLogger = new Logger('vendor-browserify');
    var bundler = browserify();

    for (module in pkg['dependencies']) {
        bundler.require(module);
    }
    for (module in pkg['browser']) {
        bundler.require(module);
    }
    for (module in pkg['optionalDependencies']) {
        bundler.require(module);
    }
    
    bundleLogger.start();
    //bundler.transform();
    return bundler.bundle()
        .on('error', handleErrors)
        .pipe(source('vendor.js'))
        .pipe(gulp.dest('./'+app+'/dist'))
        .pipe(notify.message('Finished bundling vendor packages to '+app + '/dist'))
        .on('end', function () {
            return bundleLogger.end();
        });
};

gulp.task('vendor', function () {
    var app = argv.app || 'ThinkWater';
    return runbrowserify(app);
});


