var expect = require('chai').expect;

function delegateToOwn (receiver, methods, propertyName) {
  methods.forEach(function (methodName) {
    receiver[methodName] = function () {
      var toProvider = receiver[propertyName];
      return toProvider[methodName].apply(receiver, arguments);
    };
  });

  return receiver;
};

describe('delegate to own', function () {
  var customer123, 
      accountHolder;

  beforeEach(function () {
    customer123 = {
      _balance: 10
    };

    accountHolder = {
      calculateInterest: function() {
        return this._balance * 0.05;
      }
    };

    customer123.account = accountHolder;

    delegateToOwn(customer123, ['calculateInterest'], 'account');
  });

  it('adds methods to receiver', function() {
    expect(customer123.calculateInterest()).to.be.equal(0.5);
  });

  it('needs state to be on the receiver', function() {
    expect(customer123._balance).to.be.equal(10);
  });

  it('can change implementation at run time', function() {
    var alternativeAccount = {
      calculateInterest: function() {
        return this._balance * 0.10;
      }
    };
    customer123.account = alternativeAccount;
    expect(customer123.calculateInterest()).to.be.equal(1);
  });
});
