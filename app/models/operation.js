/*
 * Operation Model
 * ===============
 *
 * Describes one step in an edit script.
 *
 * Of the form:
 * {
 *   treeUrl:  String        -- The URL of the tree being operated upon
 *   treeType: String        -- The type of the tree being operated upon
 *   path:     String        -- The selector into <treeUrl>
 *   operator: String        -- The operation being performed
 *   arguments:Array[String] -- Arlist for <operator>
 * }
 *
 *
 * Valid Tree Types
 * ================
 *
 * wild
 * ----
 * An HTML tree in the wild; no previous integration in system.
 *
 * jekyll-github
 * -------------
 * A Github hosted Jekyll instance
 *
 * filesystem
 * ----------
 * Just plain HTML files
 *
 *
 * Valid Operators
 * ===============
 *
 * save
 * ----
 * Creates a checkpoint.
 * - Argument 1: save-method : {html, html-link, zip, zip-link, web}
 *
 * edit
 * ----
 * User modified a primitive value.
 * - Argument 1: new_value : String
 *
 * list-add
 * --------
 * User duplicates n^th item of list of n
 *
 * list-del
 * --------
 * User deletes the i^th item from a list
 * - Argument 1: i : Int
 *
 * list-reorder
 * ------------
 * Moves list item i to list item j, with previous j becomming j+1
 * - Argument 1: i : Int
 * - Argument 2: j : Int
 *
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var bcrypt   = require('bcrypt');
var config   = require('../opts');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var _        = require('underscore');

var OperationSchema = mongoose.Schema({

  // To be filled in by the client, upon request.
  treeUrl: { type: String, required: true, trim: true },
  treeType: { type: String, required: true, trim: true },
  path: { type: String, required: true, trim: true },
  operator: { type: String, required: true, trim: true },
  args: [
    {value: String}
  ]

  // To be filled in by the server, upon processing.
  attempted: { type: Date, default: Date.now },
  error: { type: Schema.Types.Mixed, default: null }, 
  result: { type: Schema.Types.Mixed, default: null }

  // To be filled in by the server, upon receiving.
  user: { type: String }

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
      operator: get(json, 'operator'),
      args: get(json, 'args')
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
OperationSchema.statics.createFromRequest(req) = function(request, cb) {
  if (! 'operations' in request.body) {
    cb({error: "`operations` key missing from request body."});
  }
  if (! _.isArray(request.body.operations)) {
    cb({error: "`operations` key in request body must be an array."});
  }

  var errors = null;
  var operations = [];
  var bodyOps = request.body.operations;

  var processThenFinish = function(i) {
    if (i < bodyOps.length) {
      // Process
      var json = bodyOps[i];
      OperationSchema.statics.createFromJson(json, function(err, op) {
        if (err) {
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

var Operation = mongoose.model('Operation', OperationSchema);

exports.Operation = Operation;

