var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('chai').expect;

// lodash has _.assign which is similar
// _.mixin only assigns fucntions from the provider and does not accept mutliple providers
function extend () {
  var consumer = arguments[0],
      providers = [].slice.call(arguments, 1);

  providers.forEach(function(provider) {
    for (var key in provider) {
      if (provider.hasOwnProperty(key)) {
        consumer[key] = provider[key];
      };
    };
  });
  return consumer;
}

var customer123 = {
  balance: 100,
  rate: 0.05
};

var accountHolder = {
  getInterest: function() {
    return this.rate * this.balance;
  }
};

extend(customer123, accountHolder);

lab.test('calculates interest', function(done) {
  expect(customer123.getInterest()).to.be.equal(5);
  done();
});
