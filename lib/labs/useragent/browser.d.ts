/**
 * A browser brand represents an opaque string that is used for making
 * brand-specific version checks in userAgentData.
 */
export type Brand = string;
export namespace Brand {
    const ANDROID_BROWSER: string;
    const CHROMIUM: string;
    const EDGE: string;
    const FIREFOX: string;
    const IE: string;
    const OPERA: string;
    const SAFARI: string;
    const SILK: string;
}
/** @return {boolean} Whether the user's browser is Opera. */
export function isOpera(): boolean;
/** @return {boolean} Whether the user's browser is IE. */
export function isIE(): boolean;
/** @return {boolean} Whether the user's browser is EdgeHTML based Edge. */
export function isEdge(): boolean;
/** @return {boolean} Whether the user's browser is Chromium based Edge. */
export function isEdgeChromium(): boolean;
/** @return {boolean} Whether the user's browser is Chromium based Opera. */
export function isOperaChromium(): boolean;
/** @return {boolean} Whether the user's browser is Firefox. */
export function isFirefox(): boolean;
/** @return {boolean} Whether the user's browser is Safari. */
export function isSafari(): boolean;
/**
 * @return {boolean} Whether the user's browser is Coast (Opera's Webkit-based
 *     iOS browser).
 */
export function isCoast(): boolean;
/** @return {boolean} Whether the user's browser is iOS Webview. */
export function isIosWebview(): boolean;
/**
 * @return {boolean} Whether the user's browser is any Chromium based browser (
 *     Chrome, Blink-based Opera (15+) and Edge Chromium).
 */
export function isChrome(): boolean;
/** @return {boolean} Whether the user's browser is the Android browser. */
export function isAndroidBrowser(): boolean;
/**
 * For more information, see:
 * http://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html
 * @return {boolean} Whether the user's browser is Silk.
 */
export function isSilk(): boolean;
/**
 * Returns the browser version.
 *
 * Note that for browsers with multiple brands, this function assumes a primary
 * brand and returns the version for that brand.
 *
 * Additionally, this function is not userAgentData-aware and will return
 * incorrect values when the User Agent string is frozen. The current status of
 * User Agent string freezing is available here:
 * https://www.chromestatus.com/feature/5704553745874944
 *
 * To mitigate both of these potential issues, use
 * getVersionStringForLogging() or fullVersionOf() instead.
 *
 * @return {string} The browser version or empty string if version cannot be
 *     determined. Note that for Internet Explorer, this returns the version of
 *     the browser, not the version of the rendering engine. (IE 8 in
 *     compatibility mode will return 8.0 rather than 7.0. To determine the
 *     rendering engine version, look at document.documentMode instead. See
 *     http://msdn.microsoft.com/en-us/library/cc196988(v=vs.85).aspx for more
 *     details.)
 */
export function getVersion(): string;
/**
 * Returns whether the current browser's version is at least as high as the
 * given one.
 *
 * Note that for browsers with multiple brands, this function assumes a primary
 * brand and checks the version for that brand.
 *
 * Additionally, this function is not userAgentData-aware and will return
 * incorrect values when the User Agent string is frozen. The current status of
 * User Agent string freezing is available here:
 * https://www.chromestatus.com/feature/5704553745874944
 *
 * To mitigate both of these potential issues, use isAtLeast()/isAtMost() or
 * fullVersionOf() instead.
 *
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the browser version is higher or the same as the
 *     given version.
 * @deprecated Use isAtLeast()/isAtMost() instead.
 */
export function isVersionOrHigher(version: string | number): boolean;
/**
 * Returns the major version of the given browser brand, or NaN if the current
 * browser is not the given brand.
 * Note that the major version number may be different depending on which
 * browser is specified. The returned value can be used to make browser version
 * comparisons using comparison operators.
 * @deprecated Use isAtLeast or isAtMost instead.
 * @param {!Brand} browser The brand whose version should be returned.
 * @return {number} The major version number associated with the current
 * browser under the given brand, or NaN if the current browser doesn't match
 * the given brand.
 */
export function versionOf(browser: Brand): number;
/**
 * Returns true if the current browser matches the given brand and is at least
 * the given major version. The major version must be a whole number (i.e.
 * decimals should not be used to represent a minor version).
 * @param {!Brand} brand The brand whose version should be returned.
 * @param {number} majorVersion The major version number to compare against.
 *     This must be a whole number.
 * @return {boolean} Whether the current browser both matches the given brand
 *     and is at least the given version.
 */
export function isAtLeast(brand: Brand, majorVersion: number): boolean;
/**
 * Returns true if the current browser matches the given brand and is at most
 * the given version. The major version must be a whole number (i.e. decimals
 * should not be used to represent a minor version).
 * @param {!Brand} brand The brand whose version should be returned.
 * @param {number} majorVersion The major version number to compare against.
 *     This must be a whole number.
 * @return {boolean} Whether the current browser both matches the given brand
 *     and is at most the given version.
 */
export function isAtMost(brand: Brand, majorVersion: number): boolean;
/**
 * Requests all full browser versions to be cached.  When the returned promise
 * resolves, subsequent calls to `fullVersionOf(...).getIfLoaded()` will return
 * a value.
 *
 * This method should be avoided in favor of directly awaiting
 * `fullVersionOf(...).load()` where it is used.
 *
 * @return {!Promise<void>}
 */
export function loadFullVersions(): Promise<void>;
/**
 * Returns an object that provides access to the full version string of the
 * current browser -- or undefined, based on whether the current browser matches
 * the requested browser brand. Note that the full version string is a
 * high-entropy value, and must be asynchronously loaded before it can be
 * accessed synchronously.
 * @param {!Brand} browser The brand whose version should be returned.
 * @return {!AsyncValue<!Version>|undefined} An object that can be used
 *     to get or load the full version string as a high-entropy value, or
 * undefined if the current browser doesn't match the given brand.
 */
export function fullVersionOf(browser: Brand): AsyncValue<Version> | undefined;
/**
 * Returns a version string for the current browser or undefined, based on
 * whether the current browser is the one specified.
 * This value should ONLY be used for logging/debugging purposes. Do not use it
 * to branch code paths. For comparing versions, use isAtLeast()/isAtMost() or
 * fullVersionOf() instead.
 * @param {!Brand} browser The brand whose version should be returned.
 * @return {string} The version as a string.
 */
export function getVersionStringForLogging(browser: Brand): string;
import { AsyncValue } from "./highentropy/highentropyvalue.js";
import { Version } from "./highentropy/highentropyvalue.js";
