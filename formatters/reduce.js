/**
 * Adds a formatter to reduce an array or value by the given reduce function
 */
module.exports = function(value, reduceFunc, initialValue) {
  if (value == null || typeof reduceFunc !== 'function') {
    return value;
  }
  if (Array.isArray(value)) {
    if (arguments.length === 3) {
      return value.reduce(reduceFunc, initialValue);
    } else {
      return value.reduce(reduceFunc);
    }
  } else if (arguments.length === 3) {
    return reduceFunc(initialValue, value);
  }
};
