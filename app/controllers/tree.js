/*
 * Tree Controller
 * Persists remote CTS-UI operations via an adapter.
 *   See: ../tree-adapters
 *
 * General idea:
 *
 *  Each web request specifies:
 *   1) Who you are
 *   2) What tree you are operating upon
 *   3) What operation you want to do
 *
 *  The processing for each request proceeds in the same fashion:
 *   1) Authenticate user
 *   2) Load the tree they are requesting via the proper tree adapter
 *   3) Ask the tree adapter to perform teh requested operation
 */

/* Constructor
 * ----------------------------------------------------------------------------- 
 * This is the object exported by this file.
 */

var TreeController = function(opts, passport) {
  this.opts = opts;
  this.passport = passport;
};

/* Methods 
 * ----------------------------------------------------------------------------- 
 */

TreeController.prototype.create = function() {
};

/*
 * Params:
 *   the HTTP request object
 * Returns via Callback:
 *   next(error, treeAdapter)
 */
TreeController.prototype._lookup = function(req, next) {
  
};
