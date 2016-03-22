/**
 * A binder that ensures anything bound to the class attribute won't overrite the classes binder. Should always be bound
 * to "class".
 */
module.exports = function() {
  return {
    onlyWhenBound: true,

    updated: function(value) {
      var classList = this.element.classList;
      var classes = {};

      if (value) {
        if (typeof value === 'string') {
          value.split(/\s+/).forEach(function(className) {
            if (className) classes[className] = true;
          });
        } else if (typeof value === 'object') {
          Object.keys(value).forEach(function(className) {
            if (value[className]) classes[className] = true;
          });
        }
      }

      if (this.classes) {
        Object.keys(this.classes).forEach(function(className) {
          if (!classes[className]) classList.remove(className);
        });
      }

      Object.keys(classes).forEach(function(className) {
        classList.add(className);
      });

      this.classes = classes;
    }
  };
};
