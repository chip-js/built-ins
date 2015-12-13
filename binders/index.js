/**
 * Adds all built-in binders with bracket-like names
 */
exports.bracketed = function(fragments) {
  if (!fragments || typeof fragments.registerAttribute !== 'function') {
    throw new TypeError('formatters requires an instance of fragments to register with');
  }

  fragments.registerAttribute('#*', require('./ref'));
  fragments.registerAttribute('[.*]', require('./classes'));
  fragments.registerAttribute('[if]', require('./if')('[else-if]', '[else]', '[unless]', '[else-unless]'));
  fragments.registerAttribute('[repeat]', require('./repeat'));
};
