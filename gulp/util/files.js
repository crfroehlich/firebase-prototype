(function() {
  var files, paths;

  paths = {
    release: './dist',
    lib: './bower_components',
    less: './src/less',
    coffee: './src/coffee',
    src: './src',
    test: './test',
    img: './src/images'
  };

  files = {
    index: './dist/release.html',
    devIndex: './src/dev.html',
    testIndex: './test/test.html',
    testIndexCoffee: './test/test.coffee.html',
    coffee: './src/coffee/**/*.coffee',
    less: './src/less/**/*.less',
    test: './test/**/*.coffee*',
    img: './src/images/**/*',
    app: ['*.html', './dist/**/*.html', './dist/**/*.js', './dist/**/*.css', './dist/**/*.png', './dist/**/*.jpeg', './dist/**/*.jpg', './dist/**/*.gif']
  };

  module.exports = {
    paths: paths,
    files: files
  };

}).call(this);
