var expect = require('chai').expect;

// See this article http://raganwald.com/2015/06/17/functional-mixins.html also examples in local directory mixins-delegation-forwarding
// Example below does not provide correct instanceOF behaviour for mixin target, see article for more details.

// Returns a function for mixing behaviour into targets.
// Mixed in properties and methods will not be enumerable

function FunctionalMixin (behaviour) {
  return function (target) {
    Object.keys(behaviour).forEach(function (property) {
      Object.defineProperty(target, property, { value: behaviour[property] });
    });

    return target;
  };
}

describe('functional mixin', function () {

  function Box () {}

  var Coloured = FunctionalMixin({
    setColourRGB: function (r, g, b) {
      this.colourCode = { r: r, g: g, b: b };
    },
    getColourRGB: function () {
      return this.colourCode;
    }
  });

  Coloured(Box.prototype);

  var box = new Box();

  it('adds methods to receiver', function() {
    box.setColourRGB(1, 1, 1);
    expect(box.getColourRGB()).to.be.deep.equal({ r: 1, g: 1, b: 1 });
  });

  it('mixed-in methods are not enumerable', function() {
    // Note that state is help on the receiver - see mixins-delegation-forwarding/overview.md
    expect(Object.keys(box)).to.be.deep.equal(['colourCode']);
  });

});
