(function() {
  var notify;

  notify = require('gulp-notify');

  module.exports = {
    message: function(msg, title) {
      if (title == null) {
        title = '';
      }
      return notify({
        title: title,
        message: msg,
        hint: 'int:transient:1'
      });
    }
  };

}).call(this);
