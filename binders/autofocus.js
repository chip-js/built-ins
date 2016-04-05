/**
 * A binder that automatically focuses the input when it is displayed on screen.
 */
module.exports = function() {
  return {

    attached: function() {
      if (!this.expression || this.observer.get()) {
        this.element.focus();
      }
    }

  };
};
