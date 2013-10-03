function route(handle, pathname, response, postData, cache) {
  console.log("Routing request for " + pathname);
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, postData, cache);
  } else {
    // check for whether the pathname is in the cache
    if (pathname.charAt(0) === '/') {
      pathname = pathname.substr(1);
    }
    console.log(pathname);
    cache.get(pathname, function(err, result) {
      if (err) {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
      } else {
        response.writeHead(200, {"Content-Type": "text/plain"});
        if (result != null) {
          response.write(result);
        }
        response.end();
      }
    });
  }
}

exports.route = route;
