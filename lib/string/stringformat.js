import * as strings from './string.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Implementation of sprintf-like, python-%-operator-like,
 * .NET-String.Format-like functionality. Uses JS string's replace method to
 * extract format specifiers and sends those specifiers to a handler function,
 * which then, based on conversion type part of the specifier, calls the
 * appropriate function to handle the specific conversion.
 * For specific functionality implemented, look at formatRe below, or look
 * at the tests.
 */

// TODO(johnlenz): format should not accept undefined as a parameter
/**
 * Performs sprintf-like conversion, i.e. puts the values in a template.
 * DO NOT use it instead of built-in conversions in simple cases such as
 * 'Cost: %.2f' as it would introduce unnecessary latency opposed to
 * 'Cost: ' + cost.toFixed(2).
 * @param {string} formatString Template string containing % specifiers.
 * @param {...(string|number|undefined)} var_args Values formatString is to
 *     be filled with.
 * @return {string} Formatted string.
 */
function format(formatString, var_args) {
  // Convert the arguments to an array (MDC recommended way).
  const args = Array.prototype.slice.call(arguments);

  // Try to get the template.
  const template = args.shift();
  if (typeof template == 'undefined') {
    throw new Error('[format] Template required');
  }

  // This re is used for matching, it also defines what is supported.
  const formatRe = /%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g;

  /**
   * Chooses which conversion function to call based on type conversion
   * specifier.
   * @param {string} match Contains the re matched string.
   * @param {string} flags Formatting flags.
   * @param {string} width Replacement string minimum width.
   * @param {string} dotp Matched precision including a dot.
   * @param {string} precision Specifies floating point precision.
   * @param {string} type Type conversion specifier.
   * @param {string} offset Matching location in the original string.
   * @param {string} wholeString Has the actualString being searched.
   * @return {string} Formatted parameter.
   */
  function replacerDemuxer(
      match, flags, width, dotp, precision, type, offset, wholeString) {
    // The % is too simple and doesn't take an argument.
    if (type == '%') {
      return '%';
    }

    // Try to get the actual value from parent function.
    const value = args.shift();

    // If we didn't get any arguments, fail.
    if (typeof value == 'undefined') {
      throw new Error('[format] Not enough arguments');
    }

    // Patch the value argument to the beginning of our type specific call.
    arguments[0] = value;

    return format.demuxes_[type].apply(null, arguments);
  }

  return template.replace(formatRe, replacerDemuxer);
};

/**
 * Contains various conversion functions (to be filled in later on).
 * @private {!Object}
 */
format.demuxes_ = {};

/**
 * Processes %s conversion specifier.
 * @param {string} value Contains the formatRe matched string.
 * @param {string} flags Formatting flags.
 * @param {string} width Replacement string minimum width.
 * @param {string} dotp Matched precision including a dot.
 * @param {string} precision Specifies floating point precision.
 * @param {string} type Type conversion specifier.
 * @param {string} offset Matching location in the original string.
 * @param {string} wholeString Has the actualString being searched.
 * @return {string} Replacement string.
 */
format.demuxes_['s'] = function(
    value, flags, width, dotp, precision, type, offset, wholeString) {
  let replacement = value;
  // If no padding is necessary we're done.
  // The check for '' is necessary because Firefox incorrectly provides the
  // empty string instead of undefined for non-participating capture groups,
  // and isNaN('') == false.
  if (isNaN(width) || width == '' || replacement.length >= Number(width)) {
    return replacement;
  }

  // Otherwise we should find out where to put spaces.
  if (flags.indexOf('-', 0) > -1) {
    replacement = replacement +
        strings.repeat(' ', Number(width) - replacement.length);
  } else {
    replacement = strings.repeat(' ', Number(width) - replacement.length) +
        replacement;
  }
  return replacement;
};

/**
 * Processes %f conversion specifier.
 * @param {string} value Contains the formatRe matched string.
 * @param {string} flags Formatting flags.
 * @param {string} width Replacement string minimum width.
 * @param {string} dotp Matched precision including a dot.
 * @param {string} precision Specifies floating point precision.
 * @param {string} type Type conversion specifier.
 * @param {string} offset Matching location in the original string.
 * @param {string} wholeString Has the actualString being searched.
 * @return {string} Replacement string.
 */
format.demuxes_['f'] = function(
    value, flags, width, dotp, precision, type, offset, wholeString) {
  let replacement = value.toString();

  // The check for '' is necessary because Firefox incorrectly provides the
  // empty string instead of undefined for non-participating capture groups,
  // and isNaN('') == false.
  if (!(isNaN(precision) || precision == '')) {
    replacement = parseFloat(value).toFixed(precision);
  }

  // Generates sign string that will be attached to the replacement.
  let sign;
  if (Number(value) < 0) {
    sign = '-';
  } else if (flags.indexOf('+') >= 0) {
    sign = '+';
  } else if (flags.indexOf(' ') >= 0) {
    sign = ' ';
  } else {
    sign = '';
  }

  if (Number(value) >= 0) {
    replacement = sign + replacement;
  }

  // If no padding is necessary we're done.
  if (isNaN(width) || replacement.length >= Number(width)) {
    return replacement;
  }

  // We need a clean signless replacement to start with
  replacement = isNaN(precision) ? Math.abs(Number(value)).toString() :
                                   Math.abs(Number(value)).toFixed(precision);

  const padCount = Number(width) - replacement.length - sign.length;

  // Find out which side to pad, and if it's left side, then which character to
  // pad, and set the sign on the left and padding in the middle.
  if (flags.indexOf('-', 0) >= 0) {
    replacement = sign + replacement + strings.repeat(' ', padCount);
  } else {
    // Decides which character to pad.
    const paddingChar = (flags.indexOf('0', 0) >= 0) ? '0' : ' ';
    replacement =
        sign + strings.repeat(paddingChar, padCount) + replacement;
  }

  return replacement;
};

/**
 * Processes %d conversion specifier.
 * @param {string} value Contains the formatRe matched string.
 * @param {string} flags Formatting flags.
 * @param {string} width Replacement string minimum width.
 * @param {string} dotp Matched precision including a dot.
 * @param {string} precision Specifies floating point precision.
 * @param {string} type Type conversion specifier.
 * @param {string} offset Matching location in the original string.
 * @param {string} wholeString Has the actualString being searched.
 * @return {string} Replacement string.
 */
format.demuxes_['d'] = function(
    value, flags, width, dotp, precision, type, offset, wholeString) {
  return format.demuxes_['f'](
      parseInt(value, 10) /* value */, flags, width, dotp, 0 /* precision */,
      type, offset, wholeString);
};

// These are additional aliases, for integer conversion.
format.demuxes_['i'] = format.demuxes_['d'];
format.demuxes_['u'] = format.demuxes_['d'];

export {format};