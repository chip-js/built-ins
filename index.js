
exports.registerDefaults = function(fragments) {
  require('./animations')(fragments);
  require('./binders')(fragments);
  require('./formatters')(fragments);
};
