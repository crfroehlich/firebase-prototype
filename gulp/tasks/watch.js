(function () {
    var WATCH_OPT_RE, content, gulp, gutil, key, lr, match, value, watch_opts, _ref;

    gulp = require('gulp');

    gutil = require('gulp-util');

    content = require('../util/files');

    lr = require('gulp-livereload');

    WATCH_OPT_RE = /^WATCH_(.*)$/;

    watch_opts = {};

    _ref = process.env;
    for (key in _ref) {
        value = _ref[key];
        match = WATCH_OPT_RE.exec(key);
        if (!match) {
            break;
        }
        watch_opts[match[1]] = value;
    }

    gulp.task('watch', function () {
        lr.listen();
        gulp.watch(['./src/**/*.tag', './src/**/*.js'], watch_opts, ['browserify-dev']);
        gulp.watch(['./dist/ThinkWater.js']).on('change', lr.changed);
        gulp.watch(['./test/**/*.coffee'], watch_opts, ['browserify-test']);
        gulp.watch(['./**/*.cson'], watch_opts, ['cson']);
        return gulp.watch(['./src/**/*.tmpl'], watch_opts, ['inject']);
    });

    gulp.task('watch-src', ['compile-src'], function () {
        gulp.watch(['./src/**/*.tag', './src/**/*.js'], watch_opts, ['compile-src']);
        return gulp.watch(['./test/**/*.coffee'], watch_opts, ['compile-src']);
    });

}).call(this);
