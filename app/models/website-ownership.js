/*
 * Website Ownership Model
 * Handles ownership of websites. Allows a user to be the owner of a particular
 * website.
 */

var mongoose = require('mongoose');
var config   = require('../opts');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var WebsiteOwnershipSchema = mongoose.Schema({
  websiteId: { type: String, required: true, unique: true },
  ownerId: { type: String, require: false, unique: false},
});

var WebsiteOwnership = mongoose.model('WebsiteOwnership', WebsiteOwnershipSchema);

exports.WebsiteOwnership = WebsiteOwnership;

