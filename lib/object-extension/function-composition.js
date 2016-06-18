'use strict';

const expect = require('chai').expect;

function barker (state) {
  return {
    bark () {
      return 'Woof, I am ' + state.name;
    }
  };
}

function eater (state) {
  return {
    eat (food) {
      state.eaten.push(food);
    },
    getEaten () {
      return state.eaten.slice();
    }
  };
}

function Dog (name) {
  let state = {
    name,
    eaten: []
  };

  return Object.assign(
    {},
    barker(state),
    eater(state)
  );
}


describe('Function composition with Object.assign', () => {
  it('has all functions and state', () => {
    const dog = Dog('barny');
    expect(dog.bark()).to.eql('Woof, I am barny');
    dog.eat('chips');
    expect(dog.getEaten()).to.eql(['chips']);
  });
});
