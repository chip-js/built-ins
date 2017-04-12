var urlExp = /(^|\s|\()((?:https?|ftp):\/\/[\-A-Z0-9+\u0026@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~(_|])/gi;
var wwwExp = /(^|[^\/])(www\.[\-A-Z0-9]+\.\w{2,}(\b|$)([\-A-Z0-9+\u0026@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~(_|])?)/gi;
var localExp = /^\s*((https?|ftp):\/\/)?(localhost|127\.0\.0\.1)/gi;

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

  return ('' + value).replace(/<[^>]+>|[^<]+/g, replaceMatch.bind(this, targetString));
};

function replaceMatch(targetString, match) {
  // short-circuit if it's a localhost URL or in a tag
  if (match.charAt(0) === '<' || localExp.test(match)) {
    return match;
  }
  var replacedText = match.replace(urlExp, '$1<a href="$2"' + targetString + '>$2</a>');
  return replacedText.replace(wwwExp, '$1<a href="http://$2"' + targetString + '>$2</a>');
}
