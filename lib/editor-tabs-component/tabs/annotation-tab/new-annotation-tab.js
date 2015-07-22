/***********************************
 * annotationTab
 **********************************/

var _ = require('lodash');
var displayNameControl = require('../../../sub-components/display-name-control.js');
var fs = require('fs');
var EntityReferenceSearch = require('./xref-search');
var bridgeDbIdControl = require(
    '../../../sub-components/bridge-db-id-control/bridge-db-id-control.js');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var Rx = require('rx');

var annotationTab = {};

annotationTab.vm = (function() {

  var vm = {};

  vm.init = function(kaavio) {

    var editorTabsComponent = kaavio.editor.editorTabsComponent;
    //var initialPvjsElement = editorTabsComponent.vm.pvjsElement || {};

    var entityReferenceTypeIdToEntityTypeIdMappings =
        bridgeDbIdControl.vm.entityReferenceTypeIdToEntityTypeIdMappings;

    var entityTypeIdToEntityReferenceTypeIdMappings = _.invert(
        entityReferenceTypeIdToEntityTypeIdMappings);

    vm.containerElement = kaavio.containerElement;

    vm.disabled = m.prop(true);

    var xrefSearch = annotationTab.xrefSearch = new EntityReferenceSearch();

    vm.cancel = function() {
      vm.reset();
      kaavio.editor.cancel();
    };

    vm.bridgeDbIdInputSource = new Rx.Subject();
    vm.bridgeDbIdChangeSource = new Rx.Subject();

    Rx.Observable.merge(
        vm.bridgeDbIdInputSource.debounce(300),
        vm.bridgeDbIdChangeSource)
      .subscribe(function() {
        vm.updatePvjson({
          id: vm.iri(),
          identifier: vm.identifier(),
          displayName: vm.displayName(),
          type: [vm.entityReferenceTypeId()],
          isDataItemIn: {
            id: vm.datasetIri(),
            name: vm.datasetName(),
            bridgeDbName: vm.datasetBridgeDbName(),
            subject: vm.entityReferenceTypeId()
          }
        });
        m.redraw();
      });

    // initialize values
    vm.iri = m.prop('');
    vm.datasetIri = m.prop('');
    vm.datasetPreferredPrefix = m.prop('');
    vm.datasetName = m.prop('');
    vm.datasetBridgeDbName = m.prop('');
    vm.entityReferenceTypeId = m.prop('');
    vm.identifier = m.prop('')
    vm.displayName = m.prop('');

    /*
    vm.pvjsElementAndResetSource = Rx.Observable.return(initialPvjsElement)
      .concat(editorTabsComponent.vm.pvjsElementSource)
    //*/
    vm.pvjsElementAndResetSource = kaavio.editor.editorTabsComponent.vm.pvjsElementSource
      .partition(function(pvjsElement) {
        return kaavio.sourceData.normalizedPvjsonCurrent;
      });

    vm.pvjsElementSource = vm.pvjsElementAndResetSource[0];
    vm.resetSource = kaavio.editor.vm.resetSource.merge(vm.pvjsElementAndResetSource[1]);

    vm.clearControls = function() {
      vm.datasetIri('');
      vm.datasetPreferredPrefix('');
      vm.datasetName('');
      vm.datasetBridgeDbName('');
      vm.entityReferenceTypeId('');
      vm.identifier('');
      vm.displayName('');
    };

    vm.reset = function() {
      vm.disabled(true);
      vm.pvjsElement = null;
      vm.clearControls();
      //bridgeDbIdControl.vm.sync();
    };

    vm.pvjsElementSource.subscribe(function(pvjsElement) {
      vm.clearControls();

      vm.pvjsElement = pvjsElement;

      vm.disabled(false);

      var currentEntityReference = vm.currentEntityReference =
          _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
              function(element) {
                return element.id === pvjsElement.entityReference;
              });

      if (_.isEmpty(currentEntityReference)) {
        currentEntityReference = vm.currentEntityReference = {};
      }
      var entityReferenceIri = pvjsElement.entityReference;
      vm.iri(entityReferenceIri);

      var entityReferenceTypeId = entityTypeIdToEntityReferenceTypeIdMappings[pvjsElement.type];
      vm.entityReferenceTypeId(entityReferenceTypeId);

      // Pathway author can override default display name (xref display name)
      // for a specific DataNode.
      vm.displayName(pvjsElement.displayName || currentEntityReference.displayName);

      bridgeDbIdControl.vm.sync();
      m.redraw();
    });

    vm.resetSource
      .subscribe(function(value) {
        vm.reset();
        m.redraw();
      }, function(err) {
        console.log(err);
      }, function(value) {
        // do something
      });

    vm.updatePvjson = function(selectedEntityReference) {
      var elements = kaavio.sourceData.normalizedPvjsonCurrent['@graph'];
      var pvjsElement = vm.pvjsElement;
      var entityReferenceTypeId = _.intersection(
          selectedEntityReference.type, bridgeDbIdControl.vm.validEntityReferenceTypes)[0];

      vm.iri(selectedEntityReference.id);
      vm.entityReferenceTypeId(entityReferenceTypeId);
      vm.datasetPreferredPrefix(selectedEntityReference.isDataItemIn.preferredPrefix);
      vm.datasetIri(selectedEntityReference.isDataItemIn.id);
      vm.datasetName(selectedEntityReference.isDataItemIn.name);
      vm.datasetBridgeDbName(selectedEntityReference.isDataItemIn.bridgeDbName);
      vm.identifier(selectedEntityReference.identifier);
      vm.displayName(selectedEntityReference.displayName);

      pvjsElement.type = entityReferenceTypeIdToEntityTypeIdMappings[entityReferenceTypeId];

      var entityReferenceIri = selectedEntityReference.id;
      pvjsElement.entityReference = entityReferenceIri;
      pvjsElement.displayName = selectedEntityReference.displayName;

      //bridgeDbIdControl.vm.sync();

      var currentEntityReference = vm.currentEntityReference;

      if (!currentEntityReference || currentEntityReference.id !== entityReferenceIri) {
        var preexistingEntityReference = _.find(elements, function(element) {
          return element.id === entityReferenceIri;
        });

        if (!preexistingEntityReference) {
          elements.push(selectedEntityReference);
        } else {
          _.defaults(preexistingEntityReference, selectedEntityReference);
        }
      }

      //*
      // TODO why do I need to re-find the pvjsElement? Why doesn't updating
      // vm.pvjsElement also update the pvjsElement in kaavio.sourceData.normalizedPvjsonCurrent?
      var pvjsElementInPvjson = _.find(elements, function(element) {
        return element.id === vm.pvjsElement.id;
      });
      _.assign(pvjsElementInPvjson, pvjsElement);
      //*/
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
        onchange: vm.updatePvjson,
        trigger: args.trigger.bind(args)
      })
    ]),
    m('div.form-group.navbar-left', [
      m('div', {
        'class': 'form-control',
        style: {
          'min-width': '580px',
          height: '44px'
        }
      }, [
        m.component(bridgeDbIdControl, {
          disabled: vm.disabled,
          iri: vm.iri,
          datasetIri: vm.datasetIri,
          datasetPreferredPrefix: vm.datasetPreferredPrefix,
          datasetName: vm.datasetName,
          datasetBridgeDbName: vm.datasetBridgeDbName,
          entityReferenceTypeId: vm.entityReferenceTypeId,
          identifier: vm.identifier,
          oninput: m.withAttr('value', function(value) {
            vm.bridgeDbIdInputSource.onNext(value);
          }),
          onchange: m.withAttr('value', function(value) {
            vm.bridgeDbIdChangeSource.onNext(value);
          }),
          style: {
            clear: 'both',
            display: 'inline-block',
            'float': 'left'
          }
        }),
        m('input', {
          class: 'form-control input input-sm',
          oninput: m.withAttr('value', function(displayName) {
            vm.displayName(displayName);

            var pvjsElement = vm.pvjsElement;
            pvjsElement.displayName = displayName;
            vm.containerElement.querySelector('#text-for-' + vm.pvjsElement.id)
              .querySelector('text').textContent = displayName;
          }),
          placeholder: 'Display name',
          value: vm.displayName(),
          disabled: vm.disabled()
        }),
      ]),
    ]),
  ]);
};

module.exports = annotationTab;
