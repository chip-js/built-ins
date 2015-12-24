/**
 * Formats the value into lower case.
 */
module.exports = function(value) {
  return typeof value === 'string' ? value.toLowerCase() : value;
};
