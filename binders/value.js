var inputMethods, defaultInputMethod;

/**
 * A binder that sets the value of an HTML form element. This binder also updates the data as it is changed in
 * the form element, providing two way binding. Can use for "checked" as well.
 */
module.exports = {
  onlyWhenBound: true,
  eventsAttrName: 'value-events',
  fieldAttrName: 'value-field',
  defaultEvents: [ 'change' ],

  compiled: function() {
    var name = this.element.tagName.toLowerCase();
    var type = this.element.type;
    this.methods = inputMethods[type] || inputMethods[name];

    if (!this.methods) {
      return false;
    }

    if (this.element.hasAttribute(this.eventsAttrName)) {
      this.events = this.element.getAttribute(this.eventsAttrName).split(' ');
      this.element.removeAttribute(this.eventsAttrName);
    } else if (name !== 'option') {
      this.events = this.defaultEvents;
    }

    if (this.element.hasAttribute(this.fieldAttrName)) {
      this.valueField = this.element.getAttribute(this.fieldAttrName);
      this.element.removeAttribute(this.fieldAttrName);
    }

    if (type === 'option') {
      this.valueField = this.element.parentNode.valueField;
    }
  },

  created: function() {
    if (!this.events) return; // nothing for <option> here
    var element = this.element;
    var observer = this.observer;
    var input = this.methods;
    var valueField = this.valueField;

    // The 2-way binding part is setting values on certain events
    function onChange() {
      if (input.get.call(element, valueField) !== observer.oldValue && !element.readOnly) {
        observer.set(input.get.call(element, valueField));
      }
    }

    if (element.type === 'text') {
      element.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) onChange();
      });
    }

    this.events.forEach(function(event) {
      element.addEventListener(event, onChange);
    });
  },

  updated: function(value) {
    if (this.methods.get.call(this.element, this.valueField) != value) {
      this.methods.set.call(this.element, value, this.valueField);
    }
  }
};


/**
 * Handle the different form types
 */
defaultInputMethod = {
  get: function() { return this.value; },
  set: function(value) { this.value = (value == null) ? '' : value; }
};


inputMethods = {
  checkbox: {
    get: function() { return this.checked; },
    set: function(value) { this.checked = !!value; }
  },

  file: {
    get: function() { return this.files && this.files[0]; },
    set: function() {}
  },

  select: {
    get: function(valueField) {
      if (valueField) {
        return this.options[this.selectedIndex].valueObject;
      } else {
        return this.value;
      }
    },
    set: function(value, valueField) {
      if (value && valueField) {
        this.valueObject = value;
        this.value = value[valueField];
      } else {
        this.value = (value == null) ? '' : value;
      }
    }
  },

  option: {
    get: function(valueField) {
      return valueField ? this.valueObject[valueField] : this.value;
    },
    set: function(value, valueField) {
      if (value && valueField) {
        this.valueObject = value;
        this.value = value[valueField];
      } else {
        this.value = (value == null) ? '' : value;
      }
    }
  },

  input: defaultInputMethod,

  textarea: defaultInputMethod
};

