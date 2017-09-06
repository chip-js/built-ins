/**
 * Adds a formatter to limit the length of an array or string
 */
module.exports = function(value, limit) {
  if (value && typeof value.slice === 'function') {
    if (limit < 0) {
      return value.slice(limit);
    } else {
      return value.slice(0, limit);
    }
  } else {
    return value;
  }
};
