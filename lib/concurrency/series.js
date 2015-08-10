var expect = require('chai').expect;

function series (operations, callback) {
  var results = [];

  function exec () {
    var next = operations.shift();

    if(next) {
      next(function (err, result) {
        if(err) {
          return callback(err) ;
        }

        if(result) {
          results.push(result);
        }

        exec();
      });
    } else {
      return callback(null, results);
    }
  }

  exec();
}

describe('series', function () {

  it('calls functions in order', function (done) {
    var executed = [];

    series([
      function (callback) {
        executed.push('one');
        process.nextTick(callback);
      },
      function (callback) {
        executed.push('two');
        process.nextTick(callback);
      }
    ], function (err) {
      expect(err).to.not.be.ok;
      expect(executed).to.eql(['one', 'two']);
      done();
    });
  });

  it('returns results in order', function (done) {
    series([
      function (callback) {
        process.nextTick(function () {
          callback(null, 'one');
        });
      },
      function (callback) {
        process.nextTick(function () {
          callback(null, 'two');
        });
      }
    ], function (err, results) {
      expect(err).to.not.be.ok;
      expect(results).to.be.deep.equal(['one', 'two']);
      done();
    });
  });

  it('waits for previous function to return before calling next', function (done) {
    var firstCalledBack = false;

    series([
      function (callback) {
        process.nextTick(function () {
          firstCalledBack = true;
          callback(null);
        });
      },
      function (callback) {
        expect(firstCalledBack).to.equal(true);
        process.nextTick(callback);
      }
    ], function (err) {
      expect(err).to.not.be.ok;
      done();
    });
  });

  it('stops on error', function (done) {
    var twoExecuted = false;

    series([
      function (callback) {
        process.nextTick(function () {
          callback('An error');
        });
      },
      function (callback) {
        twoExecuted = true;
        process.nextTick(callback);
      }
    ], function (err, results) {
      expect(err).to.equal('An error');
      expect(twoExecuted).to.equal(false);
      done();
    });
  });

  it('does not return results on error', function (done) {
    series([
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
    series([], function (err, results) {
      expect(err).not.to.ok;
      expect(results).to.deep.equal([]);
      done();
    });
  });

});
