/***********************************
 * Datasource Control
 **********************************/

/**
 * Module dependencies.
 */

var _ = require('lodash');
var editorUtils = require('../../../editor-utils');
var highland = require('highland');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var mithrilUtils = require('../../../mithril-utils');
var t = require('transducers-js');

var datasetControl = {};

datasetControl.DatasetList = Array;

//a dataset
datasetControl.Dataset = function(dataset) {
  this.preferredPrefix = m.prop(dataset.preferredPrefix);
  this.name = m.prop(dataset.name);
  this.subject = m.prop(dataset.subject);
}

datasetControl.vm = (function() {
  var vm = {};
  vm.disabled = m.prop(false);
  vm.init = function(ctrl) {
    vm.disabled = m.prop(true);

    var datasetPlaceholder = {
      'id': '',
      'name': 'Select datasource'
    };

    //specify placeholder selection
    vm.currentDataset = new datasetControl.Dataset(datasetPlaceholder);

    vm.datasetList = m.prop([datasetPlaceholder]);

    ctrl.primaryDatasetList.then(function(datasetList) {
      datasetList.unshift(datasetPlaceholder);
      vm.datasetList(datasetList);
      m.redraw();
    })
  }
  return vm;

})();

datasetControl.controller = function(ctrl) {
  datasetControl.vm.init(ctrl);
}

datasetControl.view = function(ctrl, args) {
  var vm = datasetControl.vm;
  var currentXrefTypeId = args.currentXrefTypeId();
  var currentDatasetPreferredPrefix = args.currentDatasetPreferredPrefix();

  return m('select.pvjs-editor-dataset.form-control.input.input-sm', {
    //onchange: m.withAttr('value', args.currentDatasetPreferredPrefix),
    onchange: m.withAttr('value', function(datasetPreferredPrefix) {
      args.currentDatasetPreferredPrefix(datasetPreferredPrefix);
      var selectedDataset = _.find(vm.datasetList(), function(dataset) {
        return dataset.preferredPrefix === datasetPreferredPrefix;
      });
      args.onchange(selectedDataset);
    }),
    value: currentDatasetPreferredPrefix,
    disabled: args.disabled(),
    style: 'max-width: 135px; ',
    required: true
  }, [
    vm.datasetList()
      .filter(function(dataset) {
        // Filtering datasources based on the currently
        // selected GPML DataNode Type

        var currentDatasetSubjects = dataset.subject;
        currentDatasetSubjects = editorUtils.arrayifyClean(currentDatasetSubjects);

        // We include all Datasets when GPML DataNode Type is equal to "gpml:Unknown" or
        // is null, undefined, '' or not selected. We also include the placeholder prompt.
        if (_.isEmpty(currentXrefTypeId) ||
            _.isEmpty(currentDatasetSubjects) ||
            currentXrefTypeId === 'gpml:Unknown' ||
            currentXrefTypeId.indexOf('biopax:PhysicalEntity') > -1) {
          return true;
        }

        if (currentXrefTypeId === 'biopax:Pathway' &&
            currentDatasetSubjects.indexOf('biopax:Pathway') > -1) {
          return true;
        }

        if (currentXrefTypeId === 'gpml:Metabolite' &&
            currentDatasetSubjects.indexOf('gpml:Metabolite') > -1) {
          return true;
        }

        if (currentXrefTypeId === 'biopax:Rna' &&
            (currentDatasetSubjects.indexOf('biopax:RnaReference') > -1 ||
              currentDatasetSubjects.indexOf('gpml:GeneProduct') > -1)) {
          return true;
        }

        if ((currentXrefTypeId === 'gpml:GeneProduct' ||
              currentXrefTypeId === 'biopax:Protein') &&
            (currentDatasetSubjects.indexOf('biopax:ProteinReference') > -1 ||
              currentDatasetSubjects.indexOf('gpml:GeneProduct') > -1)) {
          return true;
        }

        // NOTE: intentionally filtering out datasets that lack a subject.
        // That's a BridgeDb curation issue, not a pvjs issue.

        return false;
      })
      .map(function(dataset, index) {
        return m('option', {
          key: dataset.preferredPrefix,
          value: dataset.preferredPrefix,
          selected: dataset.preferredPrefix === currentDatasetPreferredPrefix
        }, dataset.name)
      })
  ]);
}

module.exports = datasetControl;
