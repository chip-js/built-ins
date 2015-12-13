/**
 * Adds a formatter to log the value of the expression, useful for debugging
 */
module.exports = function(value, prefix) {
  if (prefix == null) prefix = 'Log:';
  /*eslint-disable no-console */
  console.log('%c' + prefix, 'color:blue;font-weight:bold', value);
  /*eslint-enable */
  return value;
};
