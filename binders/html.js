/**
 * A binder that displays unescaped HTML inside an element. Be sure it's trusted! This should be used with formatters
 * which create HTML from something safe.
 */
module.exports = function() {
  return html;
};

function html(value) {
  this.element.innerHTML = (value == null ? '' : value);
}
