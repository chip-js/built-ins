/**
 * A binder for adding event listeners. When the event is triggered the expression will be executed. The properties
 * `event` (the event object) and `element` (the element the binder is on) will be available to the expression.
 */
module.exports = function(specificEventName) {
  return {
    created: function() {
      var eventName = specificEventName || this.match;
      var _this = this;

      this.element.addEventListener(eventName, function(event) {
        if (_this.shouldSkip(event)) {
          return;
        }

        // Set the event on the context so it may be used in the expression when the event is triggered.
        var priorEvent = Object.getOwnPropertyDescriptor(_this.context, 'event');
        var priorElement = Object.getOwnPropertyDescriptor(_this.context, 'element');
        _this.setEvent(event, priorEvent, priorElement);

        // Let an event binder make the function call with its own arguments
        _this.observer.get();

        // Reset the context to its prior state
        _this.clearEvent();
      });
    },

    shouldSkip: function(event) {
      return !this.context || event.currentTarget.hasAttribute('disabled');
    },

    unbound: function() {
      this.clearEvent();
    },

    setEvent: function(event, priorEventDescriptor, priorElementDescriptor) {
      if (!this.context) {
        return;
      }
      this.event = event;
      this.priorEventDescriptor = priorEventDescriptor;
      this.priorElementDescriptor = priorElementDescriptor;
      this.lastContext = this.context;

      this.context.event = event;
      this.context.element = this.element;
    },

    clearEvent: function() {
      if (!this.event) {
        return;
      }
      var context = this.lastContext;

      if (this.priorEventDescriptor) {
        Object.defineProperty(context, 'event', this.priorEventDescriptor);
        this.priorEventDescriptor = null;
      } else {
        delete context.event;
      }

      if (this.priorElementDescriptor) {
        Object.defineProperty(context, 'element', this.priorElementDescriptor);
        this.priorElementDescriptor = null;
      } else {
        delete context.element;
      }

      this.event = null;
      this.lastContext = null;
    }
  };
};
