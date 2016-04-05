/**
 * Test public APIs
 */

var fs = require('fs');
var jsdom = require('mocha-jsdom')
var expect = require('chai').expect;
var sinon = require('sinon');
var sologger = require('../sologger.js');

//process.env.NODE_ENV = 'development';

/* global describe, it, before, expect */
require('./setup')

// Run tests
describe('Public API', function() {
  var d3;
  var Kaavio;
  var kaavioEditor;
  var m;

  before(function() {
    d3 = window.d3 = require('d3');
    m = window.m = require('mithril');
    //require('../../dist/kaavio-dev-polyfills.bundle.js');
    require('Kaavio');
    Kaavio = window.Kaavio;
    kaavioEditor = require('../../index.js') || window.kaavioEditor;
  });

  it('has save method', function() {
    expect(kaavioEditor).to.respondTo('save');
  });

  it('mount with kaavioEditor closed', function() {
    var containerElement = document.createElement('div');
    document.body.appendChild(containerElement);
    var kaavioInstance = new Kaavio(containerElement, {
      pvjson: {}
    });
    kaavioInstance.footer = kaavioEditor;
    m.mount(containerElement, kaavioInstance);

    console.log('document.body.innerHTML');
    console.log(document.body.innerHTML);

    var kaavioElement = document.querySelector('.kaavio-container');
    expect(kaavioElement.tagName).to.equal('DIV');
    // TODO make sure the footer is closed
  });

  it('mount kaavioInstance with kaavioEditor open', function() {
    var containerElement = document.createElement('div');
    document.body.appendChild(containerElement);
    var kaavioInstance = new Kaavio(containerElement, {
      pvjson: {},
      editor: 'open'
    });
    kaavioInstance.footer = kaavioEditor;
    m.mount(containerElement, kaavioInstance);

    console.log('document.body.innerHTML');
    console.log(document.body.innerHTML);

    var kaavioElement = document.querySelector('.kaavio-container');
    expect(kaavioElement.tagName).to.equal('DIV');
    // TODO make sure the footer is open
  });

});
