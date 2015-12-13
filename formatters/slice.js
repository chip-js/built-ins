/**
 * Adds a formatter to reduce an array or value by the given reduce function
 */
module.exports = function(value, index, endIndex) {
  if (Array.isArray(value)) {
    return value.slice(index, endIndex);
  } else {
    return value;
  }
};
