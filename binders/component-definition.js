module.exports = Component;
var ElementController = require('fragments-js/src/element-controller');
var lifecycle = [ 'created', 'bound', 'attached', 'unbound', 'detached' ];


function Component(observations, element, contentTemplate, unwrap) {
  // Extend ElementController https://github.com/chip-js/fragments-js/blob/master/src/element-controller.js
  ElementController.call(this, observations);
  this.observersEnabled = false;
  this.listenersEnabled = false;

  // Add computed, listeners, and properties for each mixin that has it
  this.mixins.forEach(function(mixin) {
    if (mixin.computed) {
      this.addComputed(this.computed);
    }

    if (mixin.listeners) {
      Object.keys(mixin.listeners).forEach(function(eventName) {
        var listener = mixin.listeners[eventName];
        if (typeof listener === 'string') {
          listener = mixin[listener];
        }
        this.listen(this.element, eventName, listener, this);
      }, this);
    }

    // Add properties that get set from attributes
    if (mixin.properties) {
      Object.keys(mixin.properties).forEach(function(propName) {
        var attrName = dashify(propName);
        var Cast = mixin.properties[propName];
        var observer;

        // Set the property to the attribute
        this.watch('element.getAttribute("' + attrName + '")', function(value) {
          // If it is an Object property (vs String/Boolean/Number), we are watching the expression string
          if (Cast === Object) {
            // Clean up the old observer if there was one
            if (observer) {
              observer.close();
            }

            if (value != null) {
              observer = observations.createObserver(value, function(value) {
                this[propName] = value;
              }, this);
              observer.bind(this.element._parentContext);
            }

          // Else we are watching the value
          } else {
            if (Cast === Boolean) {
              if (value === '') {
                value = true;
              } else if (value === null) {
                value = false;
              }
            }
            this[propName] = (value === null) ? null : Cast(value);
          }
        });
      }, this);
    }
  }, this);

  this.element = element;

  if (this.template) {
    this._view = this.template.createView(this.element.ownerDocument);
    if (contentTemplate) {
      this._componentContent = contentTemplate;
    }
  } else if (contentTemplate) {
    this._view = contentTemplate.createView(this.element.ownerDocument);
  }

  if (this._view) {
    if (unwrap) {
      this.element.parentNode.insertBefore(this._view, this.element.nextSibling);
    } else {
      this.element.appendChild(this._view);
    }
  }

  this.created();
}

Component.isComponent = true;

Component.onExtend = function(Class, mixins) {
  Class.prototype.mixins = Class.prototype.mixins.concat(mixins);

  // They will get called via mixins, don't let them override the original methods. To truely override you can define
  // them after using Class.extend on a component.
  lifecycle.forEach(function(method) {
    delete Class.prototype[method];
  });
};

ElementController.extend(Component, {
  mixins: [],

  get view() {
    return this._view;
  },

  created: function() {
    callOnMixins(this, this.mixins, 'created', arguments);
  },

  bound: function() {
    this.observersEnabled = true;
    callOnMixins(this, this.mixins, 'bound', arguments);
    if (this._view) {
      this._view.bind(this.template ? this : this.element._parentContext);
    }
  },

  attached: function() {
    this.listenersEnabled = true;

    callOnMixins(this, this.mixins, 'attached', arguments);
    if (this._view) {
      this._view.attached();
    }
  },

  unbound: function() {
    callOnMixins(this, this.mixins, 'unbound', arguments);
    if (this._view) {
      this._view.unbind();
    }
    this.observersEnabled = false;
  },

  detached: function() {
    this.listenersEnabled = false;
    callOnMixins(this, this.mixins, 'detached', arguments);
    if (this._view) {
      this._view.detached();
    }
  }

});


// Calls the method by name on any mixins that have it defined
function callOnMixins(context, mixins, name, args) {
  mixins.forEach(function(mixin) {
    if (typeof mixin[name] === 'function') mixin[name].apply(context, args);
  });
}

function dashify(str) {
  return str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
            .replace(/([a-z\d])([A-Z])/g, '$1-$2')
            .toLowerCase();
}
