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
          value.split(/\s+/).forEach(this.addStringClass.bind(this, classes));
        } else if (typeof value === 'object') {
          Object.keys(value).forEach(this.addObjectClass.bind(this, classes));
        }
      }

      if (this.classes) {
        Object.keys(this.classes).forEach(this.removeClass.bind(this, classes, classList));
      }

      Object.keys(classes).forEach(this.addClass.bind(this, classes, classList));

      this.classes = classes;
    },

    addStringClass: function(classes, className) {
      if (className) classes[className] = true;
    },

    addObjectClass: function(classes, className) {
      if (value[className]) classes[className] = true;
    },

    removeClass: function(classes, classList, className) {
      if (!classes[className]) classList.remove(className);
    },

    addClass: function(classes, classList, className) {
      classList.add(className);
    }
  };
};
