"use strict";

// use lodash ?

// object of structure [{kind: "mM", exponent: 2}, {kind: "L", exponent: 1}, {kind: "mg", exponent: -1}, {kind: "h", exponent: -2}]
class Unit {
  
  // constructor taking string of type 'mM^2*L/mg/h2' and creates unit-object
  static parseFromString(str) {
    let unit = new Unit();
    
    console.log("Parse string...");
    
    let items = str.match(/([*/]?(1\/)?[A-Za-z]+[\^]?[\d.]*)/g);
    console.log(" Units and op into str", items);
    
    console.log(" Check connect list of units:", simpleUnits);
    
    items.forEach(function (item, i) {
      console.log("elementes of unit ", item[0], item.search(/1\//), item.match(/[A-Za-z]+/), item.match(/[\d.]+$/));
    
    unit[i] = {
      op: item.match(/^[\/*]/) && item.match(/^[$\/*]/)[0],
      kind: item.match(/[A-Za-z]+/)[0],
      exponent: ((item.search(/1\//) != -1) && (item[0] == "/"))  ? 1 : (
                ((item.search(/1\//) != -1) || (item[0] == "/")) ? -1 : 1),
      scale: item.match(/[\d.]+$/) && item.match(/[\d.]+$/)[0]
    };
    });
    console.log("res", unit);
    return unit;
  };
  
  // serialize unit-object to string of type 'mM^2*L/mg/h^2' is the same as 'mM2*L/mg/h2'
  toString(){
    console.log("to string");
    
    let item, res = "";
    
    for (item in this) {
      console.log(" add hash ", this[item]);
      
      if (this[item].op == "*") {
        res += "*";
      } else if (this[item].op == "/") {
        res += "/";
      }
      console.log("after add op", res);
      
      if (((this[item].op == "/") && (this[item].exponent == 1)) || ((this[item].op != "/") && (this[item].exponent == -1))) {
        res += "1/";
      }
      
      res += this[item].kind;
      
      if (this[item].scale) {
        res += this[item].scale;
      }
    }
    
    return res;
  }
  
  // serialize unit-object to string of type 'mM2_L__mg__h2'
  toHash(){
    console.log("to Hash");
    
    let item, res = "";
    
    for (item in this) {
      console.log(" add hash ", this[item]);
      
      if (this[item].op == "*") {
        res += "_";
      } else if (this[item].op == "/") {
        res += "__";
      }
      console.log("after add op", res);
      
      if (((this[item].op == "/") && (this[item].exponent == 1)) || ((this[item].op != "/") && (this[item].exponent == -1))) {
        res += "1__";
      }
      
      res += this[item].kind;
      
      if (this[item].scale) {
        res += this[item].scale;
      }
    }
    
    return res;
  }
  
  // serialize unit-object to string with TeX '\frac{mM^{2} \cdot L}{mg \cdot h^{2}}'
  toTex(){
    let res = "";
    
    return res;
  }
  
  // transform to sbml units
  toSbmlUnits(){
    let res = "";
    
    return res;
  }
  
  // serialize unit-object to string with TeX '\frac{mM^{2} L}{mg h^{2}}'
  toSbmlUnitDefinition(){
    let res = "<unitDefinition></unitDefinition>";
    
    return res;
  }
  
}
