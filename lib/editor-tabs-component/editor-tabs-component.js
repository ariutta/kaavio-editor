var _ = require('lodash');
var annotationTab = require('./tabs/annotation-tab/annotation-tab');
var highland = require('highland');
var propertiesTab = require('./tabs/properties-tab/properties-tab');
// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;

/*
var containerElement = kaavio.containerElement;
var editorTabsComponentContainerElement = containerElement.querySelector(
    '.kaavio-editor-tabs');
//*/

//module for editorTabsComponent
//for simplicity, we use this module to namespace the model classes
var editorTabsComponent = {};

//the view-model,
editorTabsComponent.vm = (function() {
  var vm = {};

  vm.init = function(kaavio) {
    m = kaavio.m;
    kaavio.editor.editorTabsComponent = editorTabsComponent;

    vm.state = kaavio.kaavioComponent.vm.state;
    vm.close = kaavio.editor.vm.close;

    var pvjsElementAndResetSource = kaavio.editor.vm.pvjsElementSource
      .partition(function(pvjsElement) {
        return !!pvjsElement;
      });

    vm.hasDataChanged = function() {
      if (!kaavio.sourceData || !kaavio.sourceData.normalizedPvjsonPreUpdateString) {
        return false;
      }

      var currentPvjsonAsString = JSON.stringify(kaavio.sourceData.normalizedPvjsonCurrent);
      var dataChanged = (currentPvjsonAsString !==
          kaavio.sourceData.normalizedPvjsonPreUpdateString);
      return dataChanged;
    }

    vm.pvjsElementSource = pvjsElementAndResetSource[0];
    vm.resetSource = kaavio.editor.vm.resetSource.merge(pvjsElementAndResetSource[1]);

    vm.resetSource
      .subscribe(function(value) {
        vm.reset();
      }, function(err) {
        console.log(err);
      }, function(value) {
        // do something
      });

    vm.reset = function() {
      // do something
    };

    //the Tab class has two properties
    editorTabsComponent.Tab = function(data) {
      this.title = m.prop(data.title);
      this.component = data.component;
    };

    //the TabList class is a list of Tabs
    editorTabsComponent.TabList = m.prop([
      {
        title: 'Annotation',
        component: annotationTab
      },
      {
        title: 'Properties',
        component: propertiesTab
      }
      /* TODO add the rest of the tabs
      {
        title: 'Citations',
        component: null
      },
      //*/
    ]
    .map(function(tab) {
      return new editorTabsComponent.Tab(tab);
    }));

    vm.changeStateToBtnStyle = {
      'true': 'btn-success',
      'false': 'btn-close'
    };

    vm.changeStateToGlyphicon = {
      'true': 'span.glyphicon.glyphicon-ok[aria-hidden="true"]',
      'false': 'span.glyphicon.glyphicon-chevron-down[aria-hidden="true"]'
    };

    vm.changeStateToBtnText = {
      'true': ' Save & Close',
      'false': ' Close'
    };

    // TODO is this needed?
    vm.open = function() {
    };

    /*
    vm.close = function() {
      annotationTab.vm.onunload();
      propertiesTab.vm.onunload();
    };
    //*/

    vm.tabList = new editorTabsComponent.TabList();
    vm.currentTab = m.prop(vm.tabList[0]);

    /*
    annotationTab.vm.init(kaavio);
    propertiesTab.vm.init(kaavio);
    //*/

    /*
    kaavio.on('rendered', function() {
      // do something
    });
    //*/
  };

  vm.changeTab = function(title) {
    vm.currentTab(_.find(vm.tabList, function(tab) {
      return tab.title() === title;
    }));
  };

  return vm;
}());

//the controller defines what part of the model is relevant for the current page
//in our case, there's only one view-model that handles everything
editorTabsComponent.controller = function(ctrl) {
  editorTabsComponent.vm.init(ctrl);
};

//here's the view
editorTabsComponent.view = function(ctrl, args) {
  var vm = editorTabsComponent.vm;
  var dataChanged = vm.hasDataChanged();

  return m('div', {}, [
    m('ul.nav.nav-tabs', {}, [
      vm.tabList.map(function(tab) {
        var activeString = tab.title() === vm.currentTab().title() ?
            '.active' : '';
        return m('li' + activeString + '[role="presentation"]', {}, [
          m('a[style="cursor: pointer"]', {
            onchange: m.withAttr('value', tab.title),
            onclick: m.withAttr('value', vm.changeTab),
            value: tab.title()
          }, tab.title())
        ]);
      })
    ]),
    m('div', {
      'onclick': function onClick(e) {
        vm.state.footer('closed');
        vm.close();
      },
      title: dataChanged ? 'Save and Close' : 'Close'
    }, [
      m('span', {
        'class': 'editor-close-control btn navbar-right ' +
            vm.changeStateToBtnStyle[
                dataChanged],
      }, [
      m(vm.changeStateToGlyphicon[
          dataChanged]),
      m('span', {}, vm.changeStateToBtnText[
          dataChanged])
      ])
    ]),
    m.component(vm.currentTab().component, args),
    //vm.currentTab().view()
  ]);
};

module.exports = editorTabsComponent;
