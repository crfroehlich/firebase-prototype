(function() {
  var Logger, gutil, notify, prettyHrtime;

  gutil = require('gulp-util');

  prettyHrtime = require('pretty-hrtime');

  notify = require('./notify');

  Logger = (function() {
    function Logger(task) {
      this.task = task;
    }

    Logger.prototype.start = function() {
      this.startTime = process.hrtime();
      gutil.log("Running " + this.task, gutil.colors.green("" + this.task) + '...');
    };

    Logger.prototype.end = function() {
      var prettyTime;
      this.taskTime = process.hrtime(this.startTime);
      prettyTime = prettyHrtime(this.taskTime);
      gutil.log('Finished', gutil.colors.green("" + this.task), 'in', gutil.colors.magenta(prettyTime));
      notify.message("Finished bundling " + this.task);
    };

    return Logger;

  })();

  module.exports = Logger;

}).call(this);
