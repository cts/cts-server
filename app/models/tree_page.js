/*
 * TreePage
 *
 * This is the model that actually stores the html for a particular url.
 *
 */

var mongoose = require('mongoose');

var TreePageSchema = mongoose.Schema({
  content: { type: String, required: true, trim: true }
});

var TreePage = mongoose.model('TreePage', TreePageSchema);

exports.TreePage = TreePage;
