examples = [
  "1L", // error: wrong syntax
  "3*mg", // error: wrong syntax
  "L/mgg", // error: unknown unit mgg
  "mg^2\L^3", // error: wrong syntax
  "m^.33/kg^2.2" // error: require number before .
];
