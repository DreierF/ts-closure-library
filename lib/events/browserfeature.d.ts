/**
 * Whether the button attribute of the event is W3C compliant.  False in
 * Internet Explorer prior to version 9; document-version dependent.
 */
export const HAS_W3C_BUTTON: true;
/**
 * Whether the browser supports full W3C event model.
 */
export const HAS_W3C_EVENT_SUPPORT: true;
/**
 * To prevent default in IE7-8 for certain keydown events we need set the
 * keyCode to -1.
 */
export const SET_KEY_CODE_TO_PREVENT_DEFAULT: false;
/**
 * Whether the `navigator.onLine` property is supported.
 */
export const HAS_NAVIGATOR_ONLINE_PROPERTY: true;
/**
 * Whether HTML5 network online/offline events are supported.
 */
export const HAS_HTML5_NETWORK_EVENT_SUPPORT: true;
/**
 * Whether HTML5 network events fire on document.body, or otherwise the
 * window.
 */
export const HTML5_NETWORK_EVENTS_FIRE_ON_BODY: false;
/**
 * Whether touch is enabled in the browser.
 */
export const TOUCH_ENABLED: boolean;
/**
 * Whether addEventListener supports W3C standard pointer events.
 * http://www.w3.org/TR/pointerevents/
 */
export const POINTER_EVENTS: true;
/**
 * Whether addEventListener supports MSPointer events (only used in IE10).
 * http://msdn.microsoft.com/en-us/library/ie/hh772103(v=vs.85).aspx
 * http://msdn.microsoft.com/library/hh673557(v=vs.85).aspx
 */
export const MSPOINTER_EVENTS: false;
/**
 * Whether addEventListener supports {passive: true}.
 * https://developers.google.com/web/updates/2016/06/passive-event-listeners
 */
export const PASSIVE_EVENTS: boolean;
