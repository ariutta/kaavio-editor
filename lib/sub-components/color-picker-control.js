/***********************************
 * colorPickerControl
 **********************************/

// TODO figure out why m.redraw doesn't work with browserify
// and kaavio-editor
//var m = require('mithril');
var m = window.m;

var colorPickerControl = {};

/**
colorPickerControl config factory. The params in this doc refer to properties
                                      of the `ctrl` argument
@param {Object} data - the data with which to populate the <input>
@param {number} value - the hex value of the item in `data` that we want to select
@param {function(Object id)} onchange - the event handler to call when the selection changes.
    `id` is the the same as `value`
*/
colorPickerControl.config = function(ctrl, args) {
  return function(element, isInitialized) {
    var el = $(element);

    /*
    if (!Modernizr.inputtypes.color && !isInitialized) {
      console.log('using color picker polyfill');
      // Polyfill for browsers that don't natively
      // support inputs of type "color"
      window.setTimeout(function() {
        el.spectrum({
          preferredFormat: 'hex',
          showPalette: true,
          palette: [
            ['black', 'white', 'blanchedalmond'],
            ['rgb(255, 128, 0);', 'hsv 100 70 50', 'lightyellow']
          ]
        });
        //the service is done, tell Mithril that it may redraw
        m.redraw();
      }, 250);
    }
    //*/
  }
}

colorPickerControl.vm = (function() {

  var vm = {};

  vm.init = function(ctrl) {
    vm.disabled = ctrl.disabled;
    vm.color = ctrl.color;

    vm.reset = function() {
      vm.color('');
    }

  }

  return vm;
})();

colorPickerControl.controller = function(ctrl) {
  colorPickerControl.vm.init(ctrl);
}

//this view implements a color-picker input for both
//browers that support it natively and those that don't
colorPickerControl.view = function(ctrl, args) {
  return m('input', {
    config: colorPickerControl.config(ctrl, args),
    onchange: m.withAttr('value', function(color) {
      console.log('color');
      console.log(color);
      args.color(color);
      args.onchange(color);
    }),
    style: 'width: 30px; height: 30px; transform: translateY(1px);',
    type: 'color',
    value: args.color(),
    disabled: args.disabled()
  })
}

module.exports = colorPickerControl;
