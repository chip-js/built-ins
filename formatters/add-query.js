/**
 * Takes the input URL and adds (or replaces) the field in the query.
 * E.g. 'http://example.com?user=default&resource=foo' | addQuery('user', username)
 * Will replace user=default with user={username} where {username} is the value of username.
 */
module.exports = function(value, queryField, queryValue) {
  var url = value || location.href;
  var parts = url.split('?');
  url = parts[0];
  var query = parts[1];
  var addedQuery = '';
  if (queryValue != null) {
    addedQuery = queryField + '=' + encodeURIComponent(queryValue);
  }

  if (query) {
    var expr = new RegExp('\\b' + queryField + '=[^&]*');
    if (expr.test(query)) {
      query = query.replace(expr, addedQuery);
    } else if (addedQuery) {
      query += '&' + addedQuery;
    }
  } else {
    query = addedQuery;
  }
  if (query) {
    url += '?' + query;
  }
  return url;
};
