/*
 * MongoTree
 *
 * This is the model for the cache tree adapter.
 *
 */

var mongoose = require('mongoose');

var MongoTreeSchema = mongoose.Schema({
  content: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true }
});

var MongoTree = mongoose.model('MongoTree', MongoTreeSchema);

exports.MongoTree = MongoTree;
