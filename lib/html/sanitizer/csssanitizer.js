import * as googarray from './../../array/array.js';
import * as dom from './../../dom/dom.js';
import * as domsafe from './../../dom/safe.js';
import {TagName} from './../../dom/tagname.js';
import * as google from './../../google.js';
import * as goog_object from './../../object/object.js';
import {Const} from './../../string/const.js';
import * as goog_strings from './../../string/string.js';
import * as product from './../../useragent/product.js';
import * as userAgent from './../../useragent/useragent.js';
import * as CssSpecificity from './../cssspecificity.js';
import {SafeStyle} from './../safestyle.js';
import {SafeStyleSheet} from './../safestylesheet.js';
import {SafeUrl} from './../safeurl.js';
import * as uncheckedconversions from './../uncheckedconversions.js';
import * as CssPropertySanitizer from './csspropertysanitizer.js';
import * as noclobber from './noclobber.js';
// Copyright 2016 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview
 * JavaScript support for client-side CSS sanitization.
 */

/**
 * A regular expression to match each selector in a CSS rule. Selectors are
 * separated by commas, but can have strings within them (e.g. foo[name="bar"])
 * that can contain commas and escaped quotes.
 * @private {?RegExp}
 */
let SELECTOR_REGEX_ =
    // Don't even evaluate it on older browsers (IE8 and IE9), it throws a
    // syntax error and we don't use it anyway.
    !(userAgent.IE && document.documentMode < 10) ?
    new RegExp(
        '\\s*' +              // Discard initial space
            '([^\\s\'",]+' +  // Beginning of the match. Anything but a comma,
                              // spaces or a string delimiter. This is the only
                              // non-optional component of the regex.
            '[^\'",]*' +      // Spaces are fine afterwards (e.g. "a > b").
            ('(' +  // A series of optional strings with matching delimiters
                    // that can contain anything, and optional non-quoted text
                    // without commas.
             '(\'([^\'\\r\\n\\f\\\\]|\\\\[^])*\')|' +  // Optional single-quoted
                                                       // string.
             '("([^"\\r\\n\\f\\\\]|\\\\[^])*")|' +     // Optional double-quoted
                                                       // string.
             '[^\'",]' +  // Optional non-string content.
             ')*') +      // String and non-string
                          // content can come in any
                          // order.
            ')',          // End of the match.
        'g') :
    null;

/**
 * A whitelist of properties that can retain the prefix in Chrome.
 * @private @const {!Object<string,boolean>}
 */
let CHROME_INCLUDE_VENDOR_PREFIX_WHITELIST_ =
    goog_object.createSet(
        '-webkit-border-horizontal-spacing', '-webkit-border-vertical-spacing');

/**
 * Removes a vendor prefix from a property name.
 * @param {string} propName A property name.
 * @return {string} A property name without vendor prefixes.
 * @private
 */
function withoutVendorPrefix_(propName) {
  // A few property names are only valid with the prefix on specific browsers.
  // The recommendation is of course to avoid them, but in specific cases a
  // non-prefixed property gets transformed into one or more prefixed
  // properties by the browser. In this case, the best option to avoid having
  // the non-prefixed property be dropped silently is to allow the prefixed
  // property in the output.
  if (userAgent.WEBKIT &&
      propName in CHROME_INCLUDE_VENDOR_PREFIX_WHITELIST_) {
    return propName;
  }
  // http://stackoverflow.com/a/5411098/20394 has a fairly extensive list
  // of vendor prefixes. Blink has not declared a vendor prefix distinct from
  // -webkit- and http://css-tricks.com/tldr-on-vendor-prefix-drama/ discusses
  // how Mozilla recognizes some -webkit- prefixes.
  // http://wiki.csswg.org/spec/vendor-prefixes talks more about
  // cross-implementation, and lists other prefixes.
  return propName.replace(
      /^-(?:apple|css|epub|khtml|moz|mso?|o|rim|wap|webkit|xv)-(?=[a-z])/i, '');
};

/**
 * Sanitizes a {@link CSSStyleSheet}.
 * @param {!CSSStyleSheet} cssStyleSheet
 * @param {?string} containerId An ID to restrict the scope of the rules being
 *     sanitized. If null, no restriction is applied.
 * @param {function(string, string):?SafeUrl|undefined} uriRewriter A
 *     URI rewriter that returns a SafeUrl.
 * @return {!SafeStyleSheet}
 * @private
 */
function sanitizeStyleSheet_(
    cssStyleSheet, containerId, uriRewriter) {
  var sanitizedRules = [];
  var cssRules = getOnlyStyleRules_(
      googarray.toArray(cssStyleSheet.cssRules));
  googarray.forEach(cssRules, function(cssRule) {
    if (containerId && !/[a-zA-Z][\w-:\.]*/.test(containerId)) {
      // Sanity check on the element ID that will confine the new CSS rules.
      throw new Error('Invalid container id');
    }
    if (containerId && product.IE &&
        document.documentMode == 10 && /\\['"]/.test(cssRule.selectorText)) {
      // If a container ID was specified, drop selectors with escaped quotes in
      // strings on IE 10 due to a regex bug.
      return;
    }
    // If a container ID was specified, restrict all selectors in this rule to
    // be descendants of the node with such an ID. Use a regex to exclude commas
    // within selector strings.
    var scopedSelector = containerId ?
        cssRule.selectorText.replace(
            SELECTOR_REGEX_,
            '#' + containerId + ' $1') :
        cssRule.selectorText;
    sanitizedRules.push(SafeStyleSheet.createRule(
        scopedSelector,
        sanitizeInlineStyle(
            cssRule.style, uriRewriter)));
  });
  return SafeStyleSheet.concat(sanitizedRules);
};

/**
 * Used to filter out at-rules like @media, @font, etc. Currently, none of these
 * are supported.
 * @param {!Array<!CSSRule>} cssRules
 * @return {!Array<!CSSStyleRule>}
 * @private
 */
// TODO(pelizzi): some of these at-rules are safe, consider adding partial
// support for them.
function getOnlyStyleRules_(cssRules) {
  return /** @type {!Array<!CSSStyleRule>} */ (
      googarray.filter(cssRules, function(cssRule) {
        return cssRule instanceof CSSStyleRule ||
            cssRule.type == CSSRule.STYLE_RULE;
      }));
};

/**
 * Sanitizes the contents of a STYLE tag.
 * @param {string} textContent The textual content of the STYLE tag.
 * @param {?string=} opt_containerId The ID of a node that will contain the
 *     STYLE tag that includes the sanitized content, to restrict the effects of
 *     the rules being sanitized to descendants of this node.
 * @param {function(string, string):?SafeUrl=} opt_uriRewriter A URI
 *     rewriter that returns a SafeUrl.
 * @return {!SafeStyleSheet}
 * @supported IE 10+, Chrome 26+, Firefox 22+, Safari 7.1+, Opera 15+. On IE10,
 *     support for escaped quotes inside quoted strings (e.g. `a[name="it\'s"]`)
 *     is unreliable, and some (but not all!) rules containing these are
 *     silently dropped.
 */
function sanitizeStyleSheetString(
    textContent, opt_containerId, opt_uriRewriter) {
  var styleTag = /** @type {?HTMLStyleElement} */
      (safeParseHtmlAndGetInertElement(
          '<style>' + textContent + '</style>'));
  if (styleTag == null || styleTag.sheet == null) {
    return SafeStyleSheet.EMPTY;
  }
  var containerId = opt_containerId != undefined ? opt_containerId : null;
  return sanitizeStyleSheet_(
      /** @type {!CSSStyleSheet} */ (styleTag.sheet), containerId,
      opt_uriRewriter);
};

/**
 * Returns an inert DOM tree produced by parsing the provided html using
 * DOMParser. "Inert" here means that merely parsing the string won't execute
 * scripts or load images. If you attach this tree to a non-inert document, it
 * will execute these side effects! In this package we prefer using the TEMPLATE
 * tag over DOMParser to produce inert trees, but at least on Chrome the inert
 * STYLE tag does not have a CSSStyleSheet object attached to it.
 * @param {string} html
 * @return {?Element}
 */
function safeParseHtmlAndGetInertElement(
    html) {
  if ((userAgent.IE && !userAgent.isVersionOrHigher(10)) ||
      typeof window.DOMParser != 'function') {
    return null;
  }
  var safeHtml = uncheckedconversions
                     .safeHtmlFromStringKnownToSatisfyTypeContract(
                         Const.from('Never attached to DOM.'),
                         '<html><head></head><body>' + html + '</body></html>');
  return domsafe.parseFromStringHtml(new DOMParser(), safeHtml)
      .body.children[0];
};

/**
 * Sanitizes an inline style attribute. Short-hand attributes are expanded to
 * their individual elements. Note: The sanitizer does not output vendor
 * prefixed styles.
 * @param {?CSSStyleDeclaration} cssStyle A CSS style object.
 * @param {function(string, string):?SafeUrl=} opt_uriRewriter A URI
 *     rewriter that returns a SafeUrl.
 * @return {!SafeStyle} A sanitized inline cssText.
 */
function sanitizeInlineStyle(
    cssStyle, opt_uriRewriter) {
  if (!cssStyle) {
    return SafeStyle.EMPTY;
  }

  var cleanCssStyle = document.createElement('div').style;
  var cssPropNames =
      getCssPropNames_(cssStyle);

  googarray.forEach(cssPropNames, function(propName) {
    var propNameWithoutPrefix =
        withoutVendorPrefix_(propName);
    if (!isDisallowedPropertyName_(
            propNameWithoutPrefix)) {
      var propValue = noclobber.getCssPropertyValue(
          /** @type {!CSSStyleDeclaration} */ (cssStyle), propName);

      var sanitizedValue =
          CssPropertySanitizer.sanitizeProperty(
              propNameWithoutPrefix, propValue, opt_uriRewriter);
      if (sanitizedValue != null) {
        noclobber.setCssProperty(
            cleanCssStyle, propNameWithoutPrefix, sanitizedValue);
      }
    }
  });
  return uncheckedconversions
      .safeStyleFromStringKnownToSatisfyTypeContract(
          Const.from('Output of CSS sanitizer'),
          cleanCssStyle.cssText || '');
};

/**
 * Sanitizes inline CSS text and returns it as a SafeStyle object. When adequate
 * browser support is not available, such as for IE9 and below, a
 * SafeStyle-wrapped empty string is returned.
 * @param {string} cssText CSS text to be sanitized.
 * @param {function(string, string):?SafeUrl=} opt_uriRewriter A URI
 *     rewriter that returns a SafeUrl.
 * @return {!SafeStyle} A sanitized inline cssText.
 */
function sanitizeInlineStyleString(
    cssText, opt_uriRewriter) {
  // same check as in goog.html.sanitizer.HTML_SANITIZER_SUPPORTED_
  if (userAgent.IE && document.documentMode < 10) {
    return new SafeStyle();
  }

  var div = createInertDocument_()
      .createElement('DIV');
  div.style.cssText = cssText;
  return sanitizeInlineStyle(
      div.style, opt_uriRewriter);
};

/**
 * Converts rules in STYLE tags into style attributes on the tags they apply to.
 * Modifies the provided DOM subtree in-place.
 * @param {!Element} element
 * @package
 */
function inlineStyleRules(element) {
  // Note that Webkit used to offer the perfect function for the job:
  // getMatchedCSSRules. Unfortunately, it was never supported cross-browser and
  // is deprecated now. On the other hand, getComputedStyle cannot be used to
  // differentiate property values that are set by a style sheet from those set
  // by a style attribute or default values. This algorithm with
  // O(nr_of_elements * nr_of_rules) complexity that has to manually sort
  // selectors by specificity is the best we can do.

  // Extract all rules from STYLE tags found in the subtree.
  /** @type {!Array<!HTMLStyleElement>} */
  var styleTags =
      noclobber.getElementsByTagName(element, 'STYLE');
  var cssRules = googarray.concatMap(styleTags, function(styleTag) {
    return googarray.toArray(
        noclobber.getElementStyleSheet(styleTag).cssRules);
  });
  cssRules = getOnlyStyleRules_(cssRules);
  // Sort the rules by descending specificity.
  cssRules.sort(function(a, b) {
    var aSpecificity = CssSpecificity.getSpecificity(a.selectorText);
    var bSpecificity = CssSpecificity.getSpecificity(b.selectorText);
    return -googarray.compare3(aSpecificity, bSpecificity);
  });
  // For each element, apply the matching rules to the element style attribute.
  // If a property is already explicitly defined, do not update it. This
  // guarantees that the rule with selectors with the highest priority (or the
  // properties defined in the style attribute itself) have precedence over
  // lower priority ones.
  var subTreeWalker = document.createTreeWalker(
      element, NodeFilter.SHOW_ELEMENT, null /* filter */,
      false /* entityReferenceExpansion */);
  var currentElement;
  while (currentElement = /** @type {!Element} */ (subTreeWalker.nextNode())) {
    googarray.forEach(cssRules, function(rule) {
      if (!noclobber.elementMatches(
              currentElement, rule.selectorText)) {
        return;
      }
      if (!rule.style) {
        return;
      }
      mergeStyleDeclarations_(
          currentElement, rule.style);
    });
  }
  // Delete the STYLE tags.
  googarray.forEach(styleTags, dom.removeNode);
};

/**
 * Merges style properties from `styleDeclaration` into
 * `element.style`.
 * @param {!Element} element
 * @param {!CSSStyleDeclaration} styleDeclaration
 * @private
 */
function mergeStyleDeclarations_(
    element, styleDeclaration) {
  var existingPropNames =
      getCssPropNames_(element.style);
  var newPropNames =
      getCssPropNames_(styleDeclaration);

  googarray.forEach(newPropNames, function(propName) {
    if (existingPropNames.indexOf(propName) >= 0) {
      // This was either a property set by the style attribute or a stylesheet
      // rule with a higher priority. Leave the existing value.
      return;
    }
    var propValue = noclobber.getCssPropertyValue(
        styleDeclaration, propName);
    noclobber.setCssProperty(
        element.style, propName, propValue);
  });
};

/**
 * Creates an DOM Document object that will not execute scripts or make
 * network requests while parsing HTML.
 * @return {!Document}
 * @private
 */
function createInertDocument_() {
  // Documents created using window.document.implementation.createHTMLDocument()
  // use the same custom component registry as their parent document. This means
  // that parsing arbitrary HTML can result in calls to user-defined JavaScript.
  // This is worked around by creating a template element and its content's
  // document. See https://github.com/cure53/DOMPurify/issues/47.
  var doc = document;
  if (typeof HTMLTemplateElement === 'function') {
    doc =
        dom.createElement(TagName.TEMPLATE).content.ownerDocument;
  }
  return doc.implementation.createHTMLDocument('');
};

/**
 * Provides a cross-browser way to get a CSS property names.
 * @param {!CSSStyleDeclaration} cssStyle A CSS style object.
 * @return {!Array<string>} CSS property names.
 * @private
 */
function getCssPropNames_(cssStyle) {
  var propNames = [];
  if (google.isArrayLike(cssStyle)) {
    // Gets property names via item().
    // https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-item
    propNames = googarray.toArray(cssStyle);
  } else {
    // In IE8 and other older browsers we have to iterate over all the property
    // names. We skip cssText because it contains the unsanitized CSS, which
    // defeats the purpose.
    propNames = goog_object.getKeys(cssStyle);
    googarray.remove(propNames, 'cssText');
  }
  return propNames;
};

/**
 * Checks whether the property name specified should be disallowed.
 * @param {string} propName A property name.
 * @return {boolean} Whether the property name is disallowed.
 * @private
 */
function isDisallowedPropertyName_(
    propName) {
  // getPropertyValue doesn't deal with custom variables properly and will NOT
  // decode CSS escapes (but the browser will do so silently). Simply disallow
  // custom variables (http://www.w3.org/TR/css-variables/#defining-variables).
  return goog_strings.startsWith(propName, '--') ||
      goog_strings.startsWith(propName, 'var');
};

export {inlineStyleRules, safeParseHtmlAndGetInertElement, sanitizeInlineStyle, sanitizeInlineStyleString, sanitizeStyleSheetString};