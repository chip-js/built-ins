/**
 * A binder for radio buttons specifically
 */
module.exports = function(valueName) {
  return {
    onlyWhenBound: true,
    priority: 10,

    compiled: function() {
      var valueExpr;
      var element = this.element;

      if (valueName && valueName !== 'value' && element.hasAttribute(valueName)) {
        valueExpr = this.fragments.codifyExpression('attribute', element.getAttribute(valueName), true);
        element.removeAttribute(valueName);
      } else if (element.hasAttribute('value')) {
        valueExpr = this.fragments.codifyExpression('attribute', element.getAttribute('value'), false);
      } else {
        return false;
      }

      element.setAttribute('name', this.expression);
      this.valueObserver = this.observe(valueExpr);
    },

    created: function() {
      this.element.addEventListener('change', function(event) {
        if (this.element.checked) {
          this.observer.set(this.valueObserver.get());
        }
      }.bind(this));
    },

    bound: function() {
      this.valueObserver.bind(this.context);
    },

    unbound: function() {
      this.valueObserver.unbind();
    },

    updated: function(value) {
      this.element.checked = (value == this.valueObserver.get());
    }
  };
};

