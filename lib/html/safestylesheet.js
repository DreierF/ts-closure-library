import * as googarray from './../array/array.js';
import * as goog_asserts from './../asserts/asserts.js';
import {AssertionError} from './../asserts/asserts.js';
import * as google from './../google.js';
import * as goog_object from './../object/object.js';
import {Const} from './../string/const.js';
import * as internal from './../string/internal.js';
import {TypedString} from './../string/typedstring.js';
import {SafeStyle as HtmlSafeStyle} from './safestyle.js';
// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview The SafeStyleSheet type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */

/**
 * A string-like object which represents a CSS style sheet and that carries the
 * security type contract that its value, as a string, will not cause untrusted
 * script execution (XSS) when evaluated as CSS in a browser.
 *
 * Instances of this type must be created via the factory method
 * `SafeStyleSheet.fromConstant` and not by invoking its
 * constructor. The constructor intentionally takes no parameters and the type
 * is immutable; hence only a default instance corresponding to the empty string
 * can be obtained via constructor invocation.
 *
 * A SafeStyleSheet's string representation can safely be interpolated as the
 * content of a style element within HTML. The SafeStyleSheet string should
 * not be escaped before interpolation.
 *
 * Values of this type must be composable, i.e. for any two values
 * `styleSheet1` and `styleSheet2` of this type,
 * {@code SafeStyleSheet.unwrap(styleSheet1) +
 * SafeStyleSheet.unwrap(styleSheet2)} must itself be a value that
 * satisfies the SafeStyleSheet type constraint. This requirement implies that
 * for any value `styleSheet` of this type,
 * `SafeStyleSheet.unwrap(styleSheet1)` must end in
 * "beginning of rule" context.

 * A SafeStyleSheet can be constructed via security-reviewed unchecked
 * conversions. In this case producers of SafeStyleSheet must ensure themselves
 * that the SafeStyleSheet does not contain unsafe script. Note in particular
 * that {@code &lt;} is dangerous, even when inside CSS strings, and so should
 * always be forbidden or CSS-escaped in user controlled input. For example, if
 * {@code &lt;/style&gt;&lt;script&gt;evil&lt;/script&gt;"} were interpolated
 * inside a CSS string, it would break out of the context of the original
 * style element and `evil` would execute. Also note that within an HTML
 * style (raw text) element, HTML character references, such as
 * {@code &amp;lt;}, are not allowed. See
 *
 http://www.w3.org/TR/html5/scripting-1.html#restrictions-for-contents-of-script-elements
 * (similar considerations apply to the style element).
 *
 * @see SafeStyleSheet#fromConstant
 * @final
 * @class
 * @implements {TypedString}
 */
class SafeStyleSheet {

  /**
   * A string-like object which represents a CSS style sheet and that carries the
   * security type contract that its value, as a string, will not cause untrusted
   * script execution (XSS) when evaluated as CSS in a browser.
   *
   * Instances of this type must be created via the factory method
   * `SafeStyleSheet.fromConstant` and not by invoking its
   * constructor. The constructor intentionally takes no parameters and the type
   * is immutable; hence only a default instance corresponding to the empty string
   * can be obtained via constructor invocation.
   *
   * A SafeStyleSheet's string representation can safely be interpolated as the
   * content of a style element within HTML. The SafeStyleSheet string should
   * not be escaped before interpolation.
   *
   * Values of this type must be composable, i.e. for any two values
   * `styleSheet1` and `styleSheet2` of this type,
   * {@code SafeStyleSheet.unwrap(styleSheet1) +
   * SafeStyleSheet.unwrap(styleSheet2)} must itself be a value that
   * satisfies the SafeStyleSheet type constraint. This requirement implies that
   * for any value `styleSheet` of this type,
   * `SafeStyleSheet.unwrap(styleSheet1)` must end in
   * "beginning of rule" context.
  
   * A SafeStyleSheet can be constructed via security-reviewed unchecked
   * conversions. In this case producers of SafeStyleSheet must ensure themselves
   * that the SafeStyleSheet does not contain unsafe script. Note in particular
   * that {@code &lt;} is dangerous, even when inside CSS strings, and so should
   * always be forbidden or CSS-escaped in user controlled input. For example, if
   * {@code &lt;/style&gt;&lt;script&gt;evil&lt;/script&gt;"} were interpolated
   * inside a CSS string, it would break out of the context of the original
   * style element and `evil` would execute. Also note that within an HTML
   * style (raw text) element, HTML character references, such as
   * {@code &amp;lt;}, are not allowed. See
   *
   http://www.w3.org/TR/html5/scripting-1.html#restrictions-for-contents-of-script-elements
   * (similar considerations apply to the style element).
   *
   * @see SafeStyleSheet#fromConstant
   */
  constructor() {
    /**
     * @override
     * @const
     */
    this.implementsGoogStringTypedString = true;
  
    /**
     * The contained value of this SafeStyleSheet.  The field has a purposely
     * ugly name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {string}
     */
    this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = '';
  
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeStyleSheet#unwrap
     * @const {!Object}
     * @private
     */
    this.SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ =
        SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  }

  /**
   * Creates a style sheet consisting of one selector and one style definition.
   * Use {@link SafeStyleSheet.concat} to create longer style sheets.
   * This function doesn't support @import, @media and similar constructs.
   * @param {string} selector CSS selector, e.g. '#id' or 'tag .class, #id'. We
   *     support CSS3 selectors: https://w3.org/TR/css3-selectors/#selectors.
   * @param {!HtmlSafeStyle.PropertyMap|!HtmlSafeStyle} style Style
   *     definition associated with the selector.
   * @return {!SafeStyleSheet}
   * @throws {Error} If invalid selector is provided.
   */
  static createRule(selector, style) {
    if (internal.contains(selector, '<')) {
      throw new Error('Selector does not allow \'<\', got: ' + selector);
    }
  
    // Remove strings.
    var selectorToCheck =
        selector.replace(/('|")((?!\1)[^\r\n\f\\]|\\[\s\S])*\1/g, '');
  
    // Check characters allowed in CSS3 selectors.
    if (!/^[-_a-zA-Z0-9#.:* ,>+~[\]()=^$|]+$/.test(selectorToCheck)) {
      throw new Error(
          'Selector allows only [-_a-zA-Z0-9#.:* ,>+~[\\]()=^$|] and ' +
          'strings, got: ' + selector);
    }
  
    // Check balanced () and [].
    if (!SafeStyleSheet.hasBalancedBrackets_(selectorToCheck)) {
      throw new Error('() and [] in selector must be balanced, got: ' + selector);
    }
  
    if (!(style instanceof HtmlSafeStyle)) {
      style = HtmlSafeStyle.create(style);
    }
    var styleSheet = selector + '{' +
        HtmlSafeStyle.unwrap(style).replace(/</g, '\\3C ') + '}';
    return SafeStyleSheet
        .createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheet);
  };

  /**
   * Checks if a string has balanced () and [] brackets.
   * @param {string} s String to check.
   * @return {boolean}
   * @private
   */
  static hasBalancedBrackets_(s) {
    var brackets = {'(': ')', '[': ']'};
    var expectedBrackets = [];
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (brackets[ch]) {
        expectedBrackets.push(brackets[ch]);
      } else if (goog_object.contains(brackets, ch)) {
        if (expectedBrackets.pop() != ch) {
          return false;
        }
      }
    }
    return expectedBrackets.length == 0;
  };

  /**
   * Creates a new SafeStyleSheet object by concatenating values.
   * @suppress{checkTypes}
   * @param {...(!SafeStyleSheet|!Array<!SafeStyleSheet>)}
   *     var_args Values to concatenate.
   * @return {!SafeStyleSheet}
   */
  static concat(var_args) {
    var result = '';
  
    /**
     * @param {!SafeStyleSheet|!Array<!SafeStyleSheet>}
     *     argument
     */
    function addArgument(argument) {
      if (google.isArray(argument)) {
        googarray.forEach(argument, addArgument);
      } else {
        result += SafeStyleSheet.unwrap(argument);
      }
    };
  
    googarray.forEach(arguments, addArgument);
    return SafeStyleSheet
        .createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(result);
  };

  /**
   * Creates a SafeStyleSheet object from a compile-time constant string.
   *
   * `styleSheet` must not have any &lt; characters in it, so that
   * the syntactic structure of the surrounding HTML is not affected.
   *
   * @param {!Const} styleSheet A compile-time-constant string from
   *     which to create a SafeStyleSheet.
   * @return {!SafeStyleSheet} A SafeStyleSheet object initialized to
   *     `styleSheet`.
   */
  static fromConstant(styleSheet) {
    var styleSheetString = Const.unwrap(styleSheet);
    if (styleSheetString.length === 0) {
      return SafeStyleSheet.EMPTY;
    }
    // > is a valid character in CSS selectors and there's no strict need to
    // block it if we already block <.
    goog_asserts.assert(
        !internal.contains(styleSheetString, '<'),
        'Forbidden \'<\' character in style sheet string: ' + styleSheetString);
    return SafeStyleSheet
        .createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheetString);
  };

  /**
   * Returns this SafeStyleSheet's value as a string.
   *
   * IMPORTANT: In code where it is security relevant that an object's type is
   * indeed `SafeStyleSheet`, use `SafeStyleSheet.unwrap`
   * instead of this method. If in doubt, assume that it's security relevant. In
   * particular, note that google.html functions which return a google.html type do
   * not guarantee the returned instance is of the right type. For example:
   *
   * <pre>
   * var fakeSafeHtml = new String('fake');
   * fakeSafeHtml.__proto__ = goog.html.SafeHtml.prototype;
   * var newSafeHtml = goog.html.SafeHtml.htmlEscape(fakeSafeHtml);
   * // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
   * // goog.html.SafeHtml.htmlEscape() as fakeSafeHtml
   * // instanceof goog.html.SafeHtml.
   * </pre>
   *
   * @see SafeStyleSheet#unwrap
   * @override
   */
  getTypedStringValue() {
    return this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
  };

  /**
   * Performs a runtime check that the provided object is indeed a
   * SafeStyleSheet object, and returns its value.
   *
   * @param {!SafeStyleSheet} safeStyleSheet The object to extract from.
   * @return {string} The safeStyleSheet object's contained string, unless
   *     the run-time type check fails. In that case, `unwrap` returns an
   *     innocuous string, or, if assertions are enabled, throws
   *     `AssertionError`.
   */
  static unwrap(safeStyleSheet) {
    // Perform additional Run-time type-checking to ensure that
    // safeStyleSheet is indeed an instance of the expected type.  This
    // provides some additional protection against security bugs due to
    // application code that disables type checks.
    // Specifically, the following checks are performed:
    // 1. The object is an instance of the expected type.
    // 2. The object is not an instance of a subclass.
    // 3. The object carries a type marker for the expected type. "Faking" an
    // object requires a reference to the type marker, which has names intended
    // to stand out in code reviews.
    if (safeStyleSheet instanceof SafeStyleSheet &&
        safeStyleSheet.constructor === SafeStyleSheet &&
        safeStyleSheet
                .SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ===
            SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
      return safeStyleSheet.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
    } else {
      goog_asserts.fail('expected object of type SafeStyleSheet, got \'' +
          safeStyleSheet + '\' of type ' + google.typeOf(safeStyleSheet));
      return 'type_error:SafeStyleSheet';
    }
  };

  /**
   * Package-internal utility method to create SafeStyleSheet instances.
   *
   * @param {string} styleSheet The string to initialize the SafeStyleSheet
   *     object with.
   * @return {!SafeStyleSheet} The initialized SafeStyleSheet object.
   * @package
   */
  static createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheet) {
    return new SafeStyleSheet().initSecurityPrivateDoNotAccessOrElse_(
        styleSheet);
  };

  /**
   * Called from createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(). This
   * method exists only so that the compiler can dead code eliminate static
   * fields (like EMPTY) when they're not accessed.
   * @param {string} styleSheet
   * @return {!SafeStyleSheet}
   * @private
   */
  initSecurityPrivateDoNotAccessOrElse_(styleSheet) {
    this.privateDoNotAccessOrElseSafeStyleSheetWrappedValue_ = styleSheet;
    return this;
  };
}

/**
 * Type marker for the SafeStyleSheet type, used to implement additional
 * run-time type checking.
 * @const {!Object}
 * @private
 */
SafeStyleSheet.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};

/**
 * A SafeStyleSheet instance corresponding to the empty string.
 * @const {!SafeStyleSheet}
 */
SafeStyleSheet.EMPTY =
    SafeStyleSheet
        .createSafeStyleSheetSecurityPrivateDoNotAccessOrElse('');

export {SafeStyleSheet};