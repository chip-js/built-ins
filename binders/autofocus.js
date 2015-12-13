/**
 * A binder that automatically focuses the input when it is displayed on screen.
 */
module.exports = function() {
  return {

    bound: function() {
      var element = this.element;
      setTimeout(function() {
        element.focus();
      });
    }

  };
};
