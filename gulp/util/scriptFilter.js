(function() {
  var path;

  path = require("path");

  module.exports = function(name) {
    return /(\.(js)$)/i.test(path.extname(name));
  };

}).call(this);
