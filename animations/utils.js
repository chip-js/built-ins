
exports.getTransitionIn = function(element, property, defaults) {
  if (!defaults) {
    defaults = { duration: 250, easing: 'ease' };
  }
  var sides = property === 'height' ? [ 'top', 'bottom' ] : [ 'left', 'right' ];
  var styles = getComputedStyles(element);

  var before = {};
  var after = {};
  before[property] = '0px';
  after[property] = styles[property];
  sides.forEach(function(side) {
    var Side = side[0].toUpperCase() + side.slice(1);
    before['padding' + Side] = '0px';
    before['margin' + Side] = '0px';
    after['padding' + Side] = styles['padding' + Side];
    after['margin' + Side] = styles['margin' + Side];
  });

  return {
    states: [ before, after ],
    options: {
      duration: parseFloat(styles.transitionDuration) * 1000 || defaults.duration,
      easing: styles.transitionTimingFunction || defaults.easing
    }
  };
};

exports.getTransitionOut = function(element, property, defaults) {
  var trans = exports.getTransitionIn(element, property, defaults);
  trans.states.reverse();
  return trans;
};

exports.getTransitionOptions = function(element, defaults) {
  if (!defaults) {
    defaults = { duration: 250, easing: 'ease' };
  }

  var styles = getComputedStyles(element);

  return {
    duration: parseFloat(styles.transitionDuration) * 1000 || defaults.duration,
    easing: styles.transitionTimingFunction || defaults.easing
  };
};

function getComputedStyles(element) {
  if (element.ownerDocument.defaultView.opener) {
    return element.ownerDocument.defaultView.getComputedStyle(element);
  }
  return window.getComputedStyle(element);
}
