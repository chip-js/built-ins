/**
 * A binder that sets the property of an element to the value of the expression in a 2-way binding.
 */
module.exports = function(specificPropertyName) {
  return {
    priority: 10,

    created: function() {
      this.twoWayObserver = this.observe(specificPropertyName || this.camelCase, this.sendUpdate, this);
      this.element.addEventListener('componentized', function() {
        this.twoWayObserver.bind(this.element.component);
      }.bind(this));
    },

    unbound: function() {
      this.twoWayObserver.unbind();
    },

    sendUpdate: function(value) {
      if (!this.skipSend) {
        var properties = this.element._properties || (this.element._properties = {});
        properties[specificPropertyName || this.camelCase] = value;
        this.observer.set(value);
        this.skipSend = true;
        this.fragments.afterSync(function() {
          this.skipSend = false;
        }.bind(this));
      }
    },

    updated: function(value) {
      if (!this.skipSend && value !== undefined) {
        var properties = this.element._properties || (this.element._properties = {});
        properties[specificPropertyName || this.camelCase] = value;
        if (this.element.component) {
          this.element.component[specificPropertyName || this.camelCase] = value;
        }
        this.skipSend = true;
        this.fragments.afterSync(function() {
          this.skipSend = false;
        }.bind(this));
      }
    }
  };
};
