// TODO use the one at github
var Kaavio = require('../../kaavio/index.js');
//var Kaavio = require('kaavio');

/**
 * Kaavio constructor
 *
 * @param  {object} containerElement DOM element that is already present
 *                    on the page. The user specifies this element as
 *                    the container for all the kaavio content. It can be
 *                    any container, such as a div, section or
 *                    ariutta-kaavio custom element.
 * @param {object} options
 * @param {object} [options.pvjson] Source data. If this is not specified, src must be.
 * @param {string} [options.src] IRI (URL) to the pvjson. If this is not specified,
 *                        pvjson must be.
 * @param {string} [options.editor='closed'] Initial editor state. Can be closed, open
 *                  or disabled.
 * @param {boolean} [options.manualRender=false] If you want to specify when to render,
 *                    set this to true and then run kaavio.render when you
 *                    choose.
 * @param {boolean} [options.fitToContainer=true]
 */
var KaavioEditor = function(containerElement, options) {
  var privateInstance = this;
  options.footer = options.editor;

  Kaavio.call(privateInstance, containerElement, options);

  var kaavioComponent = privateInstance.kaavioComponent;

  privateInstance.editor = _.assign(privateInstance.editor || {},
      new privateInstance.Editor(privateInstance));

  privateInstance.editor.vm.init(privateInstance);

  privateInstance.footerOpenButton.vm.label('Quick Edit');

  return privateInstance;
};

KaavioEditor.prototype = Object.create(Kaavio.prototype);
KaavioEditor.prototype.constructor = KaavioEditor;

KaavioEditor.prototype.Editor = require('./editor.js');
KaavioEditor.prototype.EditorOpenButton = require('./editor-open-button.js');

module.exports = KaavioEditor;
