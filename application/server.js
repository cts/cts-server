var http = require("http");
var url = require("url");

function start(route, handle, cache) {
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;

    console.log("Request for " + pathname + " received.");

    request.addListener('data', function(postDataChunk) {
      postData += postDataChunk;
    });
    request.addListener('end', function() {
      route(handle, pathname, response, postData, cache);
    });
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;
