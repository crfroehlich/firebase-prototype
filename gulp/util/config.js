(function() {
  var config, gulp;

  gulp = require('gulp');

  config = null;

  fs.createFile('config.cson', function(err) {
    if (err) {
      fs.copy('config.tmpl', 'config.cson');
    }
    return config = require('./config.cson');
  });

  module.exports = config;

}).call(this);
