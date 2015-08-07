(function() {
  var notify,
    __slice = [].slice;

  notify = require('gulp-notify');

  module.exports = function() {
    var err, onerror;
    err = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    onerror = notify.onError({
      title: 'Gulp Task Error',
      message: '<%= error.message %>\n<%= error["annotated"] %>\n<%= error.stack %>',
      notifier: function(opts, callback) {
        console.error('Title: ', opts.title);
        return console.error('Message: ', opts.message);
      }
    });
    onerror.apply(null, err);
    return this.emit('end');
  };

}).call(this);
