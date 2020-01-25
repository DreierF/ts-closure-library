import * as userAgent_browser from './../labs/useragent/browser.js';
import * as engine from './../labs/useragent/engine.js';
import * as platform from './../labs/useragent/platform.js';
import * as util from './../labs/useragent/util.js';
import * as reflect from './../reflect/reflect.js';
import * as strings from './../string/string.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Rendering engine detection.
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For information on the browser brand (such as Safari versus Chrome), see
 * goog.userAgent.product.
 * @see ../demos/useragent.html
 */

/**
 * @type {boolean} Whether we know at compile-time that the browser is IE.
 */
const ASSUME_IE = false;

/**
 * @type {boolean} Whether we know at compile-time that the browser is EDGE,
 * referring to EdgeHTML based Edge.
 */
const ASSUME_EDGE = false;

/**
 * @type {boolean} Whether we know at compile-time that the browser is GECKO.
 */
const ASSUME_GECKO = false;

/**
 * @type {boolean} Whether we know at compile-time that the browser is WEBKIT.
 */
const ASSUME_WEBKIT = false;

/**
 * @type {boolean} Whether we know at compile-time that the browser is a
 *     mobile device running WebKit e.g. iPhone or Android.
 */
const ASSUME_MOBILE_WEBKIT = false;

/**
 * @type {boolean} Whether we know at compile-time that the browser is OPERA,
 * referring to Presto-based Opera.
 */
const ASSUME_OPERA = false;

/**
 * @type {boolean} Whether the
 *     `isVersionOrHigher`
 *     function will return true for any version.
 */
const ASSUME_ANY_VERSION = false;

/**
 * Whether we know the browser engine at compile-time.
 * @type {boolean}
 * @private
 */
let BROWSER_KNOWN_ = ASSUME_IE ||
    ASSUME_EDGE || ASSUME_GECKO ||
    ASSUME_MOBILE_WEBKIT || ASSUME_WEBKIT ||
    ASSUME_OPERA;

/**
 * Returns the userAgent string for the current browser.
 *
 * @return {string} The userAgent string.
 */
function getUserAgentString() {
  return util.getUserAgent();
};

/**
 * @return {?Navigator} The native navigator object.
 */
function getNavigatorTyped() {
  // Need a local navigator reference instead of using the global one,
  // to avoid the rare case where they reference different objects.
  // (in a WorkerPool, for example).
  return window['navigator'] || null;
};

/**
 * TODO(nnaze): Change type to "Navigator" and update compilation targets.
 * @return {?Object} The native navigator object.
 */
function getNavigator() {
  return getNavigatorTyped();
};

/**
 * Whether the user agent is Presto-based Opera.
 * @type {boolean}
 */
let OPERA = BROWSER_KNOWN_ ?
    ASSUME_OPERA :
    userAgent_browser.isOpera();

/**
 * Whether the user agent is Internet Explorer.
 * @type {boolean}
 */
let IE = BROWSER_KNOWN_ ?
    ASSUME_IE :
    userAgent_browser.isIE();

/**
 * Whether the user agent is Microsoft Edge (EdgeHTML based).
 * @type {boolean}
 */
let EDGE = BROWSER_KNOWN_ ?
    ASSUME_EDGE :
    engine.isEdge();

/**
 * Whether the user agent is MS Internet Explorer or MS Edge (EdgeHTML based).
 * @type {boolean}
 */
let EDGE_OR_IE = EDGE || IE;

/**
 * Whether the user agent is Gecko. Gecko is the rendering engine used by
 * Mozilla, Firefox, and others.
 * @type {boolean}
 */
let GECKO = BROWSER_KNOWN_ ?
    ASSUME_GECKO :
    engine.isGecko();

/**
 * Whether the user agent is WebKit. WebKit is the rendering engine that
 * Safari, Edge Chromium, Opera Chromium, Android and others use.
 * @type {boolean}
 */
let WEBKIT = BROWSER_KNOWN_ ?
    ASSUME_WEBKIT || ASSUME_MOBILE_WEBKIT :
    engine.isWebKit();

/**
 * Whether the user agent is running on a mobile device.
 *
 * This is a separate function so that the logic can be tested.
 *
 * TODO(nnaze): Investigate swapping in goog.labs.userAgent.device.isMobile().
 *
 * @return {boolean} Whether the user agent is running on a mobile device.
 * @private
 */
function isMobile_() {
  return WEBKIT &&
      util.matchUserAgent('Mobile');
};

/**
 * Whether the user agent is running on a mobile device.
 *
 * TODO(nnaze): Consider deprecating MOBILE when labs.userAgent
 *   is promoted as the gecko/webkit logic is likely inaccurate.
 *
 * @type {boolean}
 */
let MOBILE =
    ASSUME_MOBILE_WEBKIT || isMobile_();

/**
 * Used while transitioning code to use WEBKIT instead.
 * @type {boolean}
 * @deprecated Use {@link goog.userAgent.product.SAFARI} instead.
 * TODO(nicksantos): Delete this from goog.userAgent.
 */
let SAFARI = WEBKIT;

/**
 * @return {string} the platform (operating system) the user agent is running
 *     on. Default to empty string because navigator.platform may not be defined
 *     (on Rhino, for example).
 * @private
 */
function determinePlatform_() {
  var navigator = getNavigatorTyped();
  return navigator && navigator.platform || '';
};

/**
 * The platform (operating system) the user agent is running on. Default to
 * empty string because navigator.platform may not be defined (on Rhino, for
 * example).
 * @type {string}
 */
let PLATFORM = determinePlatform_();

/**
 * @type {boolean} Whether the user agent is running on a Macintosh operating
 *     system.
 */
const ASSUME_MAC = false;

/**
 * @type {boolean} Whether the user agent is running on a Windows operating
 *     system.
 */
const ASSUME_WINDOWS = false;

/**
 * @type {boolean} Whether the user agent is running on a Linux operating
 *     system.
 */
const ASSUME_LINUX = false;

/**
 * @type {boolean} Whether the user agent is running on a X11 windowing
 *     system.
 */
const ASSUME_X11 = false;

/**
 * @type {boolean} Whether the user agent is running on Android.
 */
const ASSUME_ANDROID = false;

/**
 * @type {boolean} Whether the user agent is running on an iPhone.
 */
const ASSUME_IPHONE = false;

/**
 * @type {boolean} Whether the user agent is running on an iPad.
 */
const ASSUME_IPAD = false;

/**
 * @type {boolean} Whether the user agent is running on an iPod.
 */
const ASSUME_IPOD = false;

/**
 * @type {boolean} Whether the user agent is running on KaiOS.
 */
const ASSUME_KAIOS = false;

/**
 * @type {boolean} Whether the user agent is running on Go2Phone.
 */
const ASSUME_GO2PHONE = false;

/**
 * @type {boolean}
 * @private
 */
let PLATFORM_KNOWN_ = ASSUME_MAC ||
    ASSUME_WINDOWS || ASSUME_LINUX ||
    ASSUME_X11 || ASSUME_ANDROID ||
    ASSUME_IPHONE || ASSUME_IPAD ||
    ASSUME_IPOD;

/**
 * Whether the user agent is running on a Macintosh operating system.
 * @type {boolean}
 */
let MAC = PLATFORM_KNOWN_ ?
    ASSUME_MAC :
    platform.isMacintosh();

/**
 * Whether the user agent is running on a Windows operating system.
 * @type {boolean}
 */
let WINDOWS = PLATFORM_KNOWN_ ?
    ASSUME_WINDOWS :
    platform.isWindows();

/**
 * Whether the user agent is Linux per the legacy behavior of
 * LINUX, which considered ChromeOS to also be
 * Linux.
 * @return {boolean}
 * @private
 */
function isLegacyLinux_() {
  return platform.isLinux() ||
      platform.isChromeOS();
};

/**
 * Whether the user agent is running on a Linux operating system.
 *
 * Note that LINUX considers ChromeOS to be Linux,
 * while platform considers ChromeOS and
 * Linux to be different OSes.
 *
 * @type {boolean}
 */
let LINUX = PLATFORM_KNOWN_ ?
    ASSUME_LINUX :
    isLegacyLinux_();

/**
 * @return {boolean} Whether the user agent is an X11 windowing system.
 * @private
 */
function isX11_() {
  var navigator = getNavigatorTyped();
  return !!navigator &&
      strings.contains(navigator['appVersion'] || '', 'X11');
};

/**
 * Whether the user agent is running on a X11 windowing system.
 * @type {boolean}
 */
let X11 = PLATFORM_KNOWN_ ?
    ASSUME_X11 :
    isX11_();

/**
 * Whether the user agent is running on Android.
 * @type {boolean}
 */
let ANDROID = PLATFORM_KNOWN_ ?
    ASSUME_ANDROID :
    platform.isAndroid();

/**
 * Whether the user agent is running on an iPhone.
 * @type {boolean}
 */
let IPHONE = PLATFORM_KNOWN_ ?
    ASSUME_IPHONE :
    platform.isIphone();

/**
 * Whether the user agent is running on an iPad.
 * @type {boolean}
 */
let IPAD = PLATFORM_KNOWN_ ?
    ASSUME_IPAD :
    platform.isIpad();

/**
 * Whether the user agent is running on an iPod.
 * @type {boolean}
 */
let IPOD = PLATFORM_KNOWN_ ?
    ASSUME_IPOD :
    platform.isIpod();

/**
 * Whether the user agent is running on iOS.
 * @type {boolean}
 */
let IOS = PLATFORM_KNOWN_ ?
    (ASSUME_IPHONE || ASSUME_IPAD ||
     ASSUME_IPOD) :
    platform.isIos();

/**
 * Whether the user agent is running on KaiOS.
 * @type {boolean}
 */
let KAIOS = PLATFORM_KNOWN_ ?
    ASSUME_KAIOS :
    platform.isKaiOS();

/**
 * Whether the user agent is running on Go2Phone.
 * @type {boolean}
 */
let GO2PHONE = PLATFORM_KNOWN_ ?
    ASSUME_GO2PHONE :
    platform.isGo2Phone();

/**
 * @return {string} The string that describes the version number of the user
 *     agent.
 * @private
 */
function determineVersion_() {
  // All browsers have different ways to detect the version and they all have
  // different naming schemes.
  // version is a string rather than a number because it may contain 'b', 'a',
  // and so on.
  var version = '';
  var arr = getVersionRegexResult_();
  if (arr) {
    version = arr ? arr[1] : '';
  }

  if (IE) {
    // IE9 can be in document mode 9 but be reporting an inconsistent user agent
    // version.  If it is identifying as a version lower than 9 we take the
    // documentMode as the version instead.  IE8 has similar behavior.
    // It is recommended to set the X-UA-Compatible header to ensure that IE9
    // uses documentMode 9.
    var docMode = getDocumentMode_();
    if (docMode != null && docMode > parseFloat(version)) {
      return String(docMode);
    }
  }

  return version;
};

/**
 * @return {?IArrayLike<string>|undefined} The version regex matches from
 *     parsing the user
 *     agent string. These regex statements must be executed inline so they can
 *     be compiled out by the closure compiler with the rest of the useragent
 *     detection logic when ASSUME_* is specified.
 * @private
 */
function getVersionRegexResult_() {
  var userAgent = getUserAgentString();
  if (GECKO) {
    return /rv\:([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (EDGE) {
    return /Edge\/([\d\.]+)/.exec(userAgent);
  }
  if (IE) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(userAgent);
  }
  if (WEBKIT) {
    // WebKit/125.4
    return /WebKit\/(\S+)/.exec(userAgent);
  }
  if (OPERA) {
    // If none of the above browsers were detected but the browser is Opera, the
    // only string that is of interest is 'Version/<number>'.
    return /(?:Version)[ \/]?(\S+)/.exec(userAgent);
  }
  return undefined;
};

/**
 * @return {number|undefined} Returns the document mode (for testing).
 * @private
 */
function getDocumentMode_() {
  // NOTE(user): google.userAgent may be used in context where there is no DOM.
  var doc = window['document'];
  return doc ? doc['documentMode'] : undefined;
};

/**
 * The version of the user agent. This is a string because it might contain
 * 'b' (as in beta) as well as multiple dots.
 * @type {string}
 */
let VERSION = determineVersion_();

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
function compare(v1, v2) {
  return strings.compareVersions(v1, v2);
};

/**
 * Cache for {@link isVersionOrHigher}.
 * Calls to compareVersions are surprisingly expensive and, as a browser's
 * version number is unlikely to change during a session, we cache the results.
 * @const
 * @private
 */
let isVersionOrHigherCache_ = {};

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
function isVersionOrHigher(version) {
  return ASSUME_ANY_VERSION ||
      reflect.cache(
          isVersionOrHigherCache_, version, function() {
            return strings.compareVersions(
                       VERSION, version) >= 0;
          });
};

/**
 * Deprecated alias to `isVersionOrHigher`.
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent version is higher or the same as
 *     the given version.
 * @deprecated Use isVersionOrHigher().
 */
function isVersion(version) {
  return isVersionOrHigher(version);
}

/**
 * Whether the IE effective document mode is higher or the same as the given
 * document mode version.
 * NOTE: Only for IE, return false for another browser.
 *
 * @param {number} documentMode The document mode version to check.
 * @return {boolean} Whether the IE effective document mode is higher or the
 *     same as the given version.
 */
function isDocumentModeOrHigher(documentMode) {
  return Number(DOCUMENT_MODE) >= documentMode;
};

/**
 * Deprecated alias to `isDocumentModeOrHigher`.
 * @param {number} version The version to check.
 * @return {boolean} Whether the IE effective document mode is higher or the
 *      same as the given version.
 * @deprecated Use isDocumentModeOrHigher().
 */
function isDocumentMode(version) {
  return isDocumentModeOrHigher(version);
}

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
let DOCUMENT_MODE = (function() {
  var doc = window['document'];
  if (!doc || !IE) {
    return undefined;
  }
  return getDocumentMode_();
})();

export {ANDROID, ASSUME_ANDROID, ASSUME_ANY_VERSION, ASSUME_EDGE, ASSUME_GECKO, ASSUME_GO2PHONE, ASSUME_IE, ASSUME_IPAD, ASSUME_IPHONE, ASSUME_IPOD, ASSUME_KAIOS, ASSUME_LINUX, ASSUME_MAC, ASSUME_MOBILE_WEBKIT, ASSUME_OPERA, ASSUME_WEBKIT, ASSUME_WINDOWS, ASSUME_X11, DOCUMENT_MODE, EDGE, EDGE_OR_IE, GECKO, GO2PHONE, IE, IOS, IPAD, IPHONE, IPOD, KAIOS, LINUX, MAC, MOBILE, OPERA, PLATFORM, SAFARI, VERSION, WEBKIT, WINDOWS, X11, compare, getNavigator, getNavigatorTyped, getUserAgentString, isDocumentMode, isDocumentModeOrHigher, isVersion, isVersionOrHigher};