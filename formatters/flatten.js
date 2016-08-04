/**
 * Flattens an array of arrays into a single array
 */
module.exports = function(value) {
  return Array.isArray(value) ? flatten(value, []) : [];
};

function flatten(array, output) {
  for (var i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      flatten(array[i], output);
    } else {
      output.push(array[i]);
    }
  }
  return output;
}
