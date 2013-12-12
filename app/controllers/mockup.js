var Util = require('../util');
var Mockups = require('../models/mockups');
var _ = require('underscore');

var MockupController = function() {
};

MockupController.prototype.list = function(req, res) {
  Util.addCORSHeaders(req, res);

  if (typeof req.body == 'undefined') {
    var error = {error: {message: "Missing request body."}};
    res.status(400).send(error);
    return;
  }
  if (! _.isObject(req.body)) {
    var error = {error: {message: "Request body must be an object."}};
    res.status(400).send(error);
    return;
  }

  var response = Mockups.list(req.body);

  if (typeof response.error == 'undefined') {
    res.status(200).send(response);
  } else {
    res.status(400).send(response);
  }
};

MockupController.prototype.connectToApp = function(app, prefix) {
  var self = this;
  app.options(prefix + '/list', Util.preflightHandler);
  app.post(prefix + '/list', self.list.bind(self));
};

exports.MockupController = MockupController;
