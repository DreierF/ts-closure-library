import * as googarray from './../../array/array.js';
import * as google from './../../google.js';
import * as object from './../../object/object.js';
import * as internal from './../../string/internal.js';
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
 * @fileoverview Closure user agent detection (Browser).
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For more information on rendering engine, platform, or device see the other
 * sub-namespaces in goog.labs.userAgent, goog.labs.userAgent.platform,
 * goog.labs.userAgent.device respectively.)
 */

// TODO(nnaze): Refactor to remove excessive exclusion logic in matching
// functions.

/**
 * @return {boolean} Whether the user's browser is Opera.  Note: Chromium
 *     based Opera (Opera 15+) is detected as Chrome to avoid unnecessary
 *     special casing.
 * @private
 */
function matchOpera_() {
  return util.matchUserAgent('Opera');
};

/**
 * @return {boolean} Whether the user's browser is IE.
 * @private
 */
function matchIE_() {
  return util.matchUserAgent('Trident') ||
      util.matchUserAgent('MSIE');
};

/**
 * @return {boolean} Whether the user's browser is Edge. This refers to EdgeHTML
 * based Edge.
 * @private
 */
function matchEdgeHtml_() {
  return util.matchUserAgent('Edge');
};

/**
 * @return {boolean} Whether the user's browser is Chromium based Edge.
 * @private
 */
function matchEdgeChromium_() {
  return util.matchUserAgent('Edg/');
};

/**
 * @return {boolean} Whether the user's browser is Chromium based Opera.
 * @private
 */
function matchOperaChromium_() {
  return util.matchUserAgent('OPR');
};

/**
 * @return {boolean} Whether the user's browser is Firefox.
 * @private
 */
function matchFirefox_() {
  return util.matchUserAgent('Firefox') ||
      util.matchUserAgent('FxiOS');
};

/**
 * @return {boolean} Whether the user's browser is Safari.
 * @private
 */
function matchSafari_() {
  return util.matchUserAgent('Safari') &&
      !(matchChrome_() ||
        matchCoast_() ||
        matchOpera_() ||
        matchEdgeHtml_() ||
        matchEdgeChromium_() ||
        matchOperaChromium_() ||
        matchFirefox_() ||
        isSilk() ||
        util.matchUserAgent('Android'));
};

/**
 * @return {boolean} Whether the user's browser is Coast (Opera's Webkit-based
 *     iOS browser).
 * @private
 */
function matchCoast_() {
  return util.matchUserAgent('Coast');
};

/**
 * @return {boolean} Whether the user's browser is iOS Webview.
 * @private
 */
function matchIosWebview_() {
  // iOS Webview does not show up as Chrome or Safari. Also check for Opera's
  // WebKit-based iOS browser, Coast.
  return (util.matchUserAgent('iPad') ||
          util.matchUserAgent('iPhone')) &&
      !matchSafari_() &&
      !matchChrome_() &&
      !matchCoast_() &&
      !matchFirefox_() &&
      util.matchUserAgent('AppleWebKit');
};

/**
 * @return {boolean} Whether the user's browser is any Chromium browser. This
 * returns true for Chrome, Opera 15+, and Edge Chromium.
 * @private
 */
function matchChrome_() {
  return (util.matchUserAgent('Chrome') ||
          util.matchUserAgent('CriOS')) &&
      !matchEdgeHtml_();
};

/**
 * @return {boolean} Whether the user's browser is the Android browser.
 * @private
 */
function matchAndroidBrowser_() {
  // Android can appear in the user agent string for Chrome on Android.
  // This is not the Android standalone browser if it does.
  return util.matchUserAgent('Android') &&
      !(isChrome() ||
        isFirefox() ||
        isOpera() ||
        isSilk());
};

/**
 * @return {boolean} Whether the user's browser is Opera.
 */
function isOpera() {
  return matchOpera_();
}

/**
 * @return {boolean} Whether the user's browser is IE.
 */
function isIE() {
  return matchIE_();
}

/**
 * @return {boolean} Whether the user's browser is EdgeHTML based Edge.
 */
function isEdge() {
  return matchEdgeHtml_();
}

/**
 * @return {boolean} Whether the user's browser is Chromium based Edge.
 */
function isEdgeChromium() {
  return matchEdgeChromium_();
}

/**
 * @return {boolean} Whether the user's browser is Chromium based Opera.
 */
function isOperaChromium() {
  return matchOperaChromium_();
}

/**
 * @return {boolean} Whether the user's browser is Firefox.
 */
function isFirefox() {
  return matchFirefox_();
}

/**
 * @return {boolean} Whether the user's browser is Safari.
 */
function isSafari() {
  return matchSafari_();
}

/**
 * @return {boolean} Whether the user's browser is Coast (Opera's Webkit-based
 *     iOS browser).
 */
function isCoast() {
  return matchCoast_();
}

/**
 * @return {boolean} Whether the user's browser is iOS Webview.
 */
function isIosWebview() {
  return matchIosWebview_();
}

/**
 * @return {boolean} Whether the user's browser is any Chromium based browser (
 * Chrome, Blink-based Opera (15+) and Edge Chromium).
 */
function isChrome() {
  return matchChrome_();
}

/**
 * @return {boolean} Whether the user's browser is the Android browser.
 */
function isAndroidBrowser() {
  return matchAndroidBrowser_();
}

/**
 * For more information, see:
 * http://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html
 * @return {boolean} Whether the user's browser is Silk.
 */
function isSilk() {
  return util.matchUserAgent('Silk');
};

/**
 * @return {string} The browser version or empty string if version cannot be
 *     determined. Note that for Internet Explorer, this returns the version of
 *     the browser, not the version of the rendering engine. (IE 8 in
 *     compatibility mode will return 8.0 rather than 7.0. To determine the
 *     rendering engine version, look at document.documentMode instead. See
 *     http://msdn.microsoft.com/en-us/library/cc196988(v=vs.85).aspx for more
 *     details.)
 */
function getVersion() {
  var userAgentString = util.getUserAgent();
  // Special case IE since IE's version is inside the parenthesis and
  // without the '/'.
  if (isIE()) {
    return getIEVersion_(userAgentString);
  }

  var versionTuples =
      util.extractVersionTuples(userAgentString);

  // Construct a map for easy lookup.
  var versionMap = {};
  googarray.forEach(versionTuples, function(tuple) {
    // Note that the tuple is of length three, but we only care about the
    // first two.
    var key = tuple[0];
    var value = tuple[1];
    versionMap[key] = value;
  });

  var versionMapHasKey = google.partial(object.containsKey, versionMap);

  // Gives the value with the first key it finds, otherwise empty string.
  function lookUpValueWithKeys(keys) {
    var key = googarray.find(keys, versionMapHasKey);
    return versionMap[key] || '';
  }

  // Check Opera before Chrome since Opera 15+ has "Chrome" in the string.
  // See
  // http://my.opera.com/ODIN/blog/2013/07/15/opera-user-agent-strings-opera-15-and-beyond
  if (isOpera()) {
    // Opera 10 has Version/10.0 but Opera/9.8, so look for "Version" first.
    // Opera uses 'OPR' for more recent UAs.
    return lookUpValueWithKeys(['Version', 'Opera']);
  }

  // Check Edge before Chrome since it has Chrome in the string.
  if (isEdge()) {
    return lookUpValueWithKeys(['Edge']);
  }

  // Check Chromium Edge before Chrome since it has Chrome in the string.
  if (isEdgeChromium()) {
    return lookUpValueWithKeys(['Edg']);
  }

  if (isChrome()) {
    return lookUpValueWithKeys(['Chrome', 'CriOS']);
  }

  // Usually products browser versions are in the third tuple after "Mozilla"
  // and the engine.
  var tuple = versionTuples[2];
  return tuple && tuple[1] || '';
};

/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the browser version is higher or the same as the
 *     given version.
 */
function isVersionOrHigher(version) {
  return internal.compareVersions(
             getVersion(), version) >= 0;
};

/**
 * Determines IE version. More information:
 * http://msdn.microsoft.com/en-us/library/ie/bg182625(v=vs.85).aspx#uaString
 * http://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
 * http://blogs.msdn.com/b/ie/archive/2010/03/23/introducing-ie9-s-user-agent-string.aspx
 * http://blogs.msdn.com/b/ie/archive/2009/01/09/the-internet-explorer-8-user-agent-string-updated-edition.aspx
 *
 * @param {string} userAgent the User-Agent.
 * @return {string}
 * @private
 */
function getIEVersion_(userAgent) {
  // IE11 may identify itself as MSIE 9.0 or MSIE 10.0 due to an IE 11 upgrade
  // bug. Example UA:
  // Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; WOW64; Trident/7.0; rv:11.0)
  // like Gecko.
  // See http://www.whatismybrowser.com/developers/unknown-user-agent-fragments.
  var rv = /rv: *([\d\.]*)/.exec(userAgent);
  if (rv && rv[1]) {
    return rv[1];
  }

  var version = '';
  var msie = /MSIE +([\d\.]+)/.exec(userAgent);
  if (msie && msie[1]) {
    // IE in compatibility mode usually identifies itself as MSIE 7.0; in this
    // case, use the Trident version to determine the version of IE. For more
    // details, see the links above.
    var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
    if (msie[1] == '7.0') {
      if (tridentVersion && tridentVersion[1]) {
        switch (tridentVersion[1]) {
          case '4.0':
            version = '8.0';
            break;
          case '5.0':
            version = '9.0';
            break;
          case '6.0':
            version = '10.0';
            break;
          case '7.0':
            version = '11.0';
            break;
        }
      } else {
        version = '7.0';
      }
    } else {
      version = msie[1];
    }
  }
  return version;
};

export {getVersion, isAndroidBrowser, isChrome, isCoast, isEdge, isEdgeChromium, isFirefox, isIE, isIosWebview, isOpera, isOperaChromium, isSafari, isSilk, isVersionOrHigher};