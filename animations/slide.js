/**
 * Slide down and up
 */
module.exports = {
  property: 'height',

  options: {
    duration: 300,
    easing: 'ease-in-out'
  },

  animateIn: function(element, done) {
    var value = element.getComputedCSS(this.property);
    if (!value || value === '0px') {
      return done();
    }

    element.style.overflow = 'hidden';
    element.animate([
      keyValuePair(this.property, '0px'),
      keyValuePair(this.property, value)
    ], this.options).onfinish = function() {
      element.style.overflow = '';
      done();
    };
  },

  animateOut: function(element, done) {
    var value = element.getComputedCSS(this.property);
    if (!value || value === '0px') {
      return done();
    }

    element.style.overflow = 'hidden';
    element.animate([
      keyValuePair(this.property, value),
      keyValuePair(this.property, '0px')
    ], this.options).onfinish = function() {
      element.style.overflow = '';
      done();
    };
  }
};

function keyValuePair(key, value) {
  var obj = {};
  obj[key] = value;
  return obj;
}
