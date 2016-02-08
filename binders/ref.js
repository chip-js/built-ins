/**
 * A binder that sets a reference to the element when it is bound.
 */
module.exports = function () {
  return {
    bound: function() {
      this.context[this.camelCase || this.expression] = this.element;
    },

    unbound: function() {
      this.context[this.camelCase || this.expression] = null;
    }
  };
};
