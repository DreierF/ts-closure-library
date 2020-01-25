import * as google from './../google.js';
// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Utility functions for supporting Bidi issues.
 */

/**
 * Namespace for bidi supporting functions.
 */
/**
 * @type {boolean} FORCE_RTL forces the {@link IS_RTL} constant
 * to say that the current locale is a RTL locale.  This should only be used
 * if you want to override the default behavior for deciding whether the
 * current locale is RTL or not.
 *
 * {@see IS_RTL}
 */
const FORCE_RTL = false;

/**
 * Constant that defines whether or not the current locale is a RTL locale.
 * If {@link FORCE_RTL} is not true, this constant will default
 * to check that {@link google.LOCALE} is one of a few major RTL locales.
 *
 * <p>This is designed to be a maximally efficient compile-time constant. For
 * example, for the default google.LOCALE, compiling
 * "if (IS_RTL) alert('rtl') else {}" should produce no code. It
 * is this design consideration that limits the implementation to only
 * supporting a few major RTL locales, as opposed to the broader repertoire of
 * something like isRtlLanguage.
 *
 * <p>Since this constant refers to the directionality of the locale, it is up
 * to the caller to determine if this constant should also be used for the
 * direction of the UI.
 *
 * {@see google.LOCALE}
 *
 * @type {boolean}
 *
 * TODO(user): write a test that checks that this is a compile-time constant.
 */
// LINT.IfChange
let IS_RTL =
    FORCE_RTL ||
    ((google.LOCALE.substring(0, 2).toLowerCase() == 'ar' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'fa' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'he' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'iw' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'ps' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'sd' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'ug' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'ur' ||
      google.LOCALE.substring(0, 2).toLowerCase() == 'yi') &&
     (google.LOCALE.length == 2 || google.LOCALE.substring(2, 3) == '-' ||
      google.LOCALE.substring(2, 3) == '_')) ||
    (  // Specific to CKB (Central Kurdish)
        google.LOCALE.length >= 3 &&
        google.LOCALE.substring(0, 3).toLowerCase() == 'ckb' &&
        (google.LOCALE.length == 3 || google.LOCALE.substring(3, 4) == '-' ||
         google.LOCALE.substring(3, 4) == '_')) ||
    (  // 2 letter language codes with RTL scripts
        google.LOCALE.length >= 7 &&
        ((google.LOCALE.substring(2, 3) == '-' ||
          google.LOCALE.substring(2, 3) == '_') &&
         (google.LOCALE.substring(3, 7).toLowerCase() == 'adlm' ||
          google.LOCALE.substring(3, 7).toLowerCase() == 'arab' ||
          google.LOCALE.substring(3, 7).toLowerCase() == 'hebr' ||
          google.LOCALE.substring(3, 7).toLowerCase() == 'nkoo' ||
          google.LOCALE.substring(3, 7).toLowerCase() == 'rohg' ||
          google.LOCALE.substring(3, 7).toLowerCase() == 'thaa'))) ||
    (  // 3 letter languages codes with RTL scripts
        google.LOCALE.length >= 8 &&
        ((google.LOCALE.substring(3, 4) == '-' ||
          google.LOCALE.substring(3, 4) == '_') &&
         (google.LOCALE.substring(4, 8).toLowerCase() == 'adlm' ||
          google.LOCALE.substring(4, 8).toLowerCase() == 'arab' ||
          google.LOCALE.substring(4, 8).toLowerCase() == 'hebr' ||
          google.LOCALE.substring(4, 8).toLowerCase() == 'nkoo' ||
          google.LOCALE.substring(4, 8).toLowerCase() == 'rohg' ||
          google.LOCALE.substring(4, 8).toLowerCase() == 'thaa')));
//    closure/RtlLocalesTest.java)

// TODO(b/77919903): Add additional scripts and languages that are RTL,
// e.g., mende, samaritan, etc.

/**
 * Unicode formatting characters and directionality string constants.
 * @enum {string}
 */
let Format = {
  /** Unicode "Left-To-Right Embedding" (LRE) character. */
  LRE: '\u202A',
  /** Unicode "Right-To-Left Embedding" (RLE) character. */
  RLE: '\u202B',
  /** Unicode "Pop Directional Formatting" (PDF) character. */
  PDF: '\u202C',
  /** Unicode "Left-To-Right Mark" (LRM) character. */
  LRM: '\u200E',
  /** Unicode "Right-To-Left Mark" (RLM) character. */
  RLM: '\u200F'
};

/**
 * Directionality enum.
 * @enum {number}
 */
let Dir = {
  /**
   * Left-to-right.
   */
  LTR: 1,

  /**
   * Right-to-left.
   */
  RTL: -1,

  /**
   * Neither left-to-right nor right-to-left.
   */
  NEUTRAL: 0
};

/**
 * 'right' string constant.
 * @type {string}
 */
let RIGHT = 'right';

/**
 * 'left' string constant.
 * @type {string}
 */
let LEFT = 'left';

/**
 * 'left' if locale is RTL, 'right' if not.
 * @type {string}
 */
let I18N_RIGHT =
    IS_RTL ? LEFT : RIGHT;

/**
 * 'right' if locale is RTL, 'left' if not.
 * @type {string}
 */
let I18N_LEFT =
    IS_RTL ? RIGHT : LEFT;

/**
 * Convert a directionality given in various formats to a Dir
 * constant. Useful for interaction with different standards of directionality
 * representation.
 *
 * @param {Dir|number|boolean|null} givenDir Directionality given
 *     in one of the following formats:
 *     1. A Dir constant.
 *     2. A number (positive = LTR, negative = RTL, 0 = neutral).
 *     3. A boolean (true = RTL, false = LTR).
 *     4. A null for unknown directionality.
 * @param {boolean=} opt_noNeutral Whether a givenDir of zero or
 *     Dir.NEUTRAL should be treated as null, i.e. unknown, in
 *     order to preserve legacy behavior.
 * @return {?Dir} A Dir constant matching the
 *     given directionality. If given null, returns null (i.e. unknown).
 */
function toDir(givenDir, opt_noNeutral) {
  if (typeof givenDir == 'number') {
    // This includes the non-null Dir case.
    return givenDir > 0 ?
        Dir.LTR :
        givenDir < 0 ? Dir.RTL :
                       opt_noNeutral ? null : Dir.NEUTRAL;
  } else if (givenDir == null) {
    return null;
  } else {
    // Must be typeof givenDir == 'boolean'.
    return givenDir ? Dir.RTL : Dir.LTR;
  }
};

/**
 * A practical pattern to identify strong LTR character in the BMP.
 * This pattern is not theoretically correct according to the Unicode
 * standard. It is simplified for performance and small code size.
 * It also partially supports LTR scripts beyond U+FFFF by including
 * UTF-16 high surrogate values corresponding to mostly L-class code
 * point ranges.
 * However, low surrogate values and private-use regions are not included
 * in this RegEx.
 * @type {string}
 * @private
 */
let ltrChars_ =
    'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0900-\u1FFF' +
    '\u200E\u2C00-\uD801\uD804-\uD839\uD83C-\uDBFF' +
    '\uF900-\uFB1C\uFE00-\uFE6F\uFEFD-\uFFFF';

/**
 * A practical pattern to identify strong RTL character. This pattern is not
 * theoretically correct according to the Unicode standard. It is simplified
 * for performance and small code size.
 * It also partially supports RTL scripts beyond U+FFFF by including
 * UTF-16 high surrogate values corresponding to mostly R- or AL-class
 * code point ranges.
 * However, low surrogate values and private-use regions are not included
 * in this RegEx.
 * @type {string}
 * @private
 */
let rtlChars_ =
    '\u0591-\u06EF\u06FA-\u08FF\u200F\uD802-\uD803\uD83A-\uD83B' +
    '\uFB1D-\uFDFF\uFE70-\uFEFC';

/**
 * Simplified regular expression for an HTML tag (opening or closing) or an HTML
 * escape. We might want to skip over such expressions when estimating the text
 * directionality.
 * @type {RegExp}
 * @private
 */
let htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;

/**
 * Returns the input text with spaces instead of HTML tags or HTML escapes, if
 * opt_isStripNeeded is true. Else returns the input as is.
 * Useful for text directionality estimation.
 * Note: the function should not be used in other contexts; it is not 100%
 * correct, but rather a good-enough implementation for directionality
 * estimation purposes.
 * @param {string} str The given string.
 * @param {boolean=} opt_isStripNeeded Whether to perform the stripping.
 *     Default: false (to retain consistency with calling functions).
 * @return {string} The given string cleaned of HTML tags / escapes.
 * @private
 */
function stripHtmlIfNeeded_(str, opt_isStripNeeded) {
  return opt_isStripNeeded ? str.replace(htmlSkipReg_, '') : str;
};

/**
 * Regular expression to check for RTL characters, BMP and high surrogate.
 * @type {RegExp}
 * @private
 */
let rtlCharReg_ = new RegExp('[' + rtlChars_ + ']');

/**
 * Regular expression to check for LTR characters.
 * @type {RegExp}
 * @private
 */
let ltrCharReg_ = new RegExp('[' + ltrChars_ + ']');

/**
 * Test whether the given string has any RTL characters in it.
 * @param {string} str The given string that need to be tested.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether the string contains RTL characters.
 */
function hasAnyRtl(str, opt_isHtml) {
  return rtlCharReg_.test(
      stripHtmlIfNeeded_(str, opt_isHtml));
};

/**
 * Test whether the given string has any RTL characters in it.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the string contains RTL characters.
 * @deprecated Use hasAnyRtl.
 */
function hasRtlChar(str) {
  return hasAnyRtl(str);
}

/**
 * Test whether the given string has any LTR characters in it.
 * @param {string} str The given string that need to be tested.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether the string contains LTR characters.
 */
function hasAnyLtr(str, opt_isHtml) {
  return ltrCharReg_.test(
      stripHtmlIfNeeded_(str, opt_isHtml));
};

/**
 * Regular expression pattern to check if the first character in the string
 * is LTR.
 * @type {RegExp}
 * @private
 */
let ltrRe_ = new RegExp('^[' + ltrChars_ + ']');

/**
 * Regular expression pattern to check if the first character in the string
 * is RTL.
 * @type {RegExp}
 * @private
 */
let rtlRe_ = new RegExp('^[' + rtlChars_ + ']');

/**
 * Check if the first character in the string is RTL or not.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the first character in str is an RTL char.
 */
function isRtlChar(str) {
  return rtlRe_.test(str);
};

/**
 * Check if the first character in the string is LTR or not.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the first character in str is an LTR char.
 */
function isLtrChar(str) {
  return ltrRe_.test(str);
};

/**
 * Check if the first character in the string is neutral or not.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the first character in str is a neutral char.
 */
function isNeutralChar(str) {
  return !isLtrChar(str) && !isRtlChar(str);
};

/**
 * Regular expressions to check if a piece of text is of LTR directionality
 * on first character with strong directionality.
 * @type {RegExp}
 * @private
 */
let ltrDirCheckRe_ = new RegExp(
    '^[^' + rtlChars_ + ']*[' + ltrChars_ + ']');

/**
 * Regular expressions to check if a piece of text is of RTL directionality
 * on first character with strong directionality.
 * @type {RegExp}
 * @private
 */
let rtlDirCheckRe_ = new RegExp(
    '^[^' + ltrChars_ + ']*[' + rtlChars_ + ']');

/**
 * Check whether the first strongly directional character (if any) is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL directionality is detected using the first
 *     strongly-directional character method.
 */
function startsWithRtl(str, opt_isHtml) {
  return rtlDirCheckRe_.test(
      stripHtmlIfNeeded_(str, opt_isHtml));
};

/**
 * Check whether the first strongly directional character (if any) is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL directionality is detected using the first
 *     strongly-directional character method.
 * @deprecated Use startsWithRtl.
 */
function isRtlText(str, opt_isHtml) {
  return startsWithRtl(str, opt_isHtml);
}

/**
 * Check whether the first strongly directional character (if any) is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR directionality is detected using the first
 *     strongly-directional character method.
 */
function startsWithLtr(str, opt_isHtml) {
  return ltrDirCheckRe_.test(
      stripHtmlIfNeeded_(str, opt_isHtml));
};

/**
 * Check whether the first strongly directional character (if any) is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR directionality is detected using the first
 *     strongly-directional character method.
 * @deprecated Use startsWithLtr.
 */
function isLtrText(str, opt_isHtml) {
  return startsWithLtr(str, opt_isHtml);
}

/**
 * Regular expression to check if a string looks like something that must
 * always be LTR even in RTL text, e.g. a URL. When estimating the
 * directionality of text containing these, we treat these as weakly LTR,
 * like numbers.
 * @type {RegExp}
 * @private
 */
let isRequiredLtrRe_ = /^http:\/\/.*/;

/**
 * Check whether the input string either contains no strongly directional
 * characters or looks like a url.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether neutral directionality is detected.
 */
function isNeutralText(str, opt_isHtml) {
  str = stripHtmlIfNeeded_(str, opt_isHtml);
  return isRequiredLtrRe_.test(str) ||
      !hasAnyLtr(str) && !hasAnyRtl(str);
};

/**
 * Regular expressions to check if the last strongly-directional character in a
 * piece of text is LTR.
 * @type {RegExp}
 * @private
 */
let ltrExitDirCheckRe_ = new RegExp(
    '[' + ltrChars_ + ']' +
    '[^' + rtlChars_ + ']*$');

/**
 * Regular expressions to check if the last strongly-directional character in a
 * piece of text is RTL.
 * @type {RegExp}
 * @private
 */
let rtlExitDirCheckRe_ = new RegExp(
    '[' + rtlChars_ + ']' +
    '[^' + ltrChars_ + ']*$');

/**
 * Check if the exit directionality a piece of text is LTR, i.e. if the last
 * strongly-directional character in the string is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR exit directionality was detected.
 */
function endsWithLtr(str, opt_isHtml) {
  return ltrExitDirCheckRe_.test(
      stripHtmlIfNeeded_(str, opt_isHtml));
};

/**
 * Check if the exit directionality a piece of text is LTR, i.e. if the last
 * strongly-directional character in the string is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR exit directionality was detected.
 * @deprecated Use endsWithLtr.
 */
function isLtrExitText(str, opt_isHtml) {
  return endsWithLtr(str, opt_isHtml);
}

/**
 * Check if the exit directionality a piece of text is RTL, i.e. if the last
 * strongly-directional character in the string is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL exit directionality was detected.
 */
function endsWithRtl(str, opt_isHtml) {
  return rtlExitDirCheckRe_.test(
      stripHtmlIfNeeded_(str, opt_isHtml));
};

/**
 * Check if the exit directionality a piece of text is RTL, i.e. if the last
 * strongly-directional character in the string is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL exit directionality was detected.
 * @deprecated Use endsWithRtl.
 */
function isRtlExitText(str, opt_isHtml) {
  return endsWithRtl(str, opt_isHtml);
}

/**
 * A regular expression for matching right-to-left language codes.
 * See {@link #isRtlLanguage} for the design.
 * Note that not all RTL scripts are included.
 * @type {!RegExp}
 * @private
 */
let rtlLocalesRe_ = new RegExp(
    '^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|' +
        '.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))' +
        '(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)',
    'i');

/**
 * Check if a BCP 47 / III language code indicates an RTL language, i.e. either:
 * - a language code explicitly specifying one of the right-to-left scripts,
 *   e.g. "az-Arab", or<p>
 * - a language code specifying one of the languages normally written in a
 *   right-to-left script, e.g. "fa" (Farsi), except ones explicitly specifying
 *   Latin or Cyrillic script (which are the usual LTR alternatives).<p>
 * The list of right-to-left scripts appears in the 100-199 range in
 * http://www.unicode.org/iso15924/iso15924-num.html, of which Arabic and
 * Hebrew are by far the most widely used. We also recognize Thaana, and N'Ko,
 * which also have significant modern usage. Adlam and Rohingya
 * scripts are now included since they can be expected to be used in the
 * future. The rest (Syriac, Samaritan, Mandaic, etc.) seem to have extremely
 * limited or no modern usage and are not recognized to save on code size. The
 * languages usually written in a right-to-left script are taken as those with
 * Suppress-Script: Hebr|Arab|Thaa|Nkoo|Adlm|Rohg in
 * http://www.iana.org/assignments/language-subtag-registry,
 * as well as Central (or Sorani) Kurdish (ckb), Sindhi (sd) and Uyghur (ug).
 * Other subtags of the language code, e.g. regions like EG (Egypt), are
 * ignored.
 * @param {string} lang BCP 47 (a.k.a III) language code.
 * @return {boolean} Whether the language code is an RTL language.
 */
function isRtlLanguage(lang) {
  return rtlLocalesRe_.test(lang);
};

/**
 * Regular expression for bracket guard replacement in text.
 * @type {RegExp}
 * @private
 */
let bracketGuardTextRe_ =
    /(\(.*?\)+)|(\[.*?\]+)|(\{.*?\}+)|(<.*?>+)/g;

/**
 * Apply bracket guard using LRM and RLM. This is to address the problem of
 * messy bracket display frequently happens in RTL layout.
 * This function works for plain text, not for HTML. In HTML, the opening
 * bracket might be in a different context than the closing bracket (such as
 * an attribute value).
 * @param {string} s The string that need to be processed.
 * @param {boolean=} opt_isRtlContext specifies default direction (usually
 *     direction of the UI).
 * @return {string} The processed string, with all bracket guarded.
 */
function guardBracketInText(s, opt_isRtlContext) {
  const useRtl = opt_isRtlContext === undefined ? hasAnyRtl(s) :
                                                  opt_isRtlContext;
  const mark = useRtl ? Format.RLM : Format.LRM;
  return s.replace(bracketGuardTextRe_, mark + '$&' + mark);
};

/**
 * Enforce the html snippet in RTL directionality regardless of overall context.
 * If the html piece was enclosed by tag, dir will be applied to existing
 * tag, otherwise a span tag will be added as wrapper. For this reason, if
 * html snippet starts with a tag, this tag must enclose the whole piece. If
 * the tag already has a dir specified, this new one will override existing
 * one in behavior (tested on FF and IE).
 * @param {string} html The string that need to be processed.
 * @return {string} The processed string, with directionality enforced to RTL.
 */
function enforceRtlInHtml(html) {
  if (html.charAt(0) == '<') {
    return html.replace(/<\w+/, '$& dir=rtl');
  }
  // '\n' is important for FF so that it won't incorrectly merge span groups
  return '\n<span dir=rtl>' + html + '</span>';
};

/**
 * Enforce RTL on both end of the given text piece using unicode BiDi formatting
 * characters RLE and PDF.
 * @param {string} text The piece of text that need to be wrapped.
 * @return {string} The wrapped string after process.
 */
function enforceRtlInText(text) {
  return Format.RLE + text + Format.PDF;
};

/**
 * Enforce the html snippet in RTL directionality regardless or overall context.
 * If the html piece was enclosed by tag, dir will be applied to existing
 * tag, otherwise a span tag will be added as wrapper. For this reason, if
 * html snippet starts with a tag, this tag must enclose the whole piece. If
 * the tag already has a dir specified, this new one will override existing
 * one in behavior (tested on FF and IE).
 * @param {string} html The string that need to be processed.
 * @return {string} The processed string, with directionality enforced to RTL.
 */
function enforceLtrInHtml(html) {
  if (html.charAt(0) == '<') {
    return html.replace(/<\w+/, '$& dir=ltr');
  }
  // '\n' is important for FF so that it won't incorrectly merge span groups
  return '\n<span dir=ltr>' + html + '</span>';
};

/**
 * Enforce LTR on both end of the given text piece using unicode BiDi formatting
 * characters LRE and PDF.
 * @param {string} text The piece of text that need to be wrapped.
 * @return {string} The wrapped string after process.
 */
function enforceLtrInText(text) {
  return Format.LRE + text + Format.PDF;
};

/**
 * Regular expression to find dimensions such as "padding: .3 0.4ex 5px 6;"
 * @type {RegExp}
 * @private
 */
let dimensionsRe_ =
    /:\s*([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)\s+([.\d][.\w]*)/g;

/**
 * Regular expression for left.
 * @type {RegExp}
 * @private
 */
let leftRe_ = /left/gi;

/**
 * Regular expression for right.
 * @type {RegExp}
 * @private
 */
let rightRe_ = /right/gi;

/**
 * Placeholder regular expression for swapping.
 * @type {RegExp}
 * @private
 */
let tempRe_ = /%%%%/g;

/**
 * Swap location parameters and 'left'/'right' in CSS specification. The
 * processed string will be suited for RTL layout. Though this function can
 * cover most cases, there are always exceptions. It is suggested to put
 * those exceptions in separate group of CSS string.
 * @param {string} cssStr CSS spefication string.
 * @return {string} Processed CSS specification string.
 */
function mirrorCSS(cssStr) {
  return cssStr
      .
      // reverse dimensions
      replace(dimensionsRe_, ':$1 $4 $3 $2')
      .replace(leftRe_, '%%%%')
      .  // swap left and right
      replace(rightRe_, LEFT)
      .replace(tempRe_, RIGHT);
};

/**
 * Regular expression for hebrew double quote substitution, finding quote
 * directly after hebrew characters.
 * @type {RegExp}
 * @private
 */
let doubleQuoteSubstituteRe_ = /([\u0591-\u05f2])"/g;

/**
 * Regular expression for hebrew single quote substitution, finding quote
 * directly after hebrew characters.
 * @type {RegExp}
 * @private
 */
let singleQuoteSubstituteRe_ = /([\u0591-\u05f2])'/g;

/**
 * Replace the double and single quote directly after a Hebrew character with
 * GERESH and GERSHAYIM. In such case, most likely that's user intention.
 * @param {string} str String that need to be processed.
 * @return {string} Processed string with double/single quote replaced.
 */
function normalizeHebrewQuote(str) {
  return str.replace(doubleQuoteSubstituteRe_, '$1\u05f4')
      .replace(singleQuoteSubstituteRe_, '$1\u05f3');
};

/**
 * Regular expression to split a string into "words" for directionality
 * estimation based on relative word counts.
 * @type {RegExp}
 * @private
 */
let wordSeparatorRe_ = /\s+/;

/**
 * Regular expression to check if a string contains any numerals. Used to
 * differentiate between completely neutral strings and those containing
 * numbers, which are weakly LTR.
 *
 * Native Arabic digits (\u0660 - \u0669) are not included because although they
 * do flow left-to-right inside a number, this is the case even if the  overall
 * directionality is RTL, and a mathematical expression using these digits is
 * supposed to flow right-to-left overall, including unary plus and minus
 * appearing to the right of a number, and this does depend on the overall
 * directionality being RTL. The digits used in Farsi (\u06F0 - \u06F9), on the
 * other hand, are included, since Farsi math (including unary plus and minus)
 * does flow left-to-right.
 * TODO: Consider other systems of digits, e.g., Adlam.
 *
 * @type {RegExp}
 * @private
 */
let hasNumeralsRe_ = /[\d\u06f0-\u06f9]/;

/**
 * This constant controls threshold of RTL directionality.
 * @type {number}
 * @private
 */
let rtlDetectionThreshold_ = 0.40;

/**
 * Estimates the directionality of a string based on relative word counts.
 * If the number of RTL words is above a certain percentage of the total number
 * of strongly directional words, returns RTL.
 * Otherwise, if any words are strongly or weakly LTR, returns LTR.
 * Otherwise, returns UNKNOWN, which is used to mean "neutral".
 * Numbers are counted as weakly LTR.
 * @param {string} str The string to be checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {Dir} Estimated overall directionality of `str`.
 */
function estimateDirection(str, opt_isHtml) {
  let rtlCount = 0;
  let totalCount = 0;
  let hasWeaklyLtr = false;
  const tokens = stripHtmlIfNeeded_(str, opt_isHtml)
                     .split(wordSeparatorRe_);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (startsWithRtl(token)) {
      rtlCount++;
      totalCount++;
    } else if (isRequiredLtrRe_.test(token)) {
      hasWeaklyLtr = true;
    } else if (hasAnyLtr(token)) {
      totalCount++;
    } else if (hasNumeralsRe_.test(token)) {
      hasWeaklyLtr = true;
    }
  }

  return totalCount == 0 ?
      (hasWeaklyLtr ? Dir.LTR : Dir.NEUTRAL) :
      (rtlCount / totalCount > rtlDetectionThreshold_ ?
           Dir.RTL :
           Dir.LTR);
};

/**
 * Check the directionality of a piece of text, return true if the piece of
 * text should be laid out in RTL direction.
 * @param {string} str The piece of text that need to be detected.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether this piece of text should be laid out in RTL.
 */
function detectRtlDirectionality(str, opt_isHtml) {
  return estimateDirection(str, opt_isHtml) ==
      Dir.RTL;
};

/**
 * Sets text input element's directionality and text alignment based on a
 * given directionality. Does nothing if the given directionality is unknown or
 * neutral.
 * @param {Element} element Input field element to set directionality to.
 * @param {Dir|number|boolean|null} dir Desired directionality,
 *     given in one of the following formats:
 *     1. A Dir constant.
 *     2. A number (positive = LRT, negative = RTL, 0 = neutral).
 *     3. A boolean (true = RTL, false = LTR).
 *     4. A null for unknown directionality.
 */
function setElementDirAndAlign(element, dir) {
  if (element) {
    const htmlElement = /** @type {!HTMLElement} */ (element);
    dir = toDir(dir);
    if (dir) {
      htmlElement.style.textAlign = dir == Dir.RTL ?
          RIGHT :
          LEFT;
      htmlElement.dir = dir == Dir.RTL ? 'rtl' : 'ltr';
    }
  }
};

/**
 * Sets element dir based on estimated directionality of the given text.
 * @param {!Element} element
 * @param {string} text
 */
function setElementDirByTextDirectionality(element, text) {
  const htmlElement = /** @type {!HTMLElement} */ (element);
  switch (estimateDirection(text)) {
    case (Dir.LTR):
      htmlElement.dir = 'ltr';
      break;
    case (Dir.RTL):
      htmlElement.dir = 'rtl';
      break;
    default:
      // Default for no direction, inherit from document.
      htmlElement.removeAttribute('dir');
  }
};

/**
 * Strings that have an (optional) known direction.
 *
 * Implementations of this interface are string-like objects that carry an
 * attached direction, if known.
 * @interface
 */
class DirectionalString {

  /**
   * Strings that have an (optional) known direction.
   *
   * Implementations of this interface are string-like objects that carry an
   * attached direction, if known.
   */
  constructor() {}

  /**
   * Retrieves this object's known direction (if any).
   * @return {?Dir} The known direction. Null if unknown.
   */
  getDirection() {}
}

/**
 * Interface marker of the DirectionalString interface.
 *
 * This property can be used to determine at runtime whether or not an object
 * implements this interface.  All implementations of this interface set this
 * property to `true`.
 * @type {boolean}
 */
DirectionalString.prototype
    .implementsGoogI18nBidiDirectionalString;

export {Dir, DirectionalString, FORCE_RTL, Format, I18N_LEFT, I18N_RIGHT, IS_RTL, LEFT, RIGHT, detectRtlDirectionality, endsWithLtr, endsWithRtl, enforceLtrInHtml, enforceLtrInText, enforceRtlInHtml, enforceRtlInText, estimateDirection, guardBracketInText, hasAnyLtr, hasAnyRtl, hasRtlChar, isLtrChar, isLtrExitText, isLtrText, isNeutralChar, isNeutralText, isRtlChar, isRtlExitText, isRtlLanguage, isRtlText, mirrorCSS, normalizeHebrewQuote, setElementDirAndAlign, setElementDirByTextDirectionality, startsWithLtr, startsWithRtl, toDir};