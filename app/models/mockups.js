var opts = require('../opts.js');
var path = require('path');
var fs = require('fs');

var _loadMockup = function(kind, category, mockup) {
  var basedir = opts.mockups[kind].baseDir;
  var filepath = path.resolve(basedir, category, mockup, 'package.json');
  var json = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  return json;
};

var _loadCategory = function(kind, category) {
  var basedir = opts.mockups[kind].baseDir;
  var filepath = path.resolve(basedir, category, 'package.json');
  var ret = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  for (var mockup in ret.mockups) {
    ret.mockups[mockup] = _loadMockup(kind, category, mockup);
  }
  return ret;
};

var _loadKind = function(kind) {
  var basedir = opts.mockups[kind].baseDir;
  var filepath = path.resolve(basedir, 'package.json');
  var ret = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  for (var category in ret.categories) {
    ret.categories[category] = _loadCategory(kind, category);
  }
  return ret;
};

var _MOCKUPS = {
  'kinds': {
    'widget': _loadKind('widget')
  }
}

var _validateKindAndCategory = function(kind, category) {
  if (typeof _MOCKUPS.kinds[kind] == 'undefined') {
    return false;
  }
  if (typeof _MOCKUPS.kinds[kind].categories[category] == 'undefined') {
    return false;
  }
  return true;
};

/*
 * Assumptions: 
 *  * kind and category have been pre-validated.
 */
var _kindCategoryIndex = function(kind, category) {
  return _MOCKUPS.kinds[kind].categories[category];
}

/*
 * Opts must contain:
 *   kind: { scraper, theme, widget }
 *   category: e.g., academic
 *
 * Returns:
 * {
 *    erorr: {
      }, // or null
 *    results: [
 *     {
 *       ctsUrl: "http://..",
 *       imgPreview: "http://...",
 *       exampleLink: "http://..."
 *     }
 *    ]
 * }
 *
 */
var list = function(opts) {
  // Provide required opts
  if (typeof opts.kind == 'undefined') {
    return {error: {message: 'No kind specified'}};
  }
  if (typeof opts.category == 'undefined') {
    return {error: {message: 'No kind specified'}};
  }

  // Provide right kind
  if ((opts.kind != 'scraper') &&
      (opts.kind != 'theme') &&
      (opts.kind != 'widget')) {
    return {error: {message: 'Provided kind is unsupported: ' + opts.kind}};
  }

  // Provide right kind/category
  if (! _validateKindAndCategory) {
    return {error: {message: 'Provided kind/category pairing is unsupported: ' + opts.kind + '/' + opts.category}};
  }

  var data = _kindCategoryIndex(kind, category);
  return { results: data };
};

// Make visible..
exports.list = list;
exports._MOCKUPS = _MOCKUPS;
