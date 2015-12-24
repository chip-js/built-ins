/**
 * Formats the value into upper case.
 */
module.exports = function(value) {
  return typeof value === 'string' ? value.toUpperCase() : value;
};
