/**
 * Constants for event names.
 */
export type EventType = string;
/**
 * Object representing a drag event
 *   representing the browser event that caused this drag event.
 * @class
 * @extends {EventsEvent}
 */
export class DragEvent extends EventsEvent {
    /**
     * Object representing a drag event
     * @param {string} type Event type.
     * @param {?Dragger} dragobj Drag object initiating event.
     * @param {number} clientX X-coordinate relative to the viewport.
     * @param {number} clientY Y-coordinate relative to the viewport.
     * @param {?EventsBrowserEvent} browserEvent The closure object
     *   representing the browser event that caused this drag event.
     * @param {number=} opt_actX Optional actual x for drag if it has been limited.
     * @param {number=} opt_actY Optional actual y for drag if it has been limited.
     * @param {boolean=} opt_dragCanceled Whether the drag has been canceled.
     */
    constructor(type: string, dragobj: Dragger | null, clientX: number, clientY: number, browserEvent: EventsBrowserEvent | null, opt_actX?: number | undefined, opt_actY?: number | undefined, opt_dragCanceled?: boolean | undefined);
    /**
     * X-coordinate relative to the viewport
     * @type {number}
     */
    clientX: number;
    /**
     * Y-coordinate relative to the viewport
     * @type {number}
     */
    clientY: number;
    /**
     * The closure object representing the browser event that caused this drag
     * event.
     * @type {?EventsBrowserEvent}
     */
    browserEvent: EventsBrowserEvent | null;
    /**
     * The real x-position of the drag if it has been limited
     * @type {number}
     */
    left: number;
    /**
     * The real y-position of the drag if it has been limited
     * @type {number}
     */
    top: number;
    /**
     * Reference to the drag object for this event
     * @type {?Dragger}
     */
    dragger: Dragger | null;
    /**
     * Whether drag was canceled with this event. Used to differentiate between
     * a legitimate drag END that can result in an action and a drag END which is
     * a result of a drag cancelation. For now it can happen 1) with drag END
     * event on FireFox when user drags the mouse out of the window, 2) with
     * drag END event on IE7 which is generated on MOUSEMOVE event when user
     * moves the mouse into the document after the mouse button has been
     * released, 3) when TOUCHCANCEL is raised instead of TOUCHEND (on touch
     * events).
     * @type {boolean}
     */
    dragCanceled: boolean;
}
/**
 * @fileoverview Drag Utilities.
 *
 * Provides extensible functionality for drag & drop behaviour.
 *
 * @see ../demos/drag.html
 * @see ../demos/dragger.html
 */
/**
 * A class that allows mouse or touch-based dragging (moving) of an element
 *
 *     the target is used.
 *     and height.
 *
 * @extends {EventsEventTarget}
 * @class
 */
export class Dragger extends goog_events.EventTarget {
    /**
     * Creates copy of node being dragged.  This is a utility function to be used
     * wherever it is inappropriate for the original source to follow the mouse
     * cursor itself.
     *
     * @param {?Element} sourceEl Element to copy.
     * @return {!Element} The clone of `sourceEl`.
     */
    static cloneNode(sourceEl: Element | null): Element;
    /**
     * A class that allows mouse or touch-based dragging (moving) of an element
     *
     * @param {?Element} target The element that will be dragged.
     * @param {?Element=} opt_handle An optional handle to control the drag, if null
     *     the target is used.
     * @param {Rect=} opt_limits Object containing left, top, width,
     *     and height.
     *
     */
    constructor(target: Element | null, opt_handle?: (Element | null) | undefined, opt_limits?: Rect | undefined);
    /**
     * Reference to drag target element.
     * @type {Element|null}
     */
    target: Element | null;
    /**
     * Reference to the handler that initiates the drag.
     * @type {Element|null}
     */
    handle: Element | null;
    /**
     * Object representing the limits of the drag region.
     * @type {?Rect}
     */
    limits: Rect | null;
    /**
     * Reference to a document object to use for the events.
     * @private {Document}
     */
    private document_;
    /** @private {!EventHandler} */
    private eventHandler_;
    /**
     * Current x position of mouse or touch relative to viewport.
     * @type {number}
     */
    clientX: number;
    /**
     * Current y position of mouse or touch relative to viewport.
     * @type {number}
     */
    clientY: number;
    /**
     * Current x position of mouse or touch relative to screen. Deprecated because
     * it doesn't take into affect zoom level or pixel density.
     * @type {number}
     * @deprecated Consider switching to clientX instead.
     */
    screenX: number;
    /**
     * Current y position of mouse or touch relative to screen. Deprecated because
     * it doesn't take into affect zoom level or pixel density.
     * @type {number}
     * @deprecated Consider switching to clientY instead.
     */
    screenY: number;
    /**
     * The x position where the first mousedown or touchstart occurred.
     * @type {number}
     */
    startX: number;
    /**
     * The y position where the first mousedown or touchstart occurred.
     * @type {number}
     */
    startY: number;
    /**
     * Current x position of drag relative to target's parent.
     * @type {number}
     */
    deltaX: number;
    /**
     * Current y position of drag relative to target's parent.
     * @type {number}
     */
    deltaY: number;
    /**
     * The current page scroll value.
     * @type {?Coordinate}
     */
    pageScroll: Coordinate | null;
    /**
     * Whether dragging is currently enabled.
     * @private {boolean}
     */
    private enabled_;
    /**
     * Whether object is currently being dragged.
     * @private {boolean}
     */
    private dragging_;
    /**
     * Whether mousedown should be default prevented.
     * @private {boolean}
     **/
    private preventMouseDown_;
    /**
     * The amount of distance, in pixels, after which a mousedown or touchstart is
     * considered a drag.
     * @private {number}
     */
    private hysteresisDistanceSquared_;
    /**
     * Whether IE drag events cancelling is on.
     * @private {boolean}
     */
    private ieDragStartCancellingOn_;
    /**
     * Whether the dragger implements the changes described in http://b/6324964,
     * making it truly RTL.  This is a temporary flag to allow clients to
     * transition to the new behavior at their convenience.  At some point it will
     * be the default.
     * @private {boolean}
     */
    private useRightPositioningForRtl_;
    /** @private {boolean} Avoids setCapture() calls to fix click handlers. */
    private useSetCapture_;
    /**
     * Prevents the dragger from calling setCapture(), even in browsers that support
     * it.  If the draggable item has click handlers, setCapture() can break them.
     * @param {boolean} allow True to use setCapture if the browser supports it.
     */
    setAllowSetCapture(allow: boolean): void;
    /**
     * Turns on/off true RTL behavior.  This should be called immediately after
     * construction.  This is a temporary flag to allow clients to transition
     * to the new component at their convenience.  At some point true will be the
     * default.
     * @param {boolean} useRightPositioningForRtl True if "right" should be used for
     *     positioning, false if "left" should be used for positioning.
     */
    enableRightPositioningForRtl(useRightPositioningForRtl: boolean): void;
    /**
     * Returns the event handler, intended for subclass use.
     * @return {!EventHandler<T>} The event handler.
     * @this {T}
     * @template T
     */
    getHandler<T>(): goog_events.EventHandler<T>;
    /**
     * Sets (or reset) the Drag limits after a Dragger is created.
     * @param {Rect?} limits Object containing left, top, width,
     *     height for new Dragger limits. If target is right-to-left and
     *     enableRightPositioningForRtl(true) is called, then rect is interpreted as
     *     right, top, width, and height.
     */
    setLimits(limits: Rect | null): void;
    /**
     * Sets the distance the user has to drag the element before a drag operation is
     * started.
     * @param {number} distance The number of pixels after which a mousedown and
     *     move is considered a drag.
     */
    setHysteresis(distance: number): void;
    /**
     * Gets the distance the user has to drag the element before a drag operation is
     * started.
     * @return {number} distance The number of pixels after which a mousedown and
     *     move is considered a drag.
     */
    getHysteresis(): number;
    /**
     * Sets the SCROLL event target to make drag element follow scrolling.
     *
     * @param {?EventTarget} scrollTarget The event target that dispatches SCROLL
     *     events.
     */
    setScrollTarget(scrollTarget: EventTarget | null): void;
    scrollTarget_: EventTarget | null | undefined;
    /**
     * Enables cancelling of built-in IE drag events.
     * @param {boolean} cancelIeDragStart Whether to enable cancelling of IE
     *     dragstart event.
     */
    setCancelIeDragStart(cancelIeDragStart: boolean): void;
    /**
     * @return {boolean} Whether the dragger is enabled.
     */
    getEnabled(): boolean;
    /**
     * Set whether dragger is enabled
     * @param {boolean} enabled Whether dragger is enabled.
     */
    setEnabled(enabled: boolean): void;
    /**
     * Set whether mousedown should be default prevented.
     * @param {boolean} preventMouseDown Whether mousedown should be default
     *     prevented.
     */
    setPreventMouseDown(preventMouseDown: boolean): void;
    /**
     * Whether the DOM element being manipulated is rendered right-to-left.
     * @return {boolean} True if the DOM element is rendered right-to-left, false
     *     otherwise.
     * @private
     */
    private isRightToLeft_;
    rightToLeft_: boolean | undefined;
    /**
     * Event handler that is used to start the drag
     * @param {?EventsBrowserEvent} e Event object.
     */
    startDrag(e: EventsBrowserEvent | null): void;
    /**
     * Sets up event handlers when dragging starts.
     * @protected
     */
    protected setupDragHandlers(): void;
    /**
     * Fires a EventType.START event.
     * @param {?EventsBrowserEvent} e Browser event that triggered the drag.
     * @return {boolean} False iff preventDefault was called on the DragEvent.
     * @private
     */
    private fireDragStart_;
    /**
     * Unregisters the event handlers that are only active during dragging, and
     * releases mouse capture.
     * @private
     */
    private cleanUpAfterDragging_;
    /**
     * Event handler that is used to end the drag.
     * @param {?EventsBrowserEvent} e Event object.
     * @param {boolean=} opt_dragCanceled Whether the drag has been canceled.
     */
    endDrag(e: EventsBrowserEvent | null, opt_dragCanceled?: boolean | undefined): void;
    /**
     * Event handler that is used to end the drag by cancelling it.
     * @param {?EventsBrowserEvent} e Event object.
     */
    endDragCancel(e: EventsBrowserEvent | null): void;
    /**
     * Event handler that is used on mouse / touch move to update the drag
     * @param {?EventsBrowserEvent} e Event object.
     * @private
     */
    private handleMove_;
    /**
     * Calculates the drag position.
     *
     * @param {number} dx The horizontal movement delta.
     * @param {number} dy The vertical movement delta.
     * @return {!Coordinate} The newly calculated drag element position.
     * @private
     */
    private calculatePosition_;
    /**
     * Event handler for scroll target scrolling.
     * @param {?EventsBrowserEvent} e The event.
     * @private
     */
    private onScroll_;
    /**
     * @param {?EventsBrowserEvent} e The closure object
     *     representing the browser event that caused a drag event.
     * @param {number} x The new horizontal position for the drag element.
     * @param {number} y The new vertical position for the drag element.
     * @param {boolean} dragFromScroll Whether dragging was caused by scrolling
     *     the associated scroll target.
     * @protected
     */
    protected doDrag(e: EventsBrowserEvent | null, x: number, y: number, dragFromScroll: boolean): void;
    /**
     * Returns the 'real' x after limits are applied (allows for some
     * limits to be undefined).
     * @param {number} x X-coordinate to limit.
     * @return {number} The 'real' X-coordinate after limits are applied.
     */
    limitX(x: number): number;
    /**
     * Returns the 'real' y after limits are applied (allows for some
     * limits to be undefined).
     * @param {number} y Y-coordinate to limit.
     * @return {number} The 'real' Y-coordinate after limits are applied.
     */
    limitY(y: number): number;
    /**
     * Overridable function for computing the initial position of the target
     * before dragging begins.
     * @protected
     */
    protected computeInitialPosition(): void;
    /**
     * Overridable function for handling the default action of the drag behaviour.
     * Normally this is simply moving the element to x,y though in some cases it
     * might be used to resize the layer.  This is basically a shortcut to
     * implementing a default ondrag event handler.
     * @param {number} x X-coordinate for target element. In right-to-left, x this
     *     is the number of pixels the target should be moved to from the right.
     * @param {number} y Y-coordinate for target element.
     */
    defaultAction(x: number, y: number): void;
    /**
     * @return {boolean} Whether the dragger is currently in the midst of a drag.
     */
    isDragging(): boolean;
}
export namespace Dragger {
    export const HAS_SET_CAPTURE_: boolean;
}
export namespace EventType {
    export const EARLY_CANCEL: string;
    export const START: string;
    export const BEFOREDRAG: string;
    export const DRAG: string;
    export const END: string;
}
import { Event as EventsEvent } from "../events/event.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import * as goog_events from "../events/eventhandler.js";
import { Rect } from "../math/rect.js";
import { Coordinate } from "../math/coordinate.js";
import { EventHandler } from "../events/eventhandler.js";
