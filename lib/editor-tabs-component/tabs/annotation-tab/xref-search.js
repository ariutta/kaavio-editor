var _ = require('lodash');
var BridgeDb = require('bridgedb');
//var editorUtils = require('../../../editor-utils');
//var JsonldRx = require('jsonld-rx');
var Levenshtein = require('levenshtein');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;
var mithrilUtils = require('../../../mithril-utils');
var mSimpleModal = require('mithril-simple-modal');
var Rx = require('rx');
var RxNode = require('rx-node');

window.myRx = Rx;
window.myLevenshtein = Levenshtein;

module.exports = function() {

  //var jsonldRx = new JsonldRx();
  /******************************
   * search by name input
   *****************************/

  //module for xrefSearch
  //for simplicity, we use this module to namespace the model classes
  var xrefSearch = {};

  //the view-model tracks a running list of xrefs,
  //stores a query for new xrefs before they are created
  //and takes care of the logic surrounding when searching is permitted
  //and clearing the input after searching a xref to the list
  xrefSearch.vm = (function() {
    var vm = {}

    vm.changeStateToGlyphiconMappings = {
      'true': 'btn-success',
      'false': 'btn-default'
    };

    vm.init = function(ctrl) {
      xrefSearch.trigger = ctrl.trigger;

      var bridgeDb = new BridgeDb({
        organism: ctrl.organism
      });

      vm.showEntityReferences = m.prop(false);

      //a slot to store the name of a new xref before it is created
      vm.query = m.prop('');

      vm.saveAndClose = function(selectedEntityReferenceId) {
        var selectedEntityReference = _.find(vm.xrefs(), function(xref) {
          return xref.id === selectedEntityReferenceId;
        });
        ctrl.onchange(selectedEntityReference);
        vm.reset();
      };

      // searches for xrefs, which are added to the list
      vm.search = function(query) {
        var queryLowerCase = query.toLowerCase();
        var queryLength = query.length;
        var deferred = m.deferred();
        var searchResultSource = RxNode.fromReadableStream(
            bridgeDb.entityReference.freeSearch(
              {attribute: query}))
          .timeout(10000)
          .filter(function(xref) {
            return xref.isDataItemIn._isPrimary;
          })
          .groupBy(function(xref) {return xref.isDataItemIn.preferredPrefix;})
          .flatMap(function(xrefGroupSource) {
            return xrefGroupSource.toArray().map(function(xrefGroup) {
              return xrefGroup.sort(function(xref1, xref2) {
                var displayName1 = xref1.displayName;
                var displayNameLowerCase1 = displayName1.toLowerCase();
                var displayName2 = xref2.displayName;
                var displayNameLowerCase2 = displayName2.toLowerCase();

                if (displayNameLowerCase1 === queryLowerCase) {
                  return -1;
                } else if (displayNameLowerCase2 === queryLowerCase) {
                  return 1;
                }

                var prefixMatch1 = displayNameLowerCase1.substr(0, queryLength) === queryLowerCase;
                var prefixMatch2 = displayNameLowerCase2.substr(0, queryLength) === queryLowerCase;

                if (prefixMatch1 && !prefixMatch2) {
                  return -1;
                } else if (!prefixMatch1 && prefixMatch2) {
                  return 1;
                }

                var levenshtein1 = new Levenshtein(query, displayName1);
                var levenshtein2 = new Levenshtein(query, displayName2);
                var levenshteinDistance1 = levenshtein1.distance;
                var levenshteinDistance2 = levenshtein2.distance;
                if (levenshteinDistance1 !== levenshteinDistance2) {
                  // Sort by closest match for displayName to query
                  return levenshteinDistance1 > levenshteinDistance2;
                }

                // If tied for closest match, sort alphabetically.
                return displayName1 > displayName2;
              });
            })
          })
          .toArray()
          .map(function(xrefGroups) {
            return xrefGroups.sort(function(xrefGroup1, xrefGroup2) {
              var datasetPreferredPrefix1 = xrefGroup1[0].isDataItemIn.preferredPrefix;
              var datasetPreferredPrefix2 = xrefGroup2[0].isDataItemIn.preferredPrefix;

              // Ensembl shows up first
              if (datasetPreferredPrefix1 === 'ensembl') {
                return -1;
              } else if (datasetPreferredPrefix2 === 'ensembl') {
                return 1;
              }

              // Entrez Gene shows up next
              if (datasetPreferredPrefix1 === 'ncbigene') {
                return -1;
              } else if (datasetPreferredPrefix2 === 'ncbigene') {
                return 1;
              }

              // The rest are sorted alphabetically
              return datasetPreferredPrefix1 > datasetPreferredPrefix2;
            })
            .reduce(function(xrefs, xrefGroup) {
              return xrefs.concat(xrefGroup);
            }, [])
            //*/
          })
          .subscribe(function(xrefs) {
            deferred.resolve(xrefs);

            /*
            if (!xrefs.length) {
              vm.reset();
              xrefSearch.trigger('warning.xrefSearch', {
                message: 'Your search "' + query + '" did not match any identifiers.'
              });
            }
            //*/

            m.redraw();
          }, function(err) {
            vm.reset();
            m.redraw();

            var message = err.message ? err.message : err.toString();
            xrefSearch.trigger('error.' + message, {
              message: message
            });
          }, function() {
            // do something on complete.
          });
        return deferred.promise;
      };

      vm.reset = function() {
        // clears the query field
        vm.query('');
        // TODO refactor the below line - shouldn't need to do this.
        //document.querySelector('#xref-search-input').value = '';
        vm.xrefs = null;
        vm.showEntityReferences(false);
      };
    }

    return vm
  }());

  // the controller defines what part of the model is relevant for the current page
  // in our case, there's only one view-model that handles everything
  xrefSearch.controller = function(ctrl) {
    xrefSearch.vm.init(ctrl);
  }

  //here's the view
  xrefSearch.view = function(ctrl, args) {
    var vm = xrefSearch.vm;
    return m('div.form-search.form-group', [
      m('div.input-group.input-group-sm.form-control', [
        m('input', {
          id: 'xref-search-input',
          'class': 'form-control',
          'placeholder': 'Search by name',
          onchange: m.withAttr('value', vm.query),
          type: 'text',
          value: vm.query(),
          disabled: args.disabled()
        }),
        m('span.input-group-btn', {
          onclick: function() {
            var query = vm.query();
            if (!_.isEmpty(query)) {
              vm.showEntityReferences(true);
              vm.xrefs = vm.search(query);
            }
          },
          style: args.disabled() ? 'pointer-events: none; ' : null
        },
          m('button[type="submit"]', {
            'class': 'btn ' +
                vm.changeStateToGlyphiconMappings[!args.disabled()]
          }, [
            m('span[aria-hidden="true"].glyphicon.glyphicon-search')
          ])),
        (function() {

          var content;
          if (vm.xrefs && vm.showEntityReferences) {
            content = {pending: true};
            vm.xrefs.then(function(xrefs) {
              if (!xrefs || !xrefs.length) {
                //content = null;
                content = m('div', {}, 'No results found.');
              } else {
                content = m('table.table.table-hover.table-bordered', [
                  m('thead', [
                    m('tr', {}, [
                      m('th', {}, 'Name'),
                      m('th', {}, 'Datasource'),
                      m('th', {}, 'Identifier')
                    ])
                  ]),
                  m('tbody', {}, [
                    xrefs.map(function(xref, index) {
                      return m('tr[style="cursor: pointer;"]', {
                        id: xref.id,
                        onclick: m.withAttr('id', mSimpleModal.wrapClose(vm.saveAndClose))
                      }, [
                        m('td', {}, xref.displayName),
                        m('td', {}, xref.db),
                        m('td', {}, xref.identifier),
                      ]);
                    })
                  ])
                ]);
              }
            });
          }

          return m.component(mSimpleModal.component, {
            content: content,
            buttons: [{
              text: 'Cancel',
              closeOnClick: true,
              callback: function(value) {
                vm.xrefs = null;
                vm.showEntityReferences(false);
                m.redraw();
              }
            }],
            onchange: function(value) {
              // do something
            }
          });
        })()
        //simpleModalComponent.view(vm.xrefs())
        /*,
        vm.modalList.map(function(xrefs, index) {
          var xrefs = xrefs.xrefs();
          if (!!xrefs && !!xrefs.length && xrefs.length > 0) {
            vm.spinner.stop();
            return simpleModalComponent.view(xrefs);
          } else {
            window.setTimeout(function() {
              xrefs = xrefs.xrefs();

              vm.spinner.stop();

              if (xrefs.length) {
                return simpleModalComponent.view(xrefs);
              }

              if (!_.isEmpty(vm.query()) && (!xrefs || !xrefs.length)) {
                xrefSearch.trigger('warning.xrefSearch',
                    {message: 'Your search "' + vm.query() +
                        '" did not match any identifiers.'});
              }
              // TODO the handling of no results returned is ugly.
              vm.reset();
              return;
            }, xrefSearch.modalOpenDelay + 1500);
          }
        })
        //*/
      ])
    ]);
  };

  return xrefSearch;
};
