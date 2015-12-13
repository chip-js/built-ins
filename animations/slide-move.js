var slideAnimation = require('./slide');

/**
 * Move items up and down in a list
 */
module.exports = {
  property: 'height',

  options: {
    duration: 300,
    easing: 'ease-in-out'
  },

  animateIn: function(element, done) {
    var value = element.getComputedCSS(property);
    if (!value || value === '0px') {
      return done();
    }

    var item = element.view && element.view._repeatItem_;
    if (item) {
      animating.set(item, element);
      setTimeout(function() {
        animating.delete(item);
      });
    }

    // Do the slide
    element.style.overflow = 'hidden';
    element.animate([
      keyValuePair(property, '0px'),
      keyValuePair(property, value)
    ], this.options).onfinish = function() {
      element.style.overflow = '';
      done();
    };
  },

  animateOut: function(element, done) {
    var value = element.getComputedCSS(property);
    if (!value || value === '0px') {
      return done();
    }

    var item = element.view && element.view._repeatItem_;
    if (item) {
      var newElement = animating.get(item);
      if (newElement && newElement.parentNode === element.parentNode) {
        // This item is being removed in one place and added into another. Make it look like its moving by making both
        // elements not visible and having a clone move above the items to the new location.
        element = this.animateMove(element, newElement);
      }
    }

    // Do the slide
    element.style.overflow = 'hidden';
    element.animate([
      keyValuePair(property, value),
      keyValuePair(property, '0px')
    ], this.options).onfinish = function() {
      element.style.overflow = '';
      done();
    };
  },

  animateMove: function(oldElement, newElement) {
    var placeholderElement;
    var parent = newElement.parentNode;
    if (!parent.__slideMoveHandled) {
      parent.__slideMoveHandled = true;
      if (window.getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }
    }

    var origStyle = oldElement.getAttribute('style');
    var style = window.getComputedStyle(oldElement);
    var marginOffsetLeft = -parseInt(style.marginLeft);
    var marginOffsetTop = -parseInt(style.marginTop);
    var oldLeft = oldElement.offsetLeft;
    var oldTop = oldElement.offsetTop;

    placeholderElement = fragments.makeElementAnimatable(oldElement.cloneNode(true));
    placeholderElement.style.width = oldElement.style.width = style.width;
    placeholderElement.style.height = oldElement.style.height = style.height;
    placeholderElement.style.opacity = '0';

    oldElement.style.position = 'absolute';
    oldElement.style.zIndex = 1000;
    parent.insertBefore(placeholderElement, oldElement);
    newElement.style.opacity = '0';

    oldElement.animate([
      { top: oldTop + marginOffsetTop + 'px', left: oldLeft + marginOffsetLeft + 'px' },
      { top: newElement.offsetTop + marginOffsetTop + 'px', left: newElement.offsetLeft + marginOffsetLeft + 'px' }
    ], this.options).onfinish = function() {
      placeholderElement.remove();
      origStyle ? oldElement.setAttribute('style', origStyle) : oldElement.removeAttribute('style');
      newElement.style.opacity = '';
    };

    return placeholderElement;
  }
};

function keyValuePair(key, value) {
  var obj = {};
  obj[key] = value;
  return obj;
}
