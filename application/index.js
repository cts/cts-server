var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var cache = require("./cache");

var handle = {};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;

var redisArgs = {};
redisArgs['port'] = 6379;
redisArgs['host'] = 'wanger.mit.edu';

var redisCache = cache.createCache(redisArgs);

server.start(router.route, handle, redisCache);
