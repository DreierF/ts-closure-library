/**
 * Enum type for the events fired by the mouse wheel handler.
 */
export type EventType = string;
export namespace EventType {
    export const MOUSEWHEEL: string;
}
/**
 * A base class for mouse wheel events. This is used with the
 * MouseWheelHandler.
 *
 *     direction.
 *     direction.
 * @extends {EventsBrowserEvent}
 * @final
 */
export class MouseWheelEvent extends EventsBrowserEvent {
    /**
     * A base class for mouse wheel events. This is used with the
     * MouseWheelHandler.
     *
     * @param {number} detail The number of rows the user scrolled.
     * @param {?Event} browserEvent Browser event object.
     * @param {number} deltaX The number of rows the user scrolled in the X
     *     direction.
     * @param {number} deltaY The number of rows the user scrolled in the Y
     *     direction.
     */
    constructor(detail: number, browserEvent: Event | null, deltaX: number, deltaY: number);
    /**
     * The number of lines the user scrolled
     * @type {number}
     * NOTE: Informally deprecated. Use deltaX and deltaY instead, they provide
     * more information.
     */
    detail: number;
    /**
     * The number of "lines" scrolled in the X direction.
     *
     * Note that not all browsers provide enough information to distinguish
     * horizontal and vertical scroll events, so for these unsupported browsers,
     * we will always have a deltaX of 0, even if the user scrolled their mouse
     * wheel or trackpad sideways.
     *
     * Currently supported browsers are Webkit and Firefox 3.1 or later.
     *
     * @type {number}
     */
    deltaX: number;
    /**
     * The number of lines scrolled in the Y direction.
     * @type {number}
     */
    deltaY: number;
}
/**
 * @fileoverview This event wrapper will dispatch an event when the user uses
 * the mouse wheel to scroll an element. You can get the direction by checking
 * the deltaX and deltaY properties of the event.
 *
 * This class aims to smooth out inconsistencies between browser platforms with
 * regards to mousewheel events, but we do not cover every possible
 * software/hardware combination out there, some of which occasionally produce
 * very large deltas in mousewheel events. If your application wants to guard
 * against extremely large deltas, use the setMaxDeltaX and setMaxDeltaY APIs
 * to set maximum values that make sense for your application.
 *
 * @see ../demos/mousewheelhandler.html
 */
/**
 * This event handler allows you to catch mouse wheel events in a consistent
 * manner.
 *     event on.
 *     capture phase.
 * @extends {EventsEventTarget}
 */
export class MouseWheelHandler extends goog_events.EventTarget {
    /**
     * Helper for scaling down a mousewheel delta by a scale factor, if appropriate.
     * @param {number} mouseWheelDelta Delta from a mouse wheel event. Expected to
     *     be an integer.
     * @param {number} scaleFactor Factor to scale the delta down by. Expected to
     *     be an integer.
     * @return {number} Scaled-down delta value, or the original delta if the
     *     scaleFactor does not appear to be applicable.
     * @private
     */
    private static smartScale_;
    /**
     * This event handler allows you to catch mouse wheel events in a consistent
     * manner.
     * @param {?Element|Document} element The element to listen to the mouse wheel
     *     event on.
     * @param {boolean=} opt_capture Whether to handle the mouse wheel event in
     *     capture phase.
     */
    constructor(element: (Element | Document) | null, opt_capture?: boolean | undefined);
    /**
     * Optional maximum magnitude for x delta on each mousewheel event.
     * @type {number|undefined}
     * @private
     */
    private maxDeltaX_;
    /**
     * Optional maximum magnitude for y delta on each mousewheel event.
     * @type {number|undefined}
     * @private
     */
    private maxDeltaY_;
    /**
     * This is the element that we will listen to the real mouse wheel events on.
     * @type {?Element|Document}
     * @private
     */
    private element_;
    /**
     * True if the element exists and is RTL, false otherwise.
     * @type {boolean}
     * @private
     */
    private isRtl_;
    /**
     * The key returned from the goog_events.listen.
     * @type {?Key}
     * @private
     */
    private listenKey_;
    /**
     * @param {number} maxDeltaX Maximum magnitude for x delta on each mousewheel
     *     event. Should be non-negative.
     */
    setMaxDeltaX(maxDeltaX: number): void;
    /**
     * @param {number} maxDeltaY Maximum magnitude for y delta on each mousewheel
     *     event. Should be non-negative.
     */
    setMaxDeltaY(maxDeltaY: number): void;
    /**
     * Handles the events on the element.
     * @param {?EventsBrowserEvent} e The underlying browser event.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleEvent(e: EventsBrowserEvent | null): void;
}
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
import * as goog_events from "./eventhandler.js";
