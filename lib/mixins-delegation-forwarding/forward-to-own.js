var expect = require('chai').expect;

// Forwarding to own property allows changing of provider at run time.
// However since forwarding allows state to be held on the provider, the state would also change,
// may or may not be what is requried depending on situation.
function forwardToOwn (receiver, methods, propertyName) {
  methods.forEach(function (methodName) {
    receiver[methodName] = function () {
      var toProvider = receiver[propertyName];
      return toProvider[methodName].apply(toProvider, arguments);
    };
  });

  return receiver;
}

describe('forward to own', function () {
  var customer123,
      accountHolder;

  beforeEach(function () {
    customer123 = {};

    accountHolder = {
      _balance: 10,
      calculateInterest: function() {
        return this._balance * 0.05;
      }
    };

    customer123.account = accountHolder;

    forwardToOwn(customer123, ['calculateInterest'], 'account');
  });

  it('adds methods to receiver', function() {
    expect(customer123.calculateInterest()).to.be.equal(0.5);
  });

  it('no state added to receiver', function() {
    expect(customer123._balance).to.be.undefined;
  });

  it('state is held by the provider', function() {
    expect(accountHolder._balance).to.be.equal(10);
  });

  it('can change implementation at run time', function() {
    // State changes too since it's held on the provider
    var alternativeAccount = {
      _balance: 5,
      calculateInterest: function() {
        return this._balance * 0.10;
      }
    };
    customer123.account = alternativeAccount;
    expect(customer123.calculateInterest()).to.be.equal(0.5);
  });
});
