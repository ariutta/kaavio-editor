/***********************************
 * bridgeDbIdControl
 **********************************/

var _ = require('lodash');
var datasetControl = require('./dataset-control.js');
var JsonldRx = require('jsonld-rx');
//var entityReferenceTypeControl = require('./xref-type-control.js');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;

var bridgeDbIdControl = {};

bridgeDbIdControl.vm = (function() {

  var jsonldRx = new JsonldRx();

  var vm = {};

  /**
   * init
   *
   * @param {object} ctrl
   */
  vm.init = function(ctrl) {
    /*
    vm.cancel = function() {
      vm.reset();
    };

    vm.reset = function() {
      vm.datasetPreferredPrefix('');
      vm.entityReferenceTypeId('');
      vm.identifier('');
      vm.displayName('');
      vm.disabled(true);
    };
    //*/

    vm.onunload = function() {
      // do something
    };
  };

  return vm;
})();

bridgeDbIdControl.controller = function(ctrl) {
  bridgeDbIdControl.vm.init(ctrl);
};

bridgeDbIdControl.view = function(ctrl, args) {
  var vm = bridgeDbIdControl.vm;
  args.entityReference.isDataItemIn = args.entityReference.isDataItemIn || {id: ''};
  var dataset = args.entityReference.isDataItemIn;
  var datasetId = dataset.id;
  var identifier = args.entityReference.identifier;

  return m('div', {
    style: args.style,
    /*
    oninput: function() {
      if (args.oninput) {
        args.oninput();
      }
    },
    onchange: function() {
      if (args.onchange) {
        args.onchange();
      }
    }
    //*/
  }, [
    /*
    m.component(entityReferenceTypeControl, {
      disabled: args.disabled,
      entityReferenceTypeId: args.entityReferenceTypeId
    }),
    //*/
    m.component(datasetControl, {
      disabled: args.disabled,
      dataset: dataset,
      onchange: function(dataset) {
        args.entityReference.isDataItemIn = dataset;
        //*
        if (dataset && dataset.id && args.identifier()) {
          args.entityReference.id = datasetId + identifier;
        } else {
          delete args.entityReference.id;
        }
        //*/
        if (args.onchange) {
          args.onchange(args.entityReference);
        }
      }
    }),
    m('input', {
      'class': 'pvjs-editor-identifier form-control input input-sm',
      placeholder: 'Identifier',
      oninput: m.withAttr('value', function(identifier) {
        args.entityReference.identifier = identifier;
        //*
        if (datasetId && identifier) {
          args.entityReference.id = datasetId + identifier;
        } else {
          delete args.entityReference.id;
        }
        //*/
        if (args.oninput) {
          args.onchange(args.entityReference);
        }
      }),
      value: args.entityReference.identifier || '',
      disabled: args.disabled()
    })
  ]);
};

module.exports = bridgeDbIdControl;
