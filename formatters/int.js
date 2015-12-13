/**
 * Formats the value into an integer or null.
 */
module.exports = function(value) {
  value = parseInt(value);
  return isNaN(value) ? null : value;
};
