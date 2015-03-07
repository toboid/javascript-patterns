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

describe('private extend', function () {
  var customer123, 
      hasBalance;

  beforeEach(function() {

    customer123 = {};

    hasBalance = {
      balance: function() { 
        return this._balance; 
      },
      setBalance: function(balance) {
        this._balance = balance;
      }
    };

    extendPrivately(customer123, hasBalance);

    customer123.setBalance(10);
  });

  it('adds the methods from the provider', function() {
    expect(customer123.balance()).to.be.equal(10);
  });

  it('keeps internal state private', function() {
    expect(customer123.balance).not.to.be.have.property('_balance');
  });

});

