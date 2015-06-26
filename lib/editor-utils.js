var _ = require('lodash');
var highland = require('highland');
var jsonld = require('jsonld');
var Rx = require('rx');

/**
 * Convert an input into an array, if it is not already.
 *
 * @param {*} arg
 * @return {array} arrayified version on input arg
 */
function arrayify(arg) {
  return _.isArray(arg) ? arg : [arg];
}

/**
 * Convert an input into an array, if it is not already.
 * If the input is falsey but not false or 0, return an empty array.
 *
 * @param {*} arg
 * @return {array} arrayified version on input arg
 */
function arrayifyClean(arg) {
  if (!arg && arg !== false && arg !== 0) {
    return [];
  }
  return arrayify(arg);
}

/*
var bridgeDbContext = {
  'biopax': {
    '@id': 'http://www.biopax.org/release/biopax-level3.owl#',
    '@type': '@id'
  },
  'bridgedb': 'http://www.example.org/bridgedb/input-vocab/',
  'dcterms': {
    '@id': 'http://purl.org/dc/terms/',
    '@type': '@id'
  },
  'displayName': {
    '@id': 'biopax:displayName',
    '@type': 'xsd:string'
  },
  'gpml': {
    '@id': 'http://vocabularies.wikipathways.org/gpml#',
    '@type': '@id'
  },
  'id': '@id',
  'identifier': {
    '@id': 'http://rdaregistry.info/Elements/u/P60052',
    '@type': 'xsd:string'
  },
  'name': {
    '@id': 'biopax:name',
    '@type': '@id'
  },
  'prefLabel': {
    '@id': 'skos:prefLabel',
    '@type': '@id'
  },
  'skos': {
    '@id': 'http://www.w3.org/2004/02/skos/core#',
    '@type': '@id'
  },
  'subject': {
    '@id': 'dcterms:subject',
    '@type': '@id'
  },
  'type': '@type',
};
//*/

var context = {
  'biopax': {
    '@id': 'http://www.biopax.org/release/biopax-level3.owl#',
    '@type': '@vocab'
  },
  'entityReference': {
    '@id': 'biopax:entityReference',
    '@type': '@vocab'
  },
  'bridgedb': {
    '@id': 'http://www.example.org/bridgedb/input-vocab/',
    '@type': '@vocab'
  },
  'db': {
    '@id': 'biopax:db',
    '@type': 'xsd:string'
  },
  'dcterms': {
    '@id': 'http://purl.org/dc/terms/',
    '@type': '@id'
  },
  'displayName': {
    '@id': 'biopax:displayName',
    '@type': 'xsd:string'
  },
  'gpml': {
    '@id': 'http://vocabularies.wikipathways.org/gpml#',
    '@type': '@id'
  },
  'id': '@id',
  'identifier': {
    '@id': 'http://rdaregistry.info/Elements/u/P60052',
    '@type': 'xsd:string'
  },
  'idot': {
    '@id': 'http://identifiers.org/idot/',
    '@type': '@vocab'
  },
  /*
  'identifiers': {
    '@id': 'http://identifiers.org/',
    '@type': '@id'
  },
  //*/
  'isDataItemIn': {
    '@id': 'http://semanticscience.org/resource/SIO_001278',
    '@type': '@id'
  },
  'name': {
    '@id': 'schema:name',
    '@type': 'xsd:string'
  },
  'prefLabel': {
    '@id': 'skos:prefLabel',
    '@type': '@id'
  },
  'preferredPrefix': {
    '@id': 'idot:preferredPrefix',
    '@type': 'xsd:string'
  },
  'schema': {
    '@id': 'http://schema.org/',
    '@type': '@vocab'
  },
  'skos': {
    '@id': 'http://www.w3.org/2004/02/skos/core#',
    '@type': '@id'
  },
  'subject': {
    '@id': 'dcterms:subject',
    '@type': '@id'
  },
  'type': '@type',
  'xsd': {
    '@id': 'http://www.w3.org/2001/XMLSchema#',
    '@type': '@id'
  }
};

/**
 * Convert from Biopax-ish entityReference to pvjs annotationEntity.
 *
 * @param {object} entityReference
 * @param {string} entityReference.id || entityReference['@id']
 * @param {string} entityReference.type || entityReference['@type']
 * @param {string} entityReference.displayName || entityReference._displayName
 * @param {string} entityReference.identifier Character string that differentiates this
 *                                          entityReference from other entityReferences.
 * @param {object} entityReference.isDataItemIn Dataset of which this entityReference
 *                                              reference is a member
 * @param {string} entityReference.isDataItemIn.id || entityReference.isDataItemIn['@id'] IRI
 * @param {string} entityReference.isDataItemIn.displayName
 * @param {object} selectedPvjsElement
 * @param {string} selectedPvjsElement.displayName || selectedPvjsElement._displayName
 * @return {object} an annotationEntity, which is a combination of an Xref plus
 *                  the displayName of the selected element, which may differ from
 *                  the displayName of the referenced Xref.
 */
function createAnnotationEntity(entityReference, selectedPvjsElement) {
  var annotationEntity = _.clone(entityReference);
  annotationEntity.displayName = selectedPvjsElement.textContent || annotationEntity.displayName;
  annotationEntity.id = annotationEntity.id || annotationEntity['@id'];

  var gpmlNodeTypes = [{
    '@id': 'http://example.org/',
    name: 'Type'
  }, {
    '@id': 'gpml:GeneProduct',
    name: 'Gene Product'
  }, {
    '@id': 'gpml:Metabolite',
    name: 'Metabolite'
  }, {
    '@id': 'biopax:Pathway',
    name: 'Pathway'
  }, {
    '@id': 'biopax:ProteinReference',
    name: 'Protein'
  }, {
    '@id': 'gpml:Unknown',
    name: 'Unknown'
  }];

  var gpmlDataNodeTypeId;

  // TODO make the way we specify annotationEntity types consistent
  if (!!annotationEntity.type) {
    var gpmlDataNodeTypeBiopaxId = annotationEntity.type;
    var biopaxToHybridMappings = {
      'DnaReference': 'gpml:GeneProduct',
      'ProteinReference': 'biopax:ProteinReference',
      'SmallMoleculeReference': 'gpml:Metabolite',
      'PhysicalEntity': 'gpml:Unknown',
      'Pathway': 'biopax:Pathway'
    };

    gpmlDataNodeTypeId = biopaxToHybridMappings[gpmlDataNodeTypeBiopaxId];
  } else {
    var candidateMatchIds = gpmlNodeTypes.map(function(gpmlNodeType) {
      return gpmlNodeType['@id'];
    });

    gpmlDataNodeTypeId = _.intersection(candidateMatchIds, annotationEntity['@type'])[0];
  }

  annotationEntity.type = gpmlDataNodeTypeId;

  var dataset = annotationEntity.isDataItemIn;
  dataset.id = dataset.id || dataset['@id'];

  return annotationEntity;
}

function rxJsonldCompact(input, ctx, options) {
  return Rx.Observable.fromNodeCallback(jsonld.compact)(input, ctx, options);
}

function rxJsonldExpand(input, options) {
  return Rx.Observable.fromNodeCallback(jsonld.expand)(input, options);
}

var createJsonldCompactStream = highland.wrapCallback(jsonld.compact);
var createJsonldExpandStream = highland.wrapCallback(jsonld.expand);

module.exports = {
  arrayify: arrayify,
  arrayifyClean: arrayifyClean,
  //bridgeDbContext: bridgeDbContext,
  context: context,
  createAnnotationEntity: createAnnotationEntity,
  createJsonldCompactStream: createJsonldCompactStream,
  createJsonldExpandStream: createJsonldExpandStream,
  rxJsonldCompact: rxJsonldCompact,
  rxJsonldExpand: rxJsonldExpand
};
