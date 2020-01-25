import * as userAgent from './../useragent/useragent.js';
import {BrowserFeature} from './browserfeature.js';
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
 * @fileoverview Event Types.
 */

/**
 * Returns a prefixed event name for the current browser.
 * @param {string} eventName The name of the event.
 * @return {string} The prefixed event name.
 * @suppress {missingRequire|missingProvide}
 * @private
 */
function getVendorPrefixedName_(eventName) {
  return userAgent.WEBKIT ?
      'webkit' + eventName :
      (userAgent.OPERA ? 'o' + eventName.toLowerCase() :
                              eventName.toLowerCase());
};

/**
 * Constants for event names.
 * @enum {string}
 */
let EventType = {
  // Mouse events
  CLICK: 'click',
  RIGHTCLICK: 'rightclick',
  DBLCLICK: 'dblclick',
  AUXCLICK: 'auxclick',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  MOUSEOVER: 'mouseover',
  MOUSEOUT: 'mouseout',
  MOUSEMOVE: 'mousemove',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',

  // Non-existent event; will never fire. This exists as a mouse counterpart to
  // POINTERCANCEL.
  MOUSECANCEL: 'mousecancel',

  // Selection events.
  // https://www.w3.org/TR/selection-api/
  SELECTIONCHANGE: 'selectionchange',
  SELECTSTART: 'selectstart',  // IE, Safari, Chrome

  // Wheel events
  // http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
  WHEEL: 'wheel',

  // Key events
  KEYPRESS: 'keypress',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',

  // Focus
  BLUR: 'blur',
  FOCUS: 'focus',
  DEACTIVATE: 'deactivate',  // IE only
  FOCUSIN: 'focusin',
  FOCUSOUT: 'focusout',

  // Forms
  CHANGE: 'change',
  RESET: 'reset',
  SELECT: 'select',
  SUBMIT: 'submit',
  INPUT: 'input',
  PROPERTYCHANGE: 'propertychange',  // IE only

  // Drag and drop
  DRAGSTART: 'dragstart',
  DRAG: 'drag',
  DRAGENTER: 'dragenter',
  DRAGOVER: 'dragover',
  DRAGLEAVE: 'dragleave',
  DROP: 'drop',
  DRAGEND: 'dragend',

  // Touch events
  // Note that other touch events exist, but we should follow the W3C list here.
  // http://www.w3.org/TR/touch-events/#list-of-touchevent-types
  TOUCHSTART: 'touchstart',
  TOUCHMOVE: 'touchmove',
  TOUCHEND: 'touchend',
  TOUCHCANCEL: 'touchcancel',

  // Misc
  BEFOREUNLOAD: 'beforeunload',
  CONSOLEMESSAGE: 'consolemessage',
  CONTEXTMENU: 'contextmenu',
  DEVICECHANGE: 'devicechange',
  DEVICEMOTION: 'devicemotion',
  DEVICEORIENTATION: 'deviceorientation',
  DOMCONTENTLOADED: 'DOMContentLoaded',
  ERROR: 'error',
  HELP: 'help',
  LOAD: 'load',
  LOSECAPTURE: 'losecapture',
  ORIENTATIONCHANGE: 'orientationchange',
  READYSTATECHANGE: 'readystatechange',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  UNLOAD: 'unload',

  // Media events
  CANPLAY: 'canplay',
  CANPLAYTHROUGH: 'canplaythrough',
  DURATIONCHANGE: 'durationchange',
  EMPTIED: 'emptied',
  ENDED: 'ended',
  LOADEDDATA: 'loadeddata',
  LOADEDMETADATA: 'loadedmetadata',
  PAUSE: 'pause',
  PLAY: 'play',
  PLAYING: 'playing',
  PROGRESS: 'progress',
  RATECHANGE: 'ratechange',
  SEEKED: 'seeked',
  SEEKING: 'seeking',
  STALLED: 'stalled',
  SUSPEND: 'suspend',
  TIMEUPDATE: 'timeupdate',
  VOLUMECHANGE: 'volumechange',
  WAITING: 'waiting',

  // Media Source Extensions events
  // https://www.w3.org/TR/media-source/#mediasource-events
  SOURCEOPEN: 'sourceopen',
  SOURCEENDED: 'sourceended',
  SOURCECLOSED: 'sourceclosed',
  // https://www.w3.org/TR/media-source/#sourcebuffer-events
  ABORT: 'abort',
  UPDATE: 'update',
  UPDATESTART: 'updatestart',
  UPDATEEND: 'updateend',

  // HTML 5 History events
  // See http://www.w3.org/TR/html5/browsers.html#event-definitions-0
  HASHCHANGE: 'hashchange',
  PAGEHIDE: 'pagehide',
  PAGESHOW: 'pageshow',
  POPSTATE: 'popstate',

  // Copy and Paste
  // Support is limited. Make sure it works on your favorite browser
  // before using.
  // http://www.quirksmode.org/dom/events/cutcopypaste.html
  COPY: 'copy',
  PASTE: 'paste',
  CUT: 'cut',
  BEFORECOPY: 'beforecopy',
  BEFORECUT: 'beforecut',
  BEFOREPASTE: 'beforepaste',

  // HTML5 online/offline events.
  // http://www.w3.org/TR/offline-webapps/#related
  ONLINE: 'online',
  OFFLINE: 'offline',

  // HTML 5 worker events
  MESSAGE: 'message',
  CONNECT: 'connect',

  // Service Worker Events - ServiceWorkerGlobalScope context
  // See https://w3c.github.io/ServiceWorker/#execution-context-events
  // Note: message event defined in worker events section
  INSTALL: 'install',
  ACTIVATE: 'activate',
  FETCH: 'fetch',
  FOREIGNFETCH: 'foreignfetch',
  MESSAGEERROR: 'messageerror',

  // Service Worker Events - Document context
  // See https://w3c.github.io/ServiceWorker/#document-context-events
  STATECHANGE: 'statechange',
  UPDATEFOUND: 'updatefound',
  CONTROLLERCHANGE: 'controllerchange',

  // CSS animation events.
  /** @suppress {missingRequire} */
  ANIMATIONSTART: getVendorPrefixedName_('AnimationStart'),
  /** @suppress {missingRequire} */
  ANIMATIONEND: getVendorPrefixedName_('AnimationEnd'),
  /** @suppress {missingRequire} */
  ANIMATIONITERATION: getVendorPrefixedName_('AnimationIteration'),

  // CSS transition events. Based on the browser support described at:
  // https://developer.mozilla.org/en/css/css_transitions#Browser_compatibility
  /** @suppress {missingRequire} */
  TRANSITIONEND: getVendorPrefixedName_('TransitionEnd'),

  // W3C Pointer Events
  // http://www.w3.org/TR/pointerevents/
  POINTERDOWN: 'pointerdown',
  POINTERUP: 'pointerup',
  POINTERCANCEL: 'pointercancel',
  POINTERMOVE: 'pointermove',
  POINTEROVER: 'pointerover',
  POINTEROUT: 'pointerout',
  POINTERENTER: 'pointerenter',
  POINTERLEAVE: 'pointerleave',
  GOTPOINTERCAPTURE: 'gotpointercapture',
  LOSTPOINTERCAPTURE: 'lostpointercapture',

  // IE specific events.
  // See http://msdn.microsoft.com/en-us/library/ie/hh772103(v=vs.85).aspx
  // Note: these events will be supplanted in IE11.
  MSGESTURECHANGE: 'MSGestureChange',
  MSGESTUREEND: 'MSGestureEnd',
  MSGESTUREHOLD: 'MSGestureHold',
  MSGESTURESTART: 'MSGestureStart',
  MSGESTURETAP: 'MSGestureTap',
  MSGOTPOINTERCAPTURE: 'MSGotPointerCapture',
  MSINERTIASTART: 'MSInertiaStart',
  MSLOSTPOINTERCAPTURE: 'MSLostPointerCapture',
  MSPOINTERCANCEL: 'MSPointerCancel',
  MSPOINTERDOWN: 'MSPointerDown',
  MSPOINTERENTER: 'MSPointerEnter',
  MSPOINTERHOVER: 'MSPointerHover',
  MSPOINTERLEAVE: 'MSPointerLeave',
  MSPOINTERMOVE: 'MSPointerMove',
  MSPOINTEROUT: 'MSPointerOut',
  MSPOINTEROVER: 'MSPointerOver',
  MSPOINTERUP: 'MSPointerUp',

  // Native IMEs/input tools events.
  TEXT: 'text',
  // The textInput event is supported in IE9+, but only in lower case. All other
  // browsers use the camel-case event name.
  TEXTINPUT: userAgent.IE ? 'textinput' : 'textInput',
  COMPOSITIONSTART: 'compositionstart',
  COMPOSITIONUPDATE: 'compositionupdate',
  COMPOSITIONEND: 'compositionend',

  // The beforeinput event is initially only supported in Safari. See
  // https://bugs.chromium.org/p/chromium/issues/detail?id=342670 for Chrome
  // implementation tracking.
  BEFOREINPUT: 'beforeinput',

  // Webview tag events
  // See https://developer.chrome.com/apps/tags/webview
  EXIT: 'exit',
  LOADABORT: 'loadabort',
  LOADCOMMIT: 'loadcommit',
  LOADREDIRECT: 'loadredirect',
  LOADSTART: 'loadstart',
  LOADSTOP: 'loadstop',
  RESPONSIVE: 'responsive',
  SIZECHANGED: 'sizechanged',
  UNRESPONSIVE: 'unresponsive',

  // HTML5 Page Visibility API.  See details at
  // `goog.labs.dom.PageVisibilityMonitor`.
  VISIBILITYCHANGE: 'visibilitychange',

  // LocalStorage event.
  STORAGE: 'storage',

  // DOM Level 2 mutation events (deprecated).
  DOMSUBTREEMODIFIED: 'DOMSubtreeModified',
  DOMNODEINSERTED: 'DOMNodeInserted',
  DOMNODEREMOVED: 'DOMNodeRemoved',
  DOMNODEREMOVEDFROMDOCUMENT: 'DOMNodeRemovedFromDocument',
  DOMNODEINSERTEDINTODOCUMENT: 'DOMNodeInsertedIntoDocument',
  DOMATTRMODIFIED: 'DOMAttrModified',
  DOMCHARACTERDATAMODIFIED: 'DOMCharacterDataModified',

  // Print events.
  BEFOREPRINT: 'beforeprint',
  AFTERPRINT: 'afterprint',

  // Web app manifest events.
  BEFOREINSTALLPROMPT: 'beforeinstallprompt',
  APPINSTALLED: 'appinstalled'
};

/**
 * Returns one of the given pointer fallback event names in order of preference:
 *   1. pointerEventName
 *   2. msPointerEventName
 *   3. fallbackEventName
 * @param {string} pointerEventName
 * @param {string} msPointerEventName
 * @param {string} fallbackEventName
 * @return {string} The supported pointer or fallback (mouse or touch) event
 *     name.
 * @private
 */
function getPointerFallbackEventName_(
    pointerEventName, msPointerEventName, fallbackEventName) {
  if (BrowserFeature.POINTER_EVENTS) {
    return pointerEventName;
  }
  if (BrowserFeature.MSPOINTER_EVENTS) {
    return msPointerEventName;
  }
  return fallbackEventName;
};

/**
 * Constants for pointer event names that fall back to corresponding mouse event
 * names on unsupported platforms. These are intended to be drop-in replacements
 * for corresponding values in `EventType`.
 * @enum {string}
 */
let PointerFallbackEventType = {
  POINTERDOWN: getPointerFallbackEventName_(
      EventType.POINTERDOWN, EventType.MSPOINTERDOWN,
      EventType.MOUSEDOWN),
  POINTERUP: getPointerFallbackEventName_(
      EventType.POINTERUP, EventType.MSPOINTERUP,
      EventType.MOUSEUP),
  POINTERCANCEL: getPointerFallbackEventName_(
      EventType.POINTERCANCEL,
      EventType.MSPOINTERCANCEL,
      // When falling back to mouse events, there is no MOUSECANCEL equivalent
      // of POINTERCANCEL. In this case POINTERUP already falls back to MOUSEUP
      // which represents both UP and CANCEL. POINTERCANCEL does not fall back
      // to MOUSEUP to prevent listening twice on the same event.
      EventType.MOUSECANCEL),
  POINTERMOVE: getPointerFallbackEventName_(
      EventType.POINTERMOVE, EventType.MSPOINTERMOVE,
      EventType.MOUSEMOVE),
  POINTEROVER: getPointerFallbackEventName_(
      EventType.POINTEROVER, EventType.MSPOINTEROVER,
      EventType.MOUSEOVER),
  POINTEROUT: getPointerFallbackEventName_(
      EventType.POINTEROUT, EventType.MSPOINTEROUT,
      EventType.MOUSEOUT),
  POINTERENTER: getPointerFallbackEventName_(
      EventType.POINTERENTER, EventType.MSPOINTERENTER,
      EventType.MOUSEENTER),
  POINTERLEAVE: getPointerFallbackEventName_(
      EventType.POINTERLEAVE, EventType.MSPOINTERLEAVE,
      EventType.MOUSELEAVE)
};

/**
 * Constants for pointer event names that fall back to corresponding touch event
 * names on unsupported platforms. These are intended to be drop-in replacements
 * for corresponding values in `EventType`.
 * @enum {string}
 */
let PointerTouchFallbackEventType = {
  POINTERDOWN: getPointerFallbackEventName_(
      EventType.POINTERDOWN, EventType.MSPOINTERDOWN,
      EventType.TOUCHSTART),
  POINTERUP: getPointerFallbackEventName_(
      EventType.POINTERUP, EventType.MSPOINTERUP,
      EventType.TOUCHEND),
  POINTERCANCEL: getPointerFallbackEventName_(
      EventType.POINTERCANCEL,
      EventType.MSPOINTERCANCEL, EventType.TOUCHCANCEL),
  POINTERMOVE: getPointerFallbackEventName_(
      EventType.POINTERMOVE, EventType.MSPOINTERMOVE,
      EventType.TOUCHMOVE)
};

/**
 * Mapping of mouse event names to underlying browser event names.
 * @typedef {{
 *     MOUSEDOWN: string,
 *     MOUSEUP: string,
 *     MOUSECANCEL:string,
 *     MOUSEMOVE:string,
 *     MOUSEOVER:string,
 *     MOUSEOUT:string,
 *     MOUSEENTER:string,
 *     MOUSELEAVE: string,
 * }}
 */
let MouseEvents;

/**
 * An alias for `EventType.MOUSE*` event types that is overridden by
 * corresponding `POINTER*` event types.
 * @const {!MouseEvents}
 */
let PointerAsMouseEventType = {
  MOUSEDOWN: PointerFallbackEventType.POINTERDOWN,
  MOUSEUP: PointerFallbackEventType.POINTERUP,
  MOUSECANCEL: PointerFallbackEventType.POINTERCANCEL,
  MOUSEMOVE: PointerFallbackEventType.POINTERMOVE,
  MOUSEOVER: PointerFallbackEventType.POINTEROVER,
  MOUSEOUT: PointerFallbackEventType.POINTEROUT,
  MOUSEENTER: PointerFallbackEventType.POINTERENTER,
  MOUSELEAVE: PointerFallbackEventType.POINTERLEAVE
};

/**
 * An alias for `EventType.MOUSE*` event types that continue to use
 * mouse events.
 * @const {!MouseEvents}
 */
let MouseAsMouseEventType = {
  MOUSEDOWN: EventType.MOUSEDOWN,
  MOUSEUP: EventType.MOUSEUP,
  MOUSECANCEL: EventType.MOUSECANCEL,
  MOUSEMOVE: EventType.MOUSEMOVE,
  MOUSEOVER: EventType.MOUSEOVER,
  MOUSEOUT: EventType.MOUSEOUT,
  MOUSEENTER: EventType.MOUSEENTER,
  MOUSELEAVE: EventType.MOUSELEAVE
};

/**
 * An alias for `EventType.TOUCH*` event types that is overridden by
 * corresponding `POINTER*` event types.
 * @enum {string}
 */
let PointerAsTouchEventType = {
  TOUCHCANCEL: PointerTouchFallbackEventType.POINTERCANCEL,
  TOUCHEND: PointerTouchFallbackEventType.POINTERUP,
  TOUCHMOVE: PointerTouchFallbackEventType.POINTERMOVE,
  TOUCHSTART: PointerTouchFallbackEventType.POINTERDOWN
};

export {EventType, MouseAsMouseEventType, MouseEvents, PointerAsMouseEventType, PointerAsTouchEventType, PointerFallbackEventType, PointerTouchFallbackEventType};