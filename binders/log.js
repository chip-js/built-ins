/**
 * A binder that prints out the value of the expression to the console.
 */
module.exports = function() {
  return {
    priority: 60,
    updated: function(value) {
      /*eslint-disable no-console */
      console.log('%cDebug: %c' + this.expression, 'color:blue;font-weight:bold', 'color:#DF8138', '=', value);
      /*eslint-enable */
    }
  };
};
