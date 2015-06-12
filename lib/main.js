var _ = require('lodash');
var editorComponent = require('./editor.js');

var Editor = function(privateInstance) {
  var editor = editorComponent(privateInstance);
  _.assign(this, editor);
  this.trigger = privateInstance.trigger.bind(privateInstance);
};

module.exports = Editor;
