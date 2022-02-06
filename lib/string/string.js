import * as safe from './../dom/safe.js';
import * as google from './../google.js';
import * as uncheckedconversions from './../html/uncheckedconversions.js';
import {Const} from './const.js';
import * as internal from './internal.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utilities for string manipulation.
 */

/**
 * Namespace for string utilities
 */

/**
 * @type {boolean} Enables HTML escaping of lowercase letter "e" which helps
 * with detection of double-escaping as this letter is frequently used.
 */
const DETECT_DOUBLE_ESCAPING = false;

/**
 * @type {boolean} Whether to force non-dom html unescaping.
 */
const FORCE_NON_DOM_HTML_UNESCAPING = false;

/**
 * Common Unicode string characters.
 * @enum {string}
 */
let Unicode = {
  NBSP: '\xa0'
};

/**
 * Fast prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix A string to look for at the start of `str`.
 * @return {boolean} True if `str` begins with `prefix`.
 *
 * @deprecated use str.startsWith(prefix) directly
 */
function startsWith(str, prefix) {
  return internal.startsWith(str, prefix);
}

/**
 * Fast suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of `str`.
 * @return {boolean} True if `str` ends with `suffix`.
 *
 * @deprecated use str.endsWith(suffix) directly
 */
function endsWith(str, suffix) {
  return internal.endsWith(str, suffix);
}

/**
 * Case-insensitive prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix  A string to look for at the end of `str`.
 * @return {boolean} True if `str` begins with `prefix` (ignoring
 *     case).
 */
function caseInsensitiveStartsWith(str, prefix) {
  return internal.caseInsensitiveStartsWith(str, prefix);
}

/**
 * Case-insensitive suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of `str`.
 * @return {boolean} True if `str` ends with `suffix` (ignoring
 *     case).
 */
function caseInsensitiveEndsWith(str, suffix) {
  return internal.caseInsensitiveEndsWith(str, suffix);
}

/**
 * Case-insensitive equality checker.
 * @param {string} str1 First string to check.
 * @param {string} str2 Second string to check.
 * @return {boolean} True if `str1` and `str2` are the same string,
 *     ignoring case.
 */
function caseInsensitiveEquals(str1, str2) {
  return internal.caseInsensitiveEquals(str1, str2);
}

/**
 * Does simple python-style string substitution.
 * subs("foo%s hot%s", "bar", "dog") becomes "foobar hotdog".
 * @param {string} str The string containing the pattern.
 * @param {...*} var_args The items to substitute into the pattern.
 * @return {string} A copy of `str` in which each occurrence of
 *     {@code %s} has been replaced an argument from `var_args`.
 */
function subs(str, var_args) {
  const splitParts = str.split('%s');
  let returnString = '';

  const subsArguments = Array.prototype.slice.call(arguments, 1);
  while (subsArguments.length &&
         // Replace up to the last split part. We are inserting in the
         // positions between split parts.
         splitParts.length > 1) {
    returnString += splitParts.shift() + subsArguments.shift();
  }

  return returnString + splitParts.join('%s');  // Join unused '%s'
};

/**
 * Converts multiple whitespace chars (spaces, non-breaking-spaces, new lines
 * and tabs) to a single space, and strips leading and trailing whitespace.
 * @param {string} str Input string.
 * @return {string} A copy of `str` with collapsed whitespace.
 */
function collapseWhitespace(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
};

/**
 * Checks if a string is empty or contains only whitespaces.
 * @param {string} str The string to check.
 * @return {boolean} Whether `str` is empty or whitespace only.
 */
function isEmptyOrWhitespace(str) {
  return internal.isEmptyOrWhitespace(str);
}

/**
 * Checks if a string is empty.
 * @param {string} str The string to check.
 * @return {boolean} Whether `str` is empty.
 */
function isEmptyString(str) {
  return str.length == 0;
};

/**
 * Checks if a string is empty or contains only whitespaces.
 *
 * @param {string} str The string to check.
 * @return {boolean} Whether `str` is empty or whitespace only.
 * @deprecated Use isEmptyOrWhitespace instead.
 */
function isEmpty(str) {
  return isEmptyOrWhitespace(str);
}

/**
 * Checks if a string is null, undefined, empty or contains only whitespaces.
 * @param {*} str The string to check.
 * @return {boolean} Whether `str` is null, undefined, empty, or
 *     whitespace only.
 * @deprecated Use isEmptyOrWhitespace(makeSafe(str))
 *     instead.
 */
function isEmptyOrWhitespaceSafe(str) {
  return isEmptyOrWhitespace(makeSafe(str));
};

/**
 * Checks if a string is null, undefined, empty or contains only whitespaces.
 *
 * @param {*} str The string to check.
 * @return {boolean} Whether `str` is null, undefined, empty, or
 *     whitespace only.
 * @deprecated Use isEmptyOrWhitespace instead.
 */
function isEmptySafe(str) {
  return isEmptyOrWhitespaceSafe(str);
}

/**
 * Checks if a string is all breaking whitespace.
 * @param {string} str The string to check.
 * @return {boolean} Whether the string is all breaking whitespace.
 */
function isBreakingWhitespace(str) {
  return !/[^\t\n\r ]/.test(str);
};

/**
 * Checks if a string contains all letters.
 * @param {string} str string to check.
 * @return {boolean} True if `str` consists entirely of letters.
 */
function isAlpha(str) {
  return !/[^a-zA-Z]/.test(str);
};

/**
 * Checks if a string contains only numbers.
 * @param {*} str string to check. If not a string, it will be
 *     casted to one.
 * @return {boolean} True if `str` is numeric.
 */
function isNumeric(str) {
  return !/[^0-9]/.test(str);
};

/**
 * Checks if a string contains only numbers or letters.
 * @param {string} str string to check.
 * @return {boolean} True if `str` is alphanumeric.
 */
function isAlphaNumeric(str) {
  return !/[^a-zA-Z0-9]/.test(str);
};

/**
 * Checks if a character is a space character.
 * @param {string} ch Character to check.
 * @return {boolean} True if `ch` is a space.
 */
function isSpace(ch) {
  return ch == ' ';
};

/**
 * Checks if a character is a valid unicode character.
 * @param {string} ch Character to check.
 * @return {boolean} True if `ch` is a valid unicode character.
 */
function isUnicodeChar(ch) {
  return ch.length == 1 && ch >= ' ' && ch <= '~' ||
      ch >= '\u0080' && ch <= '\uFFFD';
};

/**
 * Takes a string and replaces newlines with a space. Multiple lines are
 * replaced with a single space.
 * @param {string} str The string from which to strip newlines.
 * @return {string} A copy of `str` stripped of newlines.
 */
function stripNewlines(str) {
  return str.replace(/(\r\n|\r|\n)+/g, ' ');
};

/**
 * Replaces Windows and Mac new lines with unix style: \r or \r\n with \n.
 * @param {string} str The string to in which to canonicalize newlines.
 * @return {string} `str` A copy of {@code} with canonicalized newlines.
 */
function canonicalizeNewlines(str) {
  return str.replace(/(\r\n|\r|\n)/g, '\n');
};

/**
 * Normalizes whitespace in a string, replacing all whitespace chars with
 * a space.
 * @param {string} str The string in which to normalize whitespace.
 * @return {string} A copy of `str` with all whitespace normalized.
 */
function normalizeWhitespace(str) {
  return str.replace(/\xa0|\s/g, ' ');
};

/**
 * Normalizes spaces in a string, replacing all consecutive spaces and tabs
 * with a single space. Replaces non-breaking space with a space.
 * @param {string} str The string in which to normalize spaces.
 * @return {string} A copy of `str` with all consecutive spaces and tabs
 *    replaced with a single space.
 */
function normalizeSpaces(str) {
  return str.replace(/\xa0|[ \t]+/g, ' ');
};

/**
 * Removes the breaking spaces from the left and right of the string and
 * collapses the sequences of breaking spaces in the middle into single spaces.
 * The original and the result strings render the same way in HTML.
 * @param {string} str A string in which to collapse spaces.
 * @return {string} Copy of the string with normalized breaking spaces.
 */
function collapseBreakingSpaces(str) {
  return str.replace(/[\t\r\n ]+/g, ' ')
      .replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, '');
};

/**
 * Trims white spaces to the left and right of a string.
 * @param {string} str The string to trim.
 * @return {string} A trimmed copy of `str`.
 *
 * @deprecated use str.trim() directly
 */
function trim(str) {
  return internal.trim(str);
}

/**
 * Trims whitespaces at the left end of a string.
 * @param {string} str The string to left trim.
 * @return {string} A trimmed copy of `str`.
 *
 * @deprecated use str.trimStart() directly
 */
function trimLeft(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/^[\s\xa0]+/, '');
};

/**
 * Trims whitespaces at the right end of a string.
 * @param {string} str The string to right trim.
 * @return {string} A trimmed copy of `str`.
 *
 * @deprecated use str.trimEnd() directly
 */
function trimRight(str) {
  // Since IE doesn't include non-breaking-space (0xa0) in their \s character
  // class (as required by section 7.2 of the ECMAScript spec), we explicitly
  // include it in the regexp to enforce consistent cross-browser behavior.
  return str.replace(/[\s\xa0]+$/, '');
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
 */
function caseInsensitiveCompare(str1, str2) {
  return internal.caseInsensitiveCompare(str1, str2);
}

/**
 * Compares two strings interpreting their numeric substrings as numbers.
 *
 * @param {string} str1 First string.
 * @param {string} str2 Second string.
 * @param {!RegExp} tokenizerRegExp Splits a string into substrings of
 *     non-negative integers, non-numeric characters and optionally fractional
 *     numbers starting with a decimal point.
 * @return {number} Negative if str1 < str2, 0 is str1 == str2, positive if
 *     str1 > str2.
 * @private
 */
function numberAwareCompare_(str1, str2, tokenizerRegExp) {
  if (str1 == str2) {
    return 0;
  }
  if (!str1) {
    return -1;
  }
  if (!str2) {
    return 1;
  }

  // Using match to split the entire string ahead of time turns out to be faster
  // for most inputs than using RegExp.exec or iterating over each character.
  const tokens1 = str1.toLowerCase().match(tokenizerRegExp);
  const tokens2 = str2.toLowerCase().match(tokenizerRegExp);

  const count = Math.min(tokens1.length, tokens2.length);

  for (let i = 0; i < count; i++) {
    const a = tokens1[i];
    const b = tokens2[i];

    // Compare pairs of tokens, returning if one token sorts before the other.
    if (a != b) {
      // Only if both tokens are integers is a special comparison required.
      // Decimal numbers are sorted as strings (e.g., '.09' < '.1').
      const num1 = parseInt(a, 10);
      if (!isNaN(num1)) {
        const num2 = parseInt(b, 10);
        if (!isNaN(num2) && num1 - num2) {
          return num1 - num2;
        }
      }
      return a < b ? -1 : 1;
    }
  }

  // If one string is a substring of the other, the shorter string sorts first.
  if (tokens1.length != tokens2.length) {
    return tokens1.length - tokens2.length;
  }

  // The two strings must be equivalent except for case (perfect equality is
  // tested at the head of the function.) Revert to default ASCII string
  // comparison to stabilize the sort.
  return str1 < str2 ? -1 : 1;
};

/**
 * String comparison function that handles non-negative integer numbers in a
 * way humans might expect. Using this function, the string 'File 2.jpg' sorts
 * before 'File 10.jpg', and 'Version 1.9' before 'Version 1.10'. The comparison
 * is mostly case-insensitive, though strings that are identical except for case
 * are sorted with the upper-case strings before lower-case.
 *
 * This comparison function is up to 50x slower than either the default or the
 * case-insensitive compare. It should not be used in time-critical code, but
 * should be fast enough to sort several hundred short strings (like filenames)
 * with a reasonable delay.
 *
 * @param {string} str1 The string to compare in a numerically sensitive way.
 * @param {string} str2 The string to compare `str1` to.
 * @return {number} less than 0 if str1 < str2, 0 if str1 == str2, greater than
 *     0 if str1 > str2.
 */
function intAwareCompare(str1, str2) {
  return numberAwareCompare_(str1, str2, /\d+|\D+/g);
};

/**
 * String comparison function that handles non-negative integer and fractional
 * numbers in a way humans might expect. Using this function, the string
 * 'File 2.jpg' sorts before 'File 10.jpg', and '3.14' before '3.2'. Equivalent
 * to {@link intAwareCompare} apart from the way how it interprets
 * dots.
 *
 * @param {string} str1 The string to compare in a numerically sensitive way.
 * @param {string} str2 The string to compare `str1` to.
 * @return {number} less than 0 if str1 < str2, 0 if str1 == str2, greater than
 *     0 if str1 > str2.
 */
function floatAwareCompare(str1, str2) {
  return numberAwareCompare_(str1, str2, /\d+|\.\d+|\D+/g);
};

/**
 * Alias for {@link floatAwareCompare}.
 *
 * @param {string} str1
 * @param {string} str2
 * @return {number}
 */
function numerateCompare(str1, str2) {
  return floatAwareCompare(str1, str2);
}

/**
 * URL-encodes a string
 * @param {*} str The string to url-encode.
 * @return {string} An encoded copy of `str` that is safe for urls.
 *     Note that '#', ':', and other characters used to delimit portions
 *     of URLs *will* be encoded.
 */
function urlEncode(str) {
  return encodeURIComponent(String(str));
};

/**
 * URL-decodes the string. We need to specially handle '+'s because
 * the javascript library doesn't convert them to spaces.
 * @param {string} str The string to url decode.
 * @return {string} The decoded `str`.
 */
function urlDecode(str) {
  return decodeURIComponent(str.replace(/\+/g, ' '));
};

/**
 * Converts \n to <br>s or <br />s.
 * @param {string} str The string in which to convert newlines.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} A copy of `str` with converted newlines.
 */
function newLineToBr(str, opt_xml) {
  return internal.newLineToBr(str, opt_xml);
}

/**
 * Escapes double quote '"' and single quote '\'' characters in addition to
 * '&', '<', and '>' so that a string can be included in an HTML tag attribute
 * value within double or single quotes.
 *
 * It should be noted that > doesn't need to be escaped for the HTML or XML to
 * be valid, but it has been decided to escape it for consistency with other
 * implementations.
 *
 * With DETECT_DOUBLE_ESCAPING, this function escapes also the
 * lowercase letter "e".
 *
 * NOTE(user):
 * HtmlEscape is often called during the generation of large blocks of HTML.
 * Using statics for the regular expressions and strings is an optimization
 * that can more than half the amount of time IE spends in this function for
 * large apps, since strings and regexes both contribute to GC allocations.
 *
 * Testing for the presence of a character before escaping increases the number
 * of function calls, but actually provides a speed increase for the average
 * case -- since the average case often doesn't require the escaping of all 4
 * characters and indexOf() is much cheaper than replace().
 * The worst case does suffer slightly from the additional calls, therefore the
 * opt_isLikelyToContainHtmlChars option has been included for situations
 * where all 4 HTML entities are very likely to be present and need escaping.
 *
 * Some benchmarks (times tended to fluctuate +-0.05ms):
 *                                     FireFox                     IE6
 * (no chars / average (mix of cases) / all 4 chars)
 * no checks                     0.13 / 0.22 / 0.22         0.23 / 0.53 / 0.80
 * indexOf                       0.08 / 0.17 / 0.26         0.22 / 0.54 / 0.84
 * indexOf + re test             0.07 / 0.17 / 0.28         0.19 / 0.50 / 0.85
 *
 * An additional advantage of checking if replace actually needs to be called
 * is a reduction in the number of object allocations, so as the size of the
 * application grows the difference between the various methods would increase.
 *
 * @param {string} str string to be escaped.
 * @param {boolean=} opt_isLikelyToContainHtmlChars Don't perform a check to see
 *     if the character needs replacing - use this option if you expect each of
 *     the characters to appear often. Leave false if you expect few html
 *     characters to occur in your strings, such as if you are escaping HTML.
 * @return {string} An escaped copy of `str`.
 */
function htmlEscape(str, opt_isLikelyToContainHtmlChars) {
  str = internal.htmlEscape(str, opt_isLikelyToContainHtmlChars);
  if (DETECT_DOUBLE_ESCAPING) {
    str = str.replace(E_RE_, '&#101;');
  }
  return str;
};

/**
 * Regular expression that matches a lowercase letter "e", for use in escaping.
 * @const {!RegExp}
 * @private
 */
let E_RE_ = /e/g;

/**
 * Unescapes an HTML string.
 *
 * @param {string} str The string to unescape.
 * @return {string} An unescaped copy of `str`.
 */
function unescapeEntities(str) {
  if (contains(str, '&')) {
    // We are careful not to use a DOM if we do not have one or we explicitly
    // requested non-DOM html unescaping.
    if (!FORCE_NON_DOM_HTML_UNESCAPING &&
        'document' in window) {
      return unescapeEntitiesUsingDom_(str);
    } else {
      // Fall back on pure XML entities
      return unescapePureXmlEntities_(str);
    }
  }
  return str;
};

/**
 * Unescapes a HTML string using the provided document.
 *
 * @param {string} str The string to unescape.
 * @param {!Document} document A document to use in escaping the string.
 * @return {string} An unescaped copy of `str`.
 */
function unescapeEntitiesWithDocument(str, document) {
  if (contains(str, '&')) {
    return unescapeEntitiesUsingDom_(str, document);
  }
  return str;
};

/**
 * Unescapes an HTML string using a DOM to resolve non-XML, non-numeric
 * entities. This function is XSS-safe and whitespace-preserving.
 * @private
 * @param {string} str The string to unescape.
 * @param {Document=} opt_document An optional document to use for creating
 *     elements. If this is not specified then the default window.document
 *     will be used.
 * @return {string} The unescaped `str` string.
 */
function unescapeEntitiesUsingDom_(str, opt_document) {
  /** @type {!Object<string, string>} */
  const seen = {'&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"'};
  /** @type {!Element} */
  let div;
  if (opt_document) {
    div = opt_document.createElement('div');
  } else {
    div = window.document.createElement('div');
  }
  // Match as many valid entity characters as possible. If the actual entity
  // happens to be shorter, it will still work as innerHTML will return the
  // trailing characters unchanged. Since the entity characters do not include
  // open angle bracket, there is no chance of XSS from the innerHTML use.
  // Since no whitespace is passed to innerHTML, whitespace is preserved.
  return str.replace(HTML_ENTITY_PATTERN_, function(s, entity) {
    // Check for cached entity.
    let value = seen[s];
    if (value) {
      return value;
    }
    // Check for numeric entity.
    if (entity.charAt(0) == '#') {
      // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex numbers.
      const n = Number('0' + entity.substr(1));
      if (!isNaN(n)) {
        value = String.fromCharCode(n);
      }
    }
    // Fall back to innerHTML otherwise.
    if (!value) {
      // Append a non-entity character to avoid a bug in Webkit that parses
      // an invalid entity at the end of innerHTML text as the empty string.
      safe.setInnerHtml(
          div,
          uncheckedconversions
              .safeHtmlFromStringKnownToSatisfyTypeContract(
                  Const.from('Single HTML entity.'), s + ' '));
      // Then remove the trailing character from the result.
      value = div.firstChild.nodeValue.slice(0, -1);
    }
    // Cache and return.
    return seen[s] = value;
  });
};

/**
 * Unescapes XML entities.
 * @private
 * @param {string} str The string to unescape.
 * @return {string} An unescaped copy of `str`.
 */
function unescapePureXmlEntities_(str) {
  return str.replace(/&([^;]+);/g, function(s, entity) {
    switch (entity) {
      case 'amp':
        return '&';
      case 'lt':
        return '<';
      case 'gt':
        return '>';
      case 'quot':
        return '"';
      default:
        if (entity.charAt(0) == '#') {
          // Prefix with 0 so that hex entities (e.g. &#x10) parse as hex.
          const n = Number('0' + entity.substr(1));
          if (!isNaN(n)) {
            return String.fromCharCode(n);
          }
        }
        // For invalid entities we just return the entity
        return s;
    }
  });
};

/**
 * Regular expression that matches an HTML entity.
 * See also HTML5: Tokenization / Tokenizing character references.
 * @private
 * @type {!RegExp}
 */
let HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;

/**
 * Do escaping of whitespace to preserve spatial formatting. We use character
 * entity #160 to make it safer for xml.
 * @param {string} str The string in which to escape whitespace.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} An escaped copy of `str`.
 */
function whitespaceEscape(str, opt_xml) {
  // This doesn't use preserveSpaces for backwards compatibility.
  return newLineToBr(str.replace(/  /g, ' &#160;'), opt_xml);
};

/**
 * Preserve spaces that would be otherwise collapsed in HTML by replacing them
 * with non-breaking space Unicode characters.
 * @param {string} str The string in which to preserve whitespace.
 * @return {string} A copy of `str` with preserved whitespace.
 */
function preserveSpaces(str) {
  return str.replace(/(^|[\n ]) /g, '$1' + Unicode.NBSP);
};

/**
 * Strip quote characters around a string.  The second argument is a string of
 * characters to treat as quotes.  This can be a single character or a string of
 * multiple character and in that case each of those are treated as possible
 * quote characters. For example:
 *
 * <pre>
 * stripQuotes('"abc"', '"`') --> 'abc'
 * stripQuotes('`abc`', '"`') --> 'abc'
 * </pre>
 *
 * @param {string} str The string to strip.
 * @param {string} quoteChars The quote characters to strip.
 * @return {string} A copy of `str` without the quotes.
 */
function stripQuotes(str, quoteChars) {
  const length = quoteChars.length;
  for (let i = 0; i < length; i++) {
    const quoteChar = length == 1 ? quoteChars : quoteChars.charAt(i);
    if (str.charAt(0) == quoteChar && str.charAt(str.length - 1) == quoteChar) {
      return str.substring(1, str.length - 1);
    }
  }
  return str;
};

/**
 * Truncates a string to a certain length and adds '...' if necessary.  The
 * length also accounts for the ellipsis, so a maximum length of 10 and a string
 * 'Hello World!' produces 'Hello W...'.
 * @param {string} str The string to truncate.
 * @param {number} chars Max number of characters.
 * @param {boolean=} opt_protectEscapedCharacters Whether to protect escaped
 *     characters from being cut off in the middle.
 * @return {string} The truncated `str` string.
 */
function truncate(str, chars, opt_protectEscapedCharacters) {
  if (opt_protectEscapedCharacters) {
    str = unescapeEntities(str);
  }

  if (str.length > chars) {
    str = str.substring(0, chars - 3) + '...';
  }

  if (opt_protectEscapedCharacters) {
    str = htmlEscape(str);
  }

  return str;
};

/**
 * Truncate a string in the middle, adding "..." if necessary,
 * and favoring the beginning of the string.
 * @param {string} str The string to truncate the middle of.
 * @param {number} chars Max number of characters.
 * @param {boolean=} opt_protectEscapedCharacters Whether to protect escaped
 *     characters from being cutoff in the middle.
 * @param {number=} opt_trailingChars Optional number of trailing characters to
 *     leave at the end of the string, instead of truncating as close to the
 *     middle as possible.
 * @return {string} A truncated copy of `str`.
 */
function truncateMiddle(
    str, chars, opt_protectEscapedCharacters, opt_trailingChars) {
  if (opt_protectEscapedCharacters) {
    str = unescapeEntities(str);
  }

  if (opt_trailingChars && str.length > chars) {
    if (opt_trailingChars > chars) {
      opt_trailingChars = chars;
    }
    const endPoint = str.length - opt_trailingChars;
    const startPoint = chars - opt_trailingChars;
    str = str.substring(0, startPoint) + '...' + str.substring(endPoint);
  } else if (str.length > chars) {
    // Favor the beginning of the string:
    let half = Math.floor(chars / 2);
    const endPos = str.length - half;
    half += chars % 2;
    str = str.substring(0, half) + '...' + str.substring(endPos);
  }

  if (opt_protectEscapedCharacters) {
    str = htmlEscape(str);
  }

  return str;
};

/**
 * Special chars that need to be escaped for quote.
 * @private {!Object<string, string>}
 */
let specialEscapeChars_ = {
  '\0': '\\0',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\x0B': '\\x0B',  // '\v' is not supported in JScript
  '"': '\\"',
  '\\': '\\\\',
  // To support the use case of embedding quoted strings inside of script
  // tags, we have to make sure HTML comments and opening/closing script tags do
  // not appear in the resulting string. The specific strings that must be
  // escaped are documented at:
  // https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements
  '<': '\\u003C'  // NOTE: JSON.parse crashes on '\\x3c'.
};

/**
 * Character mappings used internally for escapeChar.
 * @private {!Object<string, string>}
 */
let jsEscapeCache_ = {
  '\'': '\\\''
};

/**
 * Encloses a string in double quotes and escapes characters so that the
 * string is a valid JS string. The resulting string is safe to embed in
 * `<script>` tags as "<" is escaped.
 * @param {string} s The string to quote.
 * @return {string} A copy of `s` surrounded by double quotes.
 */
function quote(s) {
  s = String(s);
  const sb = ['"'];
  for (let i = 0; i < s.length; i++) {
    const ch = s.charAt(i);
    const cc = ch.charCodeAt(0);
    sb[i + 1] = specialEscapeChars_[ch] ||
        ((cc > 31 && cc < 127) ? ch : escapeChar(ch));
  }
  sb.push('"');
  return sb.join('');
};

/**
 * Takes a string and returns the escaped string for that input string.
 * @param {string} str The string to escape.
 * @return {string} An escaped string representing `str`.
 */
function escapeString(str) {
  const sb = [];
  for (let i = 0; i < str.length; i++) {
    sb[i] = escapeChar(str.charAt(i));
  }
  return sb.join('');
};

/**
 * Takes a character and returns the escaped string for that character. For
 * example escapeChar(String.fromCharCode(15)) -> "\\x0E".
 * @param {string} c The character to escape.
 * @return {string} An escaped string representing `c`.
 */
function escapeChar(c) {
  if (c in jsEscapeCache_) {
    return jsEscapeCache_[c];
  }

  if (c in specialEscapeChars_) {
    return jsEscapeCache_[c] = specialEscapeChars_[c];
  }

  let rv = c;
  const cc = c.charCodeAt(0);
  if (cc > 31 && cc < 127) {
    rv = c;
  } else {
    // tab is 9 but handled above
    if (cc < 256) {
      rv = '\\x';
      if (cc < 16 || cc > 256) {
        rv += '0';
      }
    } else {
      rv = '\\u';
      if (cc < 4096) {  // \u1000
        rv += '0';
      }
    }
    rv += cc.toString(16).toUpperCase();
  }

  return jsEscapeCache_[c] = rv;
};

/**
 * Determines whether a string contains a substring.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether `str` contains `subString`.
 */
function contains(str, subString) {
  return internal.contains(str, subString);
}

/**
 * Determines whether a string contains a substring, ignoring case.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether `str` contains `subString`.
 */
function caseInsensitiveContains(str, subString) {
  return internal.caseInsensitiveContains(str, subString);
}

/**
 * Returns the non-overlapping occurrences of ss in s.
 * If either s or ss evalutes to false, then returns zero.
 * @param {string} s The string to look in.
 * @param {string} ss The string to look for.
 * @return {number} Number of occurrences of ss in s.
 */
function countOf(s, ss) {
  return s && ss ? s.split(ss).length - 1 : 0;
};

/**
 * Removes a substring of a specified length at a specific
 * index in a string.
 * @param {string} s The base string from which to remove.
 * @param {number} index The index at which to remove the substring.
 * @param {number} stringLength The length of the substring to remove.
 * @return {string} A copy of `s` with the substring removed or the full
 *     string if nothing is removed or the input is invalid.
 */
function removeAt(s, index, stringLength) {
  let resultStr = s;
  // If the index is greater or equal to 0 then remove substring
  if (index >= 0 && index < s.length && stringLength > 0) {
    resultStr = s.substr(0, index) +
        s.substr(index + stringLength, s.length - index - stringLength);
  }
  return resultStr;
};

/**
 * Removes the first occurrence of a substring from a string.
 * @param {string} str The base string from which to remove.
 * @param {string} substr The string to remove.
 * @return {string} A copy of `str` with `substr` removed or the
 *     full string if nothing is removed.
 */
function remove(str, substr) {
  return str.replace(substr, '');
};

/**
 *  Removes all occurrences of a substring from a string.
 *  @param {string} s The base string from which to remove.
 *  @param {string} ss The string to remove.
 *  @return {string} A copy of `s` with `ss` removed or the full
 *      string if nothing is removed.
 */
function removeAll(s, ss) {
  const re = new RegExp(regExpEscape(ss), 'g');
  return s.replace(re, '');
};

/**
 *  Replaces all occurrences of a substring of a string with a new substring.
 *  @param {string} s The base string from which to remove.
 *  @param {string} ss The string to replace.
 *  @param {string} replacement The replacement string.
 *  @return {string} A copy of `s` with `ss` replaced by
 *      `replacement` or the original string if nothing is replaced.
 */
function replaceAll(s, ss, replacement) {
  const re = new RegExp(regExpEscape(ss), 'g');
  return s.replace(re, replacement.replace(/\$/g, '$$$$'));
};

/**
 * Escapes characters in the string that are not safe to use in a RegExp.
 * @param {*} s The string to escape. If not a string, it will be casted
 *     to one.
 * @return {string} A RegExp safe, escaped copy of `s`.
 */
function regExpEscape(s) {
  return String(s)
      .replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
      .replace(/\x08/g, '\\x08');
};

/**
 * Repeats a string n times.
 * @param {string} string The string to repeat.
 * @param {number} length The number of times to repeat.
 * @return {string} A string containing `length` repetitions of
 *     `string`.
 *
 * @deprecated use str.repeat(times) directly
 */
function repeat(string, length) {
  // The native method is over 100 times faster than the alternative.
  return string.repeat(length);
};

/**
 * Pads number to given length and optionally rounds it to a given precision.
 * For example:
 * <pre>padNumber(1.25, 2, 3) -> '01.250'
 * padNumber(1.25, 2) -> '01.25'
 * padNumber(1.25, 2, 1) -> '01.3'
 * padNumber(1.25, 0) -> '1.25'</pre>
 *
 * @param {number} num The number to pad.
 * @param {number} length The desired length.
 * @param {number=} opt_precision The desired precision.
 * @return {string} `num` as a string with the given options.
 */
function padNumber(num, length, opt_precision) {
  if (!Number.isFinite(num)) return String(num);
  let s =
      (opt_precision !== undefined) ? num.toFixed(opt_precision) : String(num);
  let index = s.indexOf('.');
  if (index === -1) {
    index = s.length;
  }
  const sign = s[0] === '-' ? '-' : '';
  if (sign) {
    s = s.substring(1);
  }
  return sign + repeat('0', Math.max(0, length - index)) + s;
};

/**
 * Returns a string representation of the given object, with
 * null and undefined being returned as the empty string.
 *
 * @param {*} obj The object to convert.
 * @return {string} A string representation of the `obj`.
 */
function makeSafe(obj) {
  return obj == null ? '' : String(obj);
};

/**
 * Concatenates string expressions. This is useful
 * since some browsers are very inefficient when it comes to using plus to
 * concat strings. Be careful when using null and undefined here since
 * these will not be included in the result. If you need to represent these
 * be sure to cast the argument to a String first.
 * For example:
 * <pre>buildString('a', 'b', 'c', 'd') -> 'abcd'
 * buildString(null, undefined) -> ''
 * </pre>
 * @param {...*} var_args A list of strings to concatenate. If not a string,
 *     it will be casted to one.
 * @return {string} The concatenation of `var_args`.
 */
function buildString(var_args) {
  return Array.prototype.join.call(arguments, '');
};

/**
 * Returns a string with at least 64-bits of randomness.
 *
 * Doesn't trust JavaScript's random function entirely. Uses a combination of
 * random and current timestamp, and then encodes the string in base-36 to
 * make it shorter.
 *
 * @return {string} A random string, e.g. sn1s7vb4gcic.
 */
function getRandomString() {
  const x = 2147483648;
  return Math.floor(Math.random() * x).toString(36) +
      Math.abs(Math.floor(Math.random() * x) ^ google.now()).toString(36);
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
 */
function compareVersions(version1, version2) {
  return internal.compareVersions(version1, version2);
}

/**
 * String hash function similar to java.lang.String.hashCode().
 * The hash code for a string is computed as
 * s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
 * where s[i] is the ith character of the string and n is the length of
 * the string. We mod the result to make it between 0 (inclusive) and 2^32
 * (exclusive).
 * @param {string} str A string.
 * @return {number} Hash value for `str`, between 0 (inclusive) and 2^32
 *  (exclusive). The empty string returns 0.
 */
function hashCode(str) {
  let result = 0;
  for (let i = 0; i < str.length; ++i) {
    // Normalize to 4 byte range, 0 ... 2^32.
    result = (31 * result + str.charCodeAt(i)) >>> 0;
  }
  return result;
};

/**
 * The most recent unique ID. |0 is equivalent to Math.floor in this case.
 * @type {number}
 * @private
 */
let uniqueStringCounter_ = Math.random() * 0x80000000 | 0;

/**
 * Generates and returns a string which is unique in the current document.
 * This is useful, for example, to create unique IDs for DOM elements.
 * @return {string} A unique id.
 */
function createUniqueString() {
  return 'goog_' + uniqueStringCounter_++;
};

/**
 * Converts the supplied string to a number, which may be Infinity or NaN.
 * This function strips whitespace: (toNumber(' 123') === 123)
 * This function accepts scientific notation: (toNumber('1e1') === 10)
 *
 * This is better than JavaScript's built-in conversions because, sadly:
 *     (Number(' ') === 0) and (parseFloat('123a') === 123)
 *
 * @param {string} str The string to convert.
 * @return {number} The number the supplied string represents, or NaN.
 */
function toNumber(str) {
  const num = Number(str);
  if (num == 0 && isEmptyOrWhitespace(str)) {
    return NaN;
  }
  return num;
};

/**
 * Returns whether the given string is lower camel case (e.g. "isFooBar").
 *
 * Note that this assumes the string is entirely letters.
 * @see http://en.wikipedia.org/wiki/CamelCase#Variations_and_synonyms
 *
 * @param {string} str String to test.
 * @return {boolean} Whether the string is lower camel case.
 */
function isLowerCamelCase(str) {
  return /^[a-z]+([A-Z][a-z]*)*$/.test(str);
};

/**
 * Returns whether the given string is upper camel case (e.g. "FooBarBaz").
 *
 * Note that this assumes the string is entirely letters.
 * @see http://en.wikipedia.org/wiki/CamelCase#Variations_and_synonyms
 *
 * @param {string} str String to test.
 * @return {boolean} Whether the string is upper camel case.
 */
function isUpperCamelCase(str) {
  return /^([A-Z][a-z]*)+$/.test(str);
};

/**
 * Converts a string from selector-case to camelCase (e.g. from
 * "multi-part-string" to "multiPartString"), useful for converting
 * CSS selectors and HTML dataset keys to their equivalent JS properties.
 * @param {string} str The string in selector-case form.
 * @return {string} The string in camelCase form.
 */
function toCamelCase(str) {
  return String(str).replace(/\-([a-z])/g, function(all, match) {
    return match.toUpperCase();
  });
};

/**
 * Converts a string from camelCase to selector-case (e.g. from
 * "multiPartString" to "multi-part-string"), useful for converting JS
 * style and dataset properties to equivalent CSS selectors and HTML keys.
 * @param {string} str The string in camelCase form.
 * @return {string} The string in selector-case form.
 */
function toSelectorCase(str) {
  return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
};

/**
 * Converts a string into TitleCase. First character of the string is always
 * capitalized in addition to the first letter of every subsequent word.
 * Words are delimited by one or more whitespaces by default. Custom delimiters
 * can optionally be specified to replace the default, which doesn't preserve
 * whitespace delimiters and instead must be explicitly included if needed.
 *
 * Default delimiter => " ":
 *    toTitleCase('oneTwoThree')    => 'OneTwoThree'
 *    toTitleCase('one two three')  => 'One Two Three'
 *    toTitleCase('  one   two   ') => '  One   Two   '
 *    toTitleCase('one_two_three')  => 'One_two_three'
 *    toTitleCase('one-two-three')  => 'One-two-three'
 *
 * Custom delimiter => "_-.":
 *    toTitleCase('oneTwoThree', '_-.')       => 'OneTwoThree'
 *    toTitleCase('one two three', '_-.')     => 'One two three'
 *    toTitleCase('  one   two   ', '_-.')    => '  one   two   '
 *    toTitleCase('one_two_three', '_-.')     => 'One_Two_Three'
 *    toTitleCase('one-two-three', '_-.')     => 'One-Two-Three'
 *    toTitleCase('one...two...three', '_-.') => 'One...Two...Three'
 *    toTitleCase('one. two. three', '_-.')   => 'One. two. three'
 *    toTitleCase('one-two.three', '_-.')     => 'One-Two.Three'
 *
 * @param {string} str String value in camelCase form.
 * @param {string=} opt_delimiters Custom delimiter character set used to
 *      distinguish words in the string value. Each character represents a
 *      single delimiter. When provided, default whitespace delimiter is
 *      overridden and must be explicitly included if needed.
 * @return {string} String value in TitleCase form.
 */
function toTitleCase(str, opt_delimiters) {
  let delimiters = (typeof opt_delimiters === 'string') ?
      regExpEscape(opt_delimiters) :
      '\\s';

  // For IE8, we need to prevent using an empty character set. Otherwise,
  // incorrect matching will occur.
  delimiters = delimiters ? '|[' + delimiters + ']+' : '';

  const regexp = new RegExp('(^' + delimiters + ')([a-z])', 'g');
  return str.replace(regexp, function(all, p1, p2) {
    return p1 + p2.toUpperCase();
  });
};

/**
 * Capitalizes a string, i.e. converts the first letter to uppercase
 * and all other letters to lowercase, e.g.:
 *
 * capitalize('one')     => 'One'
 * capitalize('ONE')     => 'One'
 * capitalize('one two') => 'One two'
 *
 * Note that this function does not trim initial whitespace.
 *
 * @param {string} str String value to capitalize.
 * @return {string} String value with first letter in uppercase.
 */
function capitalize(str) {
  return String(str.charAt(0)).toUpperCase() +
      String(str.substr(1)).toLowerCase();
};

/**
 * Parse a string in decimal or hexidecimal ('0xFFFF') form.
 *
 * To parse a particular radix, please use parseInt(string, radix) directly. See
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/parseInt
 *
 * This is a wrapper for the built-in parseInt function that will only parse
 * numbers as base 10 or base 16.  Some JS implementations assume strings
 * starting with "0" are intended to be octal. ES3 allowed but discouraged
 * this behavior. ES5 forbids it.  This function emulates the ES5 behavior.
 *
 * For more information, see Mozilla JS Reference: http://goo.gl/8RiFj
 *
 * @param {string|number|null|undefined} value The value to be parsed.
 * @return {number} The number, parsed. If the string failed to parse, this
 *     will be NaN.
 */
function _parseInt(value) {
  // Force finite numbers to strings.
  if (isFinite(value)) {
    value = String(value);
  }

  if (typeof value === 'string') {
    // If the string starts with '0x' or '-0x', parse as hex.
    return /^\s*-?0x/i.test(value) ? parseInt(value, 16) : parseInt(value, 10);
  }

  return NaN;
};

/**
 * Splits a string on a separator a limited number of times.
 *
 * This implementation is more similar to Python or Java, where the limit
 * parameter specifies the maximum number of splits rather than truncating
 * the number of results.
 *
 * See http://docs.python.org/2/library/stdtypes.html#str.split
 * See JavaDoc: http://goo.gl/F2AsY
 * See Mozilla reference: http://goo.gl/dZdZs
 *
 * @param {string} str String to split.
 * @param {string} separator The separator.
 * @param {number} limit The limit to the number of splits. The resulting array
 *     will have a maximum length of limit+1.  Negative numbers are the same
 *     as zero.
 * @return {!Array<string>} The string, split.
 */
function splitLimit(str, separator, limit) {
  const parts = str.split(separator);
  const returnVal = [];

  // Only continue doing this while we haven't hit the limit and we have
  // parts left.
  while (limit > 0 && parts.length) {
    returnVal.push(parts.shift());
    limit--;
  }

  // If there are remaining parts, append them to the end.
  if (parts.length) {
    returnVal.push(parts.join(separator));
  }

  return returnVal;
};

/**
 * Finds the characters to the right of the last instance of any separator
 *
 * This function is similar to goog.string.path.baseName, except it can take a
 * list of characters to split the string on. It will return the rightmost
 * grouping of characters to the right of any separator as a left-to-right
 * oriented string.
 *
 * @see goog.string.path.baseName
 * @param {string} str The string
 * @param {string|!Array<string>} separators A list of separator characters
 * @return {string} The last part of the string with respect to the separators
 */
function lastComponent(str, separators) {
  if (!separators) {
    return str;
  } else if (typeof separators == 'string') {
    separators = [separators];
  }

  let lastSeparatorIndex = -1;
  for (let i = 0; i < separators.length; i++) {
    if (separators[i] == '') {
      continue;
    }
    const currentSeparatorIndex = str.lastIndexOf(separators[i]);
    if (currentSeparatorIndex > lastSeparatorIndex) {
      lastSeparatorIndex = currentSeparatorIndex;
    }
  }
  if (lastSeparatorIndex == -1) {
    return str;
  }
  return str.slice(lastSeparatorIndex + 1);
};

/**
 * Computes the Levenshtein edit distance between two strings.
 * @param {string} a
 * @param {string} b
 * @return {number} The edit distance between the two strings.
 */
function editDistance(a, b) {
  const v0 = [];
  const v1 = [];

  if (a == b) {
    return 0;
  }

  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }

  for (let i = 0; i < b.length + 1; i++) {
    v0[i] = i;
  }

  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;

    for (let j = 0; j < b.length; j++) {
      const cost = Number(a[i] != b[j]);
      // Cost for the substring is the minimum of adding one character, removing
      // one character, or a swap.
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }

    for (let j = 0; j < v0.length; j++) {
      v0[j] = v1[j];
    }
  }

  return v1[b.length];
};

export {DETECT_DOUBLE_ESCAPING, FORCE_NON_DOM_HTML_UNESCAPING, Unicode, _parseInt as parseInt, buildString, canonicalizeNewlines, capitalize, caseInsensitiveCompare, caseInsensitiveContains, caseInsensitiveEndsWith, caseInsensitiveEquals, caseInsensitiveStartsWith, collapseBreakingSpaces, collapseWhitespace, compareVersions, contains, countOf, createUniqueString, editDistance, endsWith, escapeChar, escapeString, floatAwareCompare, getRandomString, hashCode, htmlEscape, intAwareCompare, isAlpha, isAlphaNumeric, isBreakingWhitespace, isEmpty, isEmptyOrWhitespace, isEmptyOrWhitespaceSafe, isEmptySafe, isEmptyString, isLowerCamelCase, isNumeric, isSpace, isUnicodeChar, isUpperCamelCase, lastComponent, makeSafe, newLineToBr, normalizeSpaces, normalizeWhitespace, numerateCompare, padNumber, preserveSpaces, quote, regExpEscape, remove, removeAll, removeAt, repeat, replaceAll, splitLimit, startsWith, stripNewlines, stripQuotes, subs, toCamelCase, toNumber, toSelectorCase, toTitleCase, trim, trimLeft, trimRight, truncate, truncateMiddle, unescapeEntities, unescapeEntitiesWithDocument, urlDecode, urlEncode, whitespaceEscape};