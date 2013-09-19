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
