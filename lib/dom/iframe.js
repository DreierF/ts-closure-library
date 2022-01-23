import {SafeHtml} from './../html/safehtml.js';
import {SafeStyle} from './../html/safestyle.js';
import {TrustedResourceUrl} from './../html/trustedresourceurl.js';
import {Const} from './../string/const.js';
import * as userAgent from './../useragent/useragent.js';
import * as googdom from './dom.js';
import {DomHelper} from './dom.js';
import * as safe from './safe.js';
import {TagName} from './tagname.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utilities for creating and working with iframes
 * cross-browser.
 */

/**
 * Safe source for a blank iframe.
 *
 * Intentionally not about:blank for IE, which gives mixed content warnings in
 * IE6 over HTTPS. Using 'about:blank' for all other browsers to support Content
 * Security Policy (CSP). According to http://www.w3.org/TR/CSP/ CSP does not
 * allow inline javascript by default.
 *
 * @const {!TrustedResourceUrl}
 */
let BLANK_SOURCE_URL = userAgent.IE ?
    TrustedResourceUrl.fromConstant(
        Const.from('javascript:""')) :
    TrustedResourceUrl.fromConstant(
        Const.from('about:blank'));

/**
 * Legacy version of BLANK_SOURCE_URL.
 * @const {string}
 */
let BLANK_SOURCE =
    TrustedResourceUrl.unwrap(BLANK_SOURCE_URL);

/**
 * Safe source for a new blank iframe that may not cause a new load of the
 * iframe. This is different from `BLANK_SOURCE` in that
 * it will allow an iframe to be loaded synchronously in more browsers, notably
 * Gecko, following the javascript protocol spec.
 *
 * NOTE: This should not be used to replace the source of an existing iframe.
 * The new src value will be ignored, per the spec.
 *
 * Due to cross-browser differences, the load is not guaranteed  to be
 * synchronous. If code depends on the load of the iframe,
 * then `goog.net.IframeLoadMonitor` or a similar technique should be
 * used.
 *
 * According to
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/webappapis.html#javascript-protocol
 * the 'javascript:""' URL should trigger a new load of the iframe, which may be
 * asynchronous. A void src, such as 'javascript:undefined', does not change
 * the browsing context document's, and thus should not trigger another load.
 *
 * Intentionally not about:blank, which also triggers a load.
 *
 * NOTE: 'javascript:' URL handling spec compliance varies per browser. IE
 * throws an error with 'javascript:undefined'. Webkit browsers will reload the
 * iframe when setting this source on an existing iframe.
 *
 * @const {!TrustedResourceUrl}
 */
let BLANK_SOURCE_NEW_FRAME_URL = userAgent.IE ?
    TrustedResourceUrl.fromConstant(
        Const.from('javascript:""')) :
    TrustedResourceUrl.fromConstant(
        Const.from('javascript:undefined'));

/**
 * Legacy version of BLANK_SOURCE_NEW_FRAME_URL.
 * @const {string}
 */
let BLANK_SOURCE_NEW_FRAME = TrustedResourceUrl.unwrap(
    BLANK_SOURCE_NEW_FRAME_URL);

/**
 * Styles to help ensure an undecorated iframe.
 * @const {string}
 * @private
 */
let STYLES_ = 'border:0;vertical-align:bottom;';

/**
 * Creates a completely blank iframe element.
 *
 * The iframe will not caused mixed-content warnings for IE6 under HTTPS.
 * The iframe will also have no borders or padding, so that the styled width
 * and height will be the actual width and height of the iframe.
 *
 * This function currently only attempts to create a blank iframe.  There
 * are no guarantees to the contents of the iframe or whether it is rendered
 * in quirks mode.
 *
 * @param {DomHelper} domHelper The dom helper to use.
 * @param {!SafeStyle=} opt_styles CSS styles for the iframe.
 * @return {!HTMLIFrameElement} A completely blank iframe.
 */
function createBlank(domHelper, opt_styles) {
  var styles;
  if (opt_styles) {
    // SafeStyle has to be converted back to a string for now, since there's
    // no safe alternative to createDom().
    styles = SafeStyle.unwrap(opt_styles);
  } else {  // undefined.
    styles = '';
  }
  var iframe = domHelper.createDom(TagName.IFRAME, {
    'frameborder': 0,
    // Since iframes are inline elements, we must align to bottom to
    // compensate for the line descent.
    'style': STYLES_ + styles
  });
  safe.setIframeSrc(iframe, BLANK_SOURCE_URL);
  return iframe;
};

/**
 * Writes the contents of a blank iframe that has already been inserted
 * into the document.
 * @param {!HTMLIFrameElement} iframe An iframe with no contents, such as
 *     one created by {@link #createBlank}, but already appended to
 *     a parent document.
 * @param {!SafeHtml} content Content to write to the iframe,
 *     from doctype to the HTML close tag.
 */
function writeSafeContent(iframe, content) {
  var doc = googdom.getFrameContentDocument(iframe);
  doc.open();
  safe.documentWrite(doc, content);
  doc.close();
};

// TODO(gboyer): Provide a higher-level API for the most common use case, so
// that you can just provide a list of stylesheets and some content HTML.
/**
 * Creates a same-domain iframe containing preloaded content.
 *
 * This is primarily useful for DOM sandboxing.  One use case is to embed
 * a trusted JavaScript app with potentially conflicting CSS styles.  The
 * second case is to reduce the cost of layout passes by the browser -- for
 * example, you can perform sandbox sizing of characters in an iframe while
 * manipulating a heavy DOM in the main window.  The iframe and parent frame
 * can access each others' properties and functions without restriction.
 *
 * @param {!Element} parentElement The parent element in which to append the
 *     iframe.
 * @param {!SafeHtml=} opt_headContents Contents to go into the
 *     iframe's head.
 * @param {!SafeHtml=} opt_bodyContents Contents to go into the
 *     iframe's body.
 * @param {!SafeStyle=} opt_styles CSS styles for the iframe itself,
 *     before adding to the parent element.
 * @param {boolean=} opt_quirks Whether to use quirks mode (false by default).
 * @return {!HTMLIFrameElement} An iframe that has the specified contents.
 */
function createWithContent(
    parentElement, opt_headContents, opt_bodyContents, opt_styles, opt_quirks) {
  var domHelper = googdom.getDomHelper(parentElement);

  var content = SafeHtml.create(
      'html', {},
      SafeHtml.concat(
          SafeHtml.create('head', {}, opt_headContents),
          SafeHtml.create('body', {}, opt_bodyContents)));
  if (!opt_quirks) {
    content =
        SafeHtml.concat(SafeHtml.DOCTYPE_HTML, content);
  }

  var iframe = createBlank(domHelper, opt_styles);

  // Cannot manipulate iframe content until it is in a document.
  parentElement.appendChild(iframe);
  writeSafeContent(iframe, content);

  return iframe;
};

export {BLANK_SOURCE, BLANK_SOURCE_NEW_FRAME, BLANK_SOURCE_NEW_FRAME_URL, BLANK_SOURCE_URL, createBlank, createWithContent, writeSafeContent};