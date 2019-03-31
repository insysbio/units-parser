'use strict';

const assert = require('assert');
const {UnitsParser, Unit, qspUnits} = require('../src');
const parser = new UnitsParser(qspUnits);

const chai = require('chai');
chai.use(require('chai-xml'));
const expect = chai.expect;

describe('Testing toSbmlUnitDefinition', () => {
  it('Without simplify', () => {
    let res = parser
      .parse('uM*L')
      .toSbmlUnitDefinition();
    expect(res).xml.to.be.valid();
    expect(res).xml.be.deep.equal(
      `<unitDefinition id="uM_L" name="uM*L">
        <listOfUnits>
          <unit kind="mole" exponent="1" scale="-6" multiplier="1"/>
          <unit kind="litre" exponent="-1" scale="0" multiplier="1"/>
          <unit kind="litre" exponent="1" scale="0" multiplier="1"/>
        </listOfUnits>
      </unitDefinition>`
    );
  });
  it('With simplify', () => {
    let res = parser
      .parse('uM*L')
      .toSbmlUnitDefinition({simplify: true});
    expect(res).xml.to.be.valid();
    expect(res).xml.be.deep.equal(
      `<unitDefinition id="uM_L" name="uM*L">
        <listOfUnits>
          <unit kind="mole" exponent="1" scale="-6" multiplier="1"/>
        </listOfUnits>
      </unitDefinition>`
    );
  });
});
