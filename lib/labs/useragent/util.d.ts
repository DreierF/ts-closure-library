/**
 * Parses the user agent into tuples for each section.
 * @param {string} userAgent
 * @return {!Array<!Array<string>>} Tuples of key, version, and the contents
 *     of the parenthetical.
 */
export function extractVersionTuples(userAgent: string): Array<Array<string>>;
/**
 * @return {string} The user agent string.
 */
export function getUserAgent(): string;
/**
 * @param {string} str
 * @return {boolean} Whether the user agent contains the given string.
 */
export function matchUserAgent(str: string): boolean;
/**
 * @param {string} str
 * @return {boolean} Whether the user agent contains the given string, ignoring
 *     case.
 */
export function matchUserAgentIgnoreCase(str: string): boolean;
/**
 * Applications may override browser detection on the built in
 * navigator.userAgent object by setting this string. Set to null to use the
 * browser object instead.
 * @param {?string=} opt_userAgent The User-Agent override.
 */
export function setUserAgent(opt_userAgent?: (string | null) | undefined): void;
