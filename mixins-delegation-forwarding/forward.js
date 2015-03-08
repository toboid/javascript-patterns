var expect = require('chai').expect;

// Late binding achieved by looking target method up by name and wrapping in a function.
function forward (receiver, methods, provider) {
  methods.forEach(function (methodName) {
    receiver[methodName] = function () {
      return provider[methodName].apply(provider, arguments);
    };
  });

  return receiver;
}

describe('forwarding', function () {
  var customer123,
      accountHolder;

  beforeEach(function () {
    customer123 = {};

    accountHolder = {
      _balance: 0,
      balance: function() {
        return this._balance;
      },
      setBalance: function(balance) {
        this._balance = balance;
      }
    };

    forward(customer123, ['balance', 'setBalance'], accountHolder);

    customer123.setBalance(10);
  });

  it('adds methods to receiver', function() {
    expect(customer123.balance()).to.be.equal(10);
  });

  it('no state added to receiver', function() {
    expect(customer123._balance).to.be.undefined;
  });

  it('state is held by the provider', function() {
    expect(accountHolder._balance).to.be.equal(10);
  });
});
