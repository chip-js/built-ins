/**
 * Returns the last item from an array
 */
module.exports = function(value) {
  if (Array.isArray(value)) {
    return value[value.length - 1];
  } else {
    return value;
  }
};
