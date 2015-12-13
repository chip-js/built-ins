var escapeHTML = require('./escape');

/**
 * HTML escapes content adding <p> tags at double newlines and <br> tags in place of single newline characters.
 */
module.exports = function(value, setter) {
  if (setter) {
    return escapeHTML(value, setter);
  } else {
    var paragraphs = (value || '').split(/\r?\n\s*\r?\n/);
    var escaped = paragraphs.map(function(paragraph) {
      var lines = paragraph.split(/\r?\n/);
      return lines.map(escapeHTML).join('<br>\n');
    });
    return '<p>' + escaped.join('</p>\n\n<p>') + '</p>';
  }
};
