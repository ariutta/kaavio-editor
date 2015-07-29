/***********************************
 * colorPickerControl
 **********************************/

var _ = require('lodash');
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

    if (!Modernizr.inputtypes.color && !isInitialized) {
      var colorsByRow = _.chunk(colorPickerControl.vm.defaultColors, 3);
      console.log('using color picker polyfill');
      // Polyfill for browsers that don't natively
      // support inputs of type "color"
      window.setTimeout(function() {
        el.spectrum({
          preferredFormat: 'hex',
          showPalette: true,
          // Each sub-array in the palette represents a row of color(s)
          palette: colorsByRow
        });
        //the service is done, tell Mithril that it may redraw
        m.redraw();
      }, 250);
    }
  }
}

colorPickerControl.vm = (function() {

  var vm = {};

  vm.defaultColors = [
    // black
    '#000000',
    // white
    '#ffffff',
    // light tan (as in complexes)
    '#b4b464',
    // blue
    '#0000ff',
    // purple
    '#800080',
    // green
    '#00ff00'
  ];

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

// this view implements a color-picker input both for browers
// that support it natively and for those that don't
colorPickerControl.view = function(ctrl, args) {
  var vm = colorPickerControl.vm;

  return m('div', {}, [
    m('datalist', {
      id: 'color-palette'
    }, vm.defaultColors.map(function(defaultColor) {
      return m('option', {}, defaultColor);
    })),
    m('input', {
      config: colorPickerControl.config(ctrl, args),
      list: 'color-palette',
      onchange: m.withAttr('value', function(color) {
        console.log('color');
        console.log(color);
        args.color(color);
        args.onchange(color);
      }),
      style: 'width: 50px; height: 50px;',
      type: 'color',
      value: args.color(),
      disabled: args.disabled()
    })
  ]);
}

module.exports = colorPickerControl;
