var slideMoveAnimation = require('./slide-move');

/**
 * Move items left and right in a list
 */
module.exports = {
  property: 'width',
  options: slideMoveAnimation.options,
  animateIn: slideMoveAnimation.animateIn,
  animateOut: slideMoveAnimation.animateOut
};
