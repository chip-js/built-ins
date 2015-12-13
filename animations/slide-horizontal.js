var slideAnimation = require('./slide');

/**
 * Slide left and right
 */
module.exports = {
  property: 'width',
  options: slideAnimation.options,
  animateIn: slideAnimation.animateIn,
  animateOut: slideAnimation.animateOut
};
