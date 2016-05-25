/**
 * Adds <br> tags in place of newlines characters.
 */
module.exports = function(value, setter) {
  if (setter) {
    return value.replace(/<br>\r?\n?/g, '\n');
  } else {
    var lines = (value || '').split(/\r?\n/);
    return lines.join('<br>\n');
  }
};
