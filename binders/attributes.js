/**
 * A binder that sets the attribute of an element to the value of the expression. Use this when you don't want an
 * `<img>` to try and load its `src` before being evaluated. This is only needed on the index.html page as template
 * will be processed before being inserted into the DOM. Generally you can just use `attr="{{expr}}"`.
 */
module.exports = function(specificAttrName) {
  return function(value) {
    var attrName = specificAttrName || this.match;
    if (!value) {
      this.element.removeAttribute(attrName);
    } else {
      this.element.setAttribute(attrName, value);
    }
  };
};
