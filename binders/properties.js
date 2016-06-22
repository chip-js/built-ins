/**
 * A binder that sets the property of an element to the value of the expression.
 */
module.exports = function(specificPropertyName) {
  return {
    priority: 10,

    created: function() {
      this.propertyName = specificPropertyName || this.camelCase;
    },

    updated: function(value) {

      if (this.element.hasOwnProperty('component')) {
        var properties = this.element._properties || (this.element._properties = {});
        properties[this.propertyName] = value;

        if (this.context && this.element.component) {
          // Don't unset properties on components getting ready to be disposed of
          this.element.component[this.propertyName] = value;
        }
      } else if (this.context) {
        this.context[this.propertyName] = value;
      }
    }
  };
};
