var _ = require('lodash');
var insertCss = require('insert-css');
var fs = require('fs');
var editorTabsComponent = require('./editor-tabs-component/editor-tabs-component.js');
var editorUtils = require('./editor-utils.js');
var JsonldRx = require('jsonld-rx');
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

  var jsonldRx = new JsonldRx();

  /*
  var BridgeDb = require('bridgedb');
  var bridgeDb = new BridgeDb({
    organism: 'Homo sapiens'
  });

  var primaryDatasetList = RxNode.fromReadableStream(bridgeDb.dataset.query())
    .flatMap(function(input) {
      return jsonldRx.replaceContext(input, editorUtils.context);
    })
    .map(function(dataset) {
      dataset.subject = jsonldRx.arrayifyClean(dataset.subject);
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
  //*/

  editor.save = function save() {
    return vm.sourceData.pvjson;
  };

  vm.init = function(kaavio) {
    var jsonldRx = kaavio.jsonldRx;
    editor.trigger = kaavio.trigger.bind(kaavio);

    kaavio.sourceData.pvjsonPreUpdateAsString = JSON.stringify(kaavio.sourceData.pvjson);
    vm.sourceData = kaavio.sourceData;
    //kaavio.primaryDatasetList = primaryDatasetList;

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
      //kaavio.diagramComponent.vm.clickTargetIdSource.onNext(null);
      if (editorTabsComponent.vm.hasDataChanged()) {
        editor.save();
      }
      editor.vm.state('closed');
      if (!!editor.panZoom) {
        kaavio.panZoom.resizeDiagram();
      }
    };

    vm.disabled = vm.closed;

    /*
    var entityReferenceTypes = [
      'biopax:ProteinReference',
      'biopax:PathwayReference',
      'biopax:RnaReference',
      'gpml:GeneProductReference',
      'biopax:SmallMoleculeReference',
      'gpml:UnknownReference'
    ];

    Rx.Observable.from([kaavio.sourceData.pvjson])
      .flatMap(function(pvjson) {
        var frame = {
          '@context': editorUtils.context,
          '@type': editableElementTypes,
          entityReference: {
            type: entityReferenceTypes
          }
        };
        return editorUtils.rxJsonldFrame(pvjson, frame);
      })
      .subscribe(function(x) {
        console.log('x150');
        console.log(x);
      });

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
                  //.filter(function(dataset) {
                    // This messes up the ids for each individual node in the pvjson.
                    // TODO how to do this without messing up the IDs?
                    //return !_.isEmpty(dataset.id) &&
                    //   dataset.id !== 'http://identifiers.org/wikipathways/';
                  //})
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
    //*/

    var parentHierarchy = kaavio.diagramComponent.vm.selectionHierarchy;
    var pvjsElementHierarchy = vm.pvjsElementHierarchy = jsonldRx.hierarchicalPartition(
        parentHierarchy.mainSource,
        function(pvjsElement) {
          return pvjsElement.id;
        },
        parentHierarchy.resetSource
    );

    vm.pvjsElementSource = pvjsElementHierarchy.mainSource;
    vm.resetSource = pvjsElementHierarchy.resetSource;

    vm.pvjsElementSource.subscribe(function(pvjsElement) {
      console.log('ke pvjsElement209');
      console.log(pvjsElement);
    });
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
