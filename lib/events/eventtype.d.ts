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
    const CLICK: string;
    const RIGHTCLICK: string;
    const DBLCLICK: string;
    const AUXCLICK: string;
    const MOUSEDOWN: string;
    const MOUSEUP: string;
    const MOUSEOVER: string;
    const MOUSEOUT: string;
    const MOUSEMOVE: string;
    const MOUSEENTER: string;
    const MOUSELEAVE: string;
    const MOUSECANCEL: string;
    const SELECTIONCHANGE: string;
    const SELECTSTART: string;
    const WHEEL: string;
    const KEYPRESS: string;
    const KEYDOWN: string;
    const KEYUP: string;
    const BLUR: string;
    const FOCUS: string;
    const DEACTIVATE: string;
    const FOCUSIN: string;
    const FOCUSOUT: string;
    const CHANGE: string;
    const RESET: string;
    const SELECT: string;
    const SUBMIT: string;
    const INPUT: string;
    const PROPERTYCHANGE: string;
    const DRAGSTART: string;
    const DRAG: string;
    const DRAGENTER: string;
    const DRAGOVER: string;
    const DRAGLEAVE: string;
    const DROP: string;
    const DRAGEND: string;
    const TOUCHSTART: string;
    const TOUCHMOVE: string;
    const TOUCHEND: string;
    const TOUCHCANCEL: string;
    const BEFOREUNLOAD: string;
    const CONSOLEMESSAGE: string;
    const CONTEXTMENU: string;
    const DEVICECHANGE: string;
    const DEVICEMOTION: string;
    const DEVICEORIENTATION: string;
    const DOMCONTENTLOADED: string;
    const ERROR: string;
    const HELP: string;
    const LOAD: string;
    const LOSECAPTURE: string;
    const ORIENTATIONCHANGE: string;
    const READYSTATECHANGE: string;
    const RESIZE: string;
    const SCROLL: string;
    const UNLOAD: string;
    const CANPLAY: string;
    const CANPLAYTHROUGH: string;
    const DURATIONCHANGE: string;
    const EMPTIED: string;
    const ENDED: string;
    const LOADEDDATA: string;
    const LOADEDMETADATA: string;
    const PAUSE: string;
    const PLAY: string;
    const PLAYING: string;
    const PROGRESS: string;
    const RATECHANGE: string;
    const SEEKED: string;
    const SEEKING: string;
    const STALLED: string;
    const SUSPEND: string;
    const TIMEUPDATE: string;
    const VOLUMECHANGE: string;
    const WAITING: string;
    const SOURCEOPEN: string;
    const SOURCEENDED: string;
    const SOURCECLOSED: string;
    const ABORT: string;
    const UPDATE: string;
    const UPDATESTART: string;
    const UPDATEEND: string;
    const HASHCHANGE: string;
    const PAGEHIDE: string;
    const PAGESHOW: string;
    const POPSTATE: string;
    const COPY: string;
    const PASTE: string;
    const CUT: string;
    const BEFORECOPY: string;
    const BEFORECUT: string;
    const BEFOREPASTE: string;
    const ONLINE: string;
    const OFFLINE: string;
    const MESSAGE: string;
    const CONNECT: string;
    const INSTALL: string;
    const ACTIVATE: string;
    const FETCH: string;
    const FOREIGNFETCH: string;
    const MESSAGEERROR: string;
    const STATECHANGE: string;
    const UPDATEFOUND: string;
    const CONTROLLERCHANGE: string;
    const ANIMATIONSTART: string;
    const ANIMATIONEND: string;
    const ANIMATIONITERATION: string;
    const TRANSITIONEND: string;
    const POINTERDOWN: string;
    const POINTERUP: string;
    const POINTERCANCEL: string;
    const POINTERMOVE: string;
    const POINTEROVER: string;
    const POINTEROUT: string;
    const POINTERENTER: string;
    const POINTERLEAVE: string;
    const GOTPOINTERCAPTURE: string;
    const LOSTPOINTERCAPTURE: string;
    const MSGESTURECHANGE: string;
    const MSGESTUREEND: string;
    const MSGESTUREHOLD: string;
    const MSGESTURESTART: string;
    const MSGESTURETAP: string;
    const MSGOTPOINTERCAPTURE: string;
    const MSINERTIASTART: string;
    const MSLOSTPOINTERCAPTURE: string;
    const MSPOINTERCANCEL: string;
    const MSPOINTERDOWN: string;
    const MSPOINTERENTER: string;
    const MSPOINTERHOVER: string;
    const MSPOINTERLEAVE: string;
    const MSPOINTERMOVE: string;
    const MSPOINTEROUT: string;
    const MSPOINTEROVER: string;
    const MSPOINTERUP: string;
    const TEXT: string;
    const TEXTINPUT: string;
    const COMPOSITIONSTART: string;
    const COMPOSITIONUPDATE: string;
    const COMPOSITIONEND: string;
    const BEFOREINPUT: string;
    const EXIT: string;
    const LOADABORT: string;
    const LOADCOMMIT: string;
    const LOADREDIRECT: string;
    const LOADSTART: string;
    const LOADSTOP: string;
    const RESPONSIVE: string;
    const SIZECHANGED: string;
    const UNRESPONSIVE: string;
    const VISIBILITYCHANGE: string;
    const STORAGE: string;
    const DOMSUBTREEMODIFIED: string;
    const DOMNODEINSERTED: string;
    const DOMNODEREMOVED: string;
    const DOMNODEREMOVEDFROMDOCUMENT: string;
    const DOMNODEINSERTEDINTODOCUMENT: string;
    const DOMATTRMODIFIED: string;
    const DOMCHARACTERDATAMODIFIED: string;
    const BEFOREPRINT: string;
    const AFTERPRINT: string;
    const BEFOREINSTALLPROMPT: string;
    const APPINSTALLED: string;
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
