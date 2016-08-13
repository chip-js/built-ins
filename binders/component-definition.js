module.exports = Component;
var ObservableHash = require('observations-js').ObservableHash;
var lifecycle = [ 'created', 'bound', 'attached', 'unbound', 'detached' ];


function Component(observations, element, contentTemplate, unwrap) {
  ObservableHash.call(this, observations);
  this.observersEnabled = false;

  Object.defineProperties(this, {
    _listeners: { configurable: true, value: [] }
  });

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
  }, this);

  this.element = element;

  if (this.template) {
    this._view = this.template.createView();
    if (contentTemplate) {
      this._componentContent = contentTemplate;
    }
  } else if (contentTemplate) {
    this._view = contentTemplate.createView();
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

ObservableHash.extend(Component, {
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
    callOnMixins(this, this.mixins, 'attached', arguments);
    if (this._view) {
      this._view.attached();
    }

    this._listeners.forEach(function(item) {
      item.targetRef = addListener(this, item.target, item.eventName, item.listener);
    }, this);
  },

  unbound: function() {
    this._listeners.forEach(function(item) {
      removeListener(item.targetRef, item.eventName, item.listener);
      delete item.targetRef;
    }, this);

    callOnMixins(this, this.mixins, 'unbound', arguments);
    if (this._view) {
      this._view.unbind();
    }
    this.observersEnabled = false;
  },

  detached: function() {
    callOnMixins(this, this.mixins, 'detached', arguments);
    if (this._view) {
      this._view.detached();
    }
  },


  listen: function(target, eventName, listener, context) {
    if (typeof target === 'string') {
      context = listener;
      listener = eventName;
      eventName = target;
      target = this.element;
    }

    if (typeof listener !== 'function') {
      throw new TypeError('listener must be a function');
    }

    listener = listener.bind(context || this);

    var listenerData = {
      target: target,
      eventName: eventName,
      listener: listener,
      targetRef: null
    };

    this._listeners.push(listenerData);

    if (this._bound) {
      // If not bound will add on attachment
      listenerData.targetRef = addListener(this, target, eventName, listener);
    }
  },

});


function getTarget(component, target) {
  if (typeof target === 'string') {
    target = component[target] || component.element.querySelector(target);
  }
  return target;
}

function addListener(component, target, eventName, listener) {
  if ((target = getTarget(component, target))) {
    target.addEventListener(eventName, listener);
    return target;
  }
}

function removeListener(target, eventName, listener) {
  target.removeEventListener(eventName, listener);
}


// Calls the method by name on any mixins that have it defined
function callOnMixins(context, mixins, name, args) {
  mixins.forEach(function(mixin) {
    if (typeof mixin[name] === 'function') mixin[name].apply(context, args);
  });
}
