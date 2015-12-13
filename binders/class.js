/**
 * A binder that ensures anything bound to the class attribute won't overrite the classes binder. Should always be bound
 * to "class".
 */
module.exports = function() {
  return {
    onlyWhenBound: true,

    updated: function(value) {
      var classList = this.element.classList;

      if (this.classes) {
        this.classes.forEach(function(className) {
          if (className) {
            classList.remove(className);
          }
        });
      }

      if (value) {
        this.classes = value.split(/\s+/);
        this.classes.forEach(function(className) {
          if (className) {
            classList.add(className);
          }
        });
      }

    }
  };
};
