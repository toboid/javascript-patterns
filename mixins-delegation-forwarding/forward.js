var Lab = require('lab');
var lab = exports.lab = Lab.script();
var expect = require('chai').expect;

function forward (receiver, methods, provider) {
  methods.forEach(function (methodName) {
    receiver[methodName] = function () {
      return provider[methodName].apply(provider, arguments);
    };
  });

  return receiver;
};

lab.experiment('forwarding', function () {
  var customer123, 
      accountHolder;

  lab.beforeEach(function (done) {
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

    done();
  });

  lab.test('adds methods to receiver', function(done) {
    expect(customer123.balance()).to.be.equal(10);
    done();
  });

  lab.test('no state held on receiver', function(done) {
    expect(customer123._balance).to.be.undefined;
    done();
  });

  lab.test('state is held by the provider', function(done) {
    expect(accountHolder._balance).to.be.equal(10);
    done();
  });  
});


