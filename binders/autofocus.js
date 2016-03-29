/**
 * A binder that automatically focuses the input when it is displayed on screen.
 */
module.exports = function() {
  return {

    bound: function() {
      if (!this.expression || this.observer.get()) {
        this.focus();
      }
    },

    focus: function() {
      this.fragments.afterSync(function() {
        this.element.focus();
      }.bind(this));
    }

  };
};
