/**
 * Whether the user agent is running on Android.
 * @type {boolean}
 */
export let ANDROID: boolean;
/**
 * @type {boolean} Whether the user agent is running on Android.
 */
export const ASSUME_ANDROID: boolean;
/**
 * @type {boolean} Whether the
 *     `isVersionOrHigher`
 *     function will return true for any version.
 */
export const ASSUME_ANY_VERSION: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the browser is EDGE,
 * referring to EdgeHTML based Edge.
 */
export const ASSUME_EDGE: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the browser is GECKO.
 */
export const ASSUME_GECKO: boolean;
/**
 * @type {boolean} Whether the user agent is running on Go2Phone.
 */
export const ASSUME_GO2PHONE: boolean;
/**
 * @fileoverview Rendering engine detection.
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For information on the browser brand (such as Safari versus Chrome), see
 * goog.userAgent.product.
 * @see ../demos/useragent.html
 */
/**
 * @type {boolean} Whether we know at compile-time that the browser is IE.
 */
export const ASSUME_IE: boolean;
/**
 * @type {boolean} Whether the user agent is running on an iPad.
 */
export const ASSUME_IPAD: boolean;
/**
 * @type {boolean} Whether the user agent is running on an iPhone.
 */
export const ASSUME_IPHONE: boolean;
/**
 * @type {boolean} Whether the user agent is running on an iPod.
 */
export const ASSUME_IPOD: boolean;
/**
 * @type {boolean} Whether the user agent is running on KaiOS.
 */
export const ASSUME_KAIOS: boolean;
/**
 * @type {boolean} Whether the user agent is running on a Linux operating
 *     system.
 */
export const ASSUME_LINUX: boolean;
/**
 * @type {boolean} Whether the user agent is running on a Macintosh operating
 *     system.
 */
export const ASSUME_MAC: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the browser is a
 *     mobile device running WebKit e.g. iPhone or Android.
 */
export const ASSUME_MOBILE_WEBKIT: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the browser is OPERA,
 * referring to Presto-based Opera.
 */
export const ASSUME_OPERA: boolean;
/**
 * @type {boolean} Whether we know at compile-time that the browser is WEBKIT.
 */
export const ASSUME_WEBKIT: boolean;
/**
 * @type {boolean} Whether the user agent is running on a Windows operating
 *     system.
 */
export const ASSUME_WINDOWS: boolean;
/**
 * @type {boolean} Whether the user agent is running on a X11 windowing
 *     system.
 */
export const ASSUME_X11: boolean;
/**
 * For IE version < 7, documentMode is undefined, so attempt to use the
 * CSS1Compat property to see if we are in standards mode. If we are in
 * standards mode, treat the browser version as the document mode. Otherwise,
 * IE is emulating version 5.
 *
 * NOTE(2019/05/31): Support for IE < 7 is long gone, so this is now simplified.
 * It returns document.documentMode for IE and undefined for everything else.
 *
 * @type {number|undefined}
 * @const
 */
export let DOCUMENT_MODE: number | undefined;
/**
 * Whether the user agent is Microsoft Edge (EdgeHTML based).
 * @type {boolean}
 */
export let EDGE: boolean;
/**
 * Whether the user agent is MS Internet Explorer or MS Edge (EdgeHTML based).
 * @type {boolean}
 */
export let EDGE_OR_IE: boolean;
/**
 * Whether the user agent is Gecko. Gecko is the rendering engine used by
 * Mozilla, Firefox, and others.
 * @type {boolean}
 */
export let GECKO: boolean;
/**
 * Whether the user agent is running on Go2Phone.
 * @type {boolean}
 */
export let GO2PHONE: boolean;
/**
 * Whether the user agent is Internet Explorer.
 * @type {boolean}
 */
export let IE: boolean;
/**
 * Whether the user agent is running on iOS.
 * @type {boolean}
 */
export let IOS: boolean;
/**
 * Whether the user agent is running on an iPad.
 * @type {boolean}
 */
export let IPAD: boolean;
/**
 * Whether the user agent is running on an iPhone.
 * @type {boolean}
 */
export let IPHONE: boolean;
/**
 * Whether the user agent is running on an iPod.
 * @type {boolean}
 */
export let IPOD: boolean;
/**
 * Whether the user agent is running on KaiOS.
 * @type {boolean}
 */
export let KAIOS: boolean;
/**
 * Whether the user agent is running on a Linux operating system.
 *
 * Note that LINUX considers ChromeOS to be Linux,
 * while platform considers ChromeOS and
 * Linux to be different OSes.
 *
 * @type {boolean}
 */
export let LINUX: boolean;
/**
 * Whether the user agent is running on a Macintosh operating system.
 * @type {boolean}
 */
export let MAC: boolean;
/**
 * Whether the user agent is running on a mobile device.
 *
 * TODO(nnaze): Consider deprecating MOBILE when labs.userAgent
 *   is promoted as the gecko/webkit logic is likely inaccurate.
 *
 * @type {boolean}
 */
export let MOBILE: boolean;
/**
 * Whether the user agent is Presto-based Opera.
 * @type {boolean}
 */
export let OPERA: boolean;
/**
 * The platform (operating system) the user agent is running on. Default to
 * empty string because navigator.platform may not be defined (on Rhino, for
 * example).
 * @type {string}
 */
export let PLATFORM: string;
/**
 * Used while transitioning code to use WEBKIT instead.
 * @type {boolean}
 * @deprecated Use {@link goog.userAgent.product.SAFARI} instead.
 * TODO(nicksantos): Delete this from goog.userAgent.
 */
export let SAFARI: boolean;
/**
 * The version of the user agent. This is a string because it might contain
 * 'b' (as in beta) as well as multiple dots.
 * @type {string}
 */
export let VERSION: string;
/**
 * Whether the user agent is WebKit. WebKit is the rendering engine that
 * Safari, Edge Chromium, Opera Chromium, Android and others use.
 * @type {boolean}
 */
export let WEBKIT: boolean;
/**
 * Whether the user agent is running on a Windows operating system.
 * @type {boolean}
 */
export let WINDOWS: boolean;
/**
 * Whether the user agent is running on a X11 windowing system.
 * @type {boolean}
 */
export let X11: boolean;
/**
 * Compares two version numbers.
 *
 * @param {string} v1 Version of first item.
 * @param {string} v2 Version of second item.
 *
 * @return {number}  1 if first argument is higher
 *                   0 if arguments are equal
 *                  -1 if second argument is higher.
 * @deprecated Use strings.compareVersions.
 */
export function compare(v1: string, v2: string): number;
/**
 * TODO(nnaze): Change type to "Navigator" and update compilation targets.
 * @return {?Object} The native navigator object.
 */
export function getNavigator(): any | null;
/**
 * @return {?Navigator} The native navigator object.
 */
export function getNavigatorTyped(): Navigator | null;
/**
 * Returns the userAgent string for the current browser.
 *
 * @return {string} The userAgent string.
 */
export function getUserAgentString(): string;
/**
 * Deprecated alias to `isDocumentModeOrHigher`.
 * @param {number} version The version to check.
 * @return {boolean} Whether the IE effective document mode is higher or the
 *      same as the given version.
 * @deprecated Use isDocumentModeOrHigher().
 */
export function isDocumentMode(version: number): boolean;
/**
 * Whether the IE effective document mode is higher or the same as the given
 * document mode version.
 * NOTE: Only for IE, return false for another browser.
 *
 * @param {number} documentMode The document mode version to check.
 * @return {boolean} Whether the IE effective document mode is higher or the
 *     same as the given version.
 */
export function isDocumentModeOrHigher(documentMode: number): boolean;
/**
 * Deprecated alias to `isVersionOrHigher`.
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent version is higher or the same as
 *     the given version.
 * @deprecated Use isVersionOrHigher().
 */
export function isVersion(version: string | number): boolean;
/**
 * Whether the user agent version is higher or the same as the given version.
 * NOTE: When checking the version numbers for Firefox and Safari, be sure to
 * use the engine's version, not the browser's version number.  For example,
 * Firefox 3.0 corresponds to Gecko 1.9 and Safari 3.0 to Webkit 522.11.
 * Opera and Internet Explorer versions match the product release number.<br>
 * @see <a href="http://en.wikipedia.org/wiki/Safari_version_history">
 *     Webkit</a>
 * @see <a href="http://en.wikipedia.org/wiki/Gecko_engine">Gecko</a>
 *
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent version is higher or the same as
 *     the given version.
 */
export function isVersionOrHigher(version: string | number): boolean;
