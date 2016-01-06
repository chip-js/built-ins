/**
 * Adds all built-in animations with default names
 */
module.exports = function(fragments) {
  if (!fragments || typeof fragments.registerAnimation !== 'function') {
    throw new TypeError('formatters requires an instance of fragments to register with');
  }

  fragments.registerAnimation('fade', require('./fade')());
  fragments.registerAnimation('slide', require('./slide')());
  fragments.registerAnimation('slide-h', require('./slide-horizontal')());
  fragments.registerAnimation('slide-move', require('./slide-move')(fragments));
  fragments.registerAnimation('slide-move-h', require('./slide-move-horizontal')(fragments));
};
