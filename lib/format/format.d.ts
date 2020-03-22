/**
 * Tokens used within insertWordBreaks.
 */
export type WbrToken_ = number;
/**
 * Constant for the WBR replacement used by insertWordBreaks.  Safari requires
 * &lt;wbr&gt;&lt;/wbr&gt;, Opera needs the &shy; entity, though this will give
 * a visible hyphen at breaks.  IE8 uses a zero width space. Other browsers just
 * use &lt;wbr&gt;.
 * @type {string}
 */
export let WORD_BREAK_HTML: string;
/**
 * @fileoverview Provides utility functions for formatting strings, numbers etc.
 */
/**
 * Formats a number of bytes in human readable form.
 * 54, 450K, 1.3M, 5G etc.
 * @param {number} bytes The number of bytes to show.
 * @param {number=} opt_decimals The number of decimals to use.  Defaults to 2.
 * @return {string} The human readable form of the byte size.
 */
export function fileSize(bytes: number, opt_decimals?: number | undefined): string;
/**
 * Inserts word breaks into an HTML string at a given interval.
 *
 * This method is as aggressive as possible, using a full table of Unicode
 * characters where it is legal to insert word breaks; however, this table
 * comes at a 2.5k pre-gzip (~1k post-gzip) size cost.  Consider using
 * insertWordBreaksBasic to minimize the size impact.
 *
 * @param {string} str HTML to insert word breaks into.
 * @param {number=} opt_maxlen Maximum length after which to ensure there is a
 *     break.  Default is 10 characters.
 * @return {string} The string including word breaks.
 * @deprecated Prefer wrapping with CSS word-wrap: break-word.
 */
export function insertWordBreaks(str: string, opt_maxlen?: number | undefined): string;
/**
 * Inserts word breaks into an HTML string at a given interval.
 *
 * This method is less aggressive than insertWordBreaks, only inserting
 * breaks next to punctuation and between Latin or Cyrillic characters.
 * However, this is good enough for the common case of URLs.  It also
 * works for all Latin and Cyrillic languages, plus CJK has no need for word
 * breaks.  When this method is used, GraphemeBreak may be dead
 * code eliminated.
 *
 * @param {string} str HTML to insert word breaks into.
 * @param {number=} opt_maxlen Maximum length after which to ensure there is a
 *     break.  Default is 10 characters.
 * @return {string} The string including word breaks.
 * @deprecated Prefer wrapping with CSS word-wrap: break-word.
 */
export function insertWordBreaksBasic(str: string, opt_maxlen?: number | undefined): string;
/**
 * Checks whether string value containing scaling units (K, M, G, T, P, m,
 * u, n) can be converted to a number.
 *
 * Where there is a decimal, there must be a digit to the left of the
 * decimal point.
 *
 * Negative numbers are valid.
 *
 * Examples:
 *   0, 1, 1.0, 10.4K, 2.3M, -0.3P, 1.2m
 *
 * @param {string} val String value to check.
 * @return {boolean} True if string could be converted to a numeric value.
 */
export function isConvertableScaledNumber(val: string): boolean;
/**
 * Converts number of bytes to string representation. Binary conversion.
 * Default is to return the additional 'B' suffix only for scales greater than
 * 1K, e.g. '10.5KB' to minimize confusion with counts that are scaled by powers
 * of 1000. Otherwise, suffix is empty string.
 * @param {number} val Value to be converted.
 * @param {number=} opt_decimals The number of decimals to use.  Defaults to 2.
 * @param {boolean=} opt_suffix If true, include trailing 'B' in returned
 *     string.  Default is true.
 * @param {boolean=} opt_useSeparator If true, number and scale will be
 *     separated by a no break space. Default is false.
 * @return {string} String representation of number of bytes.
 */
export function numBytesToString(val: number, opt_decimals?: number | undefined, opt_suffix?: boolean | undefined, opt_useSeparator?: boolean | undefined): string;
/**
 * Converts a numeric value to string representation. SI conversion.
 * @param {number} val Value to be converted.
 * @param {number=} opt_decimals The number of decimals to use.  Defaults to 2.
 * @return {string} String representation of number.
 */
export function numericValueToString(val: number, opt_decimals?: number | undefined): string;
/**
 * Converts a string to number of bytes, taking into account the units.
 * Binary conversion.
 * @param {string} stringValue String to be converted to numeric value.
 * @return {number} Numeric value for string.
 */
export function stringToNumBytes(stringValue: string): number;
/**
 * Converts a string to numeric value, taking into account the units.
 * If string ends in 'B', use binary conversion.
 * @param {string} stringValue String to be converted to numeric value.
 * @return {number} Numeric value for string.
 */
export function stringToNumericValue(stringValue: string): number;
