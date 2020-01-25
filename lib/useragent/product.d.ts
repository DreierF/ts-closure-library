/**
 * Whether the code is running on AOSP browser or WebView inside
 * a pre KitKat Android phone or tablet.
 * @type {boolean}
 */
export let ANDROID: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the product is an
 *     AOSP browser or WebView inside a pre KitKat Android phone or tablet.
 */
export const ASSUME_ANDROID: boolean;
/**
 * @type {boolean} Whether the code is running on the Chrome web browser on
 * any platform or AOSP browser or WebView in a KitKat+ Android phone or tablet.
 */
export const ASSUME_CHROME: boolean;
/**
 * @fileoverview Detects the specific browser and not just the rendering engine.
 */
/**
 * @type {boolean} Whether the code is running on the Firefox web browser.
 */
export const ASSUME_FIREFOX: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the product is an
 *     iPad.
 */
export const ASSUME_IPAD: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the product is an
 *     iPhone.
 */
export const ASSUME_IPHONE: boolean;
/**
 * @type {boolean} Whether the code is running on the Safari web browser.
 */
export const ASSUME_SAFARI: boolean;
/**
 * Whether the code is running on any Chromium-based web browser on any platform
 * or AOSP browser or WebView in a KitKat+ Android phone or tablet.
 * @type {boolean}
 */
export let CHROME: boolean;
/**
 * Whether the code is running on an Edge web browser (EdgeHTML based).
 * @type {boolean}
 */
export let EDGE: boolean;
/**
 * Whether the code is running on the Firefox web browser.
 * @type {boolean}
 */
export let FIREFOX: boolean;
/**
 * Whether the code is running on an IE web browser.
 * @type {boolean}
 */
export let IE: boolean;
/**
 * Whether the code is running on an iPad.
 * @type {boolean}
 */
export let IPAD: boolean;
/**
 * Whether the code is running on an iPhone or iPod touch.
 *
 * iPod touch is considered an iPhone for legacy reasons.
 * @type {boolean}
 */
export let IPHONE: boolean;
/**
 * Whether the code is running on the Opera web browser.
 * @type {boolean}
 */
export let OPERA: boolean;
/**
 * Whether the code is running on the desktop Safari web browser.
 * Note: the legacy behavior here is only true for Safari not running
 * on iOS.
 * @type {boolean}
 */
export let SAFARI: boolean;
/**
 * The version of the user agent. This is a string because it might contain
 * 'b' (as in beta) as well as multiple dots.
 * @type {string}
 */
export let VERSION: string;
/**
 * Whether the user agent product version is higher or the same as the given
 * version.
 *
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent product version is higher or the
 *     same as the given version.
 */
export function isVersion(version: string | number): boolean;
