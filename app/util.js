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
