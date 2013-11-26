/*
 * Operator Base
 * Provides functionality from which to inherit.
 */

var globalOpts = require('../../config/opts');
var util = require('../../config/util');
var cheerio = require('cheerio');

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var OperatorBase = function() {
};

/**
 *
 */
OperatorBase.prototype.perform = function(operation, adapter, cb) {
  switch(operation.action) {
    case 'save':
      this._save(operation, adapter, cb);
      break;
    case 'fetch':
      this._fetch(operation, adapter, cb);
      break;
    case 'edit':
      this._fetchPerformActionThenSave(operation, adapter, this._edit, cb);
      break;
    default:
      cb("Unknown operator: " + operation.operator);
  }
};

OperatorBase.prototype._save = function(operation, adapter, cb) {
  if ((typeof operation.parameters == 'undefined') ||
      (typeof operation.parameters.content == 'null') ||
      (typeof operation.parameters.content == 'undefined')) {
    cb("No content to save");
  } else {
    adapter.save(operation.parameters.content, operation, function(err, url) {
      // TODO: Persist the result of this operation to Mongo.
      if (err) {
        operation.error = {
          message: err
        };
      } else {
        operation.result = {
          url: url
        }
      }
      operation.save(); // TODO: is it ok not to wait?
      cb(err, operation);
    });
  }
};

OperatorBase.prototype._fetch = function(operation, adapter, cb) {
  adapter.fetch(operation.urlKey(), function(err, data) {
    // TODO: Persist the result of this operation to Mongo.
    if (err) {
      operation.error = {
        message: err
      };
    } else {
      operation.result = {
        tree: data
      }
    }
    operation.save(); // TODO: is it ok not to wait?
    cb(err, operation);
  });
};


OperatorBase.prototype._fetchPerformActionThenSave = function(operation, adapter, action, cb) {
  var self = this;
  var handleError = function(err) {
    operation.error = {
      message: err
    }
    cb(err, operation);
  }

  // Poster child for why async is a pain in the ass
  // TODO: Consider using Q framework
  adapter.fetch(operation.urlKey(), function(err, data) {
    if (err) {
      handleError(err);
    } else {
      action(operation, data, function(err, data2) {
        if (err) {
          handleError(err);
        } else {
          adapter.save(data2, function(err, url) {
            if (err) {
              handleError(err);
            } else {
              operation.result = {
                url: url
              };
              cb(null, operation);
            } // if-else save error?
          }); // save
        } // if-else edit error
      }); // edit
    } /// if-else fetch error
  }); // fetch
};


OperatorBase.prototype._checkForMissingParams = function(operation, params) {
  if (params.length > 0) {
    if (typeof operation.parameters == 'undefined') {
      return "Operation is missing parameters";
    }
    for (var i = 0; i < params.length; i++) {
      if (typeof operation.parameters[params[i]] == 'undefined') {
        return "Operation is missing parameter " + params[i];
      }
    }
  }
  return null;
};


exports.OperatorBase = OperatorBase;
