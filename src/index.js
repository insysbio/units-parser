"use strict";

// use lodash ?

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
