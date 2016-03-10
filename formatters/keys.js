/**
 * Returns the keys of an object as an array
 */
module.exports = function(value) {
  return value == null ? [] : Object.keys(value);
};
