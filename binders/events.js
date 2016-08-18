var functionCallExp = /(^|[^\.\]a-z$_\$])([a-z$_\$][a-z_\$0-9-]*)\s*\(\s*(\S)/ig;

/**
 * A binder for adding event listeners. When the event is triggered the expression will be executed. The properties
 * `event` (the event object) and `element` (the element the binder is on) will be available to the expression.
 */
module.exports = function(specificEventName) {
  return {
    compiled: function() {
      // Call the function in the scope of the original context when appearing inside a repeat
      this.expression = this.expression.replace(functionCallExp, function(_, before, functionName, closingParen) {
        var after = closingParen === ')' ? closingParen : ', ' + closingParen;
        return before + functionName + '.call(_origContext_ || this' + after;
      });
      this.listener = this.observations.getExpression(this.expression, { extraArgs: [ '$element', '$event' ]});
    },

    created: function() {
      var eventName = specificEventName || this.match;

      this.element.addEventListener(eventName, function(event) {
        if (this.shouldSkip(event)) return;

        // queue up a sync to run afer this event is handled (we assume most events will alter the state of the
        // application, otherwise there is no need to listen for them)
        this.fragments.sync();
        this.listener.call(this.context, this.element, event);
      }.bind(this));
    },

    shouldSkip: function(event) {
      return !this.context || event.currentTarget.hasAttribute('disabled');
    }
  };
};
