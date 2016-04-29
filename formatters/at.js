/**
 * Returns the item from an array at the given index
 */
module.exports = function(value, index) {
  if (Array.isArray(value)) {
    return value[index];
  } else {
    return value;
  }
};
