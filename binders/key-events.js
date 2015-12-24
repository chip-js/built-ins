var keys = {
  backspace: 8,
  tab: 9,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46
};

/**
 * Adds a binder which is triggered when a keyboard event's `keyCode` property matches for the above list of keys. If
 * more robust shortcuts are required use the shortcut binder.
 */
module.exports = function(specificKeyName, specificEventName) {
  var eventBinder = require('./events')(specificEventName);

  return {
    compiled: function() {
      // Split on non-char (e.g. keydown::enter or keyup.esc to handle various styles)
      var parts = (specificKeyName || this.match).split(/[^a-z]+/);
      if (this.element.hasOwnProperty('on' + parts[0])) {
        this.match = parts.shift();
      } else {
        this.match = 'keydown';
      }

      this.ctrlKey = parts[0] === 'ctrl';

      if (this.ctrlKey) {
        this.keyCode = keys[parts[1]];
      } else {
        this.keyCode = keys[parts[0]];
      }
    },

    shouldSkip: function(event) {
      if (this.keyCode) {
        return eventBinder.shouldSkip.call(this, event) ||
          this.ctrlKey !== (event.ctrlKey || event.metaKey) ||
          this.keyCode !== event.keyCode;
      } else {
        return eventBinder.shouldSkip.call(this, event);
      }
    },

    created: eventBinder.created,
    unbound: eventBinder.unbound,
    setEvent: eventBinder.setEvent,
    clearEvent: eventBinder.clearEvent
  };
};
