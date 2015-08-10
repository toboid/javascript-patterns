var expect = require('chai').expect;

function parallel (items, callback) {
  var results = [];
  var returned = 0;

  for (var i = 0, count = items.length; i < count; i++) {
    // function in loop!
    (function (idx) {
      items[idx](function (err, result) {
        if (err) {
          return callback(err);
        }

        results[idx] = result;
        ++returned;

        if (returned === items.length ) {
          callback(null, results);
        }
      });
    })(i);
  }
}

describe('parallel', function () {

  it('calls functions in order', function (done) {
    var executed = [];

    parallel([
      function (callback) {
        executed.push('one');
        process.nextTick(callback);
      },
      function (callback) {
        executed.push('two');
        process.nextTick(callback);
      }],
      function (err) {
        expect(err).to.not.be.ok;
        expect(executed).to.deep.equal(['one', 'two']);
        done();
    });
  });

  it('calls functions in parallel', function (done) {
    var firstExected = false,
        firstCalledBack = false;

    parallel([
      function (callback) {
        firstExected = true;
        process.nextTick(function() {
          firstCalledBack = true;
          callback(null);
        });
      },
      function (callback) {
        expect(firstExected).to.equal(true);
        expect(firstCalledBack).to.equal(false);
        process.nextTick(callback);
      }],
      function (err) {
        expect(err).to.not.be.ok;
        expect(firstCalledBack).to.equal(true);
        done();
    });
  });

  it('returns results in order', function (done) {
    var resultsNaturalOrder = [];

    parallel([
      function (callback) {
        setTimeout(function () {
          resultsNaturalOrder.push('one');
          callback(null, 'one');
        }, 0);
      },
      function (callback) {
        process.nextTick(function () {
          resultsNaturalOrder.push('two');
          callback(null, 'two');
        });
      }
    ], function (err, results) {
      expect(err).to.not.be.ok;
      expect(results).to.be.deep.equal(['one', 'two']);
      expect(resultsNaturalOrder).to.be.deep.equal(['two', 'one']);
      done();
    });
  });

  it('does not return results on error', function (done) {
    parallel([
      function (callback) {
        process.nextTick(function () {
          callback(null, 'one');
        });
      },
      function (callback) {
        process.nextTick(function () {
          callback('An error');
        });
      }
    ], function (err, results) {
      expect(err).to.equal('An error');
      expect(results).to.not.be.ok;
      done();
    });
  });

});
