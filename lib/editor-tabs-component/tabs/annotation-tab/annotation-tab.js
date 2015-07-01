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
    var initialPvjsElement = editorTabsComponent.vm.pvjsElement || {};

    vm.containerElement = kaavio.containerElement;

    vm.disabled = m.prop(true);

    var xrefSearch = annotationTab.xrefSearch = new XrefSearch();

    vm.cancel = function() {
      vm.reset();
      kaavio.editor.cancel();
    };

    vm.annotationElement = {
      datasetPreferredPrefix: m.prop(''),
      datasetName: m.prop(''),
      type: m.prop(''),
      identifier: m.prop(''),
      displayName: m.prop('')
    };

    var annotationElementAndResetSource = Rx.Observable.just(initialPvjsElement)
      .concat(kaavio.editor.editorTabsComponent.vm.pvjsElementSource)
      .map(function(pvjsElement) {
        vm.pvjsElement = pvjsElement;
        if (!kaavio.sourceData.normalizedPvjsonCurrent || _.isEmpty(pvjsElement)) {
          return;
        }

        var currentXref = vm.currentXref =
            _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
                function(element) {
                  return element.id === pvjsElement.entityReference;
                });

        if (_.isEmpty(currentXref)) {
          currentXref = vm.currentXref = {};
        }
        var entityReferenceId = pvjsElement.entityReference;

        var iriComponents;
        if (entityReferenceId) {
          iriComponents = parseIdentifiersIri(pvjsElement.entityReference);
        } else {
          iriComponents = {
            datasetPreferredPrefix: '',
            identifier: ''
          };
        }

        // pvjson does not currently store the properties "biopax:db" and
        // "biopax:identifier" on entity references.
        vm.annotationElement.datasetPreferredPrefix(iriComponents.datasetPreferredPrefix);
        // TODO this is NOT the name. Refactor pvjson so we store the dataset
        // name on entity references.
        vm.annotationElement.datasetName(iriComponents.datasetPreferredPrefix);
        vm.annotationElement.identifier(iriComponents.identifier);

        vm.annotationElement.type(pvjsElement.type);
        // Pathway author can override default display name (xref display name)
        // for a specific DataNode.
        vm.annotationElement.displayName(pvjsElement.displayName || currentXref.displayName);

        return vm.annotationElement;
      })
      .partition(function(annotationElement) {
        return annotationElement;
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
      vm.annotationElement.displayName('');
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

    vm.updateCurrentXref = function() {
      var annotationElement = vm.annotationElement;
      var datasetPreferredPrefix = annotationElement.datasetPreferredPrefix();
      var identifier = annotationElement.identifier();

      if (!datasetPreferredPrefix || !identifier) {
        console.warn('Missing datasetPreferredPrefix and/or identifier.');
        console.warn('Cannot save xref.');
        return;
      }

      var currentXref = vm.currentXref;
      var pvjsElement = vm.pvjsElement;

      var entityReferenceId = datasetPreferredPrefix + ':' + identifier;
      pvjsElement.entityReference = entityReferenceId;

      if (!!currentXref && currentXref.id === entityReferenceId) {
        console.log('xref already exists.');
        return;
      }

      var xrefType = vm.annotationElement.type().replace(' ', '');
      var datasetName = annotationElement.datasetName();

      currentXref = vm.currentXref = _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
          function(element) {
            return element.id === entityReferenceId;
          });

      if (currentXref) {
        console.log('xref already exists.');
        return;
      }

      currentXref = {};
      currentXref.id = entityReferenceId;
      kaavio.sourceData.normalizedPvjsonCurrent['@graph'].push(currentXref);

      if (!!datasetPreferredPrefix && !!datasetName && !!identifier) {
        currentXref.isDataItemIn = {
          id: datasetPreferredPrefix,
          preferredPrefix: datasetPreferredPrefix
        };
        currentXref.dbName = datasetName;
        currentXref.dbId = identifier;
        var annotationElementDisplayName = annotationElement.displayName();
        if (!!annotationElementDisplayName) {
          currentXref.displayName = currentXref.displayName || annotationElementDisplayName;
        }
      }
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
        currentDatasetName: vm.annotationElement.datasetName,
        identifier: vm.annotationElement.identifier,
        displayName: vm.annotationElement.displayName,
        updateCurrentXref: vm.updateCurrentXref,
        trigger: args.trigger.bind(args)
      })
    ]),
    m('div.form-group.navbar-left', [
      m('div.form-control[style="height: 44px;"]', {}, [
        m.component(xrefTypeControl, {
          disabled: vm.disabled,
          currentXrefTypeId: vm.annotationElement.type,
          onchange: function(type) {
            console.log('type onchange in a-t');
            console.log('type');
            console.log(type);
            vm.pvjsElement.type = type;
            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);
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
            var pvjsElement = vm.pvjsElement;

            var annotationElement = vm.annotationElement;
            annotationElement.datasetName(dataset.name);
            vm.updateCurrentXref();

            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);
          }
        }),
        m.component(identifierControl, {
          disabled: vm.disabled,
          identifier: vm.annotationElement.identifier,
          onchange: function(identifier) {
            console.log('identifier onchange in a-t');
            console.log(identifier);

            vm.pvjsElement.identifier = identifier;
            vm.updateCurrentXref();

            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);
          }
        }),
        m.component(displayNameControl, {
          disabled: vm.disabled,
          displayName: vm.annotationElement.displayName,
          onchange: function(displayName) {
            console.log('displayName onchange in a-t');
            console.log(displayName);

            var pvjsElement = vm.pvjsElement;
            pvjsElement.displayName = displayName;
            vm.containerElement.querySelector('#text-for-' + vm.pvjsElement.id)
              .querySelector('text').textContent = displayName;

            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);
          }
        })
      ]),
    ]),
  ]);
};

module.exports = annotationTab;
