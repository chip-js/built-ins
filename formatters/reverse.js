/**
 * Adds a formatter to reverse an array
 */
module.exports = function(value) {
  if (Array.isArray(value)) {
    return value.slice().reverse();
  } else {
    return value;
  }
};
