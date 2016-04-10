/**
 * Filters an array by the given filter function(s), may provide a function or an array or an object with filtering
 * functions.
 */
module.exports = function(value, filterFunc, value) {
  if (!Array.isArray(value)) {
    return [];
  } else if (!filterFunc) {
    return value;
  }

  if (typeof filterFunc === 'string' && arguments.length > 2) {
    var key = filterFunc;
    filterFunc = function(item) {
      return item && item[key] === value;
    };
  }

  if (typeof filterFunc === 'function') {
    value = value.filter(filterFunc, this);
  } else if (Array.isArray(filterFunc)) {
    filterFunc.forEach(function(func) {
      value = value.filter(func, this);
    });
  } else if (typeof filterFunc === 'object') {
    Object.keys(filterFunc).forEach(function(key) {
      var func = filterFunc[key];
      if (typeof func === 'function') {
        value = value.filter(func, this);
      }
    });
  }
  return value;
};
