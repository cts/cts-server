function start(response, postData, cache) {
  console.log("Request handler 'start' was called.");
  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" method="post">'+
    '<textarea name="text" rows="20" cols="60"></textarea>'+
    '<input type="submit" value="Submit text" />'+
    '</form>'+
    '</body>'+
    '</html>';
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}

function upload(response, postData, cache) {
  console.log("Request handler 'upload' was called.");
  cache.setUnusedKey(postData, function(newUrl) {
    console.log("found new url " + newUrl);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(newUrl);
    response.end();
  });
}

exports.start = start;
exports.upload = upload;
