var Component = require('./component-definition');
var slice = Array.prototype.slice;

/**
 * An element binder that binds the template on the definition to fill the contents of the element that matches. Can be
 * used as an attribute binder as well.
 */
module.exports = function(ComponentClass, unwrapAttribute) {
  var componentLoader;

  if (typeof ComponentClass !== 'function') {
    throw new TypeError('Invalid component, requires a subclass of Component or a function which will return such.');
  }

  if (!ComponentClass.isComponent) {
    componentLoader = ComponentClass;
    ComponentClass = undefined;
  }

  return {

    compiled: function() {
      if (unwrapAttribute && this.element.getAttribute(unwrapAttribute) !== null) {
        var parent = this.element.parentNode;
        var placeholder = document.createTextNode('');
        parent.insertBefore(placeholder, this.element);
        parent.removeChild(this.element);
        this.element = placeholder;
        this.unwrapped = true;
      } else {
        this.unwrapped = false;
      }

      this.ComponentClass = ComponentClass;

      this.compileTemplate();

      var empty = !this.element.childNodes.length ||
                  (this.element.childNodes.length === 1 &&
                   this.element.firstChild.nodeType === Node.TEXT_NODE &&
                   !this.element.firstChild.textContent.trim()
                  );
      if (!empty) {
        // Use the contents of this component to be inserted within it
        this.contentTemplate = this.fragments.createTemplate(this.element.childNodes);
      }
    },

    created: function() {
      this.element.component = null;
    },

    updated: function(ComponentClass) {
      this.unbound();
      if (this.view && this.view._attached) {
        this.detached();
      }
      this.unmake();

      if (typeof ComponentClass === 'string' && componentLoader) {
        ComponentClass = componentLoader.call(this, ComponentClass);
      }

      this.ComponentClass = ComponentClass;

      this.make();
      this.bound();
      if (this.view && this.view._attached) {
        this.attached();
      }
    },

    bound: function() {
      // Set for the component-content binder to use
      this.element._parentContext = this.context;

      if (!this.component) {
        // If not already a component, make it
        this.make();
      }

      if (this.component) {
        this.component.bound();
      }
    },

    unbound: function() {
      if (this.component) {
        this.component.unbound();
      }

      if (this.view && !this.view._attached) {
        // If removed and unbound, unmake it
        this.unmake();
      }

      delete this.element._parentContext;
    },

    attached: function() {
      if (this.component) {
        this.component.attached();
      }
    },

    detached: function() {
      if (this.component) {
        this.component.detached();
      }
      if (!this.context) {
        // If removed and unbound, unmake it
        this.unmake();
      }
    },

    compileTemplate: function() {
      if (!this.ComponentClass) {
        return;
      }

      var proto = this.ComponentClass.prototype;
      if (proto.template && !proto.template.compiled && !proto._compiling) {
        proto._compiling = true;
        proto.template = this.fragments.createTemplate(proto.template);
        delete proto._compiling;
      }
    },

    make: function() {
      if (!this.ComponentClass) {
        return;
      }

      this.compileTemplate();

      this.component = new this.ComponentClass(this.element, this.contentTemplate, this.unwrapped);
      this.element.component = this.component;

      // Expose public properties onto the element
      if (Array.isArray(this.component.public)) {
        var descriptors = {};
        this.component.public.forEach(function(name) {
          if (typeof this[name] === 'function') {
            descriptors[name] = { configurable: true, value: this[name].bind(this) };
          } else {
            descriptors[name] = {
              configurable: true,
              get: function() { return this.component[name] },
              set: function(value) { this.component[name] = value }
            };
          }
        }, this.component);
        Object.defineProperties(this.element, descriptors);
      }

      this.element.dispatchEvent(new Event('componentized'));

      var properties = this.element._properties;
      if (properties) {
        Object.keys(properties).forEach(function(key) {
          this.component[key] = properties[key];
        }, this);
      }
    },

    unmake: function() {
      if (!this.component) {
        return;
      }

      if (this.component.view) {
        this.component.view.dispose();
      }

      // Remove exposed public properties
      if (Array.isArray(this.component.public)) {
        this.component.public.forEach(function(name) {
          delete this[name];
        }, this.element);
      }

      this.component.element = null;
      this.element.component = null;
      this.component = null;
    }

  };
};
