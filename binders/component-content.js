/**
 * An element binder that gets filled with the contents put inside a component.
 */
module.exports = function() {
  return {

    compiled: function() {
      if (this.element.childNodes.length) {
        this.defaultContent = this.fragments.createTemplate(this.element.childNodes);
      }
    },

    attached: function() {
      if (this.content) this.content.attached();
    },

    detached: function() {
      if (this.content) this.content.detached();
    },

    bound: function() {
      var template = this.context._componentContent || this.defaultContent;
      if (template) {
        this.content = template.createView();
        this.content.bind(this.context);
        this.element.appendChild(this.content);
        this.content.attached();
      }
    },

    unbound: function() {
      if (this.content) {
        this.content.dispose();
        this.content = null;
      }
    }
  };
};
