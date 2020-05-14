/**
 * @fileoverview This event wrapper will dispatch an event when the user uses
 * the wheel on an element. The event provides details of the unit type (pixel /
 * line / page) and deltas in those units in up to 3 dimensions. Additionally,
 * simplified pixel deltas are provided for code that doesn't need to handle the
 * different units differently. This is not to be confused with the scroll
 * event, where an element in the dom can report that it was scrolled.
 *
 * This class aims to smooth out inconsistencies between browser platforms with
 * regards to wheel events, but we do not cover every possible software/hardware
 * combination out there, some of which occasionally produce very large deltas
 * in wheel events, especially when the device supports acceleration.
 *
 * Relevant standard:
 * http://www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/#interface-WheelEvent
 *
 * Clients of this code should be aware that some input devices only fire a few
 * discrete events (such as a mouse wheel without acceleration) whereas some can
 * generate a large number of events for a single interaction (such as a
 * touchpad with acceleration). There is no signal in the events to reliably
 * distinguish between these.
 *
 * @see ../demos/wheelhandler.html
 */
/**
 * This event handler allows you to catch wheel events in a consistent manner.
 *     on.
 *     phase.
 * @extends {EventsEventTarget}
 */
export class WheelHandler extends goog_events.EventTarget {
    /**
     * Returns the dom event type.
     * @return {string} The dom event type.
     */
    static getDomEventType(): string;
    /**
     * This event handler allows you to catch wheel events in a consistent manner.
     * @param {!Element|!Document} element The element to listen to the wheel event
     *     on.
     * @param {boolean=} opt_capture Whether to handle the wheel event in capture
     *     phase.
     */
    constructor(element: Element | Document, opt_capture?: boolean | undefined);
    /**
     * This is the element that we will listen to the real wheel events on.
     * @private {!Element|!Document}
     */
    private element_;
    /**
     * True if the element exists and is RTL, false otherwise.
     * @private {boolean}
     */
    private isRtl_;
    /**
     * The key returned from the goog_events.listen.
     * @private {Key}
     */
    private listenKey_;
    /**
     * Handles the events on the element.
     * @param {!EventsBrowserEvent} e The underlying browser event.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleEvent(e: EventsBrowserEvent): void;
}
import * as goog_events from "./eventhandler.js";
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
