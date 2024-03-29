import * as google from './../google.js';
import * as goog_strings from './string.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview String functions called from Closure packages that couldn't
 * depend on each other. Outside Closure, use goog_strings function which
 * delegate to these.
 */

/**
 * Fast prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix A string to look for at the start of `str`.
 * @return {boolean} True if `str` begins with `prefix`.
 * @see goog_strings.startsWith
 */
function startsWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
};

/**
 * Fast suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of `str`.
 * @return {boolean} True if `str` ends with `suffix`.
 * @see goog_strings.endsWith
 */
function endsWith(str, suffix) {
  const l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
};

/**
 * Case-insensitive prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix  A string to look for at the end of `str`.
 * @return {boolean} True if `str` begins with `prefix` (ignoring
 *     case).
 * @see goog_strings.caseInsensitiveStartsWith
 */
function caseInsensitiveStartsWith(str, prefix) {
  return (
      caseInsensitiveCompare(
          prefix, str.slice(0, prefix.length)) == 0);
};

/**
 * Case-insensitive suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of `str`.
 * @return {boolean} True if `str` ends with `suffix` (ignoring
 *     case).
 * @see goog_strings.caseInsensitiveEndsWith
 */
function caseInsensitiveEndsWith(str, suffix) {
  return (
      caseInsensitiveCompare(
          suffix, str.slice(str.length - suffix.length)) == 0);
};

/**
 * Case-insensitive equality checker.
 * @param {string} str1 First string to check.
 * @param {string} str2 Second string to check.
 * @return {boolean} True if `str1` and `str2` are the same string,
 *     ignoring case.
 * @see goog_strings.caseInsensitiveEquals
 */
function caseInsensitiveEquals(str1, str2) {
  return str1.toLowerCase() == str2.toLowerCase();
};

/**
 * Checks if a string is empty or contains only whitespaces.
 * @param {string} str The string to check.
 * @return {boolean} Whether `str` is empty or whitespace only.
 * @see goog_strings.isEmptyOrWhitespace
 */
function isEmptyOrWhitespace(str) {
  // testing length == 0 first is actually slower in all browsers (about the
  // same in Opera).
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return /^[\s\xa0]*$/.test(str);
};

/**
 * Trims white spaces to the left and right of a string.
 * @param {string} str The string to trim.
 * @return {string} A trimmed copy of `str`.
 */
let trim =
    (google.TRUSTED_SITE && String.prototype.trim) ? function(str) {
      return str.trim();
    } : function(str) {
      // Since IE doesn't include non-breaking-space (0xa0) in their \s
      // character class (as required by section 7.2 of the ECMAScript spec),
      // we explicitly include it in the regexp to enforce consistent
      // cross-browser behavior.
      // NOTE: We don't use String#replace because it might have side effects
      // causing this function to not compile to 0 bytes.
      return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(str)[1];
    };

/**
 * A string comparator that ignores case.
 * -1 = str1 less than str2
 *  0 = str1 equals str2
 *  1 = str1 greater than str2
 *
 * @param {string} str1 The string to compare.
 * @param {string} str2 The string to compare `str1` to.
 * @return {number} The comparator result, as described above.
 * @see goog_strings.caseInsensitiveCompare
 */
function caseInsensitiveCompare(str1, str2) {
  const test1 = String(str1).toLowerCase();
  const test2 = String(str2).toLowerCase();

  if (test1 < test2) {
    return -1;
  } else if (test1 == test2) {
    return 0;
  } else {
    return 1;
  }
};

/**
 * Converts \n to <br>s or <br />s.
 * @param {string} str The string in which to convert newlines.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} A copy of `str` with converted newlines.
 * @see goog_strings.newLineToBr
 */
function newLineToBr(str, opt_xml) {
  return str.replace(/(\r\n|\r|\n)/g, opt_xml ? '<br />' : '<br>');
};

/**
 * Escapes double quote '"' and single quote '\'' characters in addition to
 * '&', '<', and '>' so that a string can be included in an HTML tag attribute
 * value within double or single quotes.
 * @param {string} str string to be escaped.
 * @param {boolean=} opt_isLikelyToContainHtmlChars
 * @return {string} An escaped copy of `str`.
 * @see goog_strings.htmlEscape
 */
function htmlEscape(
    str, opt_isLikelyToContainHtmlChars) {
  if (opt_isLikelyToContainHtmlChars) {
    str = str.replace(AMP_RE_, '&amp;')
              .replace(LT_RE_, '&lt;')
              .replace(GT_RE_, '&gt;')
              .replace(QUOT_RE_, '&quot;')
              .replace(SINGLE_QUOTE_RE_, '&#39;')
              .replace(NULL_RE_, '&#0;');
    return str;

  } else {
    // quick test helps in the case when there are no chars to replace, in
    // worst case this makes barely a difference to the time taken
    if (!ALL_RE_.test(str)) return str;

    // str.indexOf is faster than regex.test in this case
    if (str.indexOf('&') != -1) {
      str = str.replace(AMP_RE_, '&amp;');
    }
    if (str.indexOf('<') != -1) {
      str = str.replace(LT_RE_, '&lt;');
    }
    if (str.indexOf('>') != -1) {
      str = str.replace(GT_RE_, '&gt;');
    }
    if (str.indexOf('"') != -1) {
      str = str.replace(QUOT_RE_, '&quot;');
    }
    if (str.indexOf('\'') != -1) {
      str = str.replace(SINGLE_QUOTE_RE_, '&#39;');
    }
    if (str.indexOf('\x00') != -1) {
      str = str.replace(NULL_RE_, '&#0;');
    }
    return str;
  }
};

/**
 * Regular expression that matches an ampersand, for use in escaping.
 * @const {!RegExp}
 * @private
 */
let AMP_RE_ = /&/g;

/**
 * Regular expression that matches a less than sign, for use in escaping.
 * @const {!RegExp}
 * @private
 */
let LT_RE_ = /</g;

/**
 * Regular expression that matches a greater than sign, for use in escaping.
 * @const {!RegExp}
 * @private
 */
let GT_RE_ = />/g;

/**
 * Regular expression that matches a double quote, for use in escaping.
 * @const {!RegExp}
 * @private
 */
let QUOT_RE_ = /"/g;

/**
 * Regular expression that matches a single quote, for use in escaping.
 * @const {!RegExp}
 * @private
 */
let SINGLE_QUOTE_RE_ = /'/g;

/**
 * Regular expression that matches null character, for use in escaping.
 * @const {!RegExp}
 * @private
 */
let NULL_RE_ = /\x00/g;

/**
 * Regular expression that matches any character that needs to be escaped.
 * @const {!RegExp}
 * @private
 */
let ALL_RE_ = /[\x00&<>"']/;

/**
 * Do escaping of whitespace to preserve spatial formatting. We use character
 * entity #160 to make it safer for xml.
 * @param {string} str The string in which to escape whitespace.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} An escaped copy of `str`.
 * @see goog_strings.whitespaceEscape
 */
function whitespaceEscape(str, opt_xml) {
  // This doesn't use goog_strings.preserveSpaces for backwards compatibility.
  return newLineToBr(
      str.replace(/  /g, ' &#160;'), opt_xml);
};

/**
 * Determines whether a string contains a substring.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether `str` contains `subString`.
 * @see goog_strings.contains
 */
function contains(str, subString) {
  return str.indexOf(subString) != -1;
};

/**
 * Determines whether a string contains a substring, ignoring case.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether `str` contains `subString`.
 * @see goog_strings.caseInsensitiveContains
 */
function caseInsensitiveContains(str, subString) {
  return contains(
      str.toLowerCase(), subString.toLowerCase());
};

/**
 * Compares two version numbers.
 *
 * @param {string|number} version1 Version of first item.
 * @param {string|number} version2 Version of second item.
 *
 * @return {number}  1 if `version1` is higher.
 *                   0 if arguments are equal.
 *                  -1 if `version2` is higher.
 * @see goog_strings.compareVersions
 */
function compareVersions(version1, version2) {
  let order = 0;
  // Trim leading and trailing whitespace and split the versions into
  // subversions.
  const v1Subs = trim(String(version1)).split('.');
  const v2Subs = trim(String(version2)).split('.');
  const subCount = Math.max(v1Subs.length, v2Subs.length);

  // Iterate over the subversions, as long as they appear to be equivalent.
  for (let subIdx = 0; order == 0 && subIdx < subCount; subIdx++) {
    let v1Sub = v1Subs[subIdx] || '';
    let v2Sub = v2Subs[subIdx] || '';

    do {
      // Split the subversions into pairs of numbers and qualifiers (like 'b').
      // Two different RegExp objects are use to make it clear the code
      // is side-effect free
      const v1Comp = /(\d*)(\D*)(.*)/.exec(v1Sub) || ['', '', '', ''];
      const v2Comp = /(\d*)(\D*)(.*)/.exec(v2Sub) || ['', '', '', ''];
      // Break if there are no more matches.
      if (v1Comp[0].length == 0 && v2Comp[0].length == 0) {
        break;
      }

      // Parse the numeric part of the subversion. A missing number is
      // equivalent to 0.
      const v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
      const v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);

      // Compare the subversion components. The number has the highest
      // precedence. Next, if the numbers are equal, a subversion without any
      // qualifier is always higher than a subversion with any qualifier. Next,
      // the qualifiers are compared as strings.
      order = compareElements_(v1CompNum, v2CompNum) ||
          compareElements_(
              v1Comp[2].length == 0, v2Comp[2].length == 0) ||
          compareElements_(v1Comp[2], v2Comp[2]);
      // Stop as soon as an inequality is discovered.

      v1Sub = v1Comp[3];
      v2Sub = v2Comp[3];
    } while (order == 0);
  }

  return order;
};

/**
 * Compares elements of a version number.
 *
 * @param {string|number|boolean} left An element from a version number.
 * @param {string|number|boolean} right An element from a version number.
 *
 * @return {number}  1 if `left` is higher.
 *                   0 if arguments are equal.
 *                  -1 if `right` is higher.
 * @private
 */
function compareElements_(left, right) {
  if (left < right) {
    return -1;
  } else if (left > right) {
    return 1;
  }
  return 0;
};

export {caseInsensitiveCompare, caseInsensitiveContains, caseInsensitiveEndsWith, caseInsensitiveEquals, caseInsensitiveStartsWith, compareVersions, contains, endsWith, htmlEscape, isEmptyOrWhitespace, newLineToBr, startsWith, trim, whitespaceEscape};