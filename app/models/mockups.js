var opts = require('../../config/opts.js');
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
var list_mockups = function(opts) {
  var data = _kindCategoryIndex(opts.kind, opts.category);
  return { results: data };
};

/*
 * Assumptions:
 *  - kind has already been validated
 */
var list_categories = function(opts) {
  var ret = {
    results: {}
  };

  for (var category in _MOCKUPS.kinds[opts.kind].categories) {
    ret.results[category] = {
      name: _MOCKUPS.kinds[opts.kind].categories[category].name,
      desc: _MOCKUPS.kinds[opts.kind].categories[category].description
    }
  }

  return ret;
};

var list = function(opts) {
  // Provide required opts
  if (typeof opts.kind == 'undefined') {
    return {error: {message: 'No kind specified'}};
  }

  // Provide right kind
  if ((opts.kind != 'scraper') &&
      (opts.kind != 'theme') &&
      (opts.kind != 'widget')) {
    return {error: {message: 'Provided kind is unsupported: ' + opts.kind}};
  }

  if (typeof opts.category == 'undefined') {
    return list_categories(opts);
  } else {
    // Provide right kind/category
    if (! _validateKindAndCategory) {
      return {error: {message: 'Provided kind/category pairing is unsupported: ' + opts.kind + '/' + opts.category}};
    }
    return list_mockups(opts);
  }

};

// Make visible..
exports.list = list;
exports._MOCKUPS = _MOCKUPS;
