/***********************************
 * bridgeDbIdControl
 **********************************/

var _ = require('lodash');
var datasetControl = require('./dataset-control.js');
var entityReferenceTypeControl = require('./xref-type-control.js');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;

var bridgeDbIdControl = {};

bridgeDbIdControl.vm = (function() {

  var vm = {};

  // Regular expression to pull out the preferred dataset prefix and
  // the identifier from any of the following:
  // 1) an identifiers.org IRI
  //    (e.g, http://identifiers.org/ensembl/ENSG00000198807)
  // 2) a compacted identifiers.org IRI
  //    (e.g., identifiers:ensembl:ENSG00000198807)
  // 3) an identifiers.org preferredPrefix:identifier combination
  //    (e.g., ensembl:ENSG00000198807)
  // When matched with the regex, all of the above will yield a result with:
  //    result[2] = ensembl
  //    result[4] = ENSG00000198807
  var identifiersComponentsRe = new RegExp(
      /^(http:\/\/identifiers.org\/|identifiers:)?([^\/:]*)(:|\/)(.*)(\/)?$/);

  function parseIdentifiersIri(iri) {
    var iriComponents = identifiersComponentsRe.exec(iri);
    var datasetPreferredPrefix = iriComponents[2];
    var result = {
      datasetIri: 'http://identifiers.org/' + datasetPreferredPrefix + '/',
      datasetPreferredPrefix: datasetPreferredPrefix,
    };

    var identifier = iriComponents[4];
    if (identifier) {
      result.identifier = identifier;
    }

    return result;
  }

  vm.validEntityReferenceTypes = entityReferenceTypeControl.vm.entityReferenceTypes.map(
      function(entityReferenceType) {
        return entityReferenceType.id;
      });

  vm.entityReferenceTypeIdToEntityTypeIdMappings =
      entityReferenceTypeControl.vm.entityReferenceTypeIdToEntityTypeIdMappings;

  /**
   * init
   *
   * @param {object} ctrl
   */
  vm.init = function(ctrl) {

    /*
    vm.updateCurrentEntityReference = function(args) {
      var datasetPreferredPrefix = args.datasetPreferredPrefix;
      var identifier = args.identifier;
      var entityReferenceTypeId = args.entityReferenceTypeId;
      var datasetName = args.datasetName;

      var currentEntityReference = vm.currentEntityReference = {};

      var entityReferenceId = datasetPreferredPrefix + ':' + identifier;

      currentEntityReference.id = entityReferenceId;

      if (!!datasetPreferredPrefix && !!datasetName && !!identifier) {
        currentEntityReference.isDataItemIn = {
          id: datasetPreferredPrefix,
          preferredPrefix: datasetPreferredPrefix
        };
        currentEntityReference.dbName = datasetName;
        currentEntityReference.dbId = identifier;
      }
    }
    //*/

    vm.sync = function() {
      console.log('sync bridgedb id ctrl');
      console.log(ctrl);
      var iri = ctrl.iri;
      var datasetIri = ctrl.datasetIri;
      var datasetPreferredPrefix = ctrl.datasetPreferredPrefix;
      var identifier = ctrl.identifier;

      var disabled = ctrl.disabled;

      if (disabled()) {
        return;
      }

      if (!iri() && (!identifier() || (!datasetPreferredPrefix() && !datasetIri()))) {
        console.warn('Missing minimum information to identify this entity reference.');
        console.warn('  Must have an IRI (e.g, http://identifiers.org/ensembl/ENSG00000198807) or');
        console.warn('  a combination of the following:');
        console.warn('    an identifier (e.g, ENSG00000198807) and');
        console.warn('    a means for identifying the dataset, such as');
        console.warn('      an identifiers.org dataset prefix (e.g, ensembl) or');
        console.warn('      an identifiers.org dataset IRI');
        console.warn('          (e.g, http://identifiers.org/ensembl)');
        console.warn('Cannot fill in data for entityReference.');
        return;
      }

      if (iri() || datasetIri()) {
        var iriComponents = parseIdentifiersIri(iri() || datasetIri());
        datasetIri(iriComponents.datasetIri);
        datasetPreferredPrefix(iriComponents.datasetPreferredPrefix);

        if (iriComponents.identifier) {
          identifier(iriComponents.identifier);
        } else if (identifier() && !iri()) {
          iri(iriComponents.datasetIri + identifier());
        }
      } else if (datasetPreferredPrefix()) {
        datasetIri('http://identifiers.org/' + datasetPreferredPrefix() + '/');
        if (identifier() && !iri()) {
          iri(datasetIri() + identifier());
        }
      }

      datasetControl.vm.sync();
      /*
      vm.updateCurrentEntityReference({
        datasetPreferredPrefix: datasetPreferredPrefix(),
        identifier: identifier(),
        entityReferenceTypeId: ctrl.entityReferenceTypeId(),
        datasetName: ctrl.datasetName()
      });
      //*/
    };

    vm.sync();

    /*
    vm.cancel = function() {
      vm.reset();
    };

    vm.reset = function() {
      vm.datasetPreferredPrefix('');
      vm.entityReferenceTypeId('');
      vm.identifier('');
      vm.displayName('');
      vm.disabled(true);
    };
    //*/

    vm.onunload = function() {
      // do something
    };
  };

  return vm;
})();

bridgeDbIdControl.controller = function(ctrl) {
  bridgeDbIdControl.vm.init(ctrl);
};

bridgeDbIdControl.view = function(ctrl, args) {
  var vm = bridgeDbIdControl.vm;

  return m('div', {
    style: args.style,
    onchange: function() {
      console.log('bridgedb id control onchange fired');
      vm.sync();
      if (args.onchange) {
        args.onchange();
      }
    }
  }, [
    m.component(entityReferenceTypeControl, {
      disabled: args.disabled,
      entityReferenceTypeId: args.entityReferenceTypeId
    }),
    m.component(datasetControl, {
      disabled: args.disabled,
      entityReferenceTypeId: args.entityReferenceTypeId,
      preferredPrefix: args.datasetPreferredPrefix,
      iri: args.datasetIri,
      name: args.datasetName,
      entityReferenceIdentifier: args.identifier,
      //*
      onchange: function(dataset) {
        console.log('datasetControl onchange fired in bridgedb id control');
        args.iri('');
        vm.sync();
      },
      //*/
    }),
    m('input', {
      'class': 'pvjs-editor-identifier form-control input input-sm',
      placeholder: 'Identifier',
      onchange: m.withAttr('value', function(value) {
        console.log('bridgedb id control onchange fired');
        args.iri('');
        args.identifier(value);
        vm.sync();
      }),
      //onchange: m.withAttr('value', args.identifier),
      value: args.identifier() || '',
      disabled: args.disabled()
    })
  ]);
};

module.exports = bridgeDbIdControl;
