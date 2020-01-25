import * as strings from './../../string/string.js';
import * as util from './util.js';
// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Closure user agent platform detection.
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For more information on browser brand, rendering engine, or device see the
 * other sub-namespaces in goog.labs.userAgent (browser, engine, and device
 * respectively).
 */

/**
 * @return {boolean} Whether the platform is Android.
 */
function isAndroid() {
  return util.matchUserAgent('Android');
};

/**
 * @return {boolean} Whether the platform is iPod.
 */
function isIpod() {
  return util.matchUserAgent('iPod');
};

/**
 * @return {boolean} Whether the platform is iPhone.
 */
function isIphone() {
  return util.matchUserAgent('iPhone') &&
      !util.matchUserAgent('iPod') &&
      !util.matchUserAgent('iPad');
};

/**
 * @return {boolean} Whether the platform is iPad.
 */
function isIpad() {
  return util.matchUserAgent('iPad');
};

/**
 * @return {boolean} Whether the platform is iOS.
 */
function isIos() {
  return isIphone() ||
      isIpad() ||
      isIpod();
};

/**
 * @return {boolean} Whether the platform is Mac.
 */
function isMacintosh() {
  return util.matchUserAgent('Macintosh');
};

/**
 * Note: ChromeOS is not considered to be Linux as it does not report itself
 * as Linux in the user agent string.
 * @return {boolean} Whether the platform is Linux.
 */
function isLinux() {
  return util.matchUserAgent('Linux');
};

/**
 * @return {boolean} Whether the platform is Windows.
 */
function isWindows() {
  return util.matchUserAgent('Windows');
};

/**
 * @return {boolean} Whether the platform is ChromeOS.
 */
function isChromeOS() {
  return util.matchUserAgent('CrOS');
};

/**
 * @return {boolean} Whether the platform is Chromecast.
 */
function isChromecast() {
  return util.matchUserAgent('CrKey');
};

/**
 * @return {boolean} Whether the platform is KaiOS.
 */
function isKaiOS() {
  return util.matchUserAgentIgnoreCase('KaiOS');
};

/**
 * @return {boolean} Whether the platform is Go2Phone.
 */
function isGo2Phone() {
  return util.matchUserAgentIgnoreCase('GAFP');
};

/**
 * The version of the platform. We only determine the version for Windows,
 * Mac, and Chrome OS. It doesn't make much sense on Linux. For Windows, we only
 * look at the NT version. Non-NT-based versions (e.g. 95, 98, etc.) are given
 * version 0.0.
 *
 * @return {string} The platform version or empty string if version cannot be
 *     determined.
 */
function getVersion() {
  var userAgentString = util.getUserAgent();
  var version = '', re;
  if (isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/;
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = '0.0';
    }
  } else if (isIos()) {
    re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
    var match = re.exec(userAgentString);
    // Report the version as x.y.z and not x_y_z
    version = match && match[1].replace(/_/g, '.');
  } else if (isMacintosh()) {
    re = /Mac OS X ([0-9_.]+)/;
    var match = re.exec(userAgentString);
    // Note: some old versions of Camino do not report an OSX version.
    // Default to 10.
    version = match ? match[1].replace(/_/g, '.') : '10';
  } else if (isKaiOS()) {
    re = /(?:KaiOS)\/(\S+)/i;
    var match = re.exec(userAgentString);
    version = match && match[1];
  } else if (isAndroid()) {
    re = /Android\s+([^\);]+)(\)|;)/;
    var match = re.exec(userAgentString);
    version = match && match[1];
  } else if (isChromeOS()) {
    re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
    var match = re.exec(userAgentString);
    version = match && match[1];
  }
  return version || '';
};

/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the browser version is higher or the same as the
 *     given version.
 */
function isVersionOrHigher(version) {
  return strings.compareVersions(
             getVersion(), version) >= 0;
};

export {getVersion, isAndroid, isChromeOS, isChromecast, isGo2Phone, isIos, isIpad, isIphone, isIpod, isKaiOS, isLinux, isMacintosh, isVersionOrHigher, isWindows};