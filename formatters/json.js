/**
 * Formats the value into JSON.
 */
module.exports = function(value, isSetter) {
  if (isSetter) {
    try {
      return JSON.parse(value);
    } catch(err) {
      return null;
    }
  } else {
    try {
      return JSON.stringify(value);
    } catch(err) {
      return err.toString();
    }
  }
};
