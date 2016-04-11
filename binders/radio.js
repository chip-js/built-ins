/**
 * A binder for radio buttons specifically
 */
module.exports = function(valueName) {
  return {
    onlyWhenBound: true,
    priority: 10,

    compiled: function() {
      var element = this.element;

      if (valueName && valueName !== 'value' && element.hasAttribute(valueName)) {
        this.valueExpr = this.fragments.codifyExpression('attribute', element.getAttribute(valueName), true);
        element.removeAttribute(valueName);
      } else if (element.hasAttribute('value')) {
        this.valueExpr = this.fragments.codifyExpression('attribute', element.getAttribute('value'), false);
      } else {
        return false;
      }

      element.setAttribute('name', this.expression);
    },

    created: function() {
      this.element.addEventListener('change', function(event) {
        if (this.element.checked) {
          this.observer.set(this.get(this.valueExpr));
        }
      }.bind(this));
    },

    updated: function(value) {
      this.element.checked = (value == this.get(this.valueExpr));
    }
  };
};

