/**
 * Operation Model
 */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var config   = require('../../config/opts');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var _        = require('underscore');


var OperationSchema = mongoose.Schema({

  // To be filled in by the client, upon request
  // -------------------------------------------

  /* The action being applied to the tree.
   *
   * Retuired.
   */
  action: { type: String, required: true, trim: true },

  /* The format of the tree that lives at treeUrl. For example, 'json' or
   * 'html'.
   *
   * Required.
   */
  treeType: { type: String, required: true, trim: true },

  /* The URL of the tree this operation pertains to. The URL scheme may be
   * something other than HTTP, for example we may choose to use
   * git://path/to/repo.git
   *
   * Optional (null)
   */
  treeUrl: { type: String, default: null, trim: true },

  /* The path into the tree that this operation concerns.
   *
   * Optional (null)
   */
  path: { type: String, trim: true, default: null },

  /* Parameters for the action.
   *
   */
  parameters: { type: Schema.Types.Mixed, default: null },

  // To be filled in by the server, upon processing
  // -------------------------------------------

  attemptedOn: { type: Date, default: Date.now },
  attemptedBy: { type: String },
  error: { type: Schema.Types.Mixed, default: null }, 
  result: { type: Schema.Types.Mixed, default: null }

});

/**
 * Args:
 *   json - Json object.
 *   cb - Node-style callback.
 *
 */
OperationSchema.statics.createFromJson = function(json, cb) {
  var get = function(o, prop) {
    if (o[prop] !== undefined) return o[prop];
    else return "my default";
  }
 
  try {
    var op = new Operation({
      treeUrl: get(json, 'treeUrl'),
      treeType: get(json, 'treeType'),
      path: get(json, 'path'),
      action: get(json, 'action'),
      parameters: get(json, 'parameters')
    });
    cb(null, op);
  } catch (e) {
    cb(e);
  }
};

/**
 * Args:
 *   request: HTTP Request object. This should have a JSON body of the form:
 *      {
 *         operations: [
 *             {},
 *             {},
 *             ...
 *         ]
 *      }
 *   cb: node-style callback for error or array of operations.
 * Returns:
 *   Array of Operation objects
 */
OperationSchema.statics.createFromRequest = function(request, cb) {
  if (typeof request.body == 'undefined') {
    cb({error: "`operations` key missing from request body."});
  }
  if (! _.isObject(request.body)) {
    cb({error: "Request body must be an object."});
  }
  if (! _.isArray(request.body.operations)) {
    cb({error: "`operations` key in request body must be an array."});
  }

  var errors = null;
  var operations = [];

  var processThenFinish = function(i) {
    if (i < request.body.operations.length) {
      // Process
      var json = request.body.operations[i];
      OperationSchema.statics.createFromJson(json, function(err, op) {
        if (err) {
          console.log(err);
          if (errors == null) {
            errors = [];
          }
          errors.push({
            json: json,
            index: i,
            error: err
          });
          operations.push(null);
          processThenFinish(i+1);
        } else {
          operations.push(op);
          processThenFinish(i+1);
        }
      });
    } else {
      // Finish
      cb(errors, operations)
    }
  }
  processThenFinish(0);
};

OperationSchema.methods.urlScheme = function() {
  if (this.treeUrl) {
    var parts = this.treeUrl.split(":");
    if (parts.length > 1) {
      return parts[0];
    }
  }
  return null;
}

OperationSchema.methods.urlKey = function() {
  if (this.treeUrl) {
    var parts = this.treeUrl.split(":");
    if (parts.length > 1) {
      parts.shift();
      return parts.join(":");
    } else {
      return this.treeUrl;
    }
  }
  return null;
}

var Operation = mongoose.model('Operation', OperationSchema);
exports.Operation = Operation;

