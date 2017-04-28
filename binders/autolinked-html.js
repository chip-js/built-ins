/**
 * A binder that displays unescaped HTML inside an element and adds autolinks to the content. This is safer than the
 * formatter. As with the HTML binder, be sure the content is trusted! This should be used with formatters which create
 * HTML from something safe.
 */
module.exports = function() {
  return html;
};

function html(value) {
  this.element.innerHTML = (value == null ? '' : value);
  autolink(this.element);
}

var urlExp = /(^|\s|\()((https?:\/\/|www\.)([\-A-Z0-9]+)+\.\w{2,}[\-A-Z0-9+\u0026@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~(_|])/gi
var localExp = /^\s*(https?:\/\/)?(localhost|127\.0\.0\.1)/gi;
var ignoreTags = { A: true, PRE: true, CODE: true, TEXTAREA: true };

function autolink(element) {
  var doc = element.ownerDocument;
  var walker = createWalker(element);
  var node, match;

  // Go through each text node (not inside an ignored tag) and find urls
  while ((node = walker.nextNode())) {
    var content = node.nodeValue;
    if (match = urlExp.exec(content)) {
      var parent = node.parentNode;
      var nextSibling = node.nextSibling;
      var start = urlExp.lastIndex - match[2].length;
      var end = urlExp.lastIndex;
      var url = content.slice(start, end);
      node.nodeValue = content.slice(0, start);
      var anchor = doc.createElement('a');
      anchor.target = '_blank';
      anchor.href = (match[1] === 'www.' ? 'http://' : '') + url;
      anchor.appendChild(doc.createTextNode(url));
      parent.insertBefore(anchor, nextSibling);
      if (end < content.length) {
        parent.insertBefore(doc.createTextNode(content.slice(end)));
      }
      urlExp.lastIndex = 0;
    }
  }
}


function createWalker(element) {
  // Only process text nodes that are not inside any of the above ignored tags
  return element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return NodeFilter.FILTER_ACCEPT;
      } else if (ignoreTags[node.nodeName]) {
        return NodeFilter.FILTER_REJECT;
      } else {
        return NodeFilter.FILTER_SKIP;
      }
    }
  });
}
