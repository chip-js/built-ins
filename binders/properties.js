/**
 * A binder that sets the property of an element to the value of the expression.
 */
module.exports = function(specificPropertyName) {
  return {
    priority: 10,

    updated: function(value) {
      var context = this.element.component || this.element;
      context[specificPropertyName || this.camelCase] = value;
    }
  };
};
