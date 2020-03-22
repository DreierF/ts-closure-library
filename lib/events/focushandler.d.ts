/**
 * Enum type for the events fired by the focus handler
 */
export type EventType = string;
export namespace EventType {
    export const FOCUSIN: string;
    export const FOCUSOUT: string;
}
/**
 * @fileoverview This event handler allows you to catch focusin and focusout
 * events on  descendants. Unlike the "focus" and "blur" events which do not
 * propagate consistently, and therefore must be added to the element that is
 * focused, this allows you to attach one listener to an ancester and you will
 * be notified when the focus state changes of ony of its descendants.
 * @see ../demos/focushandler.html
 */
/**
 * This event handler allows you to catch focus events when descendants gain or
 * loses focus.
 * @extends {EventsEventTarget}
 * @final
 */
export class FocusHandler extends events.EventTarget {
    /**
     * This event handler allows you to catch focus events when descendants gain or
     * loses focus.
     * @param {?Element|Document} element  The node to listen on.
     */
    constructor(element: Element | Document | null);
    /**
     * This is the element that we will listen to the real focus events on.
     * @type {?Element|Document}
     * @private
     */
    element_: (Element | Document) | null;
    /**
     * Store the listen key so it easier to unlisten in dispose.
     * @private
     * @type {?Key}
     */
    listenKeyIn_: Key | null;
    /**
     * Store the listen key so it easier to unlisten in dispose.
     * @private
     * @type {?Key}
     */
    listenKeyOut_: Key | null;
    /**
     * This handles the underlying events and dispatches a new event.
     * @param {?EventsBrowserEvent} e  The underlying browser event.
     */
    handleEvent(e: EventsBrowserEvent | null): void;
    actualEventTarget_: FocusHandler;
}
import * as events from "./eventhandler.js";
import { Key } from "./eventhandler.js";
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
