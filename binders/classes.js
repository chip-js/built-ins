/**
 * A binder that adds classes to an element dependent on whether the expression is true or false.
 */
module.exports = function() {
  return handleClass;
};

function handleClass(value) {
  if (value) {
    this.element.classList.add(this.match);
  } else {
    this.element.classList.remove(this.match);
  }
}
