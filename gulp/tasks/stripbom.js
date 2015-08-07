(function() {
  var gulp = require('gulp');
  var stripBom = require('gulp-stripbom');
  var paths = [
      './frontend/**/*.js',
      './frontend/**/*.tag',
      './frontend/**/*.scss',
      './frontend/**/*.css',
      './*.tmpl',
      './*.html',
      './ThinkWater/**/*.js',
      './ThinkWater/**/*.tag',
      './ThinkWater/**/*.css',
      './ThinkWater/**/*.scss',
      './ThinkWater/**/*.tmpl',
      './ThinkWater/**/*.html'
      ];

  /*
   Bump the version in bower and package json
   */

  gulp.task('stripBom', function() {
    return gulp.src(paths, {
      base: './'
    }).pipe(stripBom()).pipe(gulp.dest('./'));
  });

}).call(this);
