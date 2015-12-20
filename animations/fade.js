/**
 * Fade in and out
 */
module.exports = function(options) {
  if (!options) options = {};
  if (!options.duration) options.duration = 250;
  if (!options.easing) options.easing = 'ease-in-out';

  return {
    options: options,
    animateIn: function(element, done) {
      element.animate([
        { opacity: '0' },
        { opacity: '1' }
      ], this.options).onfinish = done;
    },
    animateOut: function(element, done) {
      element.animate([
        { opacity: '1' },
        { opacity: '0' }
      ], this.options).onfinish = done;
    }
  };
};
