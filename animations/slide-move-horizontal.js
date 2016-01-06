/**
 * Move items left and right in a list
 */
module.exports = function(fragments, options) {
  if (!options) options = {};
  if (!options.property) options.property = 'width';
  return require('./slide-move')(fragments, options);
};
