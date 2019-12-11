'use strict';

const Unit = require('./unit');

module.exports = class UnitsParser {
  constructor(baseUnits=[]){
    this._base = baseUnits;
  }

  /**
   * Creates Unit object from string.
   *
   * @param {String} unitString - string of format 'mM^2*L/mg/h2'
   * @return {Unit} A Unit object.
   */
  parse(unitString){
    let unit = new Unit();

    let items = unitString // split to parts
      .replace(/\s*/g, '') // remove blanks
      .match(/(^1\/|\/|\*)?[^*/]+/g);

    if(items===null)
      throw new SyntaxError(`Wrong syntax of unit: "${unitString}"`);

    items.forEach((item) => {
      if(!/^(1\/|\/|\*)?[A-Za-z]+\^?(\d+(\.?\d*)?)?$/.test(item)) // checking "/xxx^12.23"
        throw new SyntaxError(`Wrong syntax of unit: "${unitString}"`);

      let kind = item.match(/[A-Za-z]+/)[0];
      let pow = item.match(/[\d.]+$/) && item.match(/[\d.]+$/)[0];
      let exponent0 = (/(^|\*)[a-zA-Z]+/.test(item)) // searching constructions "1/L", "/L"
        ? 1
        : -1;
      let exponent = exponent0 * (pow || 1);

      //validate
      if(this._base.indexOf(kind)===-1)
        throw new Error(`Unknown unit: "${kind}"`);

      unit.push({
        kind: kind,
        exponent: exponent,
        scale: 0,
        multiplier: 1
      });
    });

    return unit;
  }
}
