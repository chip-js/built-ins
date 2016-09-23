var utils = require('./utils');

/**
 * Slide down and up
 */
module.exports = function(options) {
  if (!options) options = {};
  if (!options.duration) options.duration = 250;
  if (!options.easing) options.easing = 'ease-in-out';
  if (!options.property) options.property = 'height';

  return {
    options: options,

    animateIn: function(element, done) {
      var transition = utils.getTransitionIn(element, this.options.property, this.options);
      element.style.overflow = 'hidden';

      element.animate(transition.states, transition.options).onfinish = function() {
        element.style.overflow = '';
        done();
      };
    },

    animateOut: function(element, done) {
      var transition = utils.getTransitionOut(element, this.options.property, this.options);
      element.style.overflow = 'hidden';

      element.animate(transition.states, transition.options).onfinish = function() {
        element.style.overflow = '';
        done();
      };
    }
  };
};
