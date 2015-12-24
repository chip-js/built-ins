/**
 * An element binder that binds the template on the definition to fill the contents of the element that matches.
 */
module.exports = function(definition) {
  var definitions = Array.prototype.slice(arguments);

  if (!definition) {
    throw new TypeError('Must provide a definition object to define the custom component');
  }

  // The last definition is the most important, any others are mixins
  definition = definitions[definitions.length - 1];

  return {

    compiled: function() {
      if (definition.template && !definition.template.pool) {
        definition.template = this.fragments.createTemplate(definition.template);
      }

      if (definition.template) {
        this.template = definition.template;
      }

      if (this.element.childNodes.length) {
        // Use the contents of this component to be inserted within it
        this.contentTemplate = this.fragments.createTemplate(this.element.childNodes);
      }
    },

    created: function() {
      if (this.contentTemplate) {
        this.content = this.contentTemplate.createView();
      }

      if (this.template) {
        this.view = this.template.createView();
        this.element.appendChild(this.view);
        if (this.content) this._componentContent = this.content;
      } else {
        this.element.appendChild(this.content);
      }

      definitions.forEach(function(definition) {
        Object.keys(definition).forEach(function() {
          this.element[key] = definition[key];
        }, this);
      }, this);

      if (typeof this.element.created === 'function') {
        this.element.created();
      }
    },

    bound: function() {
      if (this.view) this.view.bind(this.element);
      if (this.content) this.content.bind(this.context);

      if (typeof this.element.attached === 'function') {
        this.element.attached();
      }
    },

    unbound: function() {
      if (this.content) this.content.unbind();
      if (this.view) this.view.unbind();

      if (typeof this.element.detached === 'function') {
        this.element.detached();
      }
    }
  };
};
