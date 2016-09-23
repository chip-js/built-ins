var utils = require('./utils');
var animating = new Map();

/**
 * Move items up and down in a list
 */
module.exports = function(options) {
  if (!options) options = {};
  if (!options.duration) options.duration = 250;
  if (!options.easing) options.easing = 'ease-in-out';
  if (!options.property) options.property = 'height';

  return {
    options: options,

    animateIn: function(element, done) {
      var item = element.view && element.view._repeatItem_;
      if (item) {
        animating.set(item, element);
        setTimeout(function() {
          animating.delete(item);
        });
      }

      var transition = utils.getTransitionIn(element, this.options.property, this.options);
      element.style.overflow = 'hidden';

      element.animate(transition.states, transition.options).onfinish = function() {
        element.style.overflow = '';
        done();
      };
    },

    animateOut: function(element, done) {
      var item = element.view && element.view._repeatItem_;
      if (item) {
        var newElement = animating.get(item);
        if (newElement && newElement.parentNode === element.parentNode) {
          // This item is being removed in one place and added into another. Make it look like its moving by making both
          // elements not visible and having a clone move above the items to the new location.
          this.animateMove(element, newElement);
        }
      }

      var transition = utils.getTransitionOut(element, this.options.property, this.options);
      element.style.overflow = 'hidden';

      element.animate(transition.states, transition.options).onfinish = function() {
        element.style.overflow = '';
        done();
      };
    },

    animateMove: function(oldElement, newElement) {
      var moveElement, options = this.options;
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
      moveElement = this.fragments.makeElementAnimatable(oldElement.cloneNode(true));
      var savePositionElem = document.createTextNode('');
      parent.replaceChild(savePositionElem, oldElement);

      // Ensure all the moves have been processed
      Promise.resolve().then(function() {
        var newLeft = newElement.offsetLeft;
        var newTop = newElement.offsetTop;

        // Again, ensure all the new positions have been set before adding things back in
        Promise.resolve().then(function() {
          parent.replaceChild(oldElement, savePositionElem);
          oldElement.style.opacity = '0';
          newElement.style.opacity = '0';

          moveElement.style.width = style.width;
          moveElement.style.height = style.height;
          moveElement.style.position = 'absolute';
          moveElement.classList.remove('animate-out');
          moveElement.classList.add('animate-move');
          // Put at the end so it appears on top as it moves (when other elements have position: relative)
          parent.appendChild(moveElement);

          moveElement.animate([
            { top: oldTop + marginOffsetTop + 'px', left: oldLeft + marginOffsetLeft + 'px' },
            { top: newTop + marginOffsetTop + 'px', left: newLeft + marginOffsetLeft + 'px' }
          ], options).onfinish = function() {
            moveElement.remove();
            oldElement.style.opacity = '';
            newElement.style.opacity = '';
          };
        });
      });
    }
  };
};
