/**
 * Normalized button constants for the mouse.
 */
export type MouseButton = number;
/**
 * Normalized pointer type constants for pointer events.
 */
export type PointerType = string;
export namespace MouseButton {
    export const LEFT: number;
    export const MIDDLE: number;
    export const RIGHT: number;
}
export namespace PointerType {
    export const MOUSE: string;
    export const PEN: string;
    export const TOUCH: string;
}
/**
 * @fileoverview A patched, standardized event object for browser events.
 *
 * <pre>
 * The patched event object contains the following members:
 * - type           {string}    Event type, e.g. 'click'
 * - target         {Object}    The element that actually triggered the event
 * - currentTarget  {Object}    The element the listener is attached to
 * - relatedTarget  {Object}    For mouseover and mouseout, the previous object
 * - offsetX        {number}    X-coordinate relative to target
 * - offsetY        {number}    Y-coordinate relative to target
 * - clientX        {number}    X-coordinate relative to viewport
 * - clientY        {number}    Y-coordinate relative to viewport
 * - screenX        {number}    X-coordinate relative to the edge of the screen
 * - screenY        {number}    Y-coordinate relative to the edge of the screen
 * - button         {number}    Mouse button. Use isButton() to test.
 * - keyCode        {number}    Key-code
 * - ctrlKey        {boolean}   Was ctrl key depressed
 * - altKey         {boolean}   Was alt key depressed
 * - shiftKey       {boolean}   Was shift key depressed
 * - metaKey        {boolean}   Was meta key depressed
 * - pointerId      {number}    Pointer ID
 * - pointerType    {string}    Pointer type, e.g. 'mouse', 'pen', or 'touch'
 * - defaultPrevented {boolean} Whether the default action has been prevented
 * - state          {Object}    History state object
 *
 * NOTE: The keyCode member contains the raw browser keyCode. For normalized
 * key and character code use {@link goog.events.KeyHandler}.
 * </pre>
 */
/**
 * @type {boolean} If true, use the layerX and layerY properties of a native
 * browser event over the offsetX and offsetY properties, which cause expensive
 * reflow. If layerX or layerY is not defined, offsetX and offsetY will be used
 * as usual.
 */
export const USE_LAYER_XY_AS_OFFSET_XY: boolean;
/**
 * Accepts a browser event object and creates a patched, cross browser event
 * object.
 * The content of this object will not be initialized if no event object is
 * provided. If this is the case, init() needs to be invoked separately.
 * @extends {EventsEvent}
 */
declare class events_BrowserEvent extends EventsEvent {
    /**
     * Extracts the pointer type from the given event.
     * @param {!Event} e
     * @return {string} The pointer type, e.g. 'mouse', 'pen', or 'touch'.
     * @private
     */
    private static getPointerType_;
    /**
     * Accepts a browser event object and creates a patched, cross browser event
     * object.
     * The content of this object will not be initialized if no event object is
     * provided. If this is the case, init() needs to be invoked separately.
     * @param {Event=} opt_e Browser event object.
     * @param {?EventTarget=} opt_currentTarget Current target for event.
     */
    constructor(opt_e?: Event | undefined, opt_currentTarget?: (EventTarget | null) | undefined);
    /**
     * For mouseover and mouseout events, the related object for the event.
     * @type {?Node}
     */
    relatedTarget: Node | null;
    /**
     * X-coordinate relative to target.
     * @type {number}
     */
    offsetX: number;
    /**
     * Y-coordinate relative to target.
     * @type {number}
     */
    offsetY: number;
    /**
     * X-coordinate relative to the window.
     * @type {number}
     */
    clientX: number;
    /**
     * Y-coordinate relative to the window.
     * @type {number}
     */
    clientY: number;
    /**
     * X-coordinate relative to the monitor.
     * @type {number}
     */
    screenX: number;
    /**
     * Y-coordinate relative to the monitor.
     * @type {number}
     */
    screenY: number;
    /**
     * Which mouse button was pressed.
     * @type {number}
     */
    button: number;
    /**
     * Key of key press.
     * @type {string}
     */
    key: string;
    /**
     * Keycode of key press.
     * @type {number}
     */
    keyCode: number;
    /**
     * Keycode of key press.
     * @type {number}
     */
    charCode: number;
    /**
     * Whether control was pressed at time of event.
     * @type {boolean}
     */
    ctrlKey: boolean;
    /**
     * Whether alt was pressed at time of event.
     * @type {boolean}
     */
    altKey: boolean;
    /**
     * Whether shift was pressed at time of event.
     * @type {boolean}
     */
    shiftKey: boolean;
    /**
     * Whether the meta key was pressed at time of event.
     * @type {boolean}
     */
    metaKey: boolean;
    /**
     * History state object, only set for PopState events where it's a copy of the
     * state object provided to pushState or replaceState.
     * @type {?Object}
     */
    state: any | null;
    /**
     * Whether the default platform modifier key was pressed at time of event.
     * (This is control for all platforms except Mac, where it's Meta.)
     * @type {boolean}
     */
    platformModifierKey: boolean;
    /**
     * @type {number}
     */
    pointerId: number;
    /**
     * @type {string}
     */
    pointerType: string;
    /**
     * The browser event object.
     * @private {?Event}
     */
    private event_;
    /**
     * Accepts a browser event object and creates a patched, cross browser event
     * object.
     * @param {?Event} e Browser event object.
     * @param {?EventTarget=} opt_currentTarget Current target for event.
     */
    init(e: Event | null, opt_currentTarget?: (EventTarget | null) | undefined): void;
    /**
     * Tests to see which button was pressed during the event. This is really only
     * useful in IE and Gecko browsers. And in IE, it's only useful for
     * mousedown/mouseup events, because click only fires for the left mouse button.
     *
     * Safari 2 only reports the left button being clicked, and uses the value '1'
     * instead of 0. Opera only reports a mousedown event for the middle button, and
     * no mouse events for the right button. Opera has default behavior for left and
     * middle click that can only be overridden via a configuration setting.
     *
     * There's a nice table of this mess at http://www.unixpapa.com/js/mouse.html.
     *
     * @param {?MouseButton} button The button
     *     to test for.
     * @return {boolean} True if button was pressed.
     */
    isButton(button: MouseButton | null): boolean;
    /**
     * Whether this has an "action"-producing mouse button.
     *
     * By definition, this includes left-click on windows/linux, and left-click
     * without the ctrl key on Macs.
     *
     * @return {boolean} The result.
     */
    isMouseActionButton(): boolean;
    /**
     * @return {?Event} The underlying browser event object.
     */
    getBrowserEvent(): Event | null;
}
declare namespace events_BrowserEvent {
    export const IEButtonMap: Array<number>;
    export const IE_BUTTON_MAP: Array<number>;
    export const IE_POINTER_TYPE_MAP: {
        2: string;
        3: string;
        4: string;
    };
}
import { Event as EventsEvent } from "./event.js";
export { events_BrowserEvent as BrowserEvent };
