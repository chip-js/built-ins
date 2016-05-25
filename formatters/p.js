/**
 * Wraps lines into paragraphs (in <p> tags).
 */
module.exports = function(value, setter) {
  if (setter) {
    return value.replace(/<p>\n?<\/p>/g, '\n').replace(/<p>|<\/p>/g, '');
  } else {
    var lines = (value || '').split(/\r?\n/)
                // empty paragraphs will collapse if they don't have any content, insert a br
                .map(function(line) { return line || '<br>'; });
    return '<p>' + lines.join('</p>\n<p>') + '</p>';
  }
};
