'use strict';

const qspToSbml = require('./qsp-to-sbml.json');

/**
 * Class describes compound phisical units.
 *
 */
module.exports = class Unit extends Array {
  /**
   * Serialize Unit object to string.
   *
   * @return {string} of format: 'mM2*L/mg/h2'
   */
  toString(){
    return this
      .map((item, i) => {
        let operator = (item.exponent<0)
          ? ( (i>0) ? '/' : '1/' ) // 1 for 1/L
          : ( (i>0) ? '*' : '' ); // no operator for first element

        let expAbs = Math.abs(item.exponent); // absolute value
        let exponent = (expAbs!==1)
          ? expAbs
          : '';

        return operator + item.kind + exponent;
      })
      .join('');
  }

  /**
   * Serialize Unit object to HTML code.
   *
   * @return {string} of format: 'mM<sup>2</sup> * L / mg / h<sup>2</sup>'
   */
  toHTML(){
    return this
      .map((item, i) => {
        let operator = (item.exponent<0)
          ? ( (i>0) ? ' / ' : '1 / ' ) // 1 for 1/L
          : ( (i>0) ? '&#183;' : '' ); // no operator for first element

        let expAbs = Math.abs(item.exponent); // absolute value
        let exponent = (expAbs!==1)
          ? '<sup>' + expAbs + '</sup>'
          : '';

        return operator + item.kind + exponent;
      })
      .join('');
  }

  /**
   * Serialize unit-object to identificator.
   *
   * @return {string} of type 'mM2_L\__mg\__h2'
   */
  toHash(){
    return this.concat([]) // clone array to exclude mutation
      .sort((x1, x2) => x1.kind > x2.kind ? -1 : 1)
      .map((item, i) => {
        let operator = (item.exponent<0)
          ? '__'
          : (i>0) ? '_' : ''; // no operator for first element

        let expAbs = Math.abs(item.exponent); // absolute value
        let exponent = (expAbs!==1)
          ? String(expAbs).replace('.', '_')
          : '';

        return operator + item.kind + exponent;
      })
      .join('');
  }

  /**
   * Serialize unit-object to Tex format.
   *
   * @return {string} with TeX '\frac{mM^{2} \cdot L}{mg \cdot h^{2}}'
   */
  toTex(){
    let res = '';
    let numerator = this
      .filter((item) => item.exponent > 0)
      .map((item) => {
        let expAbs = Math.abs(item.exponent); // absolute value
        let exponent = (expAbs!==1)
          ? '^{' + expAbs + '}'
          : '';
        return item.kind + exponent;
      })
      .join(' \\cdot ');

    let denominator = this
      .filter((item) => item.exponent < 0)
      .map((item) => {
        let expAbs = Math.abs(item.exponent); // absolute value
        let exponent = (expAbs!==1)
          ? '^{' + expAbs + '}'
          : '';
        return item.kind + exponent;
      })
      .join(' \\cdot ');

    if(denominator!=='' && numerator!==''){ // \frac{num}{den}
      return '\\frac{' + numerator + '}{' + denominator + '}';
    }else if(denominator==='' && numerator!==''){ // num
      return numerator;
    }else if(denominator!=='' && numerator===''){ // \frac{1}{den}
      return '\\frac{1}{' + denominator + '}';
    }else{
      return ''; // unitless
    }
  }

  /**
   * Translate to SBML terms.
   *
   * @returns {Unit} Unit in SBML friendly format.
   */
  toRebaseUnits(transformator){ // TOFIX: not checked yet
    let sbmlUnit = new Unit();
    this.forEach((parseUnit) => {
      transformator[parseUnit.kind].forEach((simpleUnit) => {
        sbmlUnit.push({
          kind: simpleUnit.kind,
          multiplier: simpleUnit.multiplier || 1,
          scale: simpleUnit.scale || 0,
          exponent: simpleUnit.exponent * parseUnit.exponent || parseUnit.exponent
        });
      });
    });

    return sbmlUnit
  }

  /**
   * Multiply two units.
   *
   * @param {Unit} unit - the second unit
   *
   * @returns {Unit} result of multiplying
   */
  multiply(unit) {
    return this.concat(unit);
  }

  /**
   * Divide two units.
   *
   * @param {Unit} unit - the second unit
   *
   * @returns {Unit} Result of division.
   */
  divide(unit) {
    let newUnit = unit.map((item) => {
      let current = Object.assign({}, item); // clone
      current.exponent *= -1;
      return current;
    });
    return this.concat(newUnit);
  }

  /**
   * Normalize units.
   *
   * @return {Unit} Simplified version of units.
   */
  simplify() {
    let listOfKind = [];
    let newUnit = new Unit();

    this.forEach(function(item) {
      let current = Object.assign({}, item),
        posElement = listOfKind.indexOf(current.kind);

      if (posElement !== -1) {
        current.exponent += newUnit[posElement].exponent;
        listOfKind.splice(posElement, 1);
        newUnit.splice(posElement, 1);
      }

      if (current.exponent !== 0) {
        listOfKind.push(current.kind);
        newUnit.push(current);
      }
    });

    if (newUnit.length === 0) {
      newUnit.push({
        kind: 'dl',
        exponent: 1,
        scale: 0,
        multiplier: 1
      });
    }

    return newUnit;
  }

  toXmlUnitDefinition(transformator, options={nameStyle:'string'}){
    let units = this.toRebaseUnits(transformator);

    let listOfUnits = units
      .map((item) => {
        return `\n    <unit kind="${item.kind}" exponent="${item.exponent}" scale="${item.scale}" multiplier="${item.multiplier}"/>`;
      })
      .join('');

    let name = options.nameAsTex
      ? ` name="${this.toTex()}"`
      : ` name="${this.toString()}"`;

    let nameAttr; // name attribute
    switch (options.nameStyle) {
      case 'TeX':
        nameAttr = ` name="${this.toTex()}"`
        break;
      case 'HTML':
        nameAttr = ` name="${this.toHTML()}"`
        break;
      case 'string':
        nameAttr = ` name="${this.toString()}"`
        break;
      default:
        throw new Error(options.nameStyle + ' is unsupported value for "options.nameStyle". Use one of values: TeX, HTML, string.');
    }

    return `<unitDefinition id="${this.toHash()}"${nameAttr}>\n  <listOfUnits>`
      + listOfUnits
      + `\n  </listOfUnits>\n</unitDefinition>`;
  }

  /**
   * Creates XML representing unitDefinition as required in SBML L2.
   *
   * @returns {string} Unit definition in SBML format.
   */
  toSbmlUnitDefinition(options){
    return this.toXmlUnitDefinition(qspToSbml, options);
  }

  /**
   * toJSON - description
   *
   * @returns {string}  JSON
   */
  toJSON(){
    return JSON.stringify(this, null, 2)
  }
}
