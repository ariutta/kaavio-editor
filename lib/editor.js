var _ = require('lodash');
var insertCss = require('insert-css');
var fs = require('fs');
var EditorTabsComponent = require('./editor-tabs-component/editor-tabs-component');
var m = require('mithril');

var css = [
  fs.readFileSync(__dirname + '/editor.css')
];

module.exports = function(kaavio) {
  var containerElement = kaavio.containerElement;
  var editorTabsComponentContainerElement;
  css.map(insertCss);

  //module for editor
  //for simplicity, we use this module to namespace the model classes
  var editor = {};
  kaavio.editor = editor;

  //the view-model,
  editor.vm = (function() {
    var vm = {};

    vm.init = function() {

      vm.state = kaavio.kaavioComponent.vm.state.footer;

      vm.selection = kaavio.diagramComponent.vm.selection;

      var editableElementTypes = [
        'biopax:Protein',
        'biopax:Pathway',
        'biopax:Rna',
        'gpml:GeneProduct',
        'gpml:Metabolite'
      ];

      var selectionAndResetSource = kaavio.diagramComponent.vm.selectionSource
        .partition(function(selection) {
          vm.selection = selection;
          if (!selection().id()) {
            return false;
          }
          var pvjsElement = selection().pvjsElement();
          var pvjsElementType = _.isArray(pvjsElement.type) ? pvjsElement.type : [pvjsElement.type];
          return !_.isEmpty(_.intersection(pvjsElementType, editableElementTypes));
        });

      vm.selectionSource = selectionAndResetSource[0];
      vm.resetSource = kaavio.diagramComponent.vm.resetSource.merge(selectionAndResetSource[1]);

      vm.resetSource.subscribe(function() {
          vm.reset();
        });

      var editorTabsComponent = editor.editorTabsComponent = new EditorTabsComponent(kaavio);
      kaavio.editor.editorTabsComponent = editorTabsComponent;
      editorTabsComponent.vm.init(kaavio);

      vm.onunload = function() {
        vm.state('closed');
      };

      vm.open = function() {
        vm.state('open');
        editorTabsComponentContainerElement = containerElement.querySelector(
            '.kaavio-editor-tabs');

        kaavio.on('rendered', function() {
          //m.endComputation();
        });
      };

      vm.closed = function() {
        editor.vm.state('closed');

        if (!!kaavio.containerElement) {
          save();
          // TODO isn't there a way to do this w/out the ifs for
          // the following two items?
          if (!!editor.editorTabsComponent) {
            editor.editorTabsComponent.vm.close();
          }
          if (!!editor.panZoom) {
            kaavio.panZoom.resizeDiagram();
          }
        }
      };

      vm.disabled = vm.closed;
    };

    vm.reset = function() {
    };

    return vm;
  }());

  //the controller defines what part of the model is relevant for the current page
  //in our case, there's only one view-model that handles everything
  editor.controller = function() {
    editor.vm.init();
  };

  //here's the view
  editor.view = function() {
    if (editor.vm.state() === 'open') {
      return [
        editor.editorTabsComponent.view()
      ];
    } else {
      return;
    }
  };

  function cancel() {
    close();
  }

  function save() {
    if (!!editor.editorTabsComponent && editor.editorTabsComponent.vm.dataChanged()) {
      var kaaviodatachangeEvent = new CustomEvent('kaaviodatachange', {
        detail: {
          pvjson: kaavio.sourceData.pvjson
        }
      });
      containerElement.dispatchEvent(kaaviodatachangeEvent);
    }
  }

  return editor;

};
