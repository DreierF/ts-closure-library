// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Collection of utility functions for Unicode character.
 */

// Constants for handling Unicode supplementary characters (surrogate pairs).

/**
 * The minimum value for Supplementary code points.
 * @type {number}
 * @private
 */
let SUPPLEMENTARY_CODE_POINT_MIN_VALUE_ = 0x10000;

/**
 * The highest Unicode code point value (scalar value) according to the Unicode
 * Standard.
 * @type {number}
 * @private
 */
let CODE_POINT_MAX_VALUE_ = 0x10FFFF;

/**
 * Lead surrogate minimum value.
 * @type {number}
 * @private
 */
let LEAD_SURROGATE_MIN_VALUE_ = 0xD800;

/**
 * Lead surrogate maximum value.
 * @type {number}
 * @private
 */
let LEAD_SURROGATE_MAX_VALUE_ = 0xDBFF;

/**
 * Trail surrogate minimum value.
 * @type {number}
 * @private
 */
let TRAIL_SURROGATE_MIN_VALUE_ = 0xDC00;

/**
 * Trail surrogate maximum value.
 * @type {number}
 * @private
 */
let TRAIL_SURROGATE_MAX_VALUE_ = 0xDFFF;

/**
 * The number of least significant bits of a supplementary code point that in
 * UTF-16 become the least significant bits of the trail surrogate. The rest of
 * the in-use bits of the supplementary code point become the least significant
 * bits of the lead surrogate.
 * @type {number}
 * @private
 */
let TRAIL_SURROGATE_BIT_COUNT_ = 10;

/**
 * Gets the U+ notation string of a Unicode character. Ex: 'U+0041' for 'A'.
 * @param {string} ch The given character.
 * @return {string} The U+ notation of the given character.
 */
function toHexString(ch) {
  const chCode = toCharCode(ch);
  const chCodeStr = 'U+' +
      padString_(chCode.toString(16).toUpperCase(), 4, '0');

  return chCodeStr;
};

/**
 * Gets a string padded with given character to get given size.
 * @param {string} str The given string to be padded.
 * @param {number} length The target size of the string.
 * @param {string} ch The character to be padded with.
 * @return {string} The padded string.
 * @private
 */
function padString_(str, length, ch) {
  while (str.length < length) {
    str = ch + str;
  }
  return str;
};

/**
 * Gets Unicode value of the given character.
 * @param {string} ch The given character, which in the case of a supplementary
 * character is actually a surrogate pair. The remainder of the string is
 * ignored.
 * @return {number} The Unicode value of the character.
 */
function toCharCode(ch) {
  return getCodePointAround(ch, 0);
};

/**
 * Gets a character from the given Unicode value. If the given code point is not
 * a valid Unicode code point, null is returned.
 * @param {number} code The Unicode value of the character.
 * @return {?string} The character corresponding to the given Unicode value.
 */
function fromCharCode(code) {
  if (code == null ||
      !(code >= 0 && code <= CODE_POINT_MAX_VALUE_)) {
    return null;
  }
  if (isSupplementaryCodePoint(code)) {
    // First, we split the code point into the trail surrogate part (the
    // TRAIL_SURROGATE_BIT_COUNT_ least significant bits) and the lead surrogate
    // part (the rest of the bits, shifted down; note that for now this includes
    // the supplementary offset, also shifted down, to be subtracted off below).
    const leadBits = code >> TRAIL_SURROGATE_BIT_COUNT_;
    const trailBits = code &
        // A bit-mask to get the TRAIL_SURROGATE_BIT_COUNT_ (i.e. 10) least
        // significant bits. 1 << 10 = 0x0400. 0x0400 - 1 = 0x03FF.
        ((1 << TRAIL_SURROGATE_BIT_COUNT_) - 1);

    // Now we calculate the code point of each surrogate by adding each offset
    // to the corresponding base code point.
    const leadCodePoint = leadBits +
        (LEAD_SURROGATE_MIN_VALUE_ -
         // Subtract off the supplementary offset, which had been shifted down
         // with the rest of leadBits. We do this here instead of before the
         // shift in order to save a separate subtraction step.
         (SUPPLEMENTARY_CODE_POINT_MIN_VALUE_ >>
          TRAIL_SURROGATE_BIT_COUNT_));
    const trailCodePoint =
        trailBits + TRAIL_SURROGATE_MIN_VALUE_;

    // Convert the code points into a 2-character long string.
    return String.fromCharCode(leadCodePoint) +
        String.fromCharCode(trailCodePoint);
  }
  return String.fromCharCode(code);
};

/**
 * Returns the Unicode code point at the specified index.
 *
 * If the char value specified at the given index is in the leading-surrogate
 * range, and the following index is less than the length of `string`, and
 * the char value at the following index is in the trailing-surrogate range,
 * then the supplementary code point corresponding to this surrogate pair is
 * returned.
 *
 * If the char value specified at the given index is in the trailing-surrogate
 * range, and the preceding index is not before the start of `string`, and
 * the char value at the preceding index is in the leading-surrogate range, then
 * the negated supplementary code point corresponding to this surrogate pair is
 * returned.
 *
 * The negation allows the caller to differentiate between the case where the
 * given index is at the leading surrogate and the one where it is at the
 * trailing surrogate, and thus deduce where the next character starts and
 * preceding character ends.
 *
 * Otherwise, the char value at the given index is returned. Thus, a leading
 * surrogate is returned when it is not followed by a trailing surrogate, and a
 * trailing surrogate is returned when it is not preceded by a leading
 * surrogate.
 *
 * @param {string} string The string.
 * @param {number} index The index from which the code point is to be retrieved.
 * @return {number} The code point at the given index. If the given index is
 * that of the start (i.e. lead surrogate) of a surrogate pair, returns the code
 * point encoded by the pair. If the given index is that of the end (i.e. trail
 * surrogate) of a surrogate pair, returns the negated code pointed encoded by
 * the pair.
 */
function getCodePointAround(string, index) {
  const charCode = string.charCodeAt(index);
  if (isLeadSurrogateCodePoint(charCode) &&
      index + 1 < string.length) {
    const trail = string.charCodeAt(index + 1);
    if (isTrailSurrogateCodePoint(trail)) {
      // Part of a surrogate pair.
      return /** @type {number} */ (
          buildSupplementaryCodePoint(charCode, trail));
    }
  } else if (isTrailSurrogateCodePoint(charCode) && index > 0) {
    const lead = string.charCodeAt(index - 1);
    if (isLeadSurrogateCodePoint(lead)) {
      // Part of a surrogate pair.
      const codepoint = /** @type {number} */ (
          buildSupplementaryCodePoint(lead, charCode));
      return -codepoint;
    }
  }
  return charCode;
};

/**
 * Determines the length of the string needed to represent the specified
 * Unicode code point.
 * @param {number} codePoint
 * @return {number} 2 if codePoint is a supplementary character, 1 otherwise.
 */
function charCount(codePoint) {
  return isSupplementaryCodePoint(codePoint) ? 2 : 1;
};

/**
 * Determines whether the specified Unicode code point is in the supplementary
 * Unicode characters range.
 * @param {number} codePoint
 * @return {boolean} Whether then given code point is a supplementary character.
 */
function isSupplementaryCodePoint(codePoint) {
  return codePoint >= SUPPLEMENTARY_CODE_POINT_MIN_VALUE_ &&
      codePoint <= CODE_POINT_MAX_VALUE_;
};

/**
 * Gets whether the given code point is a leading surrogate character.
 * @param {number} codePoint
 * @return {boolean} Whether the given code point is a leading surrogate
 * character.
 */
function isLeadSurrogateCodePoint(codePoint) {
  return codePoint >= LEAD_SURROGATE_MIN_VALUE_ &&
      codePoint <= LEAD_SURROGATE_MAX_VALUE_;
};

/**
 * Gets whether the given code point is a trailing surrogate character.
 * @param {number} codePoint
 * @return {boolean} Whether the given code point is a trailing surrogate
 * character.
 */
function isTrailSurrogateCodePoint(codePoint) {
  return codePoint >= TRAIL_SURROGATE_MIN_VALUE_ &&
      codePoint <= TRAIL_SURROGATE_MAX_VALUE_;
};

/**
 * Composes a supplementary Unicode code point from the given UTF-16 surrogate
 * pair. If leadSurrogate isn't a leading surrogate code point or trailSurrogate
 * isn't a trailing surrogate code point, null is returned.
 * @param {number} lead The leading surrogate code point.
 * @param {number} trail The trailing surrogate code point.
 * @return {?number} The supplementary Unicode code point obtained by decoding
 * the given UTF-16 surrogate pair.
 */
function buildSupplementaryCodePoint(lead, trail) {
  if (isLeadSurrogateCodePoint(lead) &&
      isTrailSurrogateCodePoint(trail)) {
    const shiftedLeadOffset =
        (lead << TRAIL_SURROGATE_BIT_COUNT_) -
        (LEAD_SURROGATE_MIN_VALUE_
         << TRAIL_SURROGATE_BIT_COUNT_);
    const trailOffset = trail - TRAIL_SURROGATE_MIN_VALUE_ +
        SUPPLEMENTARY_CODE_POINT_MIN_VALUE_;
    return shiftedLeadOffset + trailOffset;
  }
  return null;
};

export {buildSupplementaryCodePoint, charCount, fromCharCode, getCodePointAround, isLeadSurrogateCodePoint, isSupplementaryCodePoint, isTrailSurrogateCodePoint, toCharCode, toHexString};