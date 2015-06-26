/***********************************
 * Entity Type Control
 **********************************/

/**
 * Module dependencies.
 */

var _ = require('lodash');
var datasetControl = require('./dataset-control');
var editorUtils = require('../../../editor-utils');
var highland = require('highland');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var mithrilUtils = require('../../../mithril-utils');
var Rx = require('rx');

var xrefTypeControl = {};

xrefTypeControl.XrefTypeList = Array;

xrefTypeControl.vm = (function() {
  var vm = {};

  var xrefTypes = [{
    'id': 'gpml:GeneProduct',
    name: 'Gene Product'
  }, {
    'id': 'gpml:Metabolite',
    name: 'Metabolite'
  }, {
    'id': 'biopax:Pathway',
    name: 'Pathway'
  }, {
    'id': 'biopax:Protein',
    name: 'Protein'
  }, {
    //'id': 'gpml:Unknown',
    'id': 'biopax:PhysicalEntity',
    name: 'Unknown'
  }];

  vm.xrefTypes = xrefTypes;

  // specify placeholder selection
  var xrefTypePlaceholder = {
    'id': '',
    'name': 'Select type'
  };

  vm.init = function(ctrl) {

    //xrefTypeControl.vm.currentXrefTypeId = m.prop('');

    var xrefTypeSource = Rx.Observable.from(xrefTypes)
      .flatMap(function(xrefType) {
        xrefType['@context'] = editorUtils.context;
        return editorUtils.rxJsonldCompact(xrefType, editorUtils.context, null);
      })
      .map(function(xrefType) {
        xrefType = xrefType[0];
        m.redraw();
        return xrefType;
      });

    m.startComputation();
    vm.xrefTypeList = m.prop([xrefTypePlaceholder]);
    Rx.Observable.from([xrefTypePlaceholder])
      .concat(xrefTypeSource)
      .map(function(item) {
        return item;
      })
      .toArray()
      .subscribe(function(xrefs) {
        vm.xrefTypeList(xrefs);
        m.endComputation();
      });

    /*
    vm.reset = function() {
      vm.currentXrefTypeId(xrefTypePlaceholder.id);
    }
    //*/
  }

  return vm;
})();

xrefTypeControl.controller = function(ctrl) {
  xrefTypeControl.vm.init(ctrl);
};

xrefTypeControl.view = function(ctrl, args) {
  var vm = xrefTypeControl.vm;
  var currentXrefTypeId = args.currentXrefTypeId();
  return m('select.form-control.input.input-sm',
  {
    //onchange: m.withAttr('value', args.currentXrefTypeId()),
    /*
    onchange: m.withAttr('value', function(value) {
      vm.currentXrefTypeId(_.find(vm.xrefTypeList, function(xrefType) {
        return xrefType.id === value;
      }));
    }),
    //*/
    //*
    onchange: m.withAttr('value', function(typeId) {
      args.currentXrefTypeId(typeId);
      var currentXrefType = _.find(vm.xrefTypeList(), function(xrefType) {
        return xrefType.id === typeId;
      });
      args.onchange(currentXrefType);
    }),
    //*/
    value: args.currentXrefTypeId(),
    disabled: args.disabled()
  },
  [
    vm.xrefTypeList()
      .map(function(xrefType, index) {
        return m('option', {
          key: xrefType.id,
          value: xrefType.id,
          selected: xrefType.id === args.currentXrefTypeId()
        }, xrefType.name);
      })
  ]);
}

module.exports = xrefTypeControl;
