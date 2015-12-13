/**
 * Fade in and out
 */
module.exports = {
  options: {
    duration: 300,
    easing: 'ease-in-out'
  },
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
