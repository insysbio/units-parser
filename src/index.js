"use strict";

// use lodash ?

// object of structure [{kind: "mM", exponent: 2}, {kind: "L", exponent: 1}, {kind: "mg", exponent: -1}, {kind: "h", exponent: -2}]
class Unit extends Array  {
  
  // constructor taking string of type 'mM^2*L/mg/h2' and creates unit-object
  static parseFromString(str) {
    let unit = new Unit();
    
    console.log("Parse string ", str, "...");
    
    let items = str.match(/(^(1\/)?[A-Za-z]+[\^]?[\d.]*)|([*/][A-Za-z]+[\^]?[\d.]*)/g);
    console.log(" Units and op into str", items);
    
    console.log(" Check connect list of units:", simpleUnits);
    let l = 0, lstr = "";
    
    if (!(items)) {
      writeEr("error: wrong syntax");
      return unit;
    }
    items.forEach(function (item) {
      console.log("elementes of unit ", item[0], item.search(/1\//), item.match(/[A-Za-z]+/), item.match(/[\d.]+$/));
      
      
      
      let kind = item.match(/[A-Za-z]+/)[0],
          pow = item.match(/[\d.]+$/) && item.match(/[\d.]+$/)[0],
          exponent = (((item.search(/1\//) != -1) && (item[0] == "/"))  ? 1 : (
                  ((item.search(/1\//) != -1) || (item[0] == "/")) ? -1 : 1)) * (pow || 1);
      
      //validate
      l += item.length;
      lstr += item;
      if (kind.match(/^[A-Za-z]+$/) == -1) {
        writeEr("error: wrong syntax");
        return unit;
      }
      if (!(simpleUnits[kind])) {
        writeEr("error: unknown unit " + kind);
        return unit;
       }
       console.log("pow is", pow);
       if (!(String(pow).match(/^[\d]+(.[\d]+)*/)) && (pow != null)) {
        writeEr("error: require number before"); 
        return unit;
       }
      
      unit.push({
        "kind": kind,
        "exponent": exponent,
        scale: 0,
        multiplier: 1
      });
    });
    
    console.log("res", unit, l, str.length, str, lstr);
    if (l != str.length) {
      writeEr("error: wrong syntax");
      return unit;
    }
    
    return unit;
    
    
    
    function writeEr(mess){
      unit.length = 0;
      unit.push(mess);
    }
  };

  // serialize unit-object to string of type 'mM^2*L/mg/h^2' is the same as 'mM2*L/mg/h2'
  toString(){
    console.log("to string...");
    if (typeof(this[0]) == "string") return this[0];  
    
    let res = "";
    
    this.forEach( function(item){
      console.log(" add hash ", item);
      
      if (item.exponent < 0) {
        res += "/";
      } else if (res != "") {
        res += "*";
      }
      console.log("after add op", res);
      
      res += item.kind;
      
      if ((item.exponent != 1) && (item.exponent != -1)) {
        res += String(Math.abs(item.exponent));
      }
    });
    
    return res;
  }
  
  // serialize unit-object to string of type 'mM2_L__mg__h2'
  toHash(){
    console.log("to Hash");  
    if (typeof(this[0]) == "string") return this[0];  
        
    let res = "";
    
    this.forEach( function(item){
      console.log(" add hash ", item);
      
      if (item.exponent < 0) {
        res += "__";
      } else if (res != "") {
        res += "_";
      }
      console.log("after add op", res);
      
      res += item.kind;
      
      if ((item.exponent != 1) && (item.exponent != -1)) {
        res += String(Math.abs(item.exponent)).replace(".", "_");
      }
    });
        
    return res;
  }
  
  // serialize unit-object to string with TeX '\frac{mM^{2} \cdot L}{mg \cdot h^{2}}'
  toTex(){
    console.log("To tex...");    
    if (typeof (this[0]) == "string") return this[0];  
    
    let res = "", 
        numerator = "", 
        denominator = "", elem;
        
    this.forEach( function(item) {
      console.log(" write ", item);
      let elem =  item.kind;
      
      if ((item.exponent != 1) && (item.exponent != -1)) {        
        elem += "^{"+(Math.abs(item.exponent))+"}";
      }
      
      if (item.exponent < 0) {
        if (denominator != "") {
          denominator += " \\cdot "+elem;
        }  
        else {
          denominator += elem;
        }
      } else {
        if (numerator != "") {
          numerator += " \\cdot "+elem;
        }  
        else {
          numerator += elem;
        }
      }
    });
    
    if (denominator != "") {
      if (numerator == "") numerator = "1"
      res = "\\frac{"+numerator+"}{"+denominator+"}";
    }
    else {
      res = numerator;
    }
    
    console.log("Text res:", res);
    return res;
  }
  
  // transform to sbml units
  toSbmlUnits(){
    console.log("To sbml unit...");
    
    if (typeof(this[0]) == "string") return this[0];  
    
    let sbmlUnit = [], 
    newUnit = {
      kind: "",
      multiplier: "",
      scale: "",
      exponent: ""
    };
    
    this.forEach(function(parseUnit) {
      console.log(" Outer cycle. parseUnit is ", parseUnit);
      simpleUnits[parseUnit.kind].forEach(function(simpleUnit) {
        console.log("   Inner cycle. simpleUnit is ", simpleUnit);
        console.log("     kind is", simpleUnit.kind);
        console.log("     multiplier is ", simpleUnit.multiplier, "+", parseUnit.multiplier, "=",simpleUnit.multiplier || 1);
        console.log("     scale is", simpleUnit.scale || 0);
        console.log("     exponent is", simpleUnit.exponent, "*", parseUnit.exponent, "=", simpleUnit.exponent * parseUnit.exponent || parseUnit.exponent);
        
        sbmlUnit.push({
          kind: simpleUnit.kind,
          multiplier: simpleUnit.multiplier || 1,
          scale: simpleUnit.scale || 0,
          exponent: simpleUnit.exponent * parseUnit.exponent || parseUnit.exponent
        });
      });
    });
    
    return sbmlUnit;
  }
  
  multiply(unit) {
   return this.concat(unit);
  }

  divide(unit) {
   unit.forEach(function(item) {
      item.exponent *= -1;
   }); 
   return this.concat(unit);
  }

  simpify() {
   let listOfKind = [],
        newAr = Object.assign(this),
        i = 0;

  console.log("Edit array is", newAr);

   /*newAr.forEach(function(item, i) {
    
   });*/ 
   while ( i < newAr.length) {

    let posElement = listOfKind.indexOf(newAr[i].kind);

    if (posElement != -1) {
      newAr[i].exponent += newAr[posElement].exponent;  
      listOfKind.splice(posElement, 1);
      newAr.splice(posElement, 1);

      i--;
    }    
    if (newAr[i].exponent == 0) {
        newAr.splice(i, 1)
        i--;
    }
    else       
       listOfKind.push(newAr[i].kind);
    i++;
   }

   if (newAr.length == 0) {
    console.log("empty newAr");
    newAr.push({
      kind: "dl",
      exponent: 1,
      scale: 0,
      multiplier: 1
    });
   } 
   return newAr;
  }

  // serialize unit-object to string with TeX '\frac{mM^{2} L}{mg h^{2}}'
  toSbmlUnitDefinition(){
    if (typeof (this[0]) == "string") return this[0];  
    
    let i, units = this.toSbmlUnits();
        
    let defUnit = document.implementation.createDocument(null, "unitDefinition");
    
    //defUnit.setAttribute("id", this.toHash());    
    
    let id = defUnit.createAttribute("id"); 
    id.nodeValue = this.toHash();
    defUnit.childNodes[0].setAttributeNode(id);
    
    let listUnit = defUnit.createElement("listOfUnits");
    
    units.forEach(function(item){
      let unit = defUnit.createElement("unit");
      for (i in item) {
        let attr = defUnit.createAttribute(i); 
        attr.nodeValue = item[i];
        unit.setAttributeNode(attr)
        //unit.setAttribute(i, item[i]);
      }
      listUnit.appendChild(unit);
    });
        
    defUnit.childNodes[0].appendChild(listUnit);
    return defUnit;
  }
  
}
