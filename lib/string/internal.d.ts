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
export function caseInsensitiveCompare(str1: string, str2: string): number;
/**
 * Determines whether a string contains a substring, ignoring case.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether `str` contains `subString`.
 * @see goog_strings.caseInsensitiveContains
 */
export function caseInsensitiveContains(str: string, subString: string): boolean;
/**
 * Case-insensitive suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of `str`.
 * @return {boolean} True if `str` ends with `suffix` (ignoring
 *     case).
 * @see goog_strings.caseInsensitiveEndsWith
 */
export function caseInsensitiveEndsWith(str: string, suffix: string): boolean;
/**
 * Case-insensitive equality checker.
 * @param {string} str1 First string to check.
 * @param {string} str2 Second string to check.
 * @return {boolean} True if `str1` and `str2` are the same string,
 *     ignoring case.
 * @see goog_strings.caseInsensitiveEquals
 */
export function caseInsensitiveEquals(str1: string, str2: string): boolean;
/**
 * Case-insensitive prefix-checker.
 * @param {string} str The string to check.
 * @param {string} prefix  A string to look for at the end of `str`.
 * @return {boolean} True if `str` begins with `prefix` (ignoring
 *     case).
 * @see goog_strings.caseInsensitiveStartsWith
 */
export function caseInsensitiveStartsWith(str: string, prefix: string): boolean;
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
export function compareVersions(version1: string | number, version2: string | number): number;
/**
 * Determines whether a string contains a substring.
 * @param {string} str The string to search.
 * @param {string} subString The substring to search for.
 * @return {boolean} Whether `str` contains `subString`.
 * @see goog_strings.contains
 */
export function contains(str: string, subString: string): boolean;
/**
 * Fast suffix-checker.
 * @param {string} str The string to check.
 * @param {string} suffix A string to look for at the end of `str`.
 * @return {boolean} True if `str` ends with `suffix`.
 * @see goog_strings.endsWith
 */
export function endsWith(str: string, suffix: string): boolean;
/**
 * Escapes double quote '"' and single quote '\'' characters in addition to
 * '&', '<', and '>' so that a string can be included in an HTML tag attribute
 * value within double or single quotes.
 * @param {string} str string to be escaped.
 * @param {boolean=} opt_isLikelyToContainHtmlChars
 * @return {string} An escaped copy of `str`.
 * @see goog_strings.htmlEscape
 */
export function htmlEscape(str: string, opt_isLikelyToContainHtmlChars?: boolean | undefined): string;
/**
 * Checks if a string is empty or contains only whitespaces.
 * @param {string} str The string to check.
 * @return {boolean} Whether `str` is empty or whitespace only.
 * @see goog_strings.isEmptyOrWhitespace
 */
export function isEmptyOrWhitespace(str: string): boolean;
/**
 * Converts \n to <br>s or <br />s.
 * @param {string} str The string in which to convert newlines.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} A copy of `str` with converted newlines.
 * @see goog_strings.newLineToBr
 */
export function newLineToBr(str: string, opt_xml?: boolean | undefined): string;
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
export function startsWith(str: string, prefix: string): boolean;
export function trim(str: any): any;
/**
 * Do escaping of whitespace to preserve spatial formatting. We use character
 * entity #160 to make it safer for xml.
 * @param {string} str The string in which to escape whitespace.
 * @param {boolean=} opt_xml Whether to use XML compatible tags.
 * @return {string} An escaped copy of `str`.
 * @see goog_strings.whitespaceEscape
 */
export function whitespaceEscape(str: string, opt_xml?: boolean | undefined): string;
