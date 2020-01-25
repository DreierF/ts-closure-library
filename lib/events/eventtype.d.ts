/**
 * Constants for event names.
 */
export type EventType = string;
/**
 * Mapping of mouse event names to underlying browser event names.
 */
export type MouseEvents = {
    MOUSEDOWN: string;
    MOUSEUP: string;
    MOUSECANCEL: string;
    MOUSEMOVE: string;
    MOUSEOVER: string;
    MOUSEOUT: string;
    MOUSEENTER: string;
    MOUSELEAVE: string;
};
/**
 * An alias for `EventType.TOUCH*` event types that is overridden by
 * corresponding `POINTER*` event types.
 */
export type PointerAsTouchEventType = string;
/**
 * Constants for pointer event names that fall back to corresponding mouse event
 * names on unsupported platforms. These are intended to be drop-in replacements
 * for corresponding values in `EventType`.
 */
export type PointerFallbackEventType = string;
/**
 * Constants for pointer event names that fall back to corresponding touch event
 * names on unsupported platforms. These are intended to be drop-in replacements
 * for corresponding values in `EventType`.
 */
export type PointerTouchFallbackEventType = string;
export namespace EventType {
    export const CLICK: string;
    export const RIGHTCLICK: string;
    export const DBLCLICK: string;
    export const AUXCLICK: string;
    export const MOUSEDOWN: string;
    export const MOUSEUP: string;
    export const MOUSEOVER: string;
    export const MOUSEOUT: string;
    export const MOUSEMOVE: string;
    export const MOUSEENTER: string;
    export const MOUSELEAVE: string;
    export const MOUSECANCEL: string;
    export const SELECTIONCHANGE: string;
    export const SELECTSTART: string;
    export const WHEEL: string;
    export const KEYPRESS: string;
    export const KEYDOWN: string;
    export const KEYUP: string;
    export const BLUR: string;
    export const FOCUS: string;
    export const DEACTIVATE: string;
    export const FOCUSIN: string;
    export const FOCUSOUT: string;
    export const CHANGE: string;
    export const RESET: string;
    export const SELECT: string;
    export const SUBMIT: string;
    export const INPUT: string;
    export const PROPERTYCHANGE: string;
    export const DRAGSTART: string;
    export const DRAG: string;
    export const DRAGENTER: string;
    export const DRAGOVER: string;
    export const DRAGLEAVE: string;
    export const DROP: string;
    export const DRAGEND: string;
    export const TOUCHSTART: string;
    export const TOUCHMOVE: string;
    export const TOUCHEND: string;
    export const TOUCHCANCEL: string;
    export const BEFOREUNLOAD: string;
    export const CONSOLEMESSAGE: string;
    export const CONTEXTMENU: string;
    export const DEVICECHANGE: string;
    export const DEVICEMOTION: string;
    export const DEVICEORIENTATION: string;
    export const DOMCONTENTLOADED: string;
    export const ERROR: string;
    export const HELP: string;
    export const LOAD: string;
    export const LOSECAPTURE: string;
    export const ORIENTATIONCHANGE: string;
    export const READYSTATECHANGE: string;
    export const RESIZE: string;
    export const SCROLL: string;
    export const UNLOAD: string;
    export const CANPLAY: string;
    export const CANPLAYTHROUGH: string;
    export const DURATIONCHANGE: string;
    export const EMPTIED: string;
    export const ENDED: string;
    export const LOADEDDATA: string;
    export const LOADEDMETADATA: string;
    export const PAUSE: string;
    export const PLAY: string;
    export const PLAYING: string;
    export const PROGRESS: string;
    export const RATECHANGE: string;
    export const SEEKED: string;
    export const SEEKING: string;
    export const STALLED: string;
    export const SUSPEND: string;
    export const TIMEUPDATE: string;
    export const VOLUMECHANGE: string;
    export const WAITING: string;
    export const SOURCEOPEN: string;
    export const SOURCEENDED: string;
    export const SOURCECLOSED: string;
    export const ABORT: string;
    export const UPDATE: string;
    export const UPDATESTART: string;
    export const UPDATEEND: string;
    export const HASHCHANGE: string;
    export const PAGEHIDE: string;
    export const PAGESHOW: string;
    export const POPSTATE: string;
    export const COPY: string;
    export const PASTE: string;
    export const CUT: string;
    export const BEFORECOPY: string;
    export const BEFORECUT: string;
    export const BEFOREPASTE: string;
    export const ONLINE: string;
    export const OFFLINE: string;
    export const MESSAGE: string;
    export const CONNECT: string;
    export const INSTALL: string;
    export const ACTIVATE: string;
    export const FETCH: string;
    export const FOREIGNFETCH: string;
    export const MESSAGEERROR: string;
    export const STATECHANGE: string;
    export const UPDATEFOUND: string;
    export const CONTROLLERCHANGE: string;
    export const ANIMATIONSTART: string;
    export const ANIMATIONEND: string;
    export const ANIMATIONITERATION: string;
    export const TRANSITIONEND: string;
    export const POINTERDOWN: string;
    export const POINTERUP: string;
    export const POINTERCANCEL: string;
    export const POINTERMOVE: string;
    export const POINTEROVER: string;
    export const POINTEROUT: string;
    export const POINTERENTER: string;
    export const POINTERLEAVE: string;
    export const GOTPOINTERCAPTURE: string;
    export const LOSTPOINTERCAPTURE: string;
    export const MSGESTURECHANGE: string;
    export const MSGESTUREEND: string;
    export const MSGESTUREHOLD: string;
    export const MSGESTURESTART: string;
    export const MSGESTURETAP: string;
    export const MSGOTPOINTERCAPTURE: string;
    export const MSINERTIASTART: string;
    export const MSLOSTPOINTERCAPTURE: string;
    export const MSPOINTERCANCEL: string;
    export const MSPOINTERDOWN: string;
    export const MSPOINTERENTER: string;
    export const MSPOINTERHOVER: string;
    export const MSPOINTERLEAVE: string;
    export const MSPOINTERMOVE: string;
    export const MSPOINTEROUT: string;
    export const MSPOINTEROVER: string;
    export const MSPOINTERUP: string;
    export const TEXT: string;
    export const TEXTINPUT: string;
    export const COMPOSITIONSTART: string;
    export const COMPOSITIONUPDATE: string;
    export const COMPOSITIONEND: string;
    export const BEFOREINPUT: string;
    export const EXIT: string;
    export const LOADABORT: string;
    export const LOADCOMMIT: string;
    export const LOADREDIRECT: string;
    export const LOADSTART: string;
    export const LOADSTOP: string;
    export const RESPONSIVE: string;
    export const SIZECHANGED: string;
    export const UNRESPONSIVE: string;
    export const VISIBILITYCHANGE: string;
    export const STORAGE: string;
    export const DOMSUBTREEMODIFIED: string;
    export const DOMNODEINSERTED: string;
    export const DOMNODEREMOVED: string;
    export const DOMNODEREMOVEDFROMDOCUMENT: string;
    export const DOMNODEINSERTEDINTODOCUMENT: string;
    export const DOMATTRMODIFIED: string;
    export const DOMCHARACTERDATAMODIFIED: string;
    export const BEFOREPRINT: string;
    export const AFTERPRINT: string;
    export const BEFOREINSTALLPROMPT: string;
    export const APPINSTALLED: string;
}
export namespace MouseAsMouseEventType {
    import MOUSEDOWN_1 = EventType.MOUSEDOWN;
    export { MOUSEDOWN_1 as MOUSEDOWN };
    import MOUSEUP_1 = EventType.MOUSEUP;
    export { MOUSEUP_1 as MOUSEUP };
    import MOUSECANCEL_1 = EventType.MOUSECANCEL;
    export { MOUSECANCEL_1 as MOUSECANCEL };
    import MOUSEMOVE_1 = EventType.MOUSEMOVE;
    export { MOUSEMOVE_1 as MOUSEMOVE };
    import MOUSEOVER_1 = EventType.MOUSEOVER;
    export { MOUSEOVER_1 as MOUSEOVER };
    import MOUSEOUT_1 = EventType.MOUSEOUT;
    export { MOUSEOUT_1 as MOUSEOUT };
    import MOUSEENTER_1 = EventType.MOUSEENTER;
    export { MOUSEENTER_1 as MOUSEENTER };
    import MOUSELEAVE_1 = EventType.MOUSELEAVE;
    export { MOUSELEAVE_1 as MOUSELEAVE };
}
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
export let MouseEvents: any;
export namespace PointerAsMouseEventType {
    import MOUSEDOWN_2 = PointerFallbackEventType.POINTERDOWN;
    export { MOUSEDOWN_2 as MOUSEDOWN };
    import MOUSEUP_2 = PointerFallbackEventType.POINTERUP;
    export { MOUSEUP_2 as MOUSEUP };
    import MOUSECANCEL_2 = PointerFallbackEventType.POINTERCANCEL;
    export { MOUSECANCEL_2 as MOUSECANCEL };
    import MOUSEMOVE_2 = PointerFallbackEventType.POINTERMOVE;
    export { MOUSEMOVE_2 as MOUSEMOVE };
    import MOUSEOVER_2 = PointerFallbackEventType.POINTEROVER;
    export { MOUSEOVER_2 as MOUSEOVER };
    import MOUSEOUT_2 = PointerFallbackEventType.POINTEROUT;
    export { MOUSEOUT_2 as MOUSEOUT };
    import MOUSEENTER_2 = PointerFallbackEventType.POINTERENTER;
    export { MOUSEENTER_2 as MOUSEENTER };
    import MOUSELEAVE_2 = PointerFallbackEventType.POINTERLEAVE;
    export { MOUSELEAVE_2 as MOUSELEAVE };
}
export namespace PointerAsTouchEventType {
    import TOUCHCANCEL_1 = PointerTouchFallbackEventType.POINTERCANCEL;
    export { TOUCHCANCEL_1 as TOUCHCANCEL };
    import TOUCHEND_1 = PointerTouchFallbackEventType.POINTERUP;
    export { TOUCHEND_1 as TOUCHEND };
    import TOUCHMOVE_1 = PointerTouchFallbackEventType.POINTERMOVE;
    export { TOUCHMOVE_1 as TOUCHMOVE };
    import TOUCHSTART_1 = PointerTouchFallbackEventType.POINTERDOWN;
    export { TOUCHSTART_1 as TOUCHSTART };
}
export namespace PointerFallbackEventType {
    const POINTERDOWN_1: string;
    export { POINTERDOWN_1 as POINTERDOWN };
    const POINTERUP_1: string;
    export { POINTERUP_1 as POINTERUP };
    const POINTERCANCEL_1: string;
    export { POINTERCANCEL_1 as POINTERCANCEL };
    const POINTERMOVE_1: string;
    export { POINTERMOVE_1 as POINTERMOVE };
    const POINTEROVER_1: string;
    export { POINTEROVER_1 as POINTEROVER };
    const POINTEROUT_1: string;
    export { POINTEROUT_1 as POINTEROUT };
    const POINTERENTER_1: string;
    export { POINTERENTER_1 as POINTERENTER };
    const POINTERLEAVE_1: string;
    export { POINTERLEAVE_1 as POINTERLEAVE };
}
export namespace PointerTouchFallbackEventType {
    const POINTERDOWN_2: string;
    export { POINTERDOWN_2 as POINTERDOWN };
    const POINTERUP_2: string;
    export { POINTERUP_2 as POINTERUP };
    const POINTERCANCEL_2: string;
    export { POINTERCANCEL_2 as POINTERCANCEL };
    const POINTERMOVE_2: string;
    export { POINTERMOVE_2 as POINTERMOVE };
}
