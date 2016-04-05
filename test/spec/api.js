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

  it('init Kaavio', function() {
    var containerElement = document.createElement('div');
    var kaavioInstance = new Kaavio(containerElement, {
      pvjson: {}
    });
    expect(kaavioInstance).to.be.instanceof(Kaavio);
    expect(kaavioInstance).to.respondTo('init');
  });

  it('mount kaavioInstance only', function() {
    var containerElement = document.createElement('div');
    var kaavioInstance = new Kaavio(containerElement, {
      pvjson: {}
    });
    m.mount(containerElement, kaavioInstance);
    expect(kaavioEditor).to.respondTo('save');
  });

  it('init kaavioEditor', function() {
    var containerElement = document.createElement('div');
    expect(kaavioEditor).to.respondTo('save');
  });

  it('mount kaavioInstance with kaavioEditor closed', function() {
    var containerElement = document.createElement('div');
    var kaavioInstance = new Kaavio(containerElement, {
      pvjson: {}
    });
    kaavioInstance.footer = kaavioEditor;
    m.mount(containerElement, kaavioInstance);
    console.log('div?');
    console.log(document.querySelector('div'));
    console.log(document.body.innerHTML);
    expect(kaavioEditor).to.respondTo('save');
  });

  it('mount kaavioInstance with kaavioEditor open', function() {
    var containerElement = document.createElement('div');
    var kaavioInstance = new Kaavio(containerElement, {
      pvjson: {},
      editor: 'open'
    });
    kaavioInstance.footer = kaavioEditor;
    m.mount(containerElement, kaavioInstance);
    console.log('.diagram-container:');
    console.log(document.querySelector('.diagram-container'));
    console.log(document.body.innerHTML);
    expect(kaavioEditor).to.respondTo('save');
  });

});
