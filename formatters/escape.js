var div = document.createElement('div');

/**
 * HTML escapes content. For use with other HTML-adding formatters such as autolink.
 */
module.exports = function (value, setter) {
  if (setter) {
    div.innerHTML = value;
    return div.textContent;
  } else {
    div.textContent = value || '';
    return div.innerHTML;
  }
};
