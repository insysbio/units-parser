'use strict';

const assert = require('assert');
const {UnitParser} = require('../src');
const qspUnits = require('../src/qsp-units');
const parser = new UnitParser(qspUnits);

let incorrectUnits = [
  {str0: "1L", errorType: SyntaxError},
  {str0: "3*mg", errorType: SyntaxError},
  {str0: "L/mgg", errorType: Error},
  {str0: "mg^2\\L^3", errorType: SyntaxError},
  {str0: "m^.33/kg^2.2", errorType: SyntaxError},
  {str0: "mg^2\L^3", errorType: SyntaxError},
  {str0: "mg^2L^3", errorType: SyntaxError}
];

describe('Testing incorrect units.', () => {
  incorrectUnits.forEach((x) => {
    it("Throw Error. " + x.str0, () => {
      assert.throws(() => {
        let unit = parser.parse(x.str0);
      }, x.errorType);
    });
  });
});
