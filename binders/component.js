var Component = require('./component-definition');
var slice = Array.prototype.slice;

/**
 * An element binder that binds the template on the definition to fill the contents of the element that matches. Can be
 * used as an attribute binder as well.
 */
module.exports = function(ComponentClass) {
  var componentLoader;

  if (typeof ComponentClass !== 'function') {
    throw new TypeError('Invalid component, requires a subclass of Component or a function which will return such.');
  }

  if (!(ComponentClass.prototype instanceof Component)) {
    componentLoader = ComponentClass;
    ComponentClass = undefined;
  }

  return {

    priority: 20,

    compiled: function() {
      if (this.element.getAttribute('[unwrap]') !== null) {
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
      this.make();
    },

    updated: function(ComponentClass) {
      this.detached();
      this.unmake();

      if (typeof ComponentClass === 'string' && componentLoader) {
        ComponentClass = componentLoader.call(this, ComponentClass);
      }

      this.ComponentClass = ComponentClass;

      this.make();
      this.attached();
    },

    bound: function() {
      // Set for the component-content binder to use
      this.element._parentContext = this.context;
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

      this.component = new this.ComponentClass(this.element, this.contentTemplate);
      this.element.component = this.component;
    },

    unmake: function() {
      if (!this.ComponentClass) {
        return;
      }

      if (this.component) {
        this.component.componentView.dispose();
        this.component.element = null;
        this.element.component = null;
        this.component = null;
      }
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
    }

  };
};
