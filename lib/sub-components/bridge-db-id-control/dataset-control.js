/***********************************
 * Datasource Control
 **********************************/

/**
 * Module dependencies.
 */

var _ = require('lodash');
var BridgeDb = require('bridgedb');
var editorUtils = require('../../editor-utils.js');
var JsonldRx = require('jsonld-rx');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var Rx = require('rx');
var RxNode = require('rx-node');

var datasetControl = {};

var jsonldRx = new JsonldRx();

datasetControl.vm = (function() {
  var vm = {};

  var bridgeDb = new BridgeDb({
    organism: 'Homo sapiens'
  });

  var primaryDatasetList = RxNode.fromReadableStream(bridgeDb.dataset.query())
    .map(function(dataset) {
      dataset.subject = jsonldRx.arrayifyClean(dataset.subject);
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
      return dataset._isPrimary &&
          !!dataset.id &&
          nonApplicableSubjects.indexOf(dataset._bridgeDbType) === -1;
    })
    .toArray()
    .toPromise();

  vm.init = function(ctrl) {

    /*
    vm.sync = function() {
      var iri = ctrl.iri;
      var preferredPrefix = ctrl.preferredPrefix;
      var name = ctrl.name;
      var bridgeDbName = ctrl.bridgeDbName;
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
            return jsonldRx.replaceContext(input, editorUtils.context);
          })
          .map(function(dataset) {
            dataset.subject = jsonldRx.arrayifyClean(dataset.subject);
            var name = dataset.name;
            // NOTE: for some of these, the name for use by the end user
            // differs from the conventional name. We want to use the
            // last name in the array in this case for what's displayed to
            // the end user and the first name for what's used with
            // BridgeDb.
            if (_.isArray(name)) {
              dataset.name = name[name.length - 1];
              dataset.bridgeDbName = name[name.length - 1];
            } else {
              dataset.name = name;
              dataset.bridgeDbName = name;
            }

            return dataset;
          })
          .subscribe(function(dataset) {
            ctrl.name(dataset.name);
            ctrl.bridgeDbName(dataset.bridgeDbName);
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
        ctrl.bridgeDbName(bridgeDbName.bridgeDbName);
        ctrl.iri(dataset.id);
        ctrl.preferredPrefix(dataset.preferredPrefix);
        m.redraw();
      });
    }

    vm.sync();
    //*/

    var datasetPlaceholder = {
      'id': '',
      'name': 'Select datasource'
    };

    //specify placeholder selection
    if (!ctrl.iri || !ctrl.iri()) {
      vm.dataset = datasetPlaceholder;
      /*
      vm.dataset = new datasetControl.Dataset(datasetPlaceholder);
      //a dataset
      datasetControl.Dataset = function(dataset) {
        this.id = m.prop(dataset.id);
        this.name = m.prop(dataset.name);
        this.bridgeDbName = m.prop(dataset.bridgeDbName);
        this.subject = m.prop(dataset.subject);
      }
      //*/
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
    }, function(err) {
      throw err;
    });
  }

  return vm;

})();

datasetControl.controller = function(ctrl) {
  datasetControl.vm.init(ctrl);
}

datasetControl.view = function(ctrl, args) {
  var vm = datasetControl.vm;
  var selectedDataset = args.dataset() || {};
  var selectedDatasetSubjects = jsonldRx.arrayifyClean(selectedDataset.subject);
  var iri = selectedDataset.id;
  var preferredPrefix = selectedDataset.preferredPrefix;
  /*
  var entityReferenceTypeId = args.entityReferenceTypeId();
  var iri = args.iri();
  var preferredPrefix = args.preferredPrefix();
  //*/

  return m('select', {
    'class': 'pvjs-editor-dataset form-control input input-sm',
    onchange: m.withAttr('value', function(iri) {
      var selectedDataset = _.find(vm.datasetList(), function(dataset) {
        return dataset.id === iri;
      });
      if (args.onchange) {
        args.onchange(selectedDataset);
      }
      /*
      args.iri(iri);
      var selectedDataset = _.find(vm.datasetList(), function(dataset) {
        return dataset.id === iri;
      });
      args.preferredPrefix(selectedDataset.preferredPrefix);
      args.name(selectedDataset.name);
      args.bridgeDbName(selectedDataset.bridgeDbName);
      if (args.onchange) {
        args.onchange(selectedDataset);
      }
      //*/
    }),
    disabled: args.disabled(),
    style: 'max-width: 135px; ',
    required: true
  }, [
    vm.datasetList()
      .filter(function(candidateDataset) {
        // Filtering datasources based on the currently
        // selected GPML DataNode Type

        var candidateDatasetSubjects = candidateDataset.subject;
        candidateDatasetSubjects = jsonldRx.arrayifyClean(candidateDatasetSubjects);

        // We include all Datasets when GPML DataNode Type is equal to "gpml:UnknownReference" or
        // is null, undefined, '' or not selected. We also include the placeholder prompt.
        if (_.isEmpty(selectedDatasetSubjects) ||
            _.isEmpty(candidateDatasetSubjects) ||
            selectedDatasetSubjects.indexOf('gpml:Unknown') > -1 ||
            selectedDatasetSubjects.indexOf('biopax:PhysicalEntity') > -1) {
          return true;
        }

        if (selectedDatasetSubjects.indexOf('gpml:Pathway') > -1 &&
            candidateDatasetSubjects.indexOf('gpml:Pathway') > -1) {
          return true;
        }

        if (selectedDatasetSubjects.indexOf('biopax:SmallMoleculeReference') > -1 &&
            candidateDatasetSubjects.indexOf('biopax:SmallMoleculeReference') > -1) {
          return true;
        }

        if ((selectedDatasetSubjects.indexOf('biopax:RnaReference')  > -1 ||
              selectedDatasetSubjects.indexOf('gpml:GeneProduct')  > -1) &&
            (candidateDatasetSubjects.indexOf('biopax:RnaReference') > -1 ||
              candidateDatasetSubjects.indexOf('gpml:GeneProduct') > -1)) {
          return true;
        }

        if ((selectedDatasetSubjects.indexOf('gpml:GeneProduct') > -1 ||
              selectedDatasetSubjects.indexOf('biopax:ProteinReference') > -1) &&
            (candidateDatasetSubjects.indexOf('biopax:ProteinReference') > -1 ||
              candidateDatasetSubjects.indexOf('gpml:GeneProduct') > -1)) {
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
