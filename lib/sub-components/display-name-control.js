/******************************
  * Display name control
  *****************************/

// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;

//module for displayNameControl
//for simplicity, we use this module to namespace the model classes
var displayNameControl = {};

//the view-model,
displayNameControl.vm = (function() {
  var vm = {}

  vm.disabled = m.prop(true);

  vm.init = function(ctrl) {
    vm.displayName = m.prop('');
  }

  vm.reset = function() {
    vm.displayName('');
    vm.disabled(true);
  }

  return vm
}());

//the controller defines what part of the model is relevant for the current page
//in our case, there's only one view-model that handles everything
displayNameControl.controller = function(ctrl) {
  displayNameControl.vm.init(ctrl);
}

//here's the view
displayNameControl.view = function(ctrl, args) {
  var component = this;
  var vm = component.vm;
  return m('input', {
    class: 'form-control input input-sm',
    //onchange: m.withAttr('value', args.displayName),
    //onchange: m.withAttr('value', args.onchange),
    onchange: m.withAttr('value', function(displayName) {
      args.displayName(displayName);
      args.onchange(displayName);
    }),
    placeholder: 'Display name',
    value: args.displayName() || '',
    disabled: args.disabled()
  });
};

module.exports = displayNameControl;
