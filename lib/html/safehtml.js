import * as googarray from './../array/array.js';
import * as goog_asserts from './../asserts/asserts.js';
import {AssertionError} from './../asserts/asserts.js';
import {TagName} from './../dom/tagname.js';
import * as dom_tags from './../dom/tags.js';
import * as google from './../google.js';
import {Dir} from './../i18n/bidi.js';
import {DirectionalString} from './../i18n/bidi.js';
import * as userAgent_browser from './../labs/useragent/browser.js';
import * as goog_object from './../object/object.js';
import {Const} from './../string/const.js';
import * as internal from './../string/internal.js';
import {TypedString} from './../string/typedstring.js';
import {SafeScript} from './safescript.js';
import {SafeStyle} from './safestyle.js';
import {SafeStyleSheet} from './safestylesheet.js';
import {SafeUrl as Html_SafeUrl} from './safeurl.js';
import {TrustedResourceUrl as Html_TrustedResourceUrl} from './trustedresourceurl.js';
import * as trustedtypes from './trustedtypes.js';
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
 * @fileoverview The SafeHtml type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */

/**
 * A string that is safe to use in HTML context in DOM APIs and HTML documents.
 *
 * A SafeHtml is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution when
 * evaluated as HTML in a browser.
 *
 * Values of this type are guaranteed to be safe to use in HTML contexts,
 * such as, assignment to the innerHTML DOM property, or interpolation into
 * a HTML template in HTML PC_DATA context, in the sense that the use will not
 * result in a Cross-Site-Scripting vulnerability.
 *
 * Instances of this type must be created via the factory methods
 * (`SafeHtml.create`, `SafeHtml.htmlEscape`),
 * etc and not by invoking its constructor.  The constructor intentionally
 * takes no parameters and the type is immutable; hence only a default instance
 * corresponding to the empty string can be obtained via constructor invocation.
 *
 * Note that there is no `SafeHtml.fromConstant`. The reason is that
 * the following code would create an unsafe HTML:
 *
 * ```
 * SafeHtml.concat(
 *     SafeHtml.fromConstant(Const.from('<script>')),
 *     SafeHtml.htmlEscape(userInput),
 *     SafeHtml.fromConstant(Const.from('<\/script>')));
 * ```
 *
 * There's `goog.dom.constHtmlToNode` to create a node from constant strings
 * only.
 *
 * @see SafeHtml.create
 * @see SafeHtml.htmlEscape
 * @final
 * @class
 * @implements {DirectionalString}
 * @implements {TypedString}
 */
class SafeHtml {

  /**
   * A string that is safe to use in HTML context in DOM APIs and HTML documents.
   *
   * A SafeHtml is a string-like object that carries the security type contract
   * that its value as a string will not cause untrusted script execution when
   * evaluated as HTML in a browser.
   *
   * Values of this type are guaranteed to be safe to use in HTML contexts,
   * such as, assignment to the innerHTML DOM property, or interpolation into
   * a HTML template in HTML PC_DATA context, in the sense that the use will not
   * result in a Cross-Site-Scripting vulnerability.
   *
   * Instances of this type must be created via the factory methods
   * (`SafeHtml.create`, `SafeHtml.htmlEscape`),
   * etc and not by invoking its constructor.  The constructor intentionally
   * takes no parameters and the type is immutable; hence only a default instance
   * corresponding to the empty string can be obtained via constructor invocation.
   *
   * Note that there is no `SafeHtml.fromConstant`. The reason is that
   * the following code would create an unsafe HTML:
   *
   * ```
   * SafeHtml.concat(
   *     SafeHtml.fromConstant(Const.from('<script>')),
   *     SafeHtml.htmlEscape(userInput),
   *     SafeHtml.fromConstant(Const.from('<\/script>')));
   * ```
   *
   * There's `goog.dom.constHtmlToNode` to create a node from constant strings
   * only.
   *
   * @see SafeHtml.create
   * @see SafeHtml.htmlEscape
   */
  constructor() {
    /**
     * @override
     * @const
     */
    this.implementsGoogI18nBidiDirectionalString = true;
  
    /**
     * @override
     * @const
     */
    this.implementsGoogStringTypedString = true;
  
    /**
     * The contained value of this SafeHtml.  The field has a purposely ugly
     * name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {!TrustedHTML|string}
     */
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ = '';
  
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeHtml.unwrap
     * @const {!Object}
     * @private
     */
    this.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ =
        SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  
    /**
     * This SafeHtml's directionality, or null if unknown.
     * @private {?Dir}
     */
    this.dir_ = null;
  }

  /** @override */
  getDirection() {
    return this.dir_;
  };

  /**
   * Returns this SafeHtml's value as string.
   *
   * IMPORTANT: In code where it is security relevant that an object's type is
   * indeed `SafeHtml`, use `SafeHtml.unwrap` instead of
   * this method. If in doubt, assume that it's security relevant. In particular,
   * note that google.html functions which return a google.html type do not guarantee
   * that the returned instance is of the right type. For example:
   *
   * <pre>
   * var fakeSafeHtml = new String('fake');
   * fakeSafeHtml.__proto__ = SafeHtml.prototype;
   * var newSafeHtml = SafeHtml.htmlEscape(fakeSafeHtml);
   * // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
   * // SafeHtml.htmlEscape() as fakeSafeHtml
   * // instanceof SafeHtml.
   * </pre>
   *
   * @see SafeHtml.unwrap
   * @override
   */
  getTypedStringValue() {
    return this.privateDoNotAccessOrElseSafeHtmlWrappedValue_.toString();
  };

  /**
   * Performs a runtime check that the provided object is indeed a SafeHtml
   * object, and returns its value.
   * @param {!SafeHtml} safeHtml The object to extract from.
   * @return {string} The SafeHtml object's contained string, unless the run-time
   *     type check fails. In that case, `unwrap` returns an innocuous
   *     string, or, if assertions are enabled, throws
   *     `AssertionError`.
   */
  static unwrap(safeHtml) {
    return SafeHtml.unwrapTrustedHTML(safeHtml).toString();
  };

  /**
   * Unwraps value as TrustedHTML if supported or as a string if not.
   * @param {!SafeHtml} safeHtml
   * @return {!TrustedHTML|string}
   * @see SafeHtml.unwrap
   */
  static unwrapTrustedHTML(safeHtml) {
    // Perform additional run-time type-checking to ensure that safeHtml is indeed
    // an instance of the expected type.  This provides some additional protection
    // against security bugs due to application code that disables type checks.
    // Specifically, the following checks are performed:
    // 1. The object is an instance of the expected type.
    // 2. The object is not an instance of a subclass.
    // 3. The object carries a type marker for the expected type. "Faking" an
    // object requires a reference to the type marker, which has names intended
    // to stand out in code reviews.
    if (safeHtml instanceof SafeHtml &&
        safeHtml.constructor === SafeHtml &&
        safeHtml.SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ===
            SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
      return safeHtml.privateDoNotAccessOrElseSafeHtmlWrappedValue_;
    } else {
      goog_asserts.fail('expected object of type SafeHtml, got \'' +
          safeHtml + '\' of type ' + google.typeOf(safeHtml));
      return 'type_error:SafeHtml';
    }
  };

  /**
   * Returns HTML-escaped text as a SafeHtml object.
   *
   * If text is of a type that implements
   * `DirectionalString`, the directionality of the new
   * `SafeHtml` object is set to `text`'s directionality, if known.
   * Otherwise, the directionality of the resulting SafeHtml is unknown (i.e.,
   * `null`).
   *
   * @param {!SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
   *     the parameter is of type SafeHtml it is returned directly (no escaping
   *     is done).
   * @return {!SafeHtml} The escaped text, wrapped as a SafeHtml.
   */
  static htmlEscape(textOrHtml) {
    if (textOrHtml instanceof SafeHtml) {
      return textOrHtml;
    }
    var textIsObject = typeof textOrHtml == 'object';
    var dir = null;
    if (textIsObject && textOrHtml.implementsGoogI18nBidiDirectionalString) {
      dir = /** @type {!DirectionalString} */ (textOrHtml)
                .getDirection();
    }
    var textAsString;
    if (textIsObject && textOrHtml.implementsGoogStringTypedString) {
      textAsString = /** @type {!TypedString} */ (textOrHtml)
                         .getTypedStringValue();
    } else {
      textAsString = String(textOrHtml);
    }
    return SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        internal.htmlEscape(textAsString), dir);
  };

  /**
   * Returns HTML-escaped text as a SafeHtml object, with newlines changed to
   * &lt;br&gt;.
   * @param {!SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
   *     the parameter is of type SafeHtml it is returned directly (no escaping
   *     is done).
   * @return {!SafeHtml} The escaped text, wrapped as a SafeHtml.
   */
  static htmlEscapePreservingNewlines(textOrHtml) {
    if (textOrHtml instanceof SafeHtml) {
      return textOrHtml;
    }
    var html = SafeHtml.htmlEscape(textOrHtml);
    return SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        internal.newLineToBr(SafeHtml.unwrap(html)),
        html.getDirection());
  };

  /**
   * Returns HTML-escaped text as a SafeHtml object, with newlines changed to
   * &lt;br&gt; and escaping whitespace to preserve spatial formatting. Character
   * entity #160 is used to make it safer for XML.
   * @param {!SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
   *     the parameter is of type SafeHtml it is returned directly (no escaping
   *     is done).
   * @return {!SafeHtml} The escaped text, wrapped as a SafeHtml.
   */
  static htmlEscapePreservingNewlinesAndSpaces(
      textOrHtml) {
    if (textOrHtml instanceof SafeHtml) {
      return textOrHtml;
    }
    var html = SafeHtml.htmlEscape(textOrHtml);
    return SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        internal.whitespaceEscape(SafeHtml.unwrap(html)),
        html.getDirection());
  };

  /**
   * Coerces an arbitrary object into a SafeHtml object.
   *
   * If `textOrHtml` is already of type `SafeHtml`, the same
   * object is returned. Otherwise, `textOrHtml` is coerced to string, and
   * HTML-escaped. If `textOrHtml` is of a type that implements
   * `DirectionalString`, its directionality, if known, is
   * preserved.
   *
   * @param {!SafeHtml.TextOrHtml_} textOrHtml The text or SafeHtml to
   *     coerce.
   * @return {!SafeHtml} The resulting SafeHtml object.
   * @deprecated Use SafeHtml.htmlEscape.
   */
  static from(textOrHtml) {
    return SafeHtml.htmlEscape(textOrHtml);
  }

  /**
   * Creates a SafeHtml content consisting of a tag with optional attributes and
   * optional content.
   *
   * For convenience tag names and attribute names are accepted as regular
   * strings, instead of Const. Nevertheless, you should not pass
   * user-controlled values to these parameters. Note that these parameters are
   * syntactically validated at runtime, and invalid values will result in
   * an exception.
   *
   * Example usage:
   *
   * SafeHtml.create('br');
   * SafeHtml.create('div', {'class': 'a'});
   * SafeHtml.create('p', {}, 'a');
   * SafeHtml.create('p', {}, SafeHtml.create('br'));
   *
   * SafeHtml.create('span', {
   *   'style': {'margin': '0'}
   * });
   *
   * To guarantee SafeHtml's type contract is upheld there are restrictions on
   * attribute values and tag names.
   *
   * - For attributes which contain script code (on*), a Const is
   *   required.
   * - For attributes which contain style (style), a SafeStyle or a
   *   SafeStyle.PropertyMap is required.
   * - For attributes which are interpreted as URLs (e.g. src, href) a
   *   Html_SafeUrl, Const or string is required. If a string
   *   is passed, it will be sanitized with SafeUrl.sanitize().
   * - For tags which can load code or set security relevant page metadata,
   *   more specific SafeHtml.create*() functions must be used. Tags
   *   which are not supported by this function are applet, base, embed, iframe,
   *   link, math, object, script, style, svg, and template.
   *
   * @param {!TagName|string} tagName The name of the tag. Only tag names
   *     consisting of [a-zA-Z0-9-] are allowed. Tag names documented above are
   *     disallowed.
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   *     Mapping from attribute names to their values. Only attribute names
   *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
   *     the attribute to be omitted.
   * @param {!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>=} opt_content Content to
   *     HTML-escape and put inside the tag. This must be empty for void tags
   *     like <br>. Array elements are concatenated.
   * @return {!SafeHtml} The SafeHtml content with the tag.
   * @throws {Error} If invalid tag name, attribute name, or attribute value is
   *     provided.
   * @throws {AssertionError} If content for void tag is provided.
   */
  static create(tagName, opt_attributes, opt_content) {
    SafeHtml.verifyTagName(String(tagName));
    return SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
        String(tagName), opt_attributes, opt_content);
  };

  /**
   * Verifies if the tag name is valid and if it doesn't change the context.
   * E.g. STRONG is fine but SCRIPT throws because it changes context. See
   * SafeHtml.create for an explanation of allowed tags.
   * @param {string} tagName
   * @throws {Error} If invalid tag name is provided.
   * @package
   */
  static verifyTagName(tagName) {
    if (!SafeHtml.VALID_NAMES_IN_TAG_.test(tagName)) {
      throw new Error(
          ENABLE_ERROR_MESSAGES ?
              'Invalid tag name <' + tagName + '>.' :
              '');
    }
    if (tagName.toUpperCase() in SafeHtml.NOT_ALLOWED_TAG_NAMES_) {
      throw new Error(
          ENABLE_ERROR_MESSAGES ?
  
              'Tag name <' + tagName + '> is not allowed for SafeHtml.' :
              '');
    }
  };

  /**
   * Creates a SafeHtml representing an iframe tag.
   *
   * This by default restricts the iframe as much as possible by setting the
   * sandbox attribute to the empty string. If the iframe requires less
   * restrictions, set the sandbox attribute as tight as possible, but do not rely
   * on the sandbox as a security feature because it is not supported by older
   * browsers. If a sandbox is essential to security (e.g. for third-party
   * frames), use createSandboxIframe which checks for browser support.
   *
   * @see https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe#attr-sandbox
   *
   * @param {?Html_TrustedResourceUrl=} opt_src The value of the src
   *     attribute. If null or undefined src will not be set.
   * @param {?SafeHtml=} opt_srcdoc The value of the srcdoc attribute.
   *     If null or undefined srcdoc will not be set.
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   *     Mapping from attribute names to their values. Only attribute names
   *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
   *     the attribute to be omitted.
   * @param {!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>=} opt_content Content to
   *     HTML-escape and put inside the tag. Array elements are concatenated.
   * @return {!SafeHtml} The SafeHtml content with the tag.
   * @throws {Error} If invalid tag name, attribute name, or attribute value is
   *     provided. If opt_attributes contains the src or srcdoc attributes.
   */
  static createIframe(
      opt_src, opt_srcdoc, opt_attributes, opt_content) {
    if (opt_src) {
      // Check whether this is really TrustedResourceUrl.
      Html_TrustedResourceUrl.unwrap(opt_src);
    }
  
    var fixedAttributes = {};
    fixedAttributes['src'] = opt_src || null;
    fixedAttributes['srcdoc'] =
        opt_srcdoc && SafeHtml.unwrap(opt_srcdoc);
    var defaultAttributes = {'sandbox': ''};
    var attributes = SafeHtml.combineAttributes(
        fixedAttributes, defaultAttributes, opt_attributes);
    return SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
        'iframe', attributes, opt_content);
  };

  /**
   * Creates a SafeHtml representing a sandboxed iframe tag.
   *
   * The sandbox attribute is enforced in its most restrictive mode, an empty
   * string. Consequently, the security requirements for the src and srcdoc
   * attributes are relaxed compared to SafeHtml.createIframe. This function
   * will throw on browsers that do not support the sandbox attribute, as
   * determined by SafeHtml.canUseSandboxIframe.
   *
   * The SafeHtml returned by this function can trigger downloads with no
   * user interaction on Chrome (though only a few, further attempts are blocked).
   * Firefox and IE will block all downloads from the sandbox.
   *
   * @see https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe#attr-sandbox
   * @see https://lists.w3.org/Archives/Public/public-whatwg-archive/2013Feb/0112.html
   *
   * @param {string|!Html_SafeUrl=} opt_src The value of the src
   *     attribute. If null or undefined src will not be set.
   * @param {string=} opt_srcdoc The value of the srcdoc attribute.
   *     If null or undefined srcdoc will not be set. Will not be sanitized.
   * @param {!Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   *     Mapping from attribute names to their values. Only attribute names
   *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
   *     the attribute to be omitted.
   * @param {!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>=} opt_content Content to
   *     HTML-escape and put inside the tag. Array elements are concatenated.
   * @return {!SafeHtml} The SafeHtml content with the tag.
   * @throws {Error} If invalid tag name, attribute name, or attribute value is
   *     provided. If opt_attributes contains the src, srcdoc or sandbox
   *     attributes. If browser does not support the sandbox attribute on iframe.
   */
  static createSandboxIframe(
      opt_src, opt_srcdoc, opt_attributes, opt_content) {
    if (!SafeHtml.canUseSandboxIframe()) {
      throw new Error(
          ENABLE_ERROR_MESSAGES ?
              'The browser does not support sandboxed iframes.' :
              '');
    }
  
    var fixedAttributes = {};
    if (opt_src) {
      // Note that sanitize is a no-op on SafeUrl.
      fixedAttributes['src'] =
          Html_SafeUrl.unwrap(Html_SafeUrl.sanitize(opt_src));
    } else {
      fixedAttributes['src'] = null;
    }
    fixedAttributes['srcdoc'] = opt_srcdoc || null;
    fixedAttributes['sandbox'] = '';
    var attributes =
        SafeHtml.combineAttributes(fixedAttributes, {}, opt_attributes);
    return SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
        'iframe', attributes, opt_content);
  };

  /**
   * Checks if the user agent supports sandboxed iframes.
   * @return {boolean}
   */
  static canUseSandboxIframe() {
    return window['HTMLIFrameElement'] &&
        ('sandbox' in window['HTMLIFrameElement'].prototype);
  };

  /**
   * Creates a SafeHtml representing a script tag with the src attribute.
   * @param {!Html_TrustedResourceUrl} src The value of the src
   * attribute.
   * @param {?Object<string, ?SafeHtml.AttributeValue>=}
   * opt_attributes
   *     Mapping from attribute names to their values. Only attribute names
   *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined
   *     causes the attribute to be omitted.
   * @return {!SafeHtml} The SafeHtml content with the tag.
   * @throws {Error} If invalid attribute name or value is provided. If
   *     opt_attributes contains the src attribute.
   */
  static createScriptSrc(src, opt_attributes) {
    // TODO(mlourenco): The charset attribute should probably be blocked. If
    // its value is attacker controlled, the script contains attacker controlled
    // sub-strings (even if properly escaped) and the server does not set charset
    // then XSS is likely possible.
    // https://html.spec.whatwg.org/multipage/scripting.html#dom-script-charset
  
    // Check whether this is really TrustedResourceUrl.
    Html_TrustedResourceUrl.unwrap(src);
  
    var fixedAttributes = {'src': src};
    var defaultAttributes = {};
    var attributes = SafeHtml.combineAttributes(
        fixedAttributes, defaultAttributes, opt_attributes);
    return SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
        'script', attributes);
  };

  /**
   * Creates a SafeHtml representing a script tag. Does not allow the language,
   * src, text or type attributes to be set.
   * @param {!SafeScript|!Array<!SafeScript>}
   *     script Content to put inside the tag. Array elements are
   *     concatenated.
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   *     Mapping from attribute names to their values. Only attribute names
   *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
   *     the attribute to be omitted.
   * @return {!SafeHtml} The SafeHtml content with the tag.
   * @throws {Error} If invalid attribute name or attribute value is provided. If
   *     opt_attributes contains the language, src, text or type attribute.
   */
  static createScript(script, opt_attributes) {
    for (var attr in opt_attributes) {
      var attrLower = attr.toLowerCase();
      if (attrLower == 'language' || attrLower == 'src' || attrLower == 'text' ||
          attrLower == 'type') {
        throw new Error(
            ENABLE_ERROR_MESSAGES ?
                'Cannot set "' + attrLower + '" attribute' :
                '');
      }
    }
  
    var content = '';
    script = googarray.concat(script);
    for (var i = 0; i < script.length; i++) {
      content += SafeScript.unwrap(script[i]);
    }
    // Convert to SafeHtml so that it's not HTML-escaped. This is safe because
    // as part of its contract, SafeScript should have no dangerous '<'.
    var htmlContent =
        SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
            content, Dir.NEUTRAL);
    return SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
        'script', opt_attributes, htmlContent);
  };

  /**
   * Creates a SafeHtml representing a style tag. The type attribute is set
   * to "text/css".
   * @param {!SafeStyleSheet|!Array<!SafeStyleSheet>}
   *     styleSheet Content to put inside the tag. Array elements are
   *     concatenated.
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   *     Mapping from attribute names to their values. Only attribute names
   *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
   *     the attribute to be omitted.
   * @return {!SafeHtml} The SafeHtml content with the tag.
   * @throws {Error} If invalid attribute name or attribute value is provided. If
   *     opt_attributes contains the type attribute.
   */
  static createStyle(styleSheet, opt_attributes) {
    var fixedAttributes = {'type': 'text/css'};
    var defaultAttributes = {};
    var attributes = SafeHtml.combineAttributes(
        fixedAttributes, defaultAttributes, opt_attributes);
  
    var content = '';
    styleSheet = googarray.concat(styleSheet);
    for (var i = 0; i < styleSheet.length; i++) {
      content += SafeStyleSheet.unwrap(styleSheet[i]);
    }
    // Convert to SafeHtml so that it's not HTML-escaped. This is safe because
    // as part of its contract, SafeStyleSheet should have no dangerous '<'.
    var htmlContent =
        SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
            content, Dir.NEUTRAL);
    return SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
        'style', attributes, htmlContent);
  };

  /**
   * Creates a SafeHtml representing a meta refresh tag.
   * @param {!Html_SafeUrl|string} url Where to redirect. If a string is
   *     passed, it will be sanitized with SafeUrl.sanitize().
   * @param {number=} opt_secs Number of seconds until the page should be
   *     reloaded. Will be set to 0 if unspecified.
   * @return {!SafeHtml} The SafeHtml content with the tag.
   */
  static createMetaRefresh(url, opt_secs) {
  
    // Note that sanitize is a no-op on SafeUrl.
    var unwrappedUrl = Html_SafeUrl.unwrap(Html_SafeUrl.sanitize(url));
  
    if (userAgent_browser.isIE() ||
        userAgent_browser.isEdge()) {
      // IE/EDGE can't parse the content attribute if the url contains a
      // semicolon. We can fix this by adding quotes around the url, but then we
      // can't parse quotes in the URL correctly. Also, it seems that IE/EDGE
      // did not unescape semicolons in these URLs at some point in the past. We
      // take a best-effort approach.
      //
      // If the URL has semicolons (which may happen in some cases, see
      // http://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2
      // for instance), wrap it in single quotes to protect the semicolons.
      // If the URL has semicolons and single quotes, url-encode the single quotes
      // as well.
      //
      // This is imperfect. Notice that both ' and ; are reserved characters in
      // URIs, so this could do the wrong thing, but at least it will do the wrong
      // thing in only rare cases.
      if (internal.contains(unwrappedUrl, ';')) {
        unwrappedUrl = "'" + unwrappedUrl.replace(/'/g, '%27') + "'";
      }
    }
    var attributes = {
      'http-equiv': 'refresh',
      'content': (opt_secs || 0) + '; url=' + unwrappedUrl
    };
  
    // This function will handle the HTML escaping for attributes.
    return SafeHtml.createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
        'meta', attributes);
  };

  /**
   * @param {string} tagName The tag name.
   * @param {string} name The attribute name.
   * @param {!SafeHtml.AttributeValue} value The attribute value.
   * @return {string} A "name=value" string.
   * @throws {Error} If attribute value is unsafe for the given tag and attribute.
   * @private
   */
  static getAttrNameAndValue_(tagName, name, value) {
    // If it's Const, allow any valid attribute name.
    if (value instanceof Const) {
      value = Const.unwrap(value);
    } else if (name.toLowerCase() == 'style') {
      if (SUPPORT_STYLE_ATTRIBUTE) {
        value = SafeHtml.getStyleValue_(value);
      } else {
        throw new Error(
            ENABLE_ERROR_MESSAGES ?
                'Attribute "style" not supported.' :
                '');
      }
    } else if (/^on/i.test(name)) {
      // TODO(jakubvrana): Disallow more attributes with a special meaning.
      throw new Error(
          ENABLE_ERROR_MESSAGES ? 'Attribute "' + name +
                  '" requires Const value, "' + value + '" given.' :
                                                     '');
      // URL attributes handled differently according to tag.
    } else if (name.toLowerCase() in SafeHtml.URL_ATTRIBUTES_) {
      if (value instanceof Html_TrustedResourceUrl) {
        value = Html_TrustedResourceUrl.unwrap(value);
      } else if (value instanceof Html_SafeUrl) {
        value = Html_SafeUrl.unwrap(value);
      } else if (typeof value === 'string') {
        value = Html_SafeUrl.sanitize(value).getTypedStringValue();
      } else {
        throw new Error(
            ENABLE_ERROR_MESSAGES ?
                'Attribute "' + name + '" on tag "' + tagName +
                    '" requires Html_SafeUrl, Const, or' +
                    ' string, value "' + value + '" given.' :
                '');
      }
    }
  
    // Accept SafeUrl, TrustedResourceUrl, etc. for attributes which only require
    // HTML-escaping.
    if (value.implementsGoogStringTypedString) {
      // Ok to call getTypedStringValue() since there's no reliance on the type
      // contract for security here.
      value =
          /** @type {!TypedString} */ (value).getTypedStringValue();
    }
  
    goog_asserts.assert(
        typeof value === 'string' || typeof value === 'number',
        'String or number value expected, got ' + (typeof value) +
            ' with value: ' + value);
    return name + '="' + internal.htmlEscape(String(value)) + '"';
  };

  /**
   * Gets value allowed in "style" attribute
   * @suppress{checkTypes}.
   * @param {!SafeHtml.AttributeValue} value It could be SafeStyle or a
   *     map which will be passed to SafeStyle.create.
   * @return {string} Unwrapped value.
   * @throws {Error} If string value is given.
   * @private
   */
  static getStyleValue_(value) {
    if (!google.isObject(value)) {
      throw new Error(
          ENABLE_ERROR_MESSAGES ?
              'The "style" attribute requires SafeStyle or map ' +
                  'of style properties, ' + (typeof value) + ' given: ' + value :
              '');
    }
    if (!(value instanceof SafeStyle)) {
      // Process the property bag into a style object.
      value = SafeStyle.create(value);
    }
    return SafeStyle.unwrap(value);
  };

  /**
   * Creates a SafeHtml content with known directionality consisting of a tag with
   * optional attributes and optional content.
   * @param {!Dir} dir Directionality.
   * @param {string} tagName
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   * @param {!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>=} opt_content
   * @return {!SafeHtml} The SafeHtml content with the tag.
   */
  static createWithDir(
      dir, tagName, opt_attributes, opt_content) {
    var html = SafeHtml.create(tagName, opt_attributes, opt_content);
    html.dir_ = dir;
    return html;
  };

  /**
   * Creates a new SafeHtml object by joining the parts with separator.
   * @suppress{checkTypes}
   * @param {!SafeHtml.TextOrHtml_} separator
   * @param {!Array<!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>>} parts Parts to join. If a part
   *     contains an array then each member of this array is also joined with the
   *     separator.
   * @return {!SafeHtml}
   */
  static join(separator, parts) {
    var separatorHtml = SafeHtml.htmlEscape(separator);
    var dir = separatorHtml.getDirection();
    var content = [];
  
    /**
     * @param {!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>} argument
     */
    function addArgument(argument) {
      if (google.isArray(argument)) {
        googarray.forEach(argument, addArgument);
      } else {
        var html = SafeHtml.htmlEscape(argument);
        content.push(SafeHtml.unwrap(html));
        var htmlDir = html.getDirection();
        if (dir == Dir.NEUTRAL) {
          dir = htmlDir;
        } else if (htmlDir != Dir.NEUTRAL && dir != htmlDir) {
          dir = null;
        }
      }
    };
  
    googarray.forEach(parts, addArgument);
    return SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        content.join(SafeHtml.unwrap(separatorHtml)), dir);
  };

  /**
   * Creates a new SafeHtml object by concatenating values.
   * @param {...(!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>)} var_args Values to concatenate.
   * @return {!SafeHtml}
   */
  static concat(var_args) {
    return SafeHtml.join(
        SafeHtml.EMPTY, Array.prototype.slice.call(arguments));
  };

  /**
   * Creates a new SafeHtml object with known directionality by concatenating the
   * values.
   * @param {!Dir} dir Directionality.
   * @param {...(!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>)} var_args Elements of array
   *     arguments would be processed recursively.
   * @return {!SafeHtml}
   */
  static concatWithDir(dir, var_args) {
    var html = SafeHtml.concat(googarray.slice(arguments, 1));
    html.dir_ = dir;
    return html;
  };

  /**
   * Package-internal utility method to create SafeHtml instances.
   *
   * @param {string} html The string to initialize the SafeHtml object with.
   * @param {?Dir} dir The directionality of the SafeHtml to be
   *     constructed, or null if unknown.
   * @return {!SafeHtml} The initialized SafeHtml object.
   * @package
   */
  static createSafeHtmlSecurityPrivateDoNotAccessOrElse(
      html, dir) {
    return new SafeHtml().initSecurityPrivateDoNotAccessOrElse_(
        html, dir);
  };

  /**
   * Called from createSafeHtmlSecurityPrivateDoNotAccessOrElse(). This
   * method exists only so that the compiler can dead code eliminate static
   * fields (like EMPTY) when they're not accessed.
   * @param {string} html
   * @param {?Dir} dir
   * @return {!SafeHtml}
   * @private
   */
  initSecurityPrivateDoNotAccessOrElse_(
      html, dir) {
    this.privateDoNotAccessOrElseSafeHtmlWrappedValue_ =
        trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY ?
        trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY.createHTML(
            html) :
        html;
    this.dir_ = dir;
    return this;
  };

  /**
   * Like create() but does not restrict which tags can be constructed.
   *
   * @param {string} tagName Tag name. Set or validated by caller.
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   * @param {(!SafeHtml.TextOrHtml_|
   *     !Array<!SafeHtml.TextOrHtml_>)=} opt_content
   * @return {!SafeHtml}
   * @throws {Error} If invalid or unsafe attribute name or value is provided.
   * @throws {AssertionError} If content for void tag is provided.
   * @package
   */
  static createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(
      tagName, opt_attributes, opt_content) {
    var dir = null;
    var result = '<' + tagName;
    result += SafeHtml.stringifyAttributes(tagName, opt_attributes);
  
    var content = opt_content;
    if (content == null) {
      content = [];
    } else if (!google.isArray(content)) {
      content = [content];
    }
  
    if (dom_tags.isVoidTag(tagName.toLowerCase())) {
      goog_asserts.assert(
          !content.length, 'Void tag <' + tagName + '> does not allow content.');
      result += '>';
    } else {
      var html = SafeHtml.concat(content);
      result += '>' + SafeHtml.unwrap(html) + '</' + tagName + '>';
      dir = html.getDirection();
    }
  
    var dirAttribute = opt_attributes && opt_attributes['dir'];
    if (dirAttribute) {
      if (/^(ltr|rtl|auto)$/i.test(dirAttribute)) {
        // If the tag has the "dir" attribute specified then its direction is
        // neutral because it can be safely used in any context.
        dir = Dir.NEUTRAL;
      } else {
        dir = null;
      }
    }
  
    return SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        result, dir);
  };

  /**
   * Creates a string with attributes to insert after tagName.
   * @param {string} tagName
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   * @return {string} Returns an empty string if there are no attributes, returns
   *     a string starting with a space otherwise.
   * @throws {Error} If attribute value is unsafe for the given tag and attribute.
   * @package
   */
  static stringifyAttributes(tagName, opt_attributes) {
    var result = '';
    if (opt_attributes) {
      for (var name in opt_attributes) {
        if (!SafeHtml.VALID_NAMES_IN_TAG_.test(name)) {
          throw new Error(
              ENABLE_ERROR_MESSAGES ?
                  'Invalid attribute name "' + name + '".' :
                  '');
        }
        var value = opt_attributes[name];
        if (value == null) {
          continue;
        }
        result +=
            ' ' + SafeHtml.getAttrNameAndValue_(tagName, name, value);
      }
    }
    return result;
  };

  /**
   * @param {!Object<string, ?SafeHtml.AttributeValue>} fixedAttributes
   * @param {!Object<string, string>} defaultAttributes
   * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
   *     Optional attributes passed to create*().
   * @return {!Object<string, ?SafeHtml.AttributeValue>}
   * @throws {Error} If opt_attributes contains an attribute with the same name
   *     as an attribute in fixedAttributes.
   * @package
   */
  static combineAttributes(
      fixedAttributes, defaultAttributes, opt_attributes) {
    var combinedAttributes = {};
    var name;
  
    for (name in fixedAttributes) {
      goog_asserts.assert(name.toLowerCase() == name, 'Must be lower case');
      combinedAttributes[name] = fixedAttributes[name];
    }
    for (name in defaultAttributes) {
      goog_asserts.assert(name.toLowerCase() == name, 'Must be lower case');
      combinedAttributes[name] = defaultAttributes[name];
    }
  
    if (opt_attributes) {
      for (name in opt_attributes) {
        var nameLower = name.toLowerCase();
        if (nameLower in fixedAttributes) {
          throw new Error(
              ENABLE_ERROR_MESSAGES ?
                  'Cannot override "' + nameLower + '" attribute, got "' + name +
                      '" with value "' + opt_attributes[name] + '"' :
                  '');
        }
        if (nameLower in defaultAttributes) {
          delete combinedAttributes[nameLower];
        }
        combinedAttributes[name] = opt_attributes[name];
      }
    }
  
    return combinedAttributes;
  };
}

/**
 * @type {boolean} Whether to strip out error messages or to leave them in.
 */
const ENABLE_ERROR_MESSAGES = google.DEBUG;

/**
 * Whether the `style` attribute is supported. Set to false to avoid the byte
 * weight of `SafeStyle` where unneeded. An error will be thrown if
 * the `style` attribute is used.
 * @type {boolean}
 */
const SUPPORT_STYLE_ATTRIBUTE = true;

/**
 * Shorthand for union of types that can sensibly be converted to strings
 * or might already be SafeHtml (as SafeHtml is a TypedString).
 * @private
 * @typedef {string|number|boolean|!TypedString|
 *           !DirectionalString}
 */
SafeHtml.TextOrHtml_;

/**
 * @const
 * @private
 */
SafeHtml.VALID_NAMES_IN_TAG_ = /^[a-zA-Z0-9-]+$/;

/**
 * Set of attributes containing URL as defined at
 * http://www.w3.org/TR/html5/index.html#attributes-1.
 * @private @const {!Object<string,boolean>}
 */
SafeHtml.URL_ATTRIBUTES_ = goog_object.createSet(
    'action', 'cite', 'data', 'formaction', 'href', 'manifest', 'poster',
    'src');

/**
 * Tags which are unsupported via create(). They might be supported via a
 * tag-specific create method. These are tags which might require a
 * TrustedResourceUrl in one of their attributes or a restricted type for
 * their content.
 * @private @const {!Object<string,boolean>}
 */
SafeHtml.NOT_ALLOWED_TAG_NAMES_ = goog_object.createSet(
    TagName.APPLET, TagName.BASE, TagName.EMBED,
    TagName.IFRAME, TagName.LINK, TagName.MATH,
    TagName.META, TagName.OBJECT, TagName.SCRIPT,
    TagName.STYLE, TagName.SVG, TagName.TEMPLATE);

/**
 * @typedef {string|number|TypedString|
 *     SafeStyle.PropertyMap|undefined}
 */
SafeHtml.AttributeValue;

/**
 * Type marker for the SafeHtml type, used to implement additional run-time
 * type checking.
 * @const {!Object}
 * @private
 */
SafeHtml.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};

/**
 * A SafeHtml instance corresponding to the HTML doctype: "<!DOCTYPE html>".
 * @const {!SafeHtml}
 */
SafeHtml.DOCTYPE_HTML =
    SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        '<!DOCTYPE html>', Dir.NEUTRAL);

/**
 * A SafeHtml instance corresponding to the empty string.
 * @const {!SafeHtml}
 */
SafeHtml.EMPTY =
    SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        '', Dir.NEUTRAL);

/**
 * A SafeHtml instance corresponding to the <br> tag.
 * @const {!SafeHtml}
 */
SafeHtml.BR =
    SafeHtml.createSafeHtmlSecurityPrivateDoNotAccessOrElse(
        '<br>', Dir.NEUTRAL);

export {ENABLE_ERROR_MESSAGES, SUPPORT_STYLE_ATTRIBUTE, SafeHtml};