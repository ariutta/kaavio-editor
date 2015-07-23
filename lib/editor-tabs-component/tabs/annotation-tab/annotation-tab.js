/***********************************
 * annotationTab
 **********************************/

var _ = require('lodash');
var bridgeDbIdControl = require(
    '../../../sub-components/bridge-db-id-control/bridge-db-id-control.js');
var textContentControl = require('../../../sub-components/display-name-control.js');
var entityTypeControl = require('../../../sub-components/entity-type-control.js');
var fs = require('fs');
var EntityReferenceSearch = require('./xref-search');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var Rx = require('rx');

var annotationTab = {};

annotationTab.vm = (function() {

  var vm = {};

  vm.init = function(kaavio) {

    var jsonldRx = kaavio.jsonldRx;

    vm.organism = kaavio.sourceData.pvjson.organism;

    var editorTabsComponent = kaavio.editor.editorTabsComponent;

    var entityReferenceTypeIdToEntityTypeIdMappings =
        vm.entityReferenceTypeIdToEntityTypeIdMappings = {
          'gpml:GeneProductReference': 'gpml:GeneProduct',
          'biopax:SmallMoleculeReference': 'gpml:Metabolite',
          'gpml:PathwayReference': 'biopax:Pathway',
          'biopax:ProteinReference': 'biopax:Protein',
          'biopax:RnaReference': 'biopax:Rna',
          'gpml:ComplexReference': 'gpml:Complex',
          'gpml:UnknownReference': 'gpml:Unknown',
        };

    var entityTypeIdToEntityReferenceTypeIdMappings = _.invert(
        entityReferenceTypeIdToEntityTypeIdMappings);

    vm.containerElement = kaavio.containerElement;

    vm.disabled = m.prop(true);

    var xrefSearch = annotationTab.xrefSearch = new EntityReferenceSearch();

    vm.cancel = function() {
      vm.reset();
      kaavio.editor.cancel();
    };

    /*
    vm.bridgeDbIdInputSource = new Rx.Subject();
    vm.bridgeDbIdChangeSource = new Rx.Subject();

    Rx.Observable.merge(
        vm.bridgeDbIdInputSource.debounce(300),
        vm.bridgeDbIdChangeSource)
      .subscribe(function() {
        vm.updatePvjson({
          id: vm.iri(),
          identifier: vm.identifier(),
          textContent: vm.textContent(),
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
    //*/

    // initialize values
    vm.pvjsElement = m.prop('');
    vm.iri = m.prop('');
    vm.datasetIri = m.prop('');
    vm.datasetPreferredPrefix = m.prop('');
    vm.datasetName = m.prop('');
    vm.datasetBridgeDbName = m.prop('');
    vm.entityReference = m.prop({});
    vm.entityReferenceTypeId = m.prop('');
    vm.entityTypeId = m.prop('');
    vm.identifier = m.prop('')
    //vm.textContent = m.prop('');

    var parentHierarchy = editorTabsComponent.vm.pvjsElementHierarchy;
    var pvjsElementHierarchy = vm.pvjsElementHierarchy = jsonldRx.hierarchicalPartition(
        parentHierarchy.mainSource,
        function(pvjsElement) {
          var pvjsElementType = _.isArray(pvjsElement.type) ? pvjsElement.type : [pvjsElement.type];

          var editableElementTypes = [
            'biopax:Protein',
            'biopax:Pathway',
            'biopax:Rna',
            'gpml:GeneProduct',
            'gpml:Metabolite',
            'gpml:Unknown',
            'biopax:Complex'
          ];

          var result = !_.isEmpty(_.intersection(pvjsElementType, editableElementTypes));
          return result;
        },
        parentHierarchy.resetSource
    );

    vm.pvjsElementSource = pvjsElementHierarchy.mainSource;
    vm.resetSource = pvjsElementHierarchy.resetSource;

    Rx.Observable.merge(vm.pvjsElementSource, vm.resetSource)
      .subscribe(function(value) {
        if (bridgeDbIdControl.vm.dataset && bridgeDbIdControl.vm.identifier) {
          var dataset = bridgeDbIdControl.vm.dataset();
          var identifier = bridgeDbIdControl.vm.identifier();
          var pvjsElement = vm.pvjsElement();
          if (pvjsElement && dataset && identifier) {
            pvjsElement.getSetEntityReference({
              id: dataset.id + identifier
            });
          }
        }
      });

    vm.clearControls = function() {
      vm.datasetIri('');
      vm.datasetPreferredPrefix('');
      vm.datasetName('');
      vm.datasetBridgeDbName('');
      vm.entityReference({});
      vm.entityReferenceTypeId('');
      vm.entityTypeId('');
      vm.identifier('');
      //vm.textContent('');
      m.redraw();
    };

    vm.reset = function() {
      vm.disabled(true);
      vm.pvjsElement({});
      vm.clearControls();
      //bridgeDbIdControl.vm.sync();
    };

    vm.pvjsElementSource
      .flatMap(function(pvjsElement) {
        console.log('ke et at pvjsElement151');
        console.log(pvjsElement);
        var entityReferenceSource;
        if (pvjsElement.entityReference) {
          entityReferenceSource = Rx.Observable.fromPromise(pvjsElement.getSetEntityReference());
        } else {
          entityReferenceSource = Rx.Observable.return({id: '', isDataItemIn: {id: ''}});
        }
        return Rx.Observable.zipArray(
            Rx.Observable.return(pvjsElement),
            entityReferenceSource
        );
      })
      .subscribe(function(pvjsElementAndEntityReference) {
        console.log('pvjsElementAndEntityReference');
        console.log(pvjsElementAndEntityReference);
        var pvjsElement = pvjsElementAndEntityReference[0];
        var currentEntityReference = _.clone(pvjsElementAndEntityReference[1]);

        vm.clearControls();

        vm.disabled(false);

        vm.entityReference(currentEntityReference);
        var entityReferenceIri = pvjsElement.entityReference;
        vm.iri(entityReferenceIri);

        vm.entityTypeId(pvjsElement.type);
        var entityReferenceTypeId = entityTypeIdToEntityReferenceTypeIdMappings[pvjsElement.type];
        vm.entityReferenceTypeId(entityReferenceTypeId);

        // Pathway author can override default display name (xref display name)
        // for a specific DataNode.
        //vm.textContent(pvjsElement.textContent || currentEntityReference.displayName);
        pvjsElement.textContent = pvjsElement.textContent || currentEntityReference.displayName;
        vm.pvjsElement(pvjsElement);

        //bridgeDbIdControl.vm.sync();
        m.redraw();
      }, function(err) {
        throw err;
      });

    vm.resetSource
      .subscribe(function(value) {
        console.log('reset ke et at 180');
        vm.reset();
        m.redraw();
      }, function(err) {
        console.log(err);
      }, function(value) {
        // do something
      });

    kaavio.diagramComponent.vm.selectionHierarchy.loopback();

    vm.updateTextContent = function(textContent) {
      var pvjsElement = vm.pvjsElement();
      pvjsElement.textContent = textContent;
      vm.pvjsElement(pvjsElement);
      vm.containerElement.querySelector('#text-for-' + pvjsElement.id)
        .querySelector('text').textContent = textContent;
    }

    /*
    vm.updatePvjson = function(selectedEntityReference) {
      var datasetId = selectedEntityReference.isDataItemIn.id;
      var identifier = selectedEntityReference.identifier;
      vm.pvjsElement.getSetEntityReference(datasetId, identifier);
    };
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
      vm.textContent(selectedEntityReference.displayName);

      pvjsElement.type = entityReferenceTypeIdToEntityTypeIdMappings[entityReferenceTypeId];

      var entityReferenceIri = selectedEntityReference.id;
      pvjsElement.entityReference = entityReferenceIri;
      pvjsElement.textContent = selectedEntityReference.displayName;

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

      // TODO why do I need to re-find the pvjsElement? Why doesn't updating
      // vm.pvjsElement also update the pvjsElement in kaavio.sourceData.normalizedPvjsonCurrent?
      var pvjsElementInPvjson = _.find(elements, function(element) {
        return element.id === vm.pvjsElement.id;
      });
      _.assign(pvjsElementInPvjson, pvjsElement);
    };
    //*/

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
        onchange: function(selectedEntityReference) {
          console.log('selectedEntityReference');
          console.log(selectedEntityReference);
          var previousEntityReference = vm.entityReference();
          vm.entityReference(selectedEntityReference);
          var pvjsElement = vm.pvjsElement();
          pvjsElement.textContent = undefined;
          pvjsElement.type = undefined;
          pvjsElement.getSetEntityReference(selectedEntityReference)
            .then(function(enrichedEntityReference) {
              vm.pvjsElement(pvjsElement);
              if (pvjsElement.textContent) {
                vm.updateTextContent(pvjsElement.textContent);
              }
              m.redraw();
            }, function(err) {
              throw err;
            });
        },
        organism: vm.organism,
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
        m.component(entityTypeControl, {
          disabled: vm.disabled,
          entityTypeId: vm.entityTypeId
        }),
        m.component(bridgeDbIdControl, {
          disabled: vm.disabled,
          entityReference: vm.entityReference,
          oninput: function(result) {
            console.log('result314');
            console.log(result);
          },
          onchange: function(result) {
            console.log('result318');
            console.log(result);
          },
          style: {
            clear: 'both',
            display: 'inline-block',
          }
        }),
        m('input', {
          class: 'form-control input input-sm',
          oninput: m.withAttr('value', vm.updateTextContent),
          placeholder: 'Display name',
          //value: vm.textContent(),
          value: vm.pvjsElement().textContent || '',
          disabled: vm.disabled()
        }),
      ]),
    ]),
  ]);
};

module.exports = annotationTab;
