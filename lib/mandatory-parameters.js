'use strict';

const expect = require('chai').expect;

function mandatory () {
  throw new Error('Missing parameter')
}

function add5 (n = mandatory()) {
  return n + 5;
}

describe('mandatory parameters', () => {
  it('throws when parameter is not supplied', () => {
    expect(add5).throws(Error);
  });

  it('succeeds when parameter is supplied', () => {
    expect(add5(1)).to.eql(6);
  });
});
