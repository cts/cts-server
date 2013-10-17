var assert = require('assert');
var FilesystemAdapter = require('../app/tree-adapters/filesystem.js').FilesystemAdapter;

var adapter = new FilesystemAdapter();

describe('FilesystemAdapter', function(){
  describe('#save()', function(){

    it('should fail when data is null', function(done) {
      adapter.save(null, function(err, key) {
        assert.notEqual(err, null);
        done()
      }); // save
    }); // it should

    it('should write and read back file', function(done) {
      var data = "Foo\nBAR!";
      adapter.save(data, function(err, key) {
        assert.equal(err, null); 
        assert.notEqual(err, key);
        adapter.fetch(key, function(err, data2) {
          assert.equal(err, null);
          assert.equal(data, data2);
          done();
        }); // fetch
      }); // save
    }); // it should

    it('should write, read back, and delete file', function(done) {
      var data = "Foo\nBAR!";
      adapter.save(data, function(err, key) {
        assert.equal(err, null); 
        assert.notEqual(err, key);
        adapter.fetch(key, function(err, data2) {
          assert.equal(err, null);
          assert.equal(data, data2);
          adapter.remove(key, function(err) {
            adapter.fetch(key, function(err, data3) {
              assert.notEqual(err, null);
              done();
            }); // fetch
          }); // remove
        }); // fetch
      }); // save
    }); // it should

  }); // describe #save()
}); // describe FilesystemAdapter
