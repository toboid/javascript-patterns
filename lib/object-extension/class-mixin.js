'use strict';

const expect = require('chai').expect;

function InterestCalculator (Base) {
  return class extends Base {
    constructor (rate) {
      super(...arguments);
      this.rate = rate;
    }

    getInterest () {
      return this.rate * this.balance;
    }
  }
};

function Depositor (Base) {
  return class extends Base {
    setBalance (balance) {
      this.balance = balance;
    }
  }
};

function mixins (...factories) {
  let base = class {};
  factories.forEach(factory => {
    base = factory(base);
  });
  return base;
}

describe('class mixins', () => {
  describe('nested base classes', () => {
    it('has members from all base classes', () => {
      class Customer extends Depositor(InterestCalculator(class {})) {}
      const customer = new Customer(0.05);
      customer.setBalance(100);
      expect(customer.getInterest()).to.eql(5);
    });
  });

  describe('mixin utility', () => {
    it('has members from all base classes', () => {
      class Customer extends mixins(Depositor, InterestCalculator) {}
      const customer = new Customer(0.05);
      customer.setBalance(100);
      expect(customer.getInterest()).to.eql(5);
    });
  });
});


