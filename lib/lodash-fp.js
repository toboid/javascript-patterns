var _ = require('lodash-fp'),
    R = require('ramda'),
   expect = require('chai').expect;

describe('lodash functional', function () {

  it('auto-curries', function () {
    var squareEach = _.map(function (e) {
      return e * e;
    });

    expect(squareEach([1, 2, 3])).to.deep.equal([1, 4, 9]);
  });

  describe('emulating Rambda - http://fr.umio.us/the-philosophy-of-ramda', function () {

    it('emulates example 1', function () {
      var basket = [
          {item: 'apples',  per: .95, count: 3, cost: 2.85},
          {item: 'peaches', per: .80, count: 2, cost: 1.60},
          {item: 'plums',   per: .55, count: 4, cost: 2.20}
      ];

      // Note that both libraries actually inlude a sum function

      // Lodash version
      var _sum = _.reduce(_.add, 0);
      var _total = _.flow(_.pluck('cost'), _sum);
      expect(_total(basket)).to.equal(6.65);

      // Ramda version
      var rSum = R.reduce(R.add, 0);
      var rtotal = R.pipe(R.pluck('cost'), rSum);
      expect(rtotal(basket)).to.equal(6.65);
    });

  });

});
