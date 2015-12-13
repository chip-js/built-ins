/**
 * Shows/hides an element conditionally. `if` should be used in most cases as it removes the element completely and is
 * more effecient since bindings within the `if` are not active while it is hidden. Use `show` for when the element
 * must remain in-DOM or bindings within it must continue to be processed while it is hidden. You should default to
 * using `if`.
 */
module.exports = function(isShow) {
  return {
    animated: true,

    updated: function(value) {
      // For performance provide an alternate code path for animation
      if (this.animate && this.context && !this.firstUpdate) {
        this.updatedAnimated(value);
      } else {
        this.updatedRegular(value);
      }
      this.firstUpdate = false;
    },

    updatedRegular: function(value) {
      if (value) {
        this.element.style.display = '';
      } else {
        this.element.style.display = 'none';
      }
    },

    updatedAnimated: function(value) {
      this.lastValue = value;
      if (this.animating) {
        return;
      }

      this.animating = true;
      function onFinish() {
        this.animating = false;
        if (this.lastValue !== value) {
          this.updatedAnimated(this.lastValue);
        }
      }

      // if isShow is truthy and value is truthy
      if (!!value === !!isShow) {
        this.element.style.display = '';
        this.animateIn(this.element, onFinish);
      } else {
        this.animateOut(this.element, function() {
          this.element.style.display = 'none';
          onFinish.call(this);
        });
      }
    },

    bound: function() {
      this.firstUpdate = true;
    },

    unbound: function() {
      this.element.style.display = '';
      this.lastValue = null;
      this.animating = false;
    }
  };
});
