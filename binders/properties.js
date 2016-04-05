/**
 * A binder that sets the property of an element to the value of the expression.
 */
module.exports = function(specificPropertyName) {
  return {
    priority: 10,

    updated: function(value) {
      var properties = this.element._properties || (this.element._properties = {});
      properties[specificPropertyName || this.camelCase] = value;
      if (this.element.component) {
        this.element.component[specificPropertyName || this.camelCase] = value;
      }
    }
  };
};
