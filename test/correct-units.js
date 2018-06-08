'use strict';

const assert = require('assert');
const {UnitsParser} = require('../src');
const qspUnits = require('../src/qsp-units');
const parser = new UnitsParser(qspUnits);

const correctUnits = [
  {str0: 'L', str: 'L', hash: 'L', tex: 'L'},
  {str0: 'mg', str: 'mg', hash: 'mg', tex: 'mg'},
  {str0: 'M', str: 'M', hash: 'M', tex: 'M'},
  {str0: 'nM', str: 'nM', hash: 'nM', tex: 'nM'},
  {str0: 'nM2', str: 'nM2', hash: 'nM2', tex: 'nM^{2}'},
  {str0: 'L/mg', str: 'L/mg', hash: '__mg_L', tex: '\\frac{L}{mg}'},
  {str0: 'L*mg', str: 'L*mg', hash: 'mg_L', tex: 'mg \\cdot L'},
  {str0: 'L*mg', str: 'L*mg', hash: 'mg_L', tex: 'mg \\cdot L'},
  {str0: 'mg^2/L^3', str: 'mg2/L3', hash: 'mg2__L3', tex: '\\frac{mg^{2}}{L^{3}}'},
  {str0: 'mg2/L3', str: 'mg2/L3', hash: 'mg2__L3', tex: '\\frac{mg^{2}}{L^{3}}'},
  {str0: 'mg/L/s', str: 'mg/L/s', hash: '__s_mg__L', tex: '\\frac{mg}{s \\cdot L}'},
  {str0: 'm^1.33/kg^2.2', str: 'm1.33/kg2.2', hash: 'm1_33__kg2_2', tex: '\\frac{m^{1.33}}{kg^{2.2}}'},
  {str0: '1/L', str: '/L', hash: '__L', tex: '\\frac{1}{L}'}
];

describe('Testing correct units.', () => {
  correctUnits.forEach((x) => {
    describe(`Parsing "${x.str0}"`, () => {
      let unit;
      it("No Errors while parsing.", () => {
        assert.doesNotThrow(() => {
          unit = parser.parse(x.str0);
        }, SyntaxError);
      });
      it("toString(): equal to initial string: " + x.str, () => {
        assert.equal(
          unit.toString(),
          x.str
        );
      });
      it("toHash(): equal to correct hash: " + x.hash, () => {
        assert.equal(
          unit.toHash(),
          x.hash
        );
      });
      it("toTex(): equal to correct Tex: " + x.tex, () => {
        assert.equal(
          unit.toTex(),
          x.tex
        );
      });
      it("toSbmlUnitDefinition(): no errors", () => {
        assert.doesNotThrow(() => {
          unit.toSbmlUnitDefinition();
        }, Error);
      });
    });
  });
});
