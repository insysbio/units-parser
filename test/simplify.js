'use strict';

const assert = require('assert');
const {UnitsParser} = require('../src');
const qspUnits = require('../src/qsp-units');
const parser = new UnitsParser(qspUnits);

describe("Checking simplify", () => {
  var test = {
    in: "uM2/mL/uM",
    res: "/mL*uM"
  };

  it("parse and compare: " + test.in, () => {
    assert.equal(
      parser.parse(test.in)
        .simplify()
        .toString(),
      test.res
    );
  });
});
