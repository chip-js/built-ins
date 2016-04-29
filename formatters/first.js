/**
 * Returns the first item from an array
 */
module.exports = function(value) {
  if (Array.isArray(value)) {
    return value[0];
  } else {
    return value;
  }
};
