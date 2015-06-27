/***********************************
 * annotationTab
 **********************************/

var _ = require('lodash');
var datasetControl = require('./dataset-control');
var displayNameControl = require('../../../sub-components/display-name-control');
var editorUtils = require('../../../editor-utils');
var fs = require('fs');
var XrefSearch = require('./xref-search');
var xrefTypeControl = require('./xref-type-control');
var highland = require('highland');
var identifierControl = require('./identifier-control');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var mithrilUtils = require('../../../mithril-utils');
var Rx = require('rx');

var annotationTab = {};

annotationTab.vm = (function() {

  var vm = {};

  function parseIdentifiersIri(iri) {
    var iriComponents = iri.split(':');
    var datasetPreferredPrefix = iriComponents.splice(0, 1)[0];
    var identifier = iriComponents.join('');
    return {
      datasetPreferredPrefix: datasetPreferredPrefix,
      identifier: identifier
    };
  }

  vm.init = function(kaavio) {
    var editorTabsComponent = kaavio.editor.editorTabsComponent;
    var initialPvjsElement = editorTabsComponent.vm.pvjsElement;

    m = kaavio.m;

    vm.disabled = m.prop(true);

    var xrefSearch = annotationTab.xrefSearch = new XrefSearch();

    vm.cancel = function() {
      vm.reset();
      kaavio.editor.cancel();
    };

    vm.annotationElement = {
      datasetPreferredPrefix: m.prop(''),
      type: m.prop(''),
      identifier: m.prop(''),
      textContent: m.prop('')
    };

    var annotationElementAndResetSource = Rx.Observable.just(initialPvjsElement)
      .concat(kaavio.editor.editorTabsComponent.vm.pvjsElementSource)
      .map(function(pvjsElement) {
        vm.pvjsElement = pvjsElement;
        if (!kaavio.sourceData.normalizedPvjsonCurrent) {
          return;
        }

        var currentXref = _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
            function(element) {
              return element.id === pvjsElement.entityReference;
            });

        if (_.isEmpty(currentXref)) {
          return;
        }

        // currentXref does not currently have the biopax:db and biopax:identifier
        var iriComponents = parseIdentifiersIri(pvjsElement.entityReference);
        vm.annotationElement.datasetPreferredPrefix(iriComponents.datasetPreferredPrefix);
        vm.annotationElement.type(pvjsElement.type);
        vm.annotationElement.identifier(iriComponents.identifier);
        vm.annotationElement.textContent(pvjsElement.textContent || currentXref.displayName);

        return vm.annotationElement;
      })
      .partition(function(annotationElement) {
        return annotationElement && annotationElement.datasetPreferredPrefix();
      });

    vm.annotationElementSource = annotationElementAndResetSource[0];
    vm.resetSource = kaavio.editor.vm.resetSource.merge(annotationElementAndResetSource[1]);

    vm.annotationElementSource.subscribe(function(annotationElement) {
      vm.disabled(false);
    });

    vm.reset = function() {
      vm.annotationElement.datasetPreferredPrefix('');
      vm.annotationElement.type('');
      vm.annotationElement.identifier('');
      vm.annotationElement.textContent('');
      vm.disabled(true);
    };

    vm.resetSource
      .subscribe(function(value) {
        vm.reset();
      }, function(err) {
        console.log(err);
      }, function(value) {
        // do something
      });

    vm.save = function() {
      var pvjsElement = _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
          function(element) {
            return vm.pvjsElement.id === element.id;
          });

      if (!pvjsElement) {
        return console.warn('No pvjsElement. Cannot save.');
      }

      var xrefType = vm.annotationElement.type().replace(' ', '');

      var datasetName = datasetControl.vm.currentDataset.name();
      var datasetPreferredPrefix = datasetControl.vm.currentDataset.preferredPrefix();
      var identifier = identifierControl.vm.identifier();
      var entityReferenceId = datasetPreferredPrefix + ':' + identifier;

      var displayName = displayNameControl.vm.displayName();

      if ('gpml:' + xrefType === pvjsElement['gpml:Type'] &&
        pvjsElement.textContent === displayName &&
        pvjsElement.entityReference === entityReferenceId) {

        // No changes.
        return;
      }

      // TODO this isn't exactly matching the current pvjson model
      if (!!xrefType) {
        pvjsElement['gpml:Type'] = 'gpml:' + xrefType;
      }
      if (!!displayName) {
        pvjsElement.textContent = displayName;
      }
      if (!!entityReferenceId) {
        pvjsElement.entityReference = {id: entityReferenceId};
      }

      var currentXref = _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
          function(element) {
            return element.id === pvjsElement.entityReference;
          });

      if (!currentXref && !!entityReferenceId) {
        currentXref = {};
        currentXref.id = entityReferenceId;
        kaavio.sourceData.normalizedPvjsonCurrent['@graph'].push(currentXref);
      }

      if (!!datasetPreferredPrefix && !!datasetName && !!identifier) {
        currentXref.isDataItemIn = {
          id: datasetPreferredPrefix,
          preferredPrefix: datasetPreferredPrefix
        };
        currentXref.dbName = datasetName;
        currentXref.dbId = identifier;
        if (!!displayName) {
          currentXref.displayName = currentXref.displayName || displayName;
        }
      }

      updateDiagram(
          kaavio, pvjsElement.id, xrefType, datasetName, identifier, displayName);

      vm.reset();
    };

    vm.onunload = function() {
      // do something
    };
  };

  return vm;
})();

annotationTab.controller = function(ctrl) {
  annotationTab.vm.init(ctrl);
};

annotationTab.view = function(ctrl, args) {
  var vm = annotationTab.vm;

  return m('nav.kaavio-editor-annotation.navbar.navbar-default.navbar-form.well.well-sm', [
    m('div.navbar-left', [
      m.component(annotationTab.xrefSearch, {
        disabled: vm.disabled,
        kaavio: args,
        currentXrefTypeId: vm.annotationElement.type,
        validXrefTypeList: xrefTypeControl.vm.xrefTypes,
        currentDatasetPreferredPrefix: vm.annotationElement.datasetPreferredPrefix,
        identifier: vm.annotationElement.identifier,
        displayName: vm.annotationElement.textContent,
        trigger: args.trigger.bind(args)
      })
    ]),
    m('div.form-group.navbar-left', [
      m('div.form-control[style="height: 44px;"]', {
        //onchange: vm.save
      }, [
        m.component(xrefTypeControl, {
          disabled: vm.disabled,
          currentXrefTypeId: vm.annotationElement.type,
          onchange: function(type) {
            console.log('type onchange in a-t');
            console.log('type');
            console.log(type);
            //vm.pvjsElement.type = type;
          }
        }),
        m.component(datasetControl, {
          disabled: vm.disabled,
          primaryDatasetList: args.primaryDatasetList,
          currentXrefTypeId: vm.annotationElement.type,
          currentDatasetPreferredPrefix: vm.annotationElement.datasetPreferredPrefix,
          onchange: function(dataset) {
            console.log('dataset onchange in a-t');
            console.log(dataset);

            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);

            //vm.pvjsElement.db = dataset.name;
          }
        }),
        m.component(identifierControl, {
          disabled: vm.disabled,
          identifier: vm.annotationElement.identifier,
          onchange: function(identifier) {
            console.log('identifier onchange in a-t');
            console.log(identifier);
            vm.pvjsElement.identifier = identifier;
          }
        }),
        m.component(displayNameControl, {
          disabled: vm.disabled,
          displayName: vm.annotationElement.textContent,
          onchange: function(displayName) {
            console.log('displayName onchange in a-t');
            console.log(displayName);

            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);

            vm.pvjsElement.displayName = displayName;
          }
        })
      ]),
    ]),
  ]);
};

function updateDiagram(kaavio, selectionId, xrefType,
    datasetName, identifier, displayName) {
  if (!datasetName || !identifier) {
    throw new Error('Missing datasetName and/or identifier for updateDiagram');
  }

  if (!!selectionId && !!displayName) {
    var textLabelElement = kaavio.$element.select('#text-for-' + selectionId)
      .select('text').text(displayName);
  }
}

module.exports = annotationTab;
