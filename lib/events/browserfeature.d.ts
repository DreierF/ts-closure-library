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
