/**
 * Formats the value into a boolean.
 */
module.exports = function(value) {
  return value && value !== '0' && value !== 'false';
};
