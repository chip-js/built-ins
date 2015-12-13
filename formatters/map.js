/**
 * Adds a formatter to map an array or value by the given mapping function
 */
module.exports = function(value, mapFunc) {
  if (value == null || typeof mapFunc !== 'function') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(mapFunc, this);
  } else {
    return mapFunc.call(this, value);
  }
};
