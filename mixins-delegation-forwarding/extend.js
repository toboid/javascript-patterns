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
      }
    }
  });
  return consumer;
}

var customer123 = {
  balance: 100,
  rate: 0.05
};

var interestCalculator = {
  getInterest: function() {
    return this.rate * this.balance;
  }
};

var depositor = {
  setBalance: function(balance) {
    this.balance = balance;
  }
};

extend(customer123, interestCalculator, depositor);

lab.test('adds a method from the first provider', function(done) {
  expect(customer123.getInterest()).to.be.equal(5);
  done();
});

lab.test('adds a method from the second provider', function(done) {
  // Note that this is one of the issues with this approach - the two templates are both interacting with balance
  // but that's not clear when working with either individually.
  customer123.setBalance(200);
  expect(customer123.getInterest()).to.be.equal(10);
  done();
});  

