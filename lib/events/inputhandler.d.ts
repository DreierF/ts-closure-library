/**
 * Enum type for the events fired by the input handler
 */
export type EventType = string;
export namespace EventType {
    export const INPUT: string;
}
/**
 * @fileoverview An object that encapsulates text changed events for textareas
 * and input element of type text and password. The event occurs after the value
 * has been changed. The event does not occur if value was changed
 * programmatically.<br>
 * <br>
 * Note: this does not guarantee the correctness of `keyCode` or
 * `charCode`, or attempt to unify them across browsers. See
 * `goog.events.KeyHandler` for that functionality<br>
 * <br>
 * Known issues:
 * <ul>
 * <li>IE doesn't have native support for input event. WebKit before version 531
 *     doesn't have support for textareas. For those browsers an emulation mode
 *     based on key, clipboard and drop events is used. Thus this event won't
 *     trigger in emulation mode if text was modified by context menu commands
 *     such as 'Undo' and 'Delete'.
 * </ul>
 * @see ../demos/inputhandler.html
 */
/**
 * This event handler will dispatch events when the user types into a text
 * input, password input or a textarea
 *     events on.
 * @extends {EventsEventTarget}
 */
export class InputHandler extends EventsEventTarget {
    /**
     * This event handler will dispatch events when the user types into a text
     * input, password input or a textarea
     * @param {?Element} element  The element that you want to listen for input
     *     events on.
     */
    constructor(element: Element | null);
    /**
     * Id of a timer used to postpone firing input event in emulation mode.
     * @type {?number}
     * @private
     */
    private timer_;
    /**
     * The element that you want to listen for input events on.
     * @type {?Element}
     * @private
     */
    private element_;
    /**
     * @type {EventHandler<!InputHandler>}
     * @private
     */
    private eventHandler_;
    /**
     * This handles the underlying events and dispatches a new event as needed.
     * @param {?EventsBrowserEvent} e The underlying browser event.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    handleEvent(e: EventsBrowserEvent | null): void;
    /**
     * Cancels timer if it is set, does nothing otherwise.
     * @private
     */
    private cancelTimerIfSet_;
    /**
     * Creates an input event from the browser event.
     * @param {?EventsBrowserEvent} be A browser event.
     * @return {!EventsBrowserEvent} An input event.
     * @private
     */
    private createInputEvent_;
}
import { EventTarget as EventsEventTarget } from "./eventhandler.js";
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
