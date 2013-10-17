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
var async = require('async');

var OperationSchema = mongoose.Schema({
  treeUrl: { type: String, required: true, trim: true },
  treeType: { type: String, required: true, trim: true },
  path: { type: String, required: true, trim: true },
  operator: { type: String, required: true, trim: true },
  args: [
    {value: String}
  ]
});

/**
 * Input:
 *   Request data, JSON of the form {operations: [{}, {}, ...]}
 * Returns:
 *   Array of Operation objects
 */
OperationSchema.statics.createFromRequest(req) = function(request, cb) {
  var i=0;
  var successful = [];
  var errors = [];
  async.whilst(function() {
    return i < request.length;
  },
  function (next) {
    var op = new Operation({ request[i] });
    op.save(function(err){
      if(err){
        console.log('Error, did not save correctly: '+err);
        errors.push(err);
      }else{
        successful.push(op);
      }
    });
    i++;
    next();
  },
  function (err){
    // done
    cb(errors, successful);
  });
};

var Operation = mongoose.model('Operation', OperationSchema);

exports.Operation = Operation;
