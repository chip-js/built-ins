/**
 * if, unless, else-if, else-unless, else
 * A binder init function that creates a binder that shows or hides the element if the value is truthy or falsey.
 * Actually removes the element from the DOM when hidden, replacing it with a non-visible placeholder and not needlessly
 * executing bindings inside. Pass in the configuration values for the corresponding partner attributes for unless and
 * else, etc.
 */
module.exports = function(elseIfAttrName, elseAttrName, unlessAttrName, elseUnlessAttrName) {
  return {
    animated: true,
    priority: 150,

    compiled: function() {
      var element = this.element;
      var expressions = [ wrapIfExp(this.expression, this.name === unlessAttrName) ];
      var placeholder = document.createTextNode('');
      var node = element.nextElementSibling;
      this.element = placeholder;
      element.parentNode.replaceChild(placeholder, element);

      // Stores a template for all the elements that can go into this spot
      this.templates = [ this.fragments.createTemplate(element) ];

      // Pull out any other elements that are chained with this one
      while (node) {
        var next = node.nextElementSibling;
        var expression;
        if (node.hasAttribute(elseIfAttrName)) {
          expression = this.fragments.codifyExpression('attribute', node.getAttribute(elseIfAttrName), true);
          expressions.push(wrapIfExp(expression, false));
          node.removeAttribute(elseIfAttrName);
        } else if (node.hasAttribute(elseUnlessAttrName)) {
          expression = this.fragments.codifyExpression('attribute', node.getAttribute(elseUnlessAttrName), true);
          expressions.push(wrapIfExp(expression, true));
          node.removeAttribute(elseUnlessAttrName);
        } else if (node.hasAttribute(elseAttrName)) {
          node.removeAttribute(elseAttrName);
          next = null;
        } else {
          break;
        }

        node.remove();
        this.templates.push(this.fragments.createTemplate(node));
        node = next;
      }

      // An expression that will return an index. Something like this `expr ? 0 : expr2 ? 1 : expr3 ? 2 : 3`. This will
      // be used to know which section to show in the if/else-if/else grouping.
      this.expression = expressions.map(function(expr, index) {
        return expr + ' ? ' + index + ' : ';
      }).join('') + expressions.length;
    },

    updated: function(index) {
      // For performance provide an alternate code path for animation
      if (this.animate && this.context && !this.firstUpdate) {
        this.updatedAnimated(index);
      } else {
        this.updatedRegular(index);
      }
      this.firstUpdate = false;
    },

    attached: function() {
      if (this.showing) {
        this.showing.attached();
      }
    },

    detached: function() {
      if (this.showing) {
        this.showing.detached();
      }
    },

    add: function(view) {
      view.bind(this.context);
      this.element.parentNode.insertBefore(view, this.element.nextSibling);
      view.attached();
    },

    // Doesn't do much, but allows sub-classes to alter the functionality.
    remove: function(view) {
      view.dispose();
    },

    updatedRegular: function(index) {
      this.animating = false;

      if (this.showing) {
        this.remove(this.showing);
        this.showing = null;
      }
      var template = this.templates[index];
      if (template) {
        this.showing = template.createView();
        this.add(this.showing);
      }
    },

    updatedAnimated: function(index) {
      this.lastValue = index;
      if (this.animating) {
        if (this.showing) {
          // Obsoleted, will change after animation is finished.
          this.showing.unbind();
        }
        return;
      }

      if (this.showing) {
        this.animating = true;
        this.showing.unbind();
        this.animateOut(this.showing, function() {
          if (this.animating) {
            this.animating = false;

            if (this.showing) {
              // Make sure this wasn't unbound while we were animating (e.g. by a parent `if` that doesn't animate)
              this.remove(this.showing);
              this.showing = null;
            }

            if (this.context) {
              // finish by animating the new element in (if any), unless no longer bound
              this.updatedAnimated(this.lastValue);
            }
          }
        });
        return;
      }

      var template = this.templates[index];
      if (template) {
        this.showing = template.createView();
        this.add(this.showing);
        this.animating = true;
        this.animateIn(this.showing, function() {
          if (this.animating) {
            setTimeout(function() {
              this.animating = false;
              // if the value changed while this was animating run it again
              if (this.lastValue !== index) {
                  this.updatedAnimated(this.lastValue);
              }
            }.bind(this));
          }
        });
      }
    },

    bound: function() {
      this.firstUpdate = true;
    },

    unbound: function() {
      if (this.showing) {
        this.showing.unbind();
      }
      this.lastValue = null;
      this.animating = false;
    }
  };
};

function wrapIfExp(expr, isUnless) {
  if (isUnless) {
    return '!(' + expr + ')';
  } else {
    return expr;
  }
}
