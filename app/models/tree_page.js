/*
 * TreePage
 *
 * This is the model that actually stores the html for a particular url.
 *
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var TreePageSchema = mongoose.Schema({
  treeKey: { type: String, required: true, trim: true},
  treeUrl: { type: String, required: true, trim: true },
  treeHtml: { type: String, required: true, trim: true }
});

var TreePage = mongoose.model('TreePage', TreePageSchema);

exports.TreePage = TreePage;
