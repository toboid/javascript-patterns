var expect = require('chai').expect;

function calculateDelay (interval, next) {

  function millisecsToNanosecs (millisecs) {
    return millisecs * 1e6;
  }

  function secsToNanosecs (secs) {
    return secs * 1e9;
  }

  function calculate (interval, next) {
    var before = process.hrtime();

    setTimeout(function() {
      var elapsed = process.hrtime(before),
          delay = (secsToNanosecs(elapsed[0]) + elapsed[1]) - millisecsToNanosecs(interval),
          cont = next(delay);

      if(cont) {
        calculateDelay(interval, next);
      }
    }, interval);
  }

  calculate(interval, next);
}

// // Example usage:
// // Bootstrap delay measurement and write to console every 300 millisecs
// calculateDelay(300, function(delay) {
//   console.log('delay is %s nanoseconds', delay);
//   return true;
// });

// // Do something that takes a while every 2 secs
// setInterval(function compute() {
//   var sum = 0;

//   for (var i = 0; i <= 999999999; i++) {
//     sum += i * 2 - (i + 1);
//   }
// }, 2000);

describe('measuring the event loop', function () {

  it('gets event loop delay', function (done) {
    calculateDelay(25, function(delay) {
      expect(delay).to.satisfy(function (num) {
        return typeof(num) === 'number' && num % 1 === 0;
      });
      done();
      return false;
    });
  });

});
