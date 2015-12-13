/**
 * A binder that toggles an attribute on or off if the expression is truthy or falsey. Use for attributes without
 * values such as `selected`, `disabled`, or `readonly`.
 */
module.exports = function(specificAttrName) {
  return function(value) {
    var attrName = specificAttrName || this.match;
    if (!value) {
      this.element.removeAttribute(attrName);
    } else {
      this.element.setAttribute(attrName, '');
    }
  };
};
