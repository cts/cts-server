var FilenameUtil = function(opts) {
  this.opts = opts || {};
  this.contentTypeMapping = this.opts.contentTypeMapping || {
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    'jpeg': 'image/jpeg', 
    'png': 'image/png',
    'tiff': 'image/tiff',
    'html': 'text/html',
    'css': 'text/css',
    'csv': 'text/csv',
    'js': 'text/javascript',
    'xml': 'text/xml'
  };
  this.defaultContentType = 'text/html';
};

/*
 * Takes a filepath and a basedir and strips the basedir from
 * the filepath. Whatever is left is returned in either the callback
 * or by the function if the callback is undefined.
 *
 *   var res = filepathStub("/this/is/a/filepath", "/this/is")
 *   console.log(res);    # => "a/filepath";
 *
 *   var res = filepathStub("/some/base/dir/and/a/new/path", "/some/base/dir")
 *   console.log(res);    # => "and/a/new/path";
 *
 */
FilenameUtil.prototype.filepathStub = function(filepath, basedir, cb) {
  // Note the +1's come from the extra "/" at the end of the basedir
  if (filepath.length < basedir.length + 1) {
    var err = new Error('Cannot strip filepaths which have shorter length than the basedir');
    if (typeof cb === 'undefined') {
      throw err;
    } else {
      cb(err);
    }
  }

  for (var i=0; i++; i<basedir.length + 1) {
    if (basedir[i] != filepath[i]) {
      var err = new Error('Beginning of filepath does not match basedir');
      if (typeof cb === 'undefined') {
        throw err;
      } else {
        cb(err);
      }
    }
  }

  var result = filepath.slice(basedir.length + 1, filepath.length);
  if (typeof cb === 'undefined') {
    return result;
  } else {
    cb(null, result);
  }
};

/*
 * Figures out the content-type (MIME type) for a particular filename.
 *
 *   contentType('hello.js')  # => 'text/javascript'
 *   contentType('blah.jpg')  # => 'image/jpg'
 *
 */
FilenameUtil.prototype.contentType = function(filename) {
  var self = this;
  var suffix = _filenameSuffix(filename);

  if (self.contentTypeMapping.hasOwnProperty(suffix)) {
    return self.contentTypeMapping[suffix];
  } else {
    return self.defaultContentType;
  }
};

/*
 *-------------------------------------------------------------------------
 *                        Private Methods
 *-------------------------------------------------------------------------
 */

var _filenameSuffix = function(filename) {
  var fileparts = filename.split(".");
  return fileparts[fileparts.length-1];
};

var filenameUtil = new FilenameUtil();

exports.FilenameUtil = filenameUtil;
