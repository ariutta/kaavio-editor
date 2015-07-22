/***********************************
 * Entity Type Control
 **********************************/

/**
 * Module dependencies.
 */

var _ = require('lodash');
var editorUtils = require('../../editor-utils.js');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var Rx = require('rx');

var entityReferenceTypeControl = {};

entityReferenceTypeControl.vm = (function() {
  var vm = {};

  var entityReferenceTypes = [{
    'id': 'gpml:GeneProductReference',
    name: 'Gene Product'
  }, {
    'id': 'biopax:SmallMoleculeReference',
    name: 'Metabolite'
  }, {
    'id': 'gpml:PathwayReference',
    name: 'Pathway'
  }, {
    'id': 'biopax:ProteinReference',
    name: 'Protein'
  }, {
    'id': 'gpml:UnknownReference',
    name: 'Unknown'
  }];

  vm.entityReferenceTypes = entityReferenceTypes;

  vm.entityReferenceTypeIdToEntityTypeIdMappings = {
    'gpml:GeneProductReference': 'gpml:GeneProduct',
    'biopax:SmallMoleculeReference': 'gpml:Metabolite',
    'gpml:PathwayReference': 'gpml:Pathway',
    'biopax:ProteinReference': 'biopax:Protein',
    'biopax:RnaReference': 'biopax:Rna',
    'gpml:UnknownReference': 'gpml:Unknown'
  };

  // specify placeholder selection
  var entityReferenceTypePlaceholder = {
    'id': '',
    'name': 'Select type'
  };

  vm.init = function(ctrl) {

    var entityReferenceTypeSource = Rx.Observable.from(entityReferenceTypes)
      .flatMap(function(entityReferenceType) {
        entityReferenceType['@context'] = editorUtils.context;
        return editorUtils.rxJsonldCompact(entityReferenceType, editorUtils.context, null);
      })
      .map(function(entityReferenceType) {
        entityReferenceType = entityReferenceType[0];
        m.redraw();
        return entityReferenceType;
      });

    m.startComputation();
    vm.entityReferenceTypeList = m.prop([entityReferenceTypePlaceholder]);
    Rx.Observable.from([entityReferenceTypePlaceholder])
      .concat(entityReferenceTypeSource)
      .map(function(item) {
        return item;
      })
      .toArray()
      .subscribe(function(entityReferences) {
        vm.entityReferenceTypeList(entityReferences);
        m.endComputation();
      });

    /*
    vm.reset = function() {
      vm.entityReferenceTypeId(entityReferenceTypePlaceholder.id);
    }
    //*/
  }

  return vm;
})();

entityReferenceTypeControl.controller = function(ctrl) {
  entityReferenceTypeControl.vm.init(ctrl);
};

entityReferenceTypeControl.view = function(ctrl, args) {
  var vm = entityReferenceTypeControl.vm;
  var entityReferenceTypeId = args.entityReferenceTypeId();
  return m('select.form-control.input.input-sm',
  {
    //*
    onchange: m.withAttr('value', function(entityReferenceTypeId) {
      args.entityReferenceTypeId(entityReferenceTypeId);
      var entityReferenceType = _.find(vm.entityReferenceTypeList(), function(entityReferenceType) {
        return entityReferenceType.id === entityReferenceTypeId;
      });
      if (args.onchange) {
        args.onchange(entityReferenceType);
      }
    }),
    //*/
    value: args.entityReferenceTypeId(),
    disabled: args.disabled()
  },
  [
    vm.entityReferenceTypeList()
      .map(function(entityReferenceType, index) {
        return m('option', {
          key: entityReferenceType.id,
          value: entityReferenceType.id,
          selected: entityReferenceType.id === args.entityReferenceTypeId()
        }, entityReferenceType.name);
      })
  ]);
}

module.exports = entityReferenceTypeControl;
