/**
 * @return {string} The rendering engine's version or empty string if version
 *     can't be determined.
 */
export function getVersion(): string;
/**
 * @return {boolean} Whether the rendering engine is EdgeHTML.
 */
export function isEdge(): boolean;
/**
 * @return {boolean} Whether the rendering engine is Gecko.
 */
export function isGecko(): boolean;
/**
 * @fileoverview Closure user agent detection.
 * @see http://en.wikipedia.org/wiki/User_agent
 * For more information on browser brand, platform, or device see the other
 * sub-namespaces in goog.labs.userAgent (browser, platform, and device).
 */
/**
 * @return {boolean} Whether the rendering engine is Presto.
 */
export function isPresto(): boolean;
/**
 * @return {boolean} Whether the rendering engine is Trident.
 */
export function isTrident(): boolean;
/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the rendering engine version is higher or the same
 *     as the given version.
 */
export function isVersionOrHigher(version: string | number): boolean;
/**
 * @return {boolean} Whether the rendering engine is WebKit. This will return
 * true for Chrome, Blink-based Opera (15+), Edge Chromium and Safari.
 */
export function isWebKit(): boolean;
