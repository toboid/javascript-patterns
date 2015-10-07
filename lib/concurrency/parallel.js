var expect = require('chai').expect;

function parallel (operations, callback) {
  var pending = operations.length,
      results = [],
      errored = false;

  if (pending === 0) {
    return process.nextTick(function () {
      callback(null, []);
    });
  }

  operations.forEach(function (item, idx) {
    item(function (err, result) {
      if (err && !errored) {
        errored = true;
        return callback(err);
      }

      results[idx] = result;
      --pending;

      if (pending === 0) {
        callback(null, results);
      }
    });
  });
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

  it('handles empty actions', function (done) {
    parallel([], function (err, results) {
      expect(err).not.to.ok;
      expect(results).to.deep.equal([]);
      done();
    });
  });

  it('calls back only once when multiple failures', function (done) {
    var callbackCount = 0,
        scheduledDone

    parallel([
      function (callback) {
        process.nextTick(function () {
          callback('Error one');
        });
      },
      function (callback) {
        process.nextTick(function () {
          callback('Error two');
        });
      }
    ], function (err) {
      expect(err).to.be.ok;
      expect(++callbackCount).to.equal(1);
    });

    // Not ideal but does correctly test the scenario. Can't call done() in the
    // callback passed to parallel as it would cause the test to pass even if the
    // callback was called twice.
    setTimeout(done, 100);
  });

});
