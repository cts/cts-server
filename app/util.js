exports.Banner = "" +
"    _________________   \n" +
"   / ____/_  __/ ___/ \n" + 
"  / /     / /  \\__ \\      __|  _ \\  __|\\ \\   / _ \\  __| \n" +
" / /___  / /  ___/ /    \\__ \\  __/ |    \\ \\ /  __/ |   \n" +
"  ____/ /_/  /____/     ____/\\___|_|     \\_/ \\___|_|   \n\n" +
"               Cascading Tree Sheets Server \n";

exports.ApiError = function(res, code, message) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  if (typeof message != 'undefined') {
    res.write(JSON.stringify({'message': message}));
  }
  res.end();
}

exports.ApiSuccess = function(res, message) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  if (typeof message != 'undefined') {
    res.write(JSON.stringify({'message': message}));
  }
  res.end();
}

/**
 * Like Underscore's extend but recurses.
 */
exports.deepExtend = function(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

exports.addCORSHeaders = function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
};

exports.preflightHandler = function(req, res) {
  exports.addCORSHeaders(req, res);
  res.status(200).send();
}
