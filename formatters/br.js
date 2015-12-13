var escapeHTML = require('./escape');

/**
 * HTML escapes content adding <br> tags in place of newlines characters.
 */
module.exports = function(value, setter) {
  if (setter) {
    return escapeHTML(value, setter);
  } else {
    var lines = (value || '').split(/\r?\n/);
    return lines.map(escapeHTML).join('<br>\n');
  }
};
