/**
 * Move items left and right in a list
 */
module.exports = function(options) {
  if (!options) options = {};
  if (!options.property) options.property = 'width';
  return require('./slide-move')(options);
};
