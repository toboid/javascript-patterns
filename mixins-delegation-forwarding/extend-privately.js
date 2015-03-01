var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('chai').expect;

function extendPrivately (consumer, provider) {
  var privateProperty = Object.create(null);

  for (var methodName in provider) {
    if (provider.hasOwnProperty(methodName)) {
      consumer[methodName] = provider[methodName].bind(privateProperty);
    }
  }
  return consumer;
}

var customer123 = {};

var hasBalance = {
  balance: function() { 
    return this._balance; 
  },
  setBalance: function(balance) {
    this._balance = balance;
  }
};

extendPrivately(customer123, hasBalance);

lab.test('adds the methods from the provider', function(done) {
  customer123.setBalance(10);
  expect(customer123.balance()).to.be.equal(10);
  done();
});

lab.test('keeps internal state private', function(done) {
  customer123.setBalance(10);
  expect(customer123.balance).not.to.be.have.property('_balance');
  done();
});

