var urlExp = /(^|\s|\()((https?:\/\/|www\.)([-A-Z0-9]+)+\.\w{2,}[-A-Z0-9+\u0026@#\/%?=()~_|!:,.;]*[-A-Z0-9+\u0026@#\/%=~(_|])/gi;
var localExp = /^\s*(https?:\/\/)?(localhost|127\.0\.0\.1)/gi;
var tagOrContentsExp = /<[^>]+>|[^<]+/g; // Use this to skip over tags by selecting them
var container = document.createElement('div');

/**
 * Adds automatic links to escaped content (be sure to escape user content). Can be used on existing HTML content as it
 * will skip URLs within HTML tags. Passing a value in the second parameter will set the target to that value or
 * `_blank` if the value is `true`.
 */
module.exports = function(value, target) {
  var targetString = '';
  if (typeof target === 'string') {
    targetString = ' target="' + target + '"';
  } else if (target) {
    targetString = ' target="_blank"';
  }

  return ('' + value).replace(tagOrContentsExp, replaceMatch.bind(this, targetString));
};

function replaceMatch(targetString, match) {
  // short-circuit if it's a localhost URL or in a tag
  if (match.charAt(0) === '<' || localExp.test(match)) {
    return match;
  }
  return match.replace(urlExp, function(_, char, url, start) {
    return char + '<a href="' + (start === 'www.' ? 'http://' : '') + url + '"' + targetString + '>' + url + '</a>';
  });
}
