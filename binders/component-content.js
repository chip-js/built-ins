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

    bound: function() {
      var template = this.context._componentContent || this.defaultContent;
      if (template) {
        this.content = template.createView();
        this.element.appendChild(this.content);
        this.content.bind(this.context);
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
