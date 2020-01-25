import * as userAgent_browser from './../labs/useragent/browser.js';
import * as userAgentplatform from './../labs/useragent/platform.js';
import * as platform from './../labs/useragent/platform.js';
import * as strings from './../string/string.js';
import * as googuserAgent from './useragent.js';
import * as userAgent from './useragent.js';
// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Detects the specific browser and not just the rendering engine.
 */

/**
 * @type {boolean} Whether the code is running on the Firefox web browser.
 */
const ASSUME_FIREFOX = false;

/**
 * @type {boolean} Whether we know at compile-time that the product is an
 *     iPhone.
 */
const ASSUME_IPHONE = false;

/**
 * @type {boolean} Whether we know at compile-time that the product is an
 *     iPad.
 */
const ASSUME_IPAD = false;

/**
 * @type {boolean} Whether we know at compile-time that the product is an
 *     AOSP browser or WebView inside a pre KitKat Android phone or tablet.
 */
const ASSUME_ANDROID = false;

/**
 * @type {boolean} Whether the code is running on the Chrome web browser on
 * any platform or AOSP browser or WebView in a KitKat+ Android phone or tablet.
 */
const ASSUME_CHROME = false;

/**
 * @type {boolean} Whether the code is running on the Safari web browser.
 */
const ASSUME_SAFARI = false;

/**
 * Whether we know the product type at compile-time.
 * @type {boolean}
 * @private
 */
let PRODUCT_KNOWN_ = userAgent.ASSUME_IE ||
    userAgent.ASSUME_EDGE || userAgent.ASSUME_OPERA ||
    ASSUME_FIREFOX ||
    ASSUME_IPHONE ||
    ASSUME_IPAD ||
    ASSUME_ANDROID ||
    ASSUME_CHROME ||
    ASSUME_SAFARI;

/**
 * Whether the code is running on the Opera web browser.
 * @type {boolean}
 */
let OPERA = userAgent.OPERA;

/**
 * Whether the code is running on an IE web browser.
 * @type {boolean}
 */
let IE = userAgent.IE;

/**
 * Whether the code is running on an Edge web browser (EdgeHTML based).
 * @type {boolean}
 */
let EDGE = userAgent.EDGE;

/**
 * Whether the code is running on the Firefox web browser.
 * @type {boolean}
 */
let FIREFOX = PRODUCT_KNOWN_ ?
    ASSUME_FIREFOX :
    userAgent_browser.isFirefox();

/**
 * Whether the user agent is an iPhone or iPod (as in iPod touch).
 * @return {boolean}
 * @private
 */
function isIphoneOrIpod_() {
  return platform.isIphone() ||
      platform.isIpod();
};

/**
 * Whether the code is running on an iPhone or iPod touch.
 *
 * iPod touch is considered an iPhone for legacy reasons.
 * @type {boolean}
 */
let IPHONE = PRODUCT_KNOWN_ ?
    ASSUME_IPHONE :
    isIphoneOrIpod_();

/**
 * Whether the code is running on an iPad.
 * @type {boolean}
 */
let IPAD = PRODUCT_KNOWN_ ?
    ASSUME_IPAD :
    platform.isIpad();

/**
 * Whether the code is running on AOSP browser or WebView inside
 * a pre KitKat Android phone or tablet.
 * @type {boolean}
 */
let ANDROID = PRODUCT_KNOWN_ ?
    ASSUME_ANDROID :
    userAgent_browser.isAndroidBrowser();

/**
 * Whether the code is running on any Chromium-based web browser on any platform
 * or AOSP browser or WebView in a KitKat+ Android phone or tablet.
 * @type {boolean}
 */
let CHROME = PRODUCT_KNOWN_ ?
    ASSUME_CHROME :
    userAgent_browser.isChrome();

/**
 * @return {boolean} Whether the browser is Safari on desktop.
 * @private
 */
function isSafariDesktop_() {
  return userAgent_browser.isSafari() &&
      !platform.isIos();
};

/**
 * Whether the code is running on the desktop Safari web browser.
 * Note: the legacy behavior here is only true for Safari not running
 * on iOS.
 * @type {boolean}
 */
let SAFARI = PRODUCT_KNOWN_ ?
    ASSUME_SAFARI :
    isSafariDesktop_();

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
 * @fileoverview Functions for understanding the version of the browser.
 * This is pulled out of product.js to ensure that only builds that need
 * this functionality actually get it, without having to rely on the compiler
 * to strip out unneeded pieces.
 *
 * TODO(nnaze): Move to more appropriate filename/namespace.
 */

/**
 * @return {string} The string that describes the version number of the user
 *     agent product.  This is a string rather than a number because it may
 *     contain 'b', 'a', and so on.
 * @private
 */
function determineVersion_() {
  // All browsers have different ways to detect the version and they all have
  // different naming schemes.

  if (FIREFOX) {
    // Firefox/2.0.0.1 or Firefox/3.5.3
    return getFirstRegExpGroup_(/Firefox\/([0-9.]+)/);
  }

  if (IE || EDGE ||
      OPERA) {
    return userAgent.VERSION;
  }

  if (CHROME) {
    if (platform.isIos()) {
      // CriOS/56.0.2924.79
      return getFirstRegExpGroup_(/CriOS\/([0-9.]+)/);
    }
    // Chrome/4.0.223.1
    return getFirstRegExpGroup_(/Chrome\/([0-9.]+)/);
  }

  // This replicates legacy logic, which considered Safari and iOS to be
  // different products.
  if (SAFARI && !platform.isIos()) {
    // Version/5.0.3
    //
    // NOTE: Before version 3, Safari did not report a product version number.
    // The product version number for these browsers will be the empty string.
    // They may be differentiated by WebKit version number in userAgent.
    return getFirstRegExpGroup_(/Version\/([0-9.]+)/);
  }

  if (IPHONE || IPAD) {
    // Mozilla/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1
    // (KHTML, like Gecko) Version/3.0 Mobile/3A100a Safari/419.3
    // Version is the browser version, Mobile is the build number. We combine
    // the version string with the build number: 3.0.3A100a for the example.
    var arr =
        execRegExp_(/Version\/(\S+).*Mobile\/(\S+)/);
    if (arr) {
      return arr[1] + '.' + arr[2];
    }
  } else if (ANDROID) {
    // Mozilla/5.0 (Linux; U; Android 0.5; en-us) AppleWebKit/522+
    // (KHTML, like Gecko) Safari/419.3
    //
    // Mozilla/5.0 (Linux; U; Android 1.0; en-us; dream) AppleWebKit/525.10+
    // (KHTML, like Gecko) Version/3.0.4 Mobile Safari/523.12.2
    //
    // Prefer Version number if present, else make do with the OS number
    var version =
        getFirstRegExpGroup_(/Android\s+([0-9.]+)/);
    if (version) {
      return version;
    }

    return getFirstRegExpGroup_(/Version\/([0-9.]+)/);
  }

  return '';
};

/**
 * Return the first group of the given regex.
 * @param {!RegExp} re Regular expression with at least one group.
 * @return {string} Contents of the first group or an empty string if no match.
 * @private
 */
function getFirstRegExpGroup_(re) {
  var arr = execRegExp_(re);
  return arr ? arr[1] : '';
};

/**
 * Run regexp's exec() on the userAgent string.
 * @param {!RegExp} re Regular expression.
 * @return {?IArrayLike<string>} A result array, or null for no match.
 * @private
 */
function execRegExp_(re) {
  return re.exec(userAgent.getUserAgentString());
};

/**
 * The version of the user agent. This is a string because it might contain
 * 'b' (as in beta) as well as multiple dots.
 * @type {string}
 */
let VERSION = determineVersion_();

/**
 * Whether the user agent product version is higher or the same as the given
 * version.
 *
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent product version is higher or the
 *     same as the given version.
 */
function isVersion(version) {
  return strings.compareVersions(VERSION, version) >=
      0;
};

export {ANDROID, ASSUME_ANDROID, ASSUME_CHROME, ASSUME_FIREFOX, ASSUME_IPAD, ASSUME_IPHONE, ASSUME_SAFARI, CHROME, EDGE, FIREFOX, IE, IPAD, IPHONE, OPERA, SAFARI, VERSION, isVersion};