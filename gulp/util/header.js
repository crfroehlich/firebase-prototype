(function() {
  var extended, gulp, header, pkg, succinct;

  gulp = require('gulp');

  pkg = require('../../package.json');

  header = require('gulp-header');

  extended = ['/**', ' * <%= pkg.name %> - <%= pkg.description %>', ' * @version v<%= pkg.version %>', ' * @link <%= pkg.homepage %>', ' * @license <%= pkg.license %>', ' */', ''].join('\n');

  succinct = '// <%= pkg.name %>@v<%= pkg.version %>, <%= pkg.license %> licensed. <%= pkg.homepage %>\n';

  module.exports = {
    succinct: function() {
      return header(succinct, {
        pkg: pkg
      });
    },
    extended: function() {
      return header(extended, {
        pkg: pkg
      });
    },
    "package": pkg
  };

}).call(this);
