'use strict';

const assert = require('assert');
const {UnitsParser, Unit} = require('../src');

describe('Testing rebase', () => {
  let test = {
    source: new Unit().concat([
      {kind: 'kg', scale: 3, exponent: 1, multiplier: 1},
      {kind: 'L', scale: 0, exponent: -1, multiplier: 1}
    ]),
    trans: {
      kg: [{"kind":"g", "scale": 3}],
      L: [{"kind":"m", "scale": -2, "exponent": 3}]
    },
    rebased: 'g/m3'
  };
  it('Check "kg/L" to "g/m3"', () => {
    let rebased = test.source
      .toRebaseUnits(test.trans);
    assert.equal(
      rebased.toString(),
      test.rebased
    );
  });
});
