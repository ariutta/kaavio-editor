var _ = require('lodash');
var editorComponent = require('./editor.js');

var Editor = function(privateInstance) {
  var editor = editorComponent(privateInstance);
  _.assign(this, editor);
  return this;
};

module.exports = Editor;
