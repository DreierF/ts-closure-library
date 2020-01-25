import * as google from './../google.js';
import * as userAgent from './../useragent/useragent.js';
// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Browser capability checks for the events package.
 */

/**
 * Enum of browser capabilities.
 * @enum {boolean}
 */
let BrowserFeature = {
  /**
   * Whether the button attribute of the event is W3C compliant.  False in
   * Internet Explorer prior to version 9; document-version dependent.
   */
  HAS_W3C_BUTTON:
      !userAgent.IE || userAgent.isDocumentModeOrHigher(9),

  /**
   * Whether the browser supports full W3C event model.
   */
  HAS_W3C_EVENT_SUPPORT:
      !userAgent.IE || userAgent.isDocumentModeOrHigher(9),

  /**
   * To prevent default in IE7-8 for certain keydown events we need set the
   * keyCode to -1.
   */
  SET_KEY_CODE_TO_PREVENT_DEFAULT:
      userAgent.IE && !userAgent.isVersionOrHigher('9'),

  /**
   * Whether the `navigator.onLine` property is supported.
   */
  HAS_NAVIGATOR_ONLINE_PROPERTY:
      !userAgent.WEBKIT || userAgent.isVersionOrHigher('528'),

  /**
   * Whether HTML5 network online/offline events are supported.
   */
  HAS_HTML5_NETWORK_EVENT_SUPPORT:
      userAgent.GECKO && userAgent.isVersionOrHigher('1.9b') ||
      userAgent.IE && userAgent.isVersionOrHigher('8') ||
      userAgent.OPERA && userAgent.isVersionOrHigher('9.5') ||
      userAgent.WEBKIT && userAgent.isVersionOrHigher('528'),

  /**
   * Whether HTML5 network events fire on document.body, or otherwise the
   * window.
   */
  HTML5_NETWORK_EVENTS_FIRE_ON_BODY:
      userAgent.GECKO && !userAgent.isVersionOrHigher('8') ||
      userAgent.IE && !userAgent.isVersionOrHigher('9'),

  /**
   * Whether touch is enabled in the browser.
   */
  TOUCH_ENABLED:
      ('ontouchstart' in window ||
       !!(window['document'] && document.documentElement &&
          'ontouchstart' in document.documentElement) ||
       // IE10 uses non-standard touch events, so it has a different check.
       !!(window['navigator'] &&
          (window['navigator']['maxTouchPoints'] ||
           window['navigator']['msMaxTouchPoints']))),

  /**
   * Whether addEventListener supports W3C standard pointer events.
   * http://www.w3.org/TR/pointerevents/
   */
  POINTER_EVENTS: ('PointerEvent' in window),

  /**
   * Whether addEventListener supports MSPointer events (only used in IE10).
   * http://msdn.microsoft.com/en-us/library/ie/hh772103(v=vs.85).aspx
   * http://msdn.microsoft.com/library/hh673557(v=vs.85).aspx
   */
  MSPOINTER_EVENTS:
      ('MSPointerEvent' in window &&
       !!(window['navigator'] &&
          window['navigator']['msPointerEnabled'])),

  /**
   * Whether addEventListener supports {passive: true}.
   * https://developers.google.com/web/updates/2016/06/passive-event-listeners
   */
  PASSIVE_EVENTS: purify(function() {
    // If we're in a web worker or other custom environment, we can't tell.
    if (!window.addEventListener || !Object.defineProperty) {  // IE 8
      return false;
    }

    var passive = false;
    var options = Object.defineProperty({}, 'passive', {
      get: function() {
        passive = true;
      }
    });
    try {
      window.addEventListener('test', google.nullFunction, options);
      window.removeEventListener('test', google.nullFunction, options);
    } catch (e) {
    }

    return passive;
  })
};

/**
 * Tricks Closure Compiler into believing that a function is pure.  The compiler
 * assumes that any `valueOf` function is pure, without analyzing its contents.
 *
 * @param {function(): T} fn
 * @return {T}
 * @template T
 */
function purify(fn) {
  return ({valueOf: fn}).valueOf();
}

export {BrowserFeature};