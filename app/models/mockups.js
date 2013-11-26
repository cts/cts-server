var opts = require('../opts.js');
var path = require('path');

var _loadWidgetDefinitionForKindAndCategory(kind, category) {
  var basedir = opts.mockups[kind].baseDir;
  var filepath = path.resolve(basedir, category, 'package.json');
};

var _loadWidgetDefinitionForKind(kind) {
  var basedir = opts.mockups[kind].baseDir;
  var filepath = path.resolve(basedir, 'package.json');
  var json = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  var ret = {
    categories: json.categories;
  };
  for (var category in ret.categories) {
    var mockups = _loadWidgetDefinitionForKindAndCategory(kind, category)
    ret.categories[category]['mockups'] = mockups;
  }
  return ret;
}

var _loadWidgetDefinitions = function(kinds) {
  var ret = {};
  for (var i = 0; i < kinds.length; i++) {
    ret[kinds[i]] = _loadWidgetDefinitionForKind(kinds[i]);
  }
  return ret;
};

var _WIDGETS = _loadWidgetDefinitions(['scraper', 'theme', 'widget']);

var _validateKindAndCategory = function(kind, category) {
  if (typeof _WIDGETS[kind] == 'undefined') {
    return false;
  }
  if (typeof _WIDGETS[kind][category] == 'undefined') {
    return false;
  }
  return true;
}

/*
 * Assumptions: 
 *  * kind and category have been pre-validated.
 */
var _kindCategoryIndex = function(kind, category) {
  return _WIDGETS[kind].categories[category];
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
exports = {
  list: list
};
