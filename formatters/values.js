/**
 * Returns the values of an object (or an array) as an array
 */
module.exports = function(value) {
  if (Array.isArray(value)) return value;
  return value == null ? [] : Object.keys(value).map(getValue.bind(this, value));
};

function getValue(value, key) {
  return value[key];
}
