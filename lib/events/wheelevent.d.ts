/**
 * @fileoverview This class aims to smooth out inconsistencies between browser
 * handling of wheel events by providing an event that is similar to that
 * defined in the standard, but also easier to consume.
 *
 * It is based upon the WheelEvent, which allows for up to 3 dimensional
 * scrolling events that come in units of either pixels, lines or pages.
 * http://www.w3.org/TR/2014/WD-DOM-Level-3-Events-20140925/#interface-WheelEvent
 *
 * The significant difference here is that it also provides reasonable pixel
 * deltas for clients that do not want to treat line and page scrolling events
 * specially.
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
 * A common class for wheel events. This is used with the WheelHandler.
 *
 *     the wheel event.
 * @extends {EventsBrowserEvent}
 * @final
 */
export class WheelEvent extends EventsBrowserEvent {
    /**
     * A common class for wheel events. This is used with the WheelHandler.
     *
     * @param {?Event} browserEvent Browser event object.
     * @param {WheelEvent.DeltaMode} deltaMode The delta mode units of
     *     the wheel event.
     * @param {number} deltaX The number of delta units the user in the X axis.
     * @param {number} deltaY The number of delta units the user in the Y axis.
     * @param {number} deltaZ The number of delta units the user in the Z axis.
     */
    constructor(browserEvent: Event | null, deltaMode: WheelEvent.DeltaMode, deltaX: number, deltaY: number, deltaZ: number);
    /**
     * An enum corresponding to the units of this event.
     * @type {WheelEvent.DeltaMode}
     */
    deltaMode: WheelEvent.DeltaMode;
    /**
     * The number of delta units in the X axis.
     * @type {number}
     */
    deltaX: number;
    /**
     * The number of delta units in the Y axis.
     * @type {number}
     */
    deltaY: number;
    /**
     * The number of delta units in the Z axis.
     * @type {number}
     */
    deltaZ: number;
    /**
     * The number of delta pixels in the X axis. Code that doesn't want to handle
     * different deltaMode units can just look here.
     * @type {number}
     */
    pixelDeltaX: number;
    /**
     * The number of pixels in the Y axis. Code that doesn't want to
     * handle different deltaMode units can just look here.
     * @type {number}
     */
    pixelDeltaY: number;
    /**
     * The number of pixels scrolled in the Z axis. Code that doesn't want to
     * handle different deltaMode units can just look here.
     * @type {number}
     */
    pixelDeltaZ: number;
}
export namespace WheelEvent {
    export namespace EventType {
        export const WHEEL: string;
    }
    /**
     * Enum type for the events fired by the wheel handler.
     */
    export type EventType = string;
    export namespace DeltaMode {
        export const PIXEL: number;
        export const LINE: number;
        export const PAGE: number;
    }
    /**
     * Units for the deltas in a WheelEvent.
     */
    export type DeltaMode = number;
    export const PIXELS_PER_LINE_: number;
    export const PIXELS_PER_PAGE_: number;
}
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
