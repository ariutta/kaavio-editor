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

  /*
  function parseIdentifiersIri(iri) {
    var iriComponents = iri.split(':');
    var datasetPreferredPrefix = iriComponents.splice(0, 1)[0];
    var identifier = iriComponents.join('');
    return {
      datasetPreferredPrefix: datasetPreferredPrefix,
      identifier: identifier
    };
  }
  //*/

  vm.init = function(kaavio) {

    var entityReferenceTypeIdToEntityTypeIdMappings =
        bridgeDbIdControl.vm.entityReferenceTypeIdToEntityTypeIdMappings;

    var entityTypeIdToEntityReferenceTypeIdMappings = _.invert(
        entityReferenceTypeIdToEntityTypeIdMappings);

    var editorTabsComponent = kaavio.editor.editorTabsComponent;
    var initialPvjsElement = editorTabsComponent.vm.pvjsElement || {};

    vm.containerElement = kaavio.containerElement;

    vm.disabled = m.prop(true);

    var xrefSearch = annotationTab.xrefSearch = new EntityReferenceSearch();

    vm.cancel = function() {
      vm.reset();
      kaavio.editor.cancel();
    };

    // initialize values
    vm.iri = m.prop('');
    vm.datasetIri = m.prop('');
    vm.datasetPreferredPrefix = m.prop('');
    vm.datasetName = m.prop('');
    vm.entityReferenceTypeId = m.prop('');
    vm.identifier = m.prop('')
    vm.displayName = m.prop('');

    vm.testValue = m.prop('');

    // TODO the "just" observable below causes a problem for when we
    // close and save and then open again. The last selected node will
    // have its data shown, even if it was deselected.
    var pvjsElementAndResetSource = Rx.Observable.just(initialPvjsElement)
      .concat(kaavio.editor.editorTabsComponent.vm.pvjsElementSource)
      .partition(function(pvjsElement) {
        return kaavio.sourceData.normalizedPvjsonCurrent && !_.isEmpty(pvjsElement);
      });

    vm.pvjsElementSource = pvjsElementAndResetSource[0];
    vm.resetSource = kaavio.editor.vm.resetSource.merge(pvjsElementAndResetSource[1]);

    vm.pvjsElementSource.subscribe(function(pvjsElement) {
      vm.reset();

      vm.pvjsElement = pvjsElement;

      vm.disabled(false);
      console.log('bridgeDbIdControl in a-t');
      console.log(bridgeDbIdControl);

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

      /*
      var iriComponents;
      if (entityReferenceIri) {
        iriComponents = parseIdentifiersIri(pvjsElement.entityReference);
      } else {
        iriComponents = {
          datasetPreferredPrefix: '',
          identifier: ''
        };
      }

      // pvjson does not currently store the properties "biopax:db" and
      // "biopax:identifier" on entity references.
      vm.datasetPreferredPrefix(iriComponents.datasetPreferredPrefix);
      // TODO this is NOT the name. Refactor pvjson so we store the dataset
      // name on entity references.
      vm.datasetName(iriComponents.datasetPreferredPrefix);
      vm.identifier(iriComponents.identifier);
      //*/

      var entityReferenceTypeId = entityTypeIdToEntityReferenceTypeIdMappings[pvjsElement.type];
      vm.entityReferenceTypeId(entityReferenceTypeId);
      // Pathway author can override default display name (xref display name)
      // for a specific DataNode.
      vm.displayName(pvjsElement.displayName || currentEntityReference.displayName);

      bridgeDbIdControl.vm.sync();
      m.redraw();
    });

    vm.reset = function() {
      vm.datasetIri('');
      vm.datasetPreferredPrefix('');
      vm.datasetName('');
      vm.entityReferenceTypeId('');
      vm.identifier('');
      vm.displayName('');
      vm.disabled(true);
      vm.pvjsElement = null;
      //bridgeDbIdControl.vm.sync();
    };

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
      /*
      var datasetPreferredPrefix = vm.datasetPreferredPrefix();
      var identifier = vm.identifier();

      if (!datasetPreferredPrefix || !identifier) {
        console.warn('Missing datasetPreferredPrefix and/or identifier.');
        console.warn('Cannot save xref.');
        return;
      }

      var currentEntityReference = vm.currentEntityReference;
      var pvjsElement = vm.pvjsElement;

      var entityReferenceIri = vm.iri();
      pvjsElement.entityReference = entityReferenceIri;

      if (!!currentEntityReference && currentEntityReference.id === entityReferenceIri) {
        console.log('xref already exists.');
        return;
      }

      var xrefType = vm.type().replace(' ', '');
      var datasetName = vm.datasetName();

      currentEntityReference = vm.currentEntityReference =
          _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
          function(element) {
            return element.id === entityReferenceIri;
          });

      if (currentEntityReference) {
        console.log('xref already exists.');
        return;
      }

      currentEntityReference = {};
      currentEntityReference.id = entityReferenceIri;
      kaavio.sourceData.normalizedPvjsonCurrent['@graph'].push(currentEntityReference);

      if (!!datasetPreferredPrefix && !!datasetName && !!identifier) {
        currentEntityReference.isDataItemIn = {
          id: datasetPreferredPrefix,
          preferredPrefix: datasetPreferredPrefix
        };
        currentEntityReference.dbName = datasetName;
        currentEntityReference.dbId = identifier;
        var pvjsElementDisplayName = vm.displayName();
        if (!!pvjsElementDisplayName) {
          currentEntityReference.displayName = currentEntityReference.displayName ||
              pvjsElementDisplayName;
        }
      }
      //*/

      var entityReferenceTypeId = _.intersection(
          selectedEntityReference.type, bridgeDbIdControl.vm.validEntityReferenceTypes)[0];

      var elements = kaavio.sourceData.normalizedPvjsonCurrent['@graph'];

      var foundEntityReference = _.find(elements, function(element) {
        return element.id === selectedEntityReference.id;
      });

      if (!foundEntityReference) {
        elements.push(selectedEntityReference);
      }

      vm.iri(selectedEntityReference.id);
      vm.entityReferenceTypeId(entityReferenceTypeId);
      vm.datasetPreferredPrefix(selectedEntityReference.isDataItemIn.preferredPrefix);
      vm.datasetIri(selectedEntityReference.isDataItemIn.id);
      vm.datasetName(selectedEntityReference.isDataItemIn.name);
      vm.identifier(selectedEntityReference.identifier);
      vm.displayName(selectedEntityReference.displayName);

      var pvjsElement = vm.pvjsElement;
      pvjsElement.type = entityReferenceTypeIdToEntityTypeIdMappings[entityReferenceTypeId];

      bridgeDbIdControl.vm.sync();

      var currentEntityReference = vm.currentEntityReference;

      var entityReferenceIri = selectedEntityReference.id;
      pvjsElement.entityReference = entityReferenceIri;
      pvjsElement.identifier = selectedEntityReference.identifier;
      pvjsElement.displayName = selectedEntityReference.displayName;

      if (!!currentEntityReference && currentEntityReference.id === entityReferenceIri) {
        console.log('entity reference already exists.');
        return;
      }

      var currentEntityReferenceExists = _.find(kaavio.sourceData.normalizedPvjsonCurrent['@graph'],
          function(element) {
            return element.id === entityReferenceIri;
          });

      if (currentEntityReferenceExists) {
        console.log('xref already exists.');
        return;
      }

      kaavio.sourceData.normalizedPvjsonCurrent['@graph'].push(currentEntityReference);

      var pvjsElementDisplayName = vm.displayName();
      if (!!pvjsElementDisplayName) {
        currentEntityReference.displayName = currentEntityReference.displayName ||
            pvjsElementDisplayName;
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
          entityReferenceTypeId: vm.entityReferenceTypeId,
          identifier: vm.identifier,
          onchange: function(value) {
            console.log('bridgeDbIdControl onchange in a-t');
            console.log('bridgeDbIdControl returned value');
            console.log(value);
            console.log('props');
            console.log('iri');
            console.log(vm.iri());
            console.log('datasetIri');
            console.log(vm.datasetIri());
            console.log('datasetPreferredPrefix');
            console.log(vm.datasetPreferredPrefix());
            console.log('datasetName');
            console.log(vm.datasetName());
            console.log('entityReferenceTypeId');
            console.log(vm.entityReferenceTypeId());
            console.log('identifier');
            console.log(vm.identifier());
            //*
            vm.updatePvjson({
              id: vm.iri(),
              identifier: vm.identifier(),
              displayName: vm.displayName(),
              type: [vm.entityReferenceTypeId()],
              isDataItemIn: {
                id: vm.datasetIri(),
                name: vm.datasetName(),
                subject: vm.entityReferenceTypeId()
              }
            });
            //*/
          },
          style: {
            clear: 'both',
            display: 'inline-block',
            'float': 'left'
          }
        }),
        m('input', {
          class: 'form-control input input-sm',
          onchange: m.withAttr('value', function(displayName) {
            console.log('displayName onchange in a-t');
            console.log(displayName);

            vm.displayName(displayName);

            var pvjsElement = vm.pvjsElement;
            pvjsElement.displayName = displayName;
            vm.containerElement.querySelector('#text-for-' + vm.pvjsElement.id)
              .querySelector('text').textContent = displayName;

            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);
          }),
          placeholder: 'Display name',
          value: vm.displayName(),
          disabled: vm.disabled()
        }),
        m('input', {
          class: 'form-control input input-sm',
          onchange: m.withAttr('value', function(testValue) {
            console.log('testValue onchange in a-t');
            console.log(testValue);

            vm.entityReferenceTypeId('gpml:PathwayReference');
            vm.datasetIri('http://identifiers.org/wikipathways/');

            vm.testValue(testValue);

            bridgeDbIdControl.vm.sync();

            console.log('vm.pvjsElement');
            console.log(vm.pvjsElement);
          }),
          placeholder: 'test',
          value: vm.testValue(),
          disabled: vm.disabled()
        }),
        m('br'),
        m('span', {}, 'datasetIri: ' + vm.datasetIri()),
        m('span', {}, ' || datasetPreferredPrefix: ' + vm.datasetPreferredPrefix()),
        m('span', {}, ' || entityReferenceTypeId: ' + vm.entityReferenceTypeId()),
      ]),
    ]),
  ]);
};

module.exports = annotationTab;
