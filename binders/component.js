var slice = Array.prototype.slice;

/**
 * An element binder that binds the template on the definition to fill the contents of the element that matches. Can be
 * used as an attribute binder as well.
 */
module.exports = function(definition) {
  var definitions = slice.call(arguments);

  // The last definition is the most important, any others are mixins
  definition = definitions[definitions.length - 1];

  return {

    compiled: function() {
      if (definition) {
        this.definition = definition;
        this.definitions = definitions;
        this.compileTemplate();
      }

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

    updated: function(definition) {
      this.detached();
      this.unmake();

      if (Array.isArray(definition)) {
        this.definitions = definition;
        this.definition = definition[definition.length - 1];
      } else if (definition) {
        this.definitions = [definition];
        this.definition = definition;
      } else {
        this.definitions = [];
        this.definition = null;
      }

      this.make();
      this.attached();
    },

    bound: function() {
      this.element._parentContext = this.context;
      this.attached();
    },

    unbound: function() {
      this.detached();
    },

    compileTemplate: function() {
      if (this.definition.template && !this.definition.template.pool && !this.definition._compiling) {
        // Set this before compiling so we don't get into infinite loops if there is template recursion
        this.definition._compiling = true;
        this.definition.template = this.fragments.createTemplate(this.definition.template);
        delete this.definition._compiling;
      }
    },

    make: function() {
      if (!this.definition) {
        return;
      }

      this.compileTemplate();

      if (this.definition.template) {
        this.view = this.definition.template.createView();
        this.element.appendChild(this.view);
        if (this.contentTemplate) {
          this.element._componentContent = this.contentTemplate;
        }
      } else if (this.contentTemplate) {
        this.content = this.contentTemplate.createView();
        this.element.appendChild(this.content);
      }

      this.definitions.forEach(function(definition) {
        Object.keys(definition).forEach(function(key) {
          this.element[key] = definition[key];
        }, this);
      }, this);

      // Don't call created until after all definitions have been copied over
      this.definitions.forEach(function(definition) {
        if (typeof definition.created === 'function') {
          definition.created.call(this.element);
        }
      }, this);
    },

    unmake: function() {
      if (!this.definition) {
        return;
      }

      if (this.content) {
        this.content.dispose();
        this.content = null;
      }

      if (this.view) {
        this.view.dispose();
        this.view = null;
      }

      this.definitions.forEach(function(definition) {
        Object.keys(definition).forEach(function(key) {
          delete this.element[key];
        }, this);
      }, this);
    },

    attached: function() {
      if (!this.definition) {
        return;
      }

      if (this.view) this.view.bind(this.element);
      if (this.content) this.content.bind(this.context);

      this.definitions.forEach(function(definition) {
        if (typeof definition.attached === 'function') {
          definition.attached.call(this.element);
          this.fragments.sync();
        }
      }, this);
    },

    detached: function() {
      if (!this.definition) {
        return;
      }

      if (this.content) this.content.unbind();
      if (this.view) this.view.unbind();

      this.definitions.forEach(function(definition) {
        if (typeof definition.detached === 'function') {
          definition.detached.call(this.element);
        }
      }, this);
    }

  };
};
