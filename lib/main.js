var _ = require('lodash');
var BridgeDb = require('bridgedb');
var insertCss = require('insert-css');
var fs = require('fs');
var editorTabsComponent = require('./editor-tabs-component/editor-tabs-component.js');
var editorUtils = require('./editor-utils.js');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var Rx = require('rx');
var RxNode = require('rx-node');

var css = [
  fs.readFileSync(__dirname + '/editor.css')
];

css.map(insertCss);

//module for editor
//for simplicity, we use this module to namespace the model classes
var editor = {};

//the view-model,
editor.vm = (function() {
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
      var datasetName = dataset.name;
      // NOTE: for some of these, the name for use by the end user
      // differs from the conventional name. We want to use the
      // last name in the array in this case.
      if (_.isArray(datasetName)) {
        dataset.name = datasetName[datasetName.length - 1];
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

  editor.save = function save() {
    return vm.sourceData.normalizedPvjsonCurrent;
  };

  vm.init = function(kaavio) {
    editor.trigger = kaavio.trigger.bind(kaavio);

    vm.sourceData = kaavio.sourceData;
    kaavio.primaryDatasetList = primaryDatasetList;

    vm.state = kaavio.kaavioComponent.vm.state.footer;

    vm.onunload = function() {
      vm.close();
    };

    vm.open = function() {
      vm.state('open');
      kaavio.on('rendered', function() {
        //m.redraw();
      });
    };

    vm.close = function() {
      kaavio.diagramComponent.vm.clickTargetIdSource.onNext(null);
      editor.save();
      editor.vm.state('closed');
      if (!!editor.panZoom) {
        kaavio.panZoom.resizeDiagram();
      }
    };

    vm.disabled = vm.closed;

    var editableElementTypes = [
      'biopax:Protein',
      'biopax:Pathway',
      'biopax:Rna',
      'gpml:GeneProduct',
      'gpml:Metabolite',
      'gpml:Unknown',
      'biopax:PhysicalEntity'
    ];

    var normalizedPvjsonSource;
    if (!kaavio.sourceData.normalizedPvjsonCurrent) {
      normalizedPvjsonSource = Rx.Observable.zipArray(
            Rx.Observable.from([kaavio.sourceData.pvjson])
              .flatMap(function(pvjson) {
                m.startComputation();
                return editorUtils.rxJsonldExpand(pvjson, null);
              })
              .map(function(input) {
                return input[0];
              }),
            Rx.Observable.fromPromise(primaryDatasetList)
              .map(function(primaryDatasetList) {
                return primaryDatasetList
                  //*
                  .filter(function(dataset) {
                    // This messes up the ids for each individual node in the pvjson.
                    // TODO how to do this without messing up the IDs?
                    return !_.isEmpty(dataset.id) &&
                        dataset.id !== 'http://identifiers.org/wikipathways/';
                  })
                  //*/
                  .reduce(function(accumulator, dataset) {
                    accumulator[dataset.preferredPrefix] = {
                      '@id': dataset.id,
                      '@type': '@id'
                    };

                    return accumulator;
                  }, {});
              })
        )
        .flatMap(function(pvjsonAndDatasetsContext) {
          var pvjson = pvjsonAndDatasetsContext[0];
          var datasetsContext = pvjsonAndDatasetsContext[1];

          _.defaults(editorUtils.context, datasetsContext);

          var context = [editorUtils.context];

          // TODO How can we avoid having an id like '../WP2853'?
          // Don't show the @base in the id of every element in this graph,
          // e.g., njwn98 instead of http://identifiers.org/wikipathways/WP4/njwn98
          var base = pvjson['@id'] + '/';
          context.push({
            '@base': base
          });
          return editorUtils.rxJsonldCompact(pvjson, context, null);
        })
        .map(function(pvjson) {
          pvjson = pvjson[0];
          kaavio.sourceData.normalizedPvjsonPreUpdateAsString = JSON.stringify(pvjson);
          window.myPvjsonNormalized = pvjson;
          kaavio.sourceData.normalizedPvjsonCurrent = pvjson;
          m.endComputation();
          return pvjson;
        })
        .first()
        .toPromise();
    } else {
      normalizedPvjsonSource = Rx.Observable.just(kaavio.sourceData.normalizedPvjsonCurrent)
        .toPromise();
    }

    var pvjsElementAndResetSource = kaavio.diagramComponent.vm.selectionSource
      .map(function(pvjsElement) {
        if (!pvjsElement.type) {
          // TODO refactor handling of elements with a type, possibly in gpml2pvjson.
          // We still appear to get gpml:Unknown
          // when the GPML Type of a DataNode is missing.
          pvjsElement.type = 'gpml:GeneProduct';
        }

        return pvjsElement;
      })
      .withLatestFrom(Rx.Observable.fromPromise(normalizedPvjsonSource).map(function(pvjson) {
            return pvjson['@graph'];
          }),
          function(pvjsElement, pvjsonElementList) {
            return [pvjsElement, pvjsonElementList];
          })
      .flatMap(function(pvjsElementAndPvjsonElementList) {
        var pvjsElement = pvjsElementAndPvjsonElementList[0];
        var pvjsonElementList = pvjsElementAndPvjsonElementList[1];
        return Rx.Observable.from(pvjsonElementList)
          .find(function(element, i, obs) {
            return element.id === pvjsElement.id;
          });
      })
      .partition(function(pvjsElement) {
        if (!pvjsElement.id) {
          return false;
        }

        var pvjsElementType = _.isArray(pvjsElement.type) ? pvjsElement.type : [pvjsElement.type];

        var result = !_.isEmpty(_.intersection(pvjsElementType, editableElementTypes));
        return result;
      });

    vm.pvjsElementSource = pvjsElementAndResetSource[0];
    vm.resetSource = kaavio.diagramComponent.vm.resetSource.merge(pvjsElementAndResetSource[1]);

    vm.resetSource.subscribe(function() {
      vm.reset();
    });

  };

  vm.reset = function() {
    editorTabsComponent.vm.pvjsElement = null;
    // do something
  };

  return vm;
}());

//the controller defines what part of the model is relevant for the current page
//in our case, there's only one view-model that handles everything
editor.controller = function(ctrl) {
  editor.vm.init(ctrl);
};

//here's the view
editor.view = function(ctrl, args) {
  var vm = editor.vm;
  if (editor.vm.state() === 'open') {
    return m('div', {}, [
      m.component(editorTabsComponent, args)
    ]);
  } else {
    return;
  }
  //*/
};

module.exports = editor;
