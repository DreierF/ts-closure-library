/**
 * @fileoverview Abstract Base Class for Drag and Drop.
 *
 * Provides functionality for implementing drag and drop classes. Also provides
 * support classes and events.
 */
/**
 * Abstract class that provides reusable functionality for implementing drag
 * and drop functionality.
 *
 * This class also allows clients to define their own subtargeting function
 * so that drop areas can have finer granularity than a single element. This is
 * accomplished by using a client provided function to map from element and
 * coordinates to a subregion id.
 *
 * This class can also be made aware of scrollable containers that contain
 * drop targets by calling addScrollableContainer. This will cause dnd to
 * take changing scroll positions into account while a drag is occurring.
 *
 * @extends {EventsEventTarget}
 * @class
 * @abstract
 */
export class AbstractDragDrop extends goog_events.EventTarget {
    /**
     * List of items that makes up the drag source or drop target.
     * @protected {Array<DragDropItem>}
     * @suppress {underscore|visibility}
     */
    protected items_: any[];
    /**
     * List of associated drop targets.
     * @private {Array<AbstractDragDrop>}
     */
    private targets_;
    /**
     * Scrollable containers to account for during drag
     * @private {Array<ScrollableContainer_>}
     */
    private scrollableContainers_;
    /**
     * Flag indicating if it's a drag source, set by addTarget.
     * @private {boolean}
     */
    private isSource_;
    /**
     * Flag indicating if it's a drop target, set when added as target to another
     * DragDrop object.
     * @private {boolean}
     */
    private isTarget_;
    /**
     * Whether the object has been initialized.
     * @private {boolean}
     */
    private initialized_;
    /**
     * Set class to add to source elements being dragged.
     *
     * @param {string} className Class to be added.  Must be a single, valid
     *     classname.
     */
    setDragClass(className: string): void;
    dragClass_: string | undefined;
    /**
     * Set class to add to source elements.
     *
     * @param {string} className Class to be added.  Must be a single, valid
     *     classname.
     */
    setSourceClass(className: string): void;
    sourceClass_: string | undefined;
    /**
     * Set class to add to target elements.
     *
     * @param {string} className Class to be added.  Must be a single, valid
     *     classname.
     */
    setTargetClass(className: string): void;
    targetClass_: string | undefined;
    /**
     * Whether the control has been initialized.
     *
     * @return {boolean} True if it's been initialized.
     */
    isInitialized(): boolean;
    /**
     * Add item to drag object.
     *
     * @param {?Element|string} element Dom Node, or string representation of node
     *     id, to be used as drag source/drop target.
     * @throws Error Thrown if called on instance of abstract class
     * @abstract
     */
    addItem(element: (Element | string) | null): void;
    /**
     * Associate drop target with drag element.
     *
     * @param {?AbstractDragDrop} target Target to add.
     */
    addTarget(target: AbstractDragDrop | null): void;
    /**
     * Removes the specified target from the list of drop targets.
     *
     * @param {!AbstractDragDrop} target Target to remove.
     */
    removeTarget(target: AbstractDragDrop): void;
    activeTarget_: any;
    /**
     * Sets the SCROLL event target to make drag element follow scrolling.
     *
     * @param {?EventTarget} scrollTarget The element that dispatches SCROLL events.
     */
    setScrollTarget(scrollTarget: EventTarget | null): void;
    scrollTarget_: EventTarget | null | undefined;
    /**
     * Initialize drag and drop functionality for sources/targets already added.
     * Sources/targets added after init has been called will initialize themselves
     * one by one.
     */
    init(): void;
    /**
     * Initializes a single item.
     *
     * @param {?DragDropItem} item Item to initialize.
     * @protected
     */
    protected initItem(item: DragDropItem | null): void;
    /**
     * Called when removing an item. Removes event listeners and classes.
     *
     * @param {?DragDropItem} item Item to dispose.
     * @protected
     */
    protected disposeItem(item: DragDropItem | null): void;
    /**
     * Removes all items.
     */
    removeItems(): void;
    /**
     * Starts a drag event for an item if the mouse button stays pressed and the
     * cursor moves a few pixels. Allows dragging of items without first having to
     * register them with addItem.
     *
     * @param {?EventsBrowserEvent} event Mouse down event.
     * @param {?DragDropItem} item Item that's being dragged.
     */
    maybeStartDrag(event: EventsBrowserEvent | null, item: DragDropItem | null): void;
    /**
     * Event handler that's used to start drag.
     *
     * @param {?EventsBrowserEvent} event Mouse move event.
     * @param {?DragDropItem} item Item that's being dragged.
     */
    startDrag(event: EventsBrowserEvent | null, item: DragDropItem | null): void;
    dragItem_: DragDropItem | null | undefined;
    dragEl_: Element | null | undefined;
    dragger_: Fx_Dragger | undefined;
    /**
     * Recalculates the geometry of this source's drag targets.  Call this
     * if the position or visibility of a drag target has changed during
     * a drag, or if targets are added or removed.
     *
     * TODO(user): this is an expensive operation;  more efficient APIs
     * may be necessary.
     */
    recalculateDragTargets(): void;
    targetList_: any[] | undefined;
    targetBox_: Box | undefined;
    /**
     * Recalculates the current scroll positions of scrollable containers and
     * allocates targets. Call this if the position of a container changed or if
     * targets are added or removed.
     */
    recalculateScrollableContainers(): void;
    /**
     * Creates the Dragger for the drag element.
     * @param {?Element} sourceEl Drag source element.
     * @param {?Element} el the element created by createDragElement().
     * @param {?EventsBrowserEvent} event Mouse down event for start of drag.
     * @return {!Fx_Dragger} The new Dragger.
     * @protected
     */
    protected createDraggerFor(sourceEl: Element | null, el: Element | null, event: EventsBrowserEvent | null): Fx_Dragger;
    /**
     * Event handler that's used to stop drag. Fires a drop event if over a valid
     * target.
     *
     * @param {?DragEvent} event Drag event.
     */
    endDrag(event: DragEvent | null): void;
    /**
     * Called after a drag operation has finished.
     *
     * @param {DragDropItem=} opt_dropTarget Target for successful drop.
     * @protected
     */
    protected afterEndDrag(opt_dropTarget?: DragDropItem | undefined): void;
    /**
     * Called once a drag operation has finished. Removes event listeners and
     * elements.
     *
     * @protected
     */
    protected disposeDrag(): void;
    /**
     * Event handler for drag events. Determines the active drop target, if any, and
     * fires dragover and dragout events appropriately.
     *
     * @param {?DragEvent} event Drag event.
     * @private
     */
    private moveDrag_;
    activeSubtarget_: any;
    /**
     * Event handler for suppressing selectstart events. Selecting should be
     * disabled while dragging.
     *
     * @param {?EventsEvent} event The selectstart event to suppress.
     * @return {boolean} Whether to perform default behavior.
     * @private
     */
    private suppressSelect_;
    /**
     * Sets up listeners for the scrollable containers that keep track of their
     * scroll positions.
     * @private
     */
    private initScrollableContainerListeners_;
    /**
     * Cleans up the scrollable container listeners.
     * @private
     */
    private disposeScrollableContainerListeners_;
    /**
     * Makes drag and drop aware of a target container that could scroll mid drag.
     * @param {?Element} element The scroll container.
     */
    addScrollableContainer(element: Element | null): void;
    /**
     * Removes all scrollable containers.
     */
    removeAllScrollableContainers(): void;
    /**
     * Event handler for containers scrolling.
     * @param {?EventsBrowserEvent} e The event.
     * @suppress {visibility} TODO(martone): update dependent projects.
     * @private
     */
    private containerScrollHandler_;
    /**
     * Set a function that provides subtargets. A subtargeting function
     * returns an arbitrary identifier for each subtarget of an element.
     * DnD code will generate additional drag over / out events when
     * switching from subtarget to subtarget. This is useful for instance
     * if you are interested if you are on the top half or the bottom half
     * of the element.
     * The provided function will be given the DragDropItem, box, x, y
     * box is the current window coordinates occupied by element
     * x, y is the mouse position in window coordinates
     *
     * @param {?Function} f The new subtarget function.
     */
    setSubtargetFunction(f: Function | null): void;
    subtargetFunction_: Function | null | undefined;
    /**
     * Creates an element for the item being dragged.
     *
     * @param {?Element} sourceEl Drag source element.
     * @return {?Element} The new drag element.
     */
    createDragElement(sourceEl: Element | null): Element | null;
    /**
     * Returns the position for the drag element.
     *
     * @param {?Element} el Drag source element.
     * @param {?Element} dragEl The dragged element created by createDragElement().
     * @param {?EventsBrowserEvent} event Mouse down event for start of drag.
     * @return {!Coordinate} The position for the drag element.
     */
    getDragElementPosition(el: Element | null, dragEl: Element | null, event: EventsBrowserEvent | null): Coordinate;
    /**
     * Returns the dragger object.
     *
     * @return {?Fx_Dragger} The dragger object used by this drag and drop
     *     instance.
     */
    getDragger(): Fx_Dragger | null;
    /**
     * Creates copy of node being dragged.
     *
     * @param {?Element} sourceEl Element to copy.
     * @return {!Element} The clone of `sourceEl`.
     * @deprecated Use Fx_Dragger.cloneNode().
     * @private
     */
    private cloneNode_;
    /**
     * Generates an element to follow the cursor during dragging, given a drag
     * source element.  The default behavior is simply to clone the source element,
     * but this may be overridden in subclasses.  This method is called by
     * `createDragElement()` before the drag class is added.
     *
     * @param {?Element} sourceEl Drag source element.
     * @return {!Element} The new drag element.
     * @protected
     * @suppress {deprecated}
     */
    protected createDragElementInternal(sourceEl: Element | null): Element;
    /**
     * Add possible drop target for current drag operation.
     *
     * @param {?AbstractDragDrop} target Drag handler.
     * @param {?DragDropItem} item Item that's being dragged.
     * @private
     */
    private addDragTarget_;
    /**
     * Calculates the position and dimension of a draggable element.
     *
     * @param {?DragDropItem} item Item that's being dragged.
     * @param {?Element} element The element to calculate the box.
     *
     * @return {!Box} Box describing the position and dimension
     *     of element.
     * @protected
     */
    protected getElementBox(item: DragDropItem | null, element: Element | null): Box;
    /**
     * Calculate the outer bounds (the region all targets are inside).
     *
     * @param {?Box} box Box describing the position and dimension
     *     of a drag target.
     * @private
     */
    private calculateTargetBox_;
    /**
     * Creates a dummy target for the given cursor position. The assumption is to
     * create as big dummy target box as possible, the only constraints are:
     * - The dummy target box cannot overlap any of real target boxes.
     * - The dummy target has to contain a point with current mouse coordinates.
     *
     * NOTE: For performance reasons the box construction algorithm is kept simple
     * and it is not optimal (see example below). Currently it is O(n) in regard to
     * the number of real drop target boxes, but its result depends on the order
     * of those boxes being processed (the order in which they're added to the
     * targetList_ collection).
     *
     * The algorithm.
     * a) Assumptions
     * - Mouse pointer is in the bounding box of real target boxes.
     * - None of the boxes have negative coordinate values.
     * - Mouse pointer is not contained by any of "real target" boxes.
     * - For targets inside a scrollable container, the box used is the
     *   intersection of the scrollable container's box and the target's box.
     *   This is because the part of the target that extends outside the scrollable
     *   container should not be used in the clipping calculations.
     *
     * b) Outline
     * - Initialize the fake target to the bounding box of real targets.
     * - For each real target box - clip the fake target box so it does not contain
     *   that target box, but does contain the mouse pointer.
     *   -- Project the real target box, mouse pointer and fake target box onto
     *      both axes and calculate the clipping coordinates.
     *   -- Only one coordinate is used to clip the fake target box to keep the
     *      fake target as big as possible.
     *   -- If the projection of the real target box contains the mouse pointer,
     *      clipping for a given axis is not possible.
     *   -- If both clippings are possible, the clipping more distant from the
     *      mouse pointer is selected to keep bigger fake target area.
     * - Save the created fake target only if it has a big enough area.
     *
     *
     * c) Example
     * <pre>
     *        Input:           Algorithm created box:        Maximum box:
     * +---------------------+ +---------------------+ +---------------------+
     * | B1      |        B2 | | B1               B2 | | B1               B2 |
     * |         |           | |   +-------------+   | |+-------------------+|
     * |---------x-----------| |   |             |   | ||                   ||
     * |         |           | |   |             |   | ||                   ||
     * |         |           | |   |             |   | ||                   ||
     * |         |           | |   |             |   | ||                   ||
     * |         |           | |   |             |   | ||                   ||
     * |         |           | |   +-------------+   | |+-------------------+|
     * | B4      |        B3 | | B4               B3 | | B4               B3 |
     * +---------------------+ +---------------------+ +---------------------+
     * </pre>
     *
     * @param {number} x Cursor position on the x-axis.
     * @param {number} y Cursor position on the y-axis.
     * @return {?ActiveDropTarget_} Dummy drop target.
     * @private
     */
    private maybeCreateDummyTargetForPosition_;
    dummyTarget_: any;
    /**
     * Returns the target for a given cursor position.
     *
     * @param {?Coordinate} position Cursor position.
     * @return {?ActiveDropTarget_} Target for position or null if no target
     *     was defined for the given position.
     * @private
     */
    private getTargetFromPosition_;
    /**
     * Checks whatever a given point is inside a given box.
     *
     * @param {number} x Cursor position on the x-axis.
     * @param {number} y Cursor position on the y-axis.
     * @param {?Box} box Box to check position against.
     * @return {boolean} Whether the given point is inside `box`.
     * @protected
     * @deprecated Use Box.contains.
     */
    protected isInside(x: number, y: number, box: Box | null): boolean;
    /**
     * Gets the scroll distance as a coordinate object, using
     * the window of the current drag element's dom.
     * @return {!Coordinate} Object with scroll offsets 'x' and 'y'.
     * @protected
     */
    protected getScrollPos(): Coordinate;
    /**
     * Get the position of a drag event.
     * @param {?DragEvent} event Drag event.
     * @return {!Coordinate} Position of the event.
     * @protected
     */
    protected getEventPosition(event: DragEvent | null): Coordinate;
}
export namespace AbstractDragDrop {
    export const DUMMY_TARGET_MIN_SIZE_: number;
    export const initDragDistanceThreshold: number;
    export namespace TEST_ONLY {
        export { ActiveDropTarget_ as ActiveDropTarget };
    }
}
/**
 * Object representing a drag and drop event.
 *
 *     that caused this dragdrop event.
 * @extends {EventsEvent}
 * @class
 */
export class DragDropEvent extends EventsEvent {
    /**
     * Object representing a drag and drop event.
     *
     * @param {string} type Event type.
     * @param {?AbstractDragDrop} source Source drag drop object.
     * @param {?DragDropItem} sourceItem Source item.
     * @param {AbstractDragDrop=} opt_target Target drag drop object.
     * @param {DragDropItem=} opt_targetItem Target item.
     * @param {?Element=} opt_targetElement Target element.
     * @param {number=} opt_clientX X-Position relative to the screen.
     * @param {number=} opt_clientY Y-Position relative to the screen.
     * @param {number=} opt_x X-Position relative to the viewport.
     * @param {number=} opt_y Y-Position relative to the viewport.
     * @param {Object=} opt_subtarget The currently active subtarget.
     * @param {EventsBrowserEvent=} opt_browserEvent The browser event
     *     that caused this dragdrop event.
     */
    constructor(type: string, source: AbstractDragDrop | null, sourceItem: DragDropItem | null, opt_target?: AbstractDragDrop | undefined, opt_targetItem?: DragDropItem | undefined, opt_targetElement?: (Element | null) | undefined, opt_clientX?: number | undefined, opt_clientY?: number | undefined, opt_x?: number | undefined, opt_y?: number | undefined, opt_subtarget?: any | undefined, opt_browserEvent?: EventsBrowserEvent | undefined);
    /**
     * Reference to the source AbstractDragDrop object.
     * @type {?AbstractDragDrop}
     */
    dragSource: AbstractDragDrop | null;
    /**
     * Reference to the source DragDropItem object.
     * @type {?DragDropItem}
     */
    dragSourceItem: DragDropItem | null;
    /**
     * Reference to the target AbstractDragDrop object.
     * @type {AbstractDragDrop|undefined}
     */
    dropTarget: AbstractDragDrop | undefined;
    /**
     * Reference to the target DragDropItem object.
     * @type {DragDropItem|undefined}
     */
    dropTargetItem: DragDropItem | undefined;
    /**
     * The actual element of the drop target that is the target for this event.
     * @type {?Element|undefined}
     */
    dropTargetElement: (Element | undefined) | null;
    /**
     * X-Position relative to the screen.
     * @type {number|undefined}
     */
    clientX: number | undefined;
    /**
     * Y-Position relative to the screen.
     * @type {number|undefined}
     */
    clientY: number | undefined;
    /**
     * X-Position relative to the viewport.
     * @type {number|undefined}
     */
    viewportX: number | undefined;
    /**
     * Y-Position relative to the viewport.
     * @type {number|undefined}
     */
    viewportY: number | undefined;
    /**
     * The subtarget that is currently active if a subtargeting function
     * is supplied.
     * @type {Object|undefined}
     */
    subtarget: any | undefined;
    /**
     * The browser event that caused this dragdrop event.
     * @const
     */
    browserEvent: EventsBrowserEvent | undefined;
}
/**
 * Class representing a source or target element for drag and drop operations.
 *
 *     id, to be used as drag source/drop target.
 * @throws Error If no element argument is provided or if the type is invalid
 * @extends {EventsEventTarget}
 * @class
 */
export class DragDropItem extends goog_events.EventTarget {
    /**
     * Class representing a source or target element for drag and drop operations.
     *
     * @param {?Element|string} element Dom Node, or string representation of node
     *     id, to be used as drag source/drop target.
     * @param {Object=} opt_data Data associated with the source/target.
     * @throws Error If no element argument is provided or if the type is invalid
     */
    constructor(element: (Element | string) | null, opt_data?: any | undefined);
    /**
     * Reference to drag source/target element
     * @type {?Element}
     */
    element: Element | null;
    /**
     * Data associated with element.
     * @type {Object|undefined}
     */
    data: any | undefined;
    /**
     * Drag object the item belongs to.
     * @type {AbstractDragDrop?}
     * @private
     */
    private parent_;
    /**
     * Event handler for listeners on events that can initiate a drag.
     * @type {!EventHandler<!DragDropItem>}
     * @private
     */
    private eventHandler_;
    /**
     * The current element being dragged. This is needed because a DragDropItem
     * can have multiple elements that can be dragged.
     * @private {Element|null}
     */
    private currentDragElement_;
    /**
     * Get the data associated with the source/target.
     * @return {Object|null|undefined} Data associated with the source/target.
     */
    getData(): any | null | undefined;
    /**
     * Gets the element that is actually draggable given that the given target was
     * attempted to be dragged. This should be overridden when the element that was
     * given actually contains many items that can be dragged. From the target, you
     * can determine what element should actually be dragged.
     *
     * @param {?Element} target The target that was attempted to be dragged.
     * @return {?Element} The element that is draggable given the target. If
     *     none are draggable, this will return null.
     */
    getDraggableElement(target: Element | null): Element | null;
    /**
     * Gets the element that is currently being dragged.
     *
     * @return {?Element} The element that is currently being dragged.
     */
    getCurrentDragElement(): Element | null;
    /**
     * Gets all the elements of this item that are potentially draggable/
     *
     * @return {!Array<Element>} The draggable elements.
     */
    getDraggableElements(): Array<Element>;
    /**
     * Event handler for mouse down.
     *
     * @param {?EventsBrowserEvent} event Mouse down event.
     * @private
     */
    private mouseDown_;
    /**
     * Sets the dragdrop to which this item belongs.
     * @param {?AbstractDragDrop} parent The parent dragdrop.
     */
    setParent(parent: AbstractDragDrop | null): void;
    /**
     * Adds mouse move, mouse out and mouse up handlers.
     *
     * @param {?EventsBrowserEvent} event Mouse down event.
     * @param {?Element} element Element.
     * @private
     */
    private maybeStartDrag_;
    startPosition_: Coordinate | undefined;
    /**
     * Event handler for mouse move. Starts drag operation if moved more than the
     * threshold value.
     *
     * @param {?EventsBrowserEvent} event Mouse move or mouse out event.
     * @private
     */
    private mouseMove_;
    /**
     * Event handler for mouse up. Removes mouse move, mouse out and mouse up event
     * handlers.
     *
     * @param {?EventsBrowserEvent} event Mouse up event.
     * @private
     */
    private mouseUp_;
}
export namespace EventType {
    export const DRAGOVER: string;
    export const DRAGOUT: string;
    export const DRAG: string;
    export const DROP: string;
    export const DRAGSTART: string;
    export const DRAGEND: string;
}
import * as goog_events from "../events/eventhandler.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import { Dragger as Fx_Dragger } from "./dragger.js";
import { Box } from "../math/box.js";
import { DragEvent } from "./dragger.js";
import { Coordinate } from "../math/coordinate.js";
/**
 * Class representing an active drop target
 *
 *     target item.
       associated with position.
 * @class
 * @private
 */
declare class ActiveDropTarget_ {
    /**
     * Class representing an active drop target
     *
     * @param {?Box} box Box describing the position and dimension of the
     *     target item.
     * @param {AbstractDragDrop=} opt_target Target that contains the item
           associated with position.
     * @param {DragDropItem=} opt_item Item associated with position.
     * @param {?Element=} opt_element Element of item associated with position.
     * @private
     */
    private constructor();
    /**
     * Box describing the position and dimension of the target item
     * @type {?Box}
     * @private
     */
    private box_;
    /**
     * Target that contains the item associated with position
     * @type {AbstractDragDrop|undefined}
     * @private
     */
    private target_;
    /**
     * Item associated with position
     * @type {DragDropItem|undefined}
     * @private
     */
    private item_;
    /**
     * The draggable element of the item associated with position.
     * @type {?Element}
     * @private
     */
    private element_;
    /**
     * If this target is in a scrollable container this is it.
     * @private {?ScrollableContainer_}
     */
    private scrollableContainer_;
}
import { Event as EventsEvent } from "../events/event.js";
export {};
