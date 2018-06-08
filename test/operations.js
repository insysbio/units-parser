'use strict';

const assert = require('assert');
const {UnitsParser} = require('../src');
const qspUnits = require('../src/qsp-units');
const parser = new UnitsParser(qspUnits);

describe("Checking multiply/divide", () => {
  let test = {
    in1: "uM/mL",
    in2: "kg",
    res1: "uM/mL*kg",
    res2: "uM/mL/kg"
  };

  it("Check multiply:", () => {
    assert.equal(
      parser.parse(test.in1)
        .multiply(parser.parse(test.in2))
        .toString(),
      test.res1
    );
  });

  it("Check divide:", () => {
    assert.equal(
      parser.parse(test.in1)
        .divide(parser.parse(test.in2))
        .toString(),
      test.res2
    );
  });
});
