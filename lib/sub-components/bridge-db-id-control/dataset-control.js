/***********************************
 * Datasource Control
 **********************************/

/**
 * Module dependencies.
 */

var _ = require('lodash');
var BridgeDb = require('bridgedb');
var editorUtils = require('../../editor-utils.js');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var Rx = require('rx');
var RxNode = require('rx-node');

var datasetControl = {};

datasetControl.DatasetList = Array;

//a dataset
datasetControl.Dataset = function(dataset) {
  this.id = m.prop(dataset.id);
  this.name = m.prop(dataset.name);
  this.subject = m.prop(dataset.subject);
}

datasetControl.vm = (function() {
  var vm = {};

  var bridgeDb = new BridgeDb({
    baseIri: 'http://webservice.bridgedb.org/',
    //baseIri: 'http://pointer.ucsf.edu/d3/r/data-sources/bridgedb.php/',
    datasetsMetadataIri: 'http://pointer.ucsf.edu/d3/r/data-sources/bridgedb-datasources.php',
    organism: 'Homo sapiens'
  });

  var primaryDatasetList = RxNode.fromReadableStream(bridgeDb.dataset.query())
    .flatMap(function(input) {
      return editorUtils.rxJsonldExpand(input, null);
    })
    .flatMap(function(input) {
      input = input[0];
      return editorUtils.rxJsonldCompact(input, editorUtils.context, null);
    })
    .map(function(dataset) {
      dataset = dataset[0];
      dataset.subject = editorUtils.arrayifyClean(dataset.subject);
      var name = dataset.name;
      // NOTE: for some of these, the name for use by the end user
      // differs from the conventional name. We want to use the
      // last name in the array in this case.
      if (_.isArray(name)) {
        dataset.name = name[name.length - 1];
      }
      return dataset;
    })
    .filter(function(dataset) {
      // Dataset subjects that indicate the dataset should not be used for identifying
      // an Entity Reference for a gpml:DataNode.
      var nonApplicableSubjects = [
        'interaction',
        'ontology',
        'probe',
        'experiment',
        'publication',
        'model',
        'organism'
      ];
      return dataset['bridgedb:_isPrimary'] &&
          !!dataset.id &&
          nonApplicableSubjects.indexOf(dataset['bridgedb:_bridgeDbType']) === -1;
    })
    .toArray()
    .toPromise();

  vm.init = function(ctrl) {

    vm.sync = function() {
      var iri = ctrl.iri;
      var preferredPrefix = ctrl.preferredPrefix;
      var name = ctrl.name;
      var entityReferenceIdentifier = ctrl.entityReferenceIdentifier;

      var disabled = ctrl.disabled;

      if (disabled()) {
        return;
      }

      if (!iri() && !preferredPrefix()) {

        console.warn('Missing minimum information to identify this dataset.');
        console.warn('  You must provide either:');
        console.warn('    1) an identifiers.org dataset prefix (e.g, ensembl) or');
        console.warn('    2) an identifiers.org dataset IRI');
        console.warn('          (e.g, http://identifiers.org/ensembl/)');

        if (!name()) {
          return;
        }

        console.warn('Will try to identify the dataset based on the provided name.');

        RxNode.fromReadableStream(bridgeDb.dataset.get({
          '@id': iri(),
          preferredPrefix: preferredPrefix(),
          name: name(),
          identifier: entityReferenceIdentifier()
        }))
          .flatMap(function(input) {
            return editorUtils.rxJsonldExpand(input, null);
          })
          .flatMap(function(input) {
            input = input[0];
            return editorUtils.rxJsonldCompact(input, editorUtils.context, null);
          })
          .map(function(dataset) {
            dataset = dataset[0];
            dataset.subject = editorUtils.arrayifyClean(dataset.subject);
            var name = dataset.name;
            // NOTE: for some of these, the name for use by the end user
            // differs from the conventional name. We want to use the
            // last name in the array in this case.
            if (_.isArray(name)) {
              dataset.name = name[name.length - 1];
            }
            return dataset;
          })
          .subscribe(function(dataset) {
            ctrl.name(dataset.name);
            ctrl.iri(dataset.id);
            ctrl.preferredPrefix(dataset.preferredPrefix);
            m.redraw();
          });
        return;
      }

      primaryDatasetList.then(function(datasetList) {
        var dataset;
        if (iri()) {
          dataset = _.find(datasetList, function(dataset) {
            return dataset.id === iri();
          });
        } else {
          dataset = _.find(datasetList, function(dataset) {
            return dataset.preferredPrefix === preferredPrefix();
          });
        }
        ctrl.name(dataset.name);
        ctrl.iri(dataset.id);
        ctrl.preferredPrefix(dataset.preferredPrefix);
        m.redraw();
      });
    }

    vm.sync();

    var datasetPlaceholder = {
      'id': '',
      'name': 'Select datasource'
    };

    //specify placeholder selection
    if (!ctrl.iri || !ctrl.iri()) {
      vm.dataset = new datasetControl.Dataset(datasetPlaceholder);
    }

    vm.datasetList = m.prop([datasetPlaceholder]);

    primaryDatasetList.then(function(datasetList) {
      var placeholderUnshifted = _.find(datasetList, function(dataset) {
        return dataset.id === datasetPlaceholder.id &&
          dataset.name === datasetPlaceholder.name;
      });
      if (!placeholderUnshifted) {
        datasetList.unshift(datasetPlaceholder);
      }
      vm.datasetList(datasetList);
      m.redraw();
    });
  }

  return vm;

})();

datasetControl.controller = function(ctrl) {
  datasetControl.vm.init(ctrl);
}

datasetControl.view = function(ctrl, args) {
  var vm = datasetControl.vm;
  var entityReferenceTypeId = args.entityReferenceTypeId();
  var iri = args.iri();
  var preferredPrefix = args.preferredPrefix();

  return m('select', {
    'class': 'pvjs-editor-dataset form-control input input-sm',
    onchange: m.withAttr('value', function(iri) {
      args.iri(iri);
      var selectedDataset = _.find(vm.datasetList(), function(dataset) {
        return dataset.id === iri;
      });
      args.preferredPrefix(selectedDataset.preferredPrefix);
      args.name(selectedDataset.name);
      if (args.onchange) {
        args.onchange(selectedDataset);
      }
    }),
    disabled: args.disabled(),
    style: 'max-width: 135px; ',
    required: true
  }, [
    vm.datasetList()
      .filter(function(dataset) {
        // Filtering datasources based on the currently
        // selected GPML DataNode Type

        var datasetSubjects = dataset.subject;
        datasetSubjects = editorUtils.arrayifyClean(datasetSubjects);

        // We include all Datasets when GPML DataNode Type is equal to "gpml:UnknownReference" or
        // is null, undefined, '' or not selected. We also include the placeholder prompt.
        if (_.isEmpty(entityReferenceTypeId) ||
            _.isEmpty(datasetSubjects) ||
            entityReferenceTypeId === 'gpml:UnknownReference' ||
            entityReferenceTypeId.indexOf('biopax:PhysicalEntity') > -1) {
          return true;
        }

        if (entityReferenceTypeId === 'gpml:PathwayReference' &&
            datasetSubjects.indexOf('gpml:PathwayReference') > -1) {
          return true;
        }

        if (entityReferenceTypeId === 'biopax:SmallMoleculeReference' &&
            datasetSubjects.indexOf('biopax:SmallMoleculeReference') > -1) {
          return true;
        }

        if (entityReferenceTypeId === 'biopax:RnaReference' &&
            (datasetSubjects.indexOf('biopax:RnaReference') > -1 ||
              datasetSubjects.indexOf('gpml:GeneProductReference') > -1)) {
          return true;
        }

        if ((entityReferenceTypeId === 'gpml:GeneProductReference' ||
              entityReferenceTypeId === 'biopax:ProteinReference') &&
            (datasetSubjects.indexOf('biopax:ProteinReference') > -1 ||
              datasetSubjects.indexOf('gpml:GeneProductReference') > -1)) {
          return true;
        }

        // NOTE: intentionally filtering out datasets that lack a subject.
        // That's a BridgeDb curation issue, not a pvjs issue.

        return false;
      })
      .map(function(dataset, index) {
        return m('option', {
          key: dataset.id,
          value: dataset.id,
          selected: dataset.id === iri
        }, dataset.name)
      })
  ]);
}

module.exports = datasetControl;
