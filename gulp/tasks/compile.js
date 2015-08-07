(function() {
  var gulp;

  gulp = require('gulp');

  gulp.task('build', ['compile', 'test', 'watch']);

  gulp.task('compile', ['compile-src']);

  gulp.task('compile-src', ['browserify-dev']);

  gulp.task('compile-all', ['vendor', 'browserify']);

  gulp.task('default', ['build']);

}).call(this);
