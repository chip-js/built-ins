/**
 * Slide down and up and fade in and out
 */
module.exports = function(options) {
  if (!options) options = {};
  if (!options.duration) options.duration = 250;
  if (!options.easing) options.easing = 'ease-in-out';
  if (!options.property) options.property = 'height';

  return {
    options: options,

    animateIn: function(element, done) {
      var value = element.getComputedCSS(this.options.property);
      if (!value || value === '0px') {
        return done();
      }

      var before = { opacity: '0' };
      var after = { opacity: '1' };

      before[this.options.property] = '0px';
      after[this.options.property] = value;

      element.style.overflow = 'hidden';
      element.animate([
        before,
        after
      ], this.options).onfinish = function() {
        element.style.overflow = '';
        done();
      };
    },

    animateOut: function(element, done) {
      var value = element.getComputedCSS(this.options.property);
      if (!value || value === '0px') {
        return done();
      }

      var before = { opacity: '1' };
      var after = { opacity: '0' };
      before[this.options.property] = value;
      after[this.options.property] = '0px';

      element.style.overflow = 'hidden';
      element.animate([
        before,
        after
      ], this.options).onfinish = function() {
        element.style.overflow = '';
        done();
      };
    }
  };
};
