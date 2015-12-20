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
      var value = element.getComputedCSS(this.options.property);
      if (!value || value === '0px') {
        return done();
      }

      element.style.overflow = 'hidden';
      element.animate([
        keyValuePair(this.options.property, '0px'),
        keyValuePair(this.options.property, value)
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

      element.style.overflow = 'hidden';
      element.animate([
        keyValuePair(this.options.property, value),
        keyValuePair(this.options.property, '0px')
      ], this.options).onfinish = function() {
        element.style.overflow = '';
        done();
      };
    }
  };
};

function keyValuePair(key, value) {
  var obj = {};
  obj[key] = value;
  return obj;
}
