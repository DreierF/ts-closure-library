import * as googasserts from './../asserts/asserts.js';
import * as functions from './../functions/functions.js';
import * as google from './../google.js';
import {SafeHtml as Html_SafeHtml} from './../html/safehtml.js';
import {SafeScript} from './../html/safescript.js';
import {SafeStyle} from './../html/safestyle.js';
import {SafeUrl as Html_SafeUrl} from './../html/safeurl.js';
import {TrustedResourceUrl} from './../html/trustedresourceurl.js';
import * as uncheckedconversions from './../html/uncheckedconversions.js';
import {Const} from './../string/const.js';
import * as internal from './../string/internal.js';
import * as asserts from './asserts.js';
// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Type-safe wrappers for unsafe DOM APIs.
 *
 * This file provides type-safe wrappers for DOM APIs that can result in
 * cross-site scripting (XSS) vulnerabilities, if the API is supplied with
 * untrusted (attacker-controlled) input.  Instead of plain strings, the type
 * safe wrappers consume values of types from the google.html package whose
 * contract promises that values are safe to use in the corresponding context.
 *
 * Hence, a program that exclusively uses the wrappers in this file (i.e., whose
 * only reference to security-sensitive raw DOM APIs are in this file) is
 * guaranteed to be free of XSS due to incorrect use of such DOM APIs (modulo
 * correctness of code that produces values of the respective google.html types,
 * and absent code that violates type safety).
 *
 * For example, assigning to an element's .innerHTML property a string that is
 * derived (even partially) from untrusted input typically results in an XSS
 * vulnerability. The type-safe wrapper setInnerHtml consumes a
 * value of type Html_SafeHtml, whose contract states that using its values
 * in a HTML context will not result in XSS. Hence a program that is free of
 * direct assignments to any element's innerHTML property (with the exception of
 * the assignment to .innerHTML in this file) is guaranteed to be free of XSS
 * due to assignment of untrusted strings to the innerHTML property.
 */

/** @enum {string} */
let InsertAdjacentHtmlPosition = {
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend'
};

/**
 * Inserts known-safe HTML into a Node, at the specified position.
 * @param {!Node} node The node on which to call insertAdjacentHTML.
 * @param {!InsertAdjacentHtmlPosition} position Position where
 *     to insert the HTML.
 * @param {!Html_SafeHtml} html The known-safe HTML to insert.
 */
function insertAdjacentHtml(node, position, html) {
  node.insertAdjacentHTML(position, Html_SafeHtml.unwrapTrustedHTML(html));
};

/**
 * Tags not allowed in setInnerHtml.
 * @private @const {!Object<string, boolean>}
 */
let SET_INNER_HTML_DISALLOWED_TAGS_ = {
  'MATH': true,
  'SCRIPT': true,
  'STYLE': true,
  'SVG': true,
  'TEMPLATE': true
};

/**
 * Whether assigning to innerHTML results in a non-spec-compliant clean-up. Used
 * to define unsafeSetInnerHtmlDoNotUseOrElse.
 *
 * <p>As mentioned in https://stackoverflow.com/questions/28741528, re-rendering
 * an element in IE by setting innerHTML causes IE to recursively disconnect all
 * parent/children connections that were in the previous contents of the
 * element. Unfortunately, this can unexpectedly result in confusing cases where
 * a function is run (typically asynchronously) on element that has since
 * disconnected from the DOM but assumes the presence of its children. A simple
 * workaround is to remove all children first. Testing on IE11 via
 * https://jsperf.com/innerhtml-vs-removechild/239, removeChild seems to be
 * ~10x faster than innerHTML='' for a large number of children (perhaps due
 * to the latter's recursive behavior), implying that this workaround would
 * not hurt performance and might actually improve it.
 * @return {boolean}
 * @private
 */
let isInnerHtmlCleanupRecursive_ =
    functions.cacheReturnValue(function() {
      // `document` missing in some test frameworks.
      if (google.DEBUG && typeof document === 'undefined') {
        return false;
      }
      // Create 3 nested <div>s without using innerHTML.
      // We're not chaining the appendChilds in one call,  as this breaks
      // in a DocumentFragment.
      var div = document.createElement('div');
      var childDiv = document.createElement('div');
      childDiv.appendChild(document.createElement('div'));
      div.appendChild(childDiv);
      // `firstChild` is null in Google Js Test.
      if (google.DEBUG && !div.firstChild) {
        return false;
      }
      var innerChild = div.firstChild.firstChild;
      div.innerHTML =
          Html_SafeHtml.unwrapTrustedHTML(Html_SafeHtml.EMPTY);
      return !innerChild.parentElement;
    });

/**
 * Assigns HTML to an element's innerHTML property. Helper to use only here and
 * in soy.js.
 * @param {?Element} elem The element whose innerHTML is to be assigned to.
 * @param {!Html_SafeHtml} html
 */
function unsafeSetInnerHtmlDoNotUseOrElse(elem, html) {
  // See comment above isInnerHtmlCleanupRecursive_.
  if (isInnerHtmlCleanupRecursive_()) {
    while (elem.lastChild) {
      elem.removeChild(elem.lastChild);
    }
  }
  elem.innerHTML = Html_SafeHtml.unwrapTrustedHTML(html);
};

/**
 * Assigns known-safe HTML to an element's innerHTML property.
 * @param {!Element} elem The element whose innerHTML is to be assigned to.
 * @param {!Html_SafeHtml} html The known-safe HTML to assign.
 * @throws {Error} If called with one of these tags: math, script, style, svg,
 *     template.
 */
function setInnerHtml(elem, html) {
  if (googasserts.ENABLE_ASSERTS) {
    var tagName = elem.tagName.toUpperCase();
    if (SET_INNER_HTML_DISALLOWED_TAGS_[tagName]) {
      throw new Error(
          'goog.dom.safe.setInnerHtml cannot be used to set content of ' +
          elem.tagName + '.');
    }
  }

  unsafeSetInnerHtmlDoNotUseOrElse(elem, html);
};

/**
 * Assigns known-safe HTML to an element's outerHTML property.
 * @param {!Element} elem The element whose outerHTML is to be assigned to.
 * @param {!Html_SafeHtml} html The known-safe HTML to assign.
 */
function setOuterHtml(elem, html) {
  elem.outerHTML = Html_SafeHtml.unwrapTrustedHTML(html);
};

/**
 * Safely assigns a URL a form element's action property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * form's action property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setFormElementAction(formEl, url);
 * which is a safe alternative to
 *   formEl.action = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!Element} form The form element whose action property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setFormElementAction(form, url) {
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  asserts.assertIsHTMLFormElement(form).action =
      Html_SafeUrl.unwrap(safeUrl);
};

/**
 * Safely assigns a URL to a button element's formaction property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * button's formaction property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setButtonFormAction(buttonEl, url);
 * which is a safe alternative to
 *   buttonEl.action = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!Element} button The button element whose action property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setButtonFormAction(button, url) {
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  asserts.assertIsHTMLButtonElement(button).formAction =
      Html_SafeUrl.unwrap(safeUrl);
};
/**
 * Safely assigns a URL to an input element's formaction property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * input's formaction property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setInputFormAction(inputEl, url);
 * which is a safe alternative to
 *   inputEl.action = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!Element} input The input element whose action property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setInputFormAction(input, url) {
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  asserts.assertIsHTMLInputElement(input).formAction =
      Html_SafeUrl.unwrap(safeUrl);
};

/**
 * Sets the given element's style property to the contents of the provided
 * SafeStyle object.
 * @param {!Element} elem
 * @param {!SafeStyle} style
 */
function setStyle(elem, style) {
  elem.style.cssText = SafeStyle.unwrap(style);
};

/**
 * Writes known-safe HTML to a document.
 * @param {!Document} doc The document to be written to.
 * @param {!Html_SafeHtml} html The known-safe HTML to assign.
 */
function documentWrite(doc, html) {
  doc.write(Html_SafeHtml.unwrapTrustedHTML(html));
};

/**
 * Safely assigns a URL to an anchor element's href property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * anchor's href property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setAnchorHref(anchorEl, url);
 * which is a safe alternative to
 *   anchorEl.href = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!HTMLAnchorElement} anchor The anchor element whose href property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setAnchorHref(anchor, url) {
  asserts.assertIsHTMLAnchorElement(anchor);
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  anchor.href = Html_SafeUrl.unwrap(safeUrl);
};

/**
 * Safely assigns a URL to an image element's src property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * image's src property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * @param {!HTMLImageElement} imageElement The image element whose src property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setImageSrc(imageElement, url) {
  asserts.assertIsHTMLImageElement(imageElement);
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    var allowDataUrl = /^data:image\//i.test(url);
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url, allowDataUrl);
  }
  imageElement.src = Html_SafeUrl.unwrap(safeUrl);
};

/**
 * Safely assigns a URL to a audio element's src property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * audio's src property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * @param {!HTMLAudioElement} audioElement The audio element whose src property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setAudioSrc(audioElement, url) {
  asserts.assertIsHTMLAudioElement(audioElement);
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    var allowDataUrl = /^data:audio\//i.test(url);
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url, allowDataUrl);
  }
  audioElement.src = Html_SafeUrl.unwrap(safeUrl);
};

/**
 * Safely assigns a URL to a video element's src property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * video's src property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * @param {!HTMLVideoElement} videoElement The video element whose src property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setVideoSrc(videoElement, url) {
  asserts.assertIsHTMLVideoElement(videoElement);
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    var allowDataUrl = /^data:video\//i.test(url);
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url, allowDataUrl);
  }
  videoElement.src = Html_SafeUrl.unwrap(safeUrl);
};

/**
 * Safely assigns a URL to an embed element's src property.
 *
 * Example usage:
 *   setEmbedSrc(embedEl, url);
 * which is a safe alternative to
 *   embedEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLEmbedElement} embed The embed element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
function setEmbedSrc(embed, url) {
  asserts.assertIsHTMLEmbedElement(embed);
  embed.src = TrustedResourceUrl.unwrapTrustedScriptURL(url);
};

/**
 * Safely assigns a URL to a frame element's src property.
 *
 * Example usage:
 *   setFrameSrc(frameEl, url);
 * which is a safe alternative to
 *   frameEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLFrameElement} frame The frame element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
function setFrameSrc(frame, url) {
  asserts.assertIsHTMLFrameElement(frame);
  frame.src = TrustedResourceUrl.unwrap(url);
};

/**
 * Safely assigns a URL to an iframe element's src property.
 *
 * Example usage:
 *   setIframeSrc(iframeEl, url);
 * which is a safe alternative to
 *   iframeEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLIFrameElement} iframe The iframe element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
function setIframeSrc(iframe, url) {
  asserts.assertIsHTMLIFrameElement(iframe);
  iframe.src = TrustedResourceUrl.unwrap(url);
};

/**
 * Safely assigns HTML to an iframe element's srcdoc property.
 *
 * Example usage:
 *   setIframeSrcdoc(iframeEl, safeHtml);
 * which is a safe alternative to
 *   iframeEl.srcdoc = html;
 * The latter can result in loading untrusted code.
 *
 * @param {!HTMLIFrameElement} iframe The iframe element whose srcdoc property
 *     is to be assigned to.
 * @param {!Html_SafeHtml} html The HTML to assign.
 */
function setIframeSrcdoc(iframe, html) {
  asserts.assertIsHTMLIFrameElement(iframe);
  iframe.srcdoc = Html_SafeHtml.unwrapTrustedHTML(html);
};

/**
 * Safely sets a link element's href and rel properties. Whether or not
 * the URL assigned to href has to be a TrustedResourceUrl
 * depends on the value of the rel property. If rel contains "stylesheet"
 * then a TrustedResourceUrl is required.
 *
 * Example usage:
 *   setLinkHrefAndRel(linkEl, url, 'stylesheet');
 * which is a safe alternative to
 *   linkEl.rel = 'stylesheet';
 *   linkEl.href = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLLinkElement} link The link element whose href property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl|!TrustedResourceUrl} url The URL
 *     to assign to the href property. Must be a TrustedResourceUrl if the
 *     value assigned to rel contains "stylesheet". A string value is
 *     sanitized with Html_SafeUrl.sanitize.
 * @param {string} rel The value to assign to the rel property.
 * @throws {Error} if rel contains "stylesheet" and url is not a
 *     TrustedResourceUrl
 * @see Html_SafeUrl#sanitize
 */
function setLinkHrefAndRel(link, url, rel) {
  asserts.assertIsHTMLLinkElement(link);
  link.rel = rel;
  if (internal.caseInsensitiveContains(rel, 'stylesheet')) {
    googasserts.assert(
        url instanceof TrustedResourceUrl,
        'URL must be TrustedResourceUrl because "rel" contains "stylesheet"');
    link.href = TrustedResourceUrl.unwrap(url);
  } else if (url instanceof TrustedResourceUrl) {
    link.href = TrustedResourceUrl.unwrap(url);
  } else if (url instanceof Html_SafeUrl) {
    link.href = Html_SafeUrl.unwrap(url);
  } else {  // string
    // SafeUrl.sanitize must return legitimate SafeUrl when passed a string.
    link.href = Html_SafeUrl.unwrap(
        Html_SafeUrl.sanitizeAssertUnchanged(url));
  }
};

/**
 * Safely assigns a URL to an object element's data property.
 *
 * Example usage:
 *   setObjectData(objectEl, url);
 * which is a safe alternative to
 *   objectEl.data = url;
 * The latter can result in loading untrusted code unless setit is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLObjectElement} object The object element whose data property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
function setObjectData(object, url) {
  asserts.assertIsHTMLObjectElement(object);
  object.data = TrustedResourceUrl.unwrapTrustedScriptURL(url);
};

/**
 * Safely assigns a URL to a script element's src property.
 *
 * Example usage:
 *   setScriptSrc(scriptEl, url);
 * which is a safe alternative to
 *   scriptEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLScriptElement} script The script element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
function setScriptSrc(script, url) {
  asserts.assertIsHTMLScriptElement(script);
  script.src = TrustedResourceUrl.unwrapTrustedScriptURL(url);

  // If CSP nonces are used, propagate them to dynamically created scripts.
  // This is necessary to allow nonce-based CSPs without 'strict-dynamic'.
  var nonce = google.getScriptNonce();
  if (nonce) {
    script.setAttribute('nonce', nonce);
  }
};

/**
 * Safely assigns a value to a script element's content.
 *
 * Example usage:
 *   setScriptContent(scriptEl, content);
 * which is a safe alternative to
 *   scriptEl.text = content;
 * The latter can result in executing untrusted code unless it is ensured that
 * the code is loaded from a trustworthy resource.
 *
 * @param {!HTMLScriptElement} script The script element whose content is being
 *     set.
 * @param {!SafeScript} content The content to assign.
 */
function setScriptContent(script, content) {
  asserts.assertIsHTMLScriptElement(script);
  script.text = SafeScript.unwrapTrustedScript(content);

  // If CSP nonces are used, propagate them to dynamically created scripts.
  // This is necessary to allow nonce-based CSPs without 'strict-dynamic'.
  var nonce = google.getScriptNonce();
  if (nonce) {
    script.setAttribute('nonce', nonce);
  }
};

/**
 * Safely assigns a URL to a Location object's href property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * loc's href property.  If url is of type string however, it is first sanitized
 * using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setLocationHref(document.location, redirectUrl);
 * which is a safe alternative to
 *   document.location.href = redirectUrl;
 * The latter can result in XSS vulnerabilities if redirectUrl is a
 * user-/attacker-controlled value.
 *
 * @param {!Location} loc The Location object whose href property is to be
 *     assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function setLocationHref(loc, url) {
  asserts.assertIsLocation(loc);
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  loc.href = Html_SafeUrl.unwrap(safeUrl);
};

/**
 * Safely assigns the URL of a Location object.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and
 * passed to Location#assign. If url is of type string however, it is
 * first sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   assignLocation(document.location, newUrl);
 * which is a safe alternative to
 *   document.location.assign(newUrl);
 * The latter can result in XSS vulnerabilities if newUrl is a
 * user-/attacker-controlled value.
 *
 * This has the same behaviour as setLocationHref, however some test
 * mock Location.assign instead of a property assignment.
 *
 * @param {!Location} loc The Location object which is to be assigned.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function assignLocation(loc, url) {
  asserts.assertIsLocation(loc);
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  loc.assign(Html_SafeUrl.unwrap(safeUrl));
};

/**
 * Safely replaces the URL of a Location object.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and
 * passed to Location#replace. If url is of type string however, it is
 * first sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   replaceLocation(document.location, newUrl);
 * which is a safe alternative to
 *   document.location.replace(newUrl);
 * The latter can result in XSS vulnerabilities if newUrl is a
 * user-/attacker-controlled value.
 *
 * @param {!Location} loc The Location object which is to be replaced.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
function replaceLocation(loc, url) {
  asserts.assertIsLocation(loc);
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  loc.replace(Html_SafeUrl.unwrap(safeUrl));
};

/**
 * Safely opens a URL in a new window (via window.open).
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and passed in to
 * window.open.  If url is of type string however, it is first sanitized
 * using Html_SafeUrl.sanitize.
 *
 * Note that this function does not prevent leakages via the referer that is
 * sent by window.open. It is advised to only use this to open 1st party URLs.
 *
 * Example usage:
 *   openInWindow(url);
 * which is a safe alternative to
 *   window.open(url);
 * The latter can result in XSS vulnerabilities if redirectUrl is a
 * user-/attacker-controlled value.
 *
 * @param {string|!Html_SafeUrl} url The URL to open.
 * @param {Window=} opt_openerWin Window of which to call the .open() method.
 *     Defaults to the global window.
 * @param {!Const=} opt_name Name of the window to open in. Can be
 *     _top, etc as allowed by window.open().
 * @param {string=} opt_specs Comma-separated list of specifications, same as
 *     in window.open().
 * @param {boolean=} opt_replace Whether to replace the current entry in browser
 *     history, same as in window.open().
 * @return {Window} Window the url was opened in.
 */
function openInWindow(
    url, opt_openerWin, opt_name, opt_specs, opt_replace) {
  /** @type {!Html_SafeUrl} */
  var safeUrl;
  if (url instanceof Html_SafeUrl) {
    safeUrl = url;
  } else {
    safeUrl = Html_SafeUrl.sanitizeAssertUnchanged(url);
  }
  var win = opt_openerWin || window;
  return win.open(
      Html_SafeUrl.unwrap(safeUrl),
      // If opt_name is undefined, simply passing that in to open() causes IE to
      // reuse the current window instead of opening a new one. Thus we pass ''
      // in instead, which according to spec opens a new window. See
      // https://html.spec.whatwg.org/multipage/browsers.html#dom-open .
      opt_name ? Const.unwrap(opt_name) : '', opt_specs,
      opt_replace);
};

/**
 * Parses the HTML as 'text/html'.
 * @param {!DOMParser} parser
 * @param {!Html_SafeHtml} html The HTML to be parsed.
 * @return {?Document}
 */
function parseFromStringHtml(parser, html) {
  return parseFromString(parser, html, 'text/html');
};

/**
 * Parses the string.
 * @param {!DOMParser} parser
 * @param {!Html_SafeHtml} content Note: We don't have a special type for
 *     XML od SVG supported by this function so we use SafeHtml.
 * @param {string} type
 * @return {?Document}
 */
function parseFromString(parser, content, type) {
  return parser.parseFromString(
      Html_SafeHtml.unwrapTrustedHTML(content), type);
};

/**
 * Safely creates an HTMLImageElement from a Blob.
 *
 * Example usage:
 *     createImageFromBlob(blob);
 * which is a safe alternative to
 *     image.src = createObjectUrl(blob)
 * The latter can result in executing malicious same-origin scripts from a bad
 * Blob.
 * @param {!Blob} blob The blob to create the image from.
 * @return {!HTMLImageElement} The image element created from the blob.
 * @throws {!Error} If called with a Blob with a MIME type other than image/.*.
 */
function createImageFromBlob(blob) {
  // Any image/* MIME type is accepted as safe.
  if (!/^image\/.*/g.test(blob.type)) {
    throw new Error(
        'goog.dom.safe.createImageFromBlob only accepts MIME type image/.*.');
  }
  var objectUrl = window.URL.createObjectURL(blob);
  var image = new window.Image();
  image.onload = function() {
    window.URL.revokeObjectURL(objectUrl);
  };
  setImageSrc(
      image,
      uncheckedconversions
          .safeUrlFromStringKnownToSatisfyTypeContract(
              Const.from('Image blob URL.'), objectUrl));
  return image;
};

export {InsertAdjacentHtmlPosition, assignLocation, createImageFromBlob, documentWrite, insertAdjacentHtml, openInWindow, parseFromString, parseFromStringHtml, replaceLocation, setAnchorHref, setAudioSrc, setButtonFormAction, setEmbedSrc, setFormElementAction, setFrameSrc, setIframeSrc, setIframeSrcdoc, setImageSrc, setInnerHtml, setInputFormAction, setLinkHrefAndRel, setLocationHref, setObjectData, setOuterHtml, setScriptContent, setScriptSrc, setStyle, setVideoSrc, unsafeSetInnerHtmlDoNotUseOrElse};