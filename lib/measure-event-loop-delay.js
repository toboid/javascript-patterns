function millisecsToNanosecs(millisecs) {
  return millisecs * 1e6;
}

function secsToNanosecs(secs) {
  return secs * 1e9;
}

function calculateDelay(interval, callback) {
  var before = process.hrtime();

  setTimeout(function() {
    var elapsed = process.hrtime(before);
    var delay = (secsToNanosecs(elapsed[0]) + elapsed[1]) - millisecsToNanosecs(interval);
    callback(delay);

    outputDelay(interval, callback);
  }, interval);
};

// Bootstrap delay measurement and write to console every 300 millisecs
calculateDelay(300, function(delay) {
  console.log('delay is %s nanoseconds', delay);
});

// Do something that takes a while every 2 secs
setInterval(function compute() {
  var sum = 0;

  for (var i = 0; i <= 999999999; i++) {
    sum += i * 2 - (i + 1);
  }
}, 2000);
