/***********************************
 * Entity Type Control
 **********************************/

/**
 * Module dependencies.
 */

var _ = require('lodash');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var Rx = require('rx');

var entityTypeControl = {};

entityTypeControl.vm = (function() {
  var vm = {};

  var entityTypes = vm.entityTypes = [{
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
    'id': 'biopax:Complex',
    name: 'Complex'
  }, {
    'id': 'gpml:Unknown',
    name: 'Unknown'
  }];

  // specify placeholder selection
  var entityTypePlaceholder = {
    'id': '',
    'name': 'Select type'
  };

  vm.init = function(ctrl) {

    /*
    var editorUtils = require('../editor-utils.js');
    var entityTypeSource = Rx.Observable.from(entityTypes)
      .flatMap(function(entityType) {
        entityType['@context'] = editorUtils.context;
        return editorUtils.rxJsonldCompact(entityType, editorUtils.context, null);
      })
      .map(function(entityType) {
        entityType = entityType[0];
        m.redraw();
        return entityType;
      });
    //*/

    vm.entityTypeSelectionList = m.prop([entityTypePlaceholder]
      .concat(entityTypes)
      .map(function(item) {
        return item;
      }));

    /*
    m.startComputation();
    vm.entityTypeSelectionList = m.prop([entityTypePlaceholder]);
    Rx.Observable.from([entityTypePlaceholder])
      .concat(entityTypeSource)
      .map(function(item) {
        return item;
      })
      .toArray()
      .subscribe(function(entityReferences) {
        vm.entityTypeSelectionList(entityReferences);
        m.endComputation();
      });
    //*/

    /*
    vm.reset = function() {
      vm.entityTypeId(entityTypePlaceholder.id);
    }
    //*/
  }

  return vm;
})();

entityTypeControl.controller = function(ctrl) {
  entityTypeControl.vm.init(ctrl);
};

entityTypeControl.view = function(ctrl, args) {
  var vm = entityTypeControl.vm;
  var entityTypeId = args.entityTypeId();
  return m('select.form-control.input.input-sm',
  {
    //*
    onchange: m.withAttr('value', function(entityTypeId) {
      args.entityTypeId(entityTypeId);
      var entityType = _.find(vm.entityTypeSelectionList(), function(entityType) {
        return entityType.id === entityTypeId;
      });
      if (args.onchange) {
        args.onchange(entityType);
      }
    }),
    //*/
    value: args.entityTypeId(),
    disabled: args.disabled()
  },
  [
    vm.entityTypeSelectionList()
      .map(function(entityType, index) {
        return m('option', {
          key: entityType.id,
          value: entityType.id,
          selected: entityType.id === args.entityTypeId()
        }, entityType.name);
      })
  ]);
}

module.exports = entityTypeControl;
