"use strict";

// use lodash ?

const sbmlUnits = [
  "ampere", "coulomb", "gray", "joule", "litre", "mole", "radian", "steradian", "weber",
  "avogadro", "dimensionless", "henry", "katal", "lumen", "newton", "second", "tesla",
  "becquerel", "farad", "hertz", "kelvin", "lux", "ohm", "siemens", "volt",
  "candela", "gram", "item", "kilogram", "metre", "pascal", "sievert", "watt"
];

const simpleUnits = {
  "pmole":[],
  "nmole":[],
  "umole":[],
  "mmole":[],
  "mole":[],
  
  "pM":[],
  "nM":[],
  "uM":[],
  "mM":[],
  "M":[],
  
  "mL":[],
  "L":[],
  
  "ug":[],
  "mg":[],
  "g":[],
  "kg":[],
  
  "s": [{"kind": "second"}],
  "min":[],
  "h":[],
  "day":[],
  "month":[],
  "year":[],
  
  "cell":[],
  "kcell":[],
  
  "Da": [{"kind": "gram", "exponent": "1"}, {"kind": "mole", "exponent": "-1"}],
  "cm":[],
  "m":[],
  
  "dl": [{"kind": "dimensionless"}],
  
  "item":[],
  
  "Pa":[],
  "J":[],
  "kJ":[],
  "mV":[],
  "V":[],
  "K":[]
};


// object of structure [{kind: "mM", exponent: 2}, {kind: "L", exponent: 1}, {kind: "mg", exponent: -1}, {kind: "h", exponent: -2}]
class Unit {
  
  // constructor taking string of type 'mM^2*L/mg/h2' and creates unit-object
  static parseFromString(str) {
    let unit = new Unit();
    
    return unit;
  };
  
  // serialize unit-object to string of type 'mM^2*L/mg/h^2' is the same as 'mM2*L/mg/h2'
  toString(){
    let res = "";
    
    return res;
  }
  
  // serialize unit-object to string of type 'mM2_L__mg__h2'
  toHash(){
    let res = "";
    
    return res;
  }
  
  // serialize unit-object to string with TeX '\frac{mM^{2} L}{mg h^{2}}'
  toTex(){
    let res = "";
    
    return res;
  }
  
  // serialize unit-object to string with TeX '\frac{mM^{2} L}{mg h^{2}}'
  toSbmlUnitDefinition(){
    let res = "<unitDefinition></unitDefinition>";
    
    return res;
  }
  
}
