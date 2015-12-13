/**
 * Automatically selects the contents of an input when it receives focus.
 */
module.exports = function() {
  return {

    created: function() {
      var focused, mouseEvent;

      this.element.addEventListener('mousedown', function() {
        // Use matches since document.activeElement doesn't work well with web components (future compat)
        focused = this.matches(':focus');
        mouseEvent = true;
      });

      this.element.addEventListener('focus', function() {
        if (!mouseEvent) {
          this.select();
        }
      });

      this.element.addEventListener('mouseup', function() {
        if (!focused) {
          this.select();
        }
        mouseEvent = false;
      });
    }

  };
};
