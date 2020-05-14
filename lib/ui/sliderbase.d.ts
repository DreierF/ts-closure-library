/**
 * Enum for representing the orientation of the slider.
 */
export type Orientation = string;
/**
 * The factory for creating additional animations to be played when animating to
 * a new value.
 * @interface
 */
export class AnimationFactory {
    /**
     * Creates an additional animation to play when animating to a new value.
     *
     * @param {number} previousValue The previous value (before animation).
     * @param {number} newValue The new value (after animation).
     * @param {number} interval The animation interval.
     * @return {!Array<!TransitionBase>} The additional animations to play.
     */
    createAnimations(previousValue: number, newValue: number, interval: number): Array<TransitionBase>;
}
export namespace Orientation {
    export const VERTICAL: string;
    export const HORIZONTAL: string;
}
/**
 * @fileoverview Implementation of a basic slider control.
 *
 * Models a control that allows to select a sub-range within a given
 * range of values using two thumbs.  The underlying range is modeled
 * as a range model, where the min thumb points to value of the
 * rangemodel, and the max thumb points to value + extent of the range
 * model.
 *
 * The currently selected range is exposed through methods
 * getValue() and getExtent().
 *
 * The reason for modelling the basic slider state as value + extent is
 * to be able to capture both, a two-thumb slider to select a range, and
 * a single-thumb slider to just select a value (in the latter case, extent
 * is always zero). We provide subclasses (twothumbslider.js and slider.js)
 * that model those special cases of this control.
 *
 * All rendering logic is left out, so that the subclasses can define
 * their own rendering. To do so, the subclasses overwrite:
 * - createDom
 * - decorateInternal
 * - getCssClass
 */
/**
 * This creates a SliderBase object.
 *     slider values to a description of the value.
 * @extends {Component}
 * @abstract
 */
export class SliderBase extends Component {
    /**
     * This creates a SliderBase object.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     * @param {(function(number):?string)=} opt_labelFn An optional function mapping
     *     slider values to a description of the value.
     */
    constructor(opt_domHelper?: DomHelper | undefined, opt_labelFn?: ((arg0: number) => string | null) | undefined);
    /**
     * Orientation of the slider.
     * @type {?Orientation}
     * @private
     */
    private orientation_;
    /** @private
      * @type {?AnimationParallelQueue} */
    private currentAnimation_;
    /** @private
      * @type {?Timer} */
    private incTimer_;
    /** @private
      * @type {boolean|null} */
    private incrementing_;
    /** @private
      * @type {number|null} */
    private lastMousePosition_;
    /**
     * The minThumb dom-element, pointing to the start of the selected range.
     * @type {?HTMLDivElement}
     * @protected
     */
    protected valueThumb: HTMLDivElement | null;
    /**
     * The maxThumb dom-element, pointing to the end of the selected range.
     * @type {?HTMLDivElement}
     * @protected
     */
    protected extentThumb: HTMLDivElement | null;
    /**
     * The dom-element highlighting the selected range.
     * @type {?HTMLDivElement}
     * @protected
     */
    protected rangeHighlight: HTMLDivElement | null;
    /**
     * The thumb that we should be moving (only relevant when timed move is active).
     * @type {?HTMLDivElement}
     * @private
     */
    private thumbToMove_;
    /**
     * The object handling keyboard events.
     * @type {?KeyHandler}
     * @private
     */
    private keyHandler_;
    /**
     * The object handling mouse wheel events.
     * @type {?MouseWheelHandler}
     * @private
     */
    private mouseWheelHandler_;
    /**
     * The Dragger for dragging the valueThumb.
     * @type {?Dragger}
     * @private
     */
    private valueDragger_;
    /**
     * The Dragger for dragging the extentThumb.
     * @type {?Dragger}
     * @private
     */
    private extentDragger_;
    /**
     * If we are currently animating the thumb.
     * @private
     * @type {boolean}
     */
    private isAnimating_;
    /**
     * Whether clicking on the backgtround should move directly to that point.
     * @private
     * @type {boolean}
     */
    private moveToPointEnabled_;
    /**
     * The amount to increment/decrement for page up/down as well as when holding
     * down the mouse button on the background.
     * @private
     * @type {number}
     */
    private blockIncrement_;
    /**
     * The minimal extent. The class will ensure that the extent cannot shrink
     * to a value smaller than minExtent.
     * @private
     * @type {number}
     */
    private minExtent_;
    /**
     * Whether the slider should handle mouse wheel events.
     * @private
     * @type {boolean}
     */
    private isHandleMouseWheel_;
    /**
     * The time the last mousedown event was received.
     * @private
     * @type {number}
     */
    private mouseDownTime_;
    /**
     * Whether the slider is enabled or not.
     * @private
     * @type {boolean}
     */
    private enabled_;
    /**
     * Whether the slider implements the changes described in http://b/6324964,
     * making it truly RTL.  This is a temporary flag to allow clients to transition
     * to the new behavior at their convenience.  At some point it will be the
     * default.
     * @type {boolean}
     * @private
     */
    private flipForRtl_;
    /**
     * The amount to increment/decrement for up, down, left and right arrow keys
     * and mouse wheel events.
     * @private
     * @type {number}
     */
    private unitIncrement_;
    /**
     * The factory to use to generate additional animations when animating to a
     * new value.
     * @type {?AnimationFactory}
     * @private
     */
    private additionalAnimations_;
    /**
     * The model for the range of the slider.
     * @protected {!RangeModel}
     */
    protected rangeModel: RangeModel;
    /**
     * A function mapping slider values to text description.
     * @private {function(number):?string}
     */
    private labelFn_;
    /**
     * Whether to move the focus to the top level element when dragging the
     * slider, default true.
     * @private {boolean}
     */
    private focusElementOnSliderDrag_;
    /**
     * Enables/disables true RTL behavior.  This should be called immediately after
     * construction.  This is a temporary flag to allow clients to transition
     * to the new behavior at their convenience.  At some point it will be the
     * default.
     * @param {boolean} flipForRtl True if the slider should be flipped for RTL,
     *     false otherwise.
     */
    enableFlipForRtl(flipForRtl: boolean): void;
    /**
     * Returns the CSS class applied to the slider element for the given
     * orientation. Subclasses must override this method.
     * @param {?Orientation} orient The orientation.
     * @return {string} The CSS class applied to slider elements.
     * @protected
     * @abstract
     */
    protected getCssClass(orient: Orientation | null): string;
    /**
     * Subclasses must implement this method and set the valueThumb and
     * extentThumb to non-null values. They can also set the rangeHighlight
     * element if a range highlight is desired. * @protected
     * @abstract
     */
    createThumbs(): void;
    /**
     * Attaches/Detaches the event handlers on the slider.
     * @param {boolean} enable Whether to attach or detach the event handlers.
     * @private
     */
    private enableEventHandlers_;
    /**
     * Handler for the before drag event. We use the event properties to determine
     * the new value.
     * @param {?DragEvent} e  The drag event used to drag the thumb.
     * @private
     */
    private handleBeforeDrag_;
    /**
     * Handler for the start/end drag event on the thumbs. Adds/removes
     * the "-dragging" CSS classes on the slider and thumb.
     * @param {?DragEvent} e The drag event used to drag the thumb.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private handleThumbDragStartEnd_;
    /**
     * Event handler for the key down event. This is used to update the value
     * based on the key pressed.
     * @param {?KeyEvent} e  The keyboard event object.
     * @private
     */
    private handleKeyDown_;
    /**
     * Handler for the mouse down event and click event.
     * @param {?EventsEvent} e  The mouse event object.
     * @private
     */
    private handleMouseDownAndClick_;
    /**
     * Handler for the mouse wheel event.
     * @param {?MouseWheelEvent} e  The mouse wheel event object.
     * @private
     */
    private handleMouseWheel_;
    /**
     * Starts the animation that causes the thumb to increment/decrement by the
     * block increment when the user presses down on the background.
     * @param {?EventsEvent} e  The mouse event object.
     * @private
     */
    private startBlockIncrementing_;
    /**
     * Handler for the tick event dispatched by the timer used to update the value
     * in a block increment. This is also called directly from
     * startBlockIncrementing_.
     * @private
     */
    private handleTimerTick_;
    /**
     * Stops the block incrementing animation and unlistens the necessary
     * event handlers.
     * @private
     */
    private stopBlockIncrementing_;
    /**
     * Returns the relative mouse position to the slider.
     * @param {?EventsEvent} e  The mouse event object.
     * @return {number} The relative mouse position to the slider.
     * @private
     */
    private getRelativeMousePos_;
    /**
     * Stores the current mouse position so that it can be used in the timer.
     * @param {?EventsEvent} e  The mouse event object.
     * @private
     */
    private storeMousePos_;
    /**
     * Returns the value to use for the current mouse position
     * @param {?EventsEvent} e  The mouse event object.
     * @return {number} The value that this mouse position represents.
     */
    getValueFromMousePosition(e: EventsEvent | null): number;
    /**
     * @param {?HTMLDivElement} thumb  The thumb object.
     * @return {number} The position of the specified thumb.
     * @private
     */
    private getThumbPosition_;
    /**
     * Returns whether a thumb is currently being dragged with the mouse (or via
     * touch). Note that changing the value with keyboard, mouswheel, or via
     * move-to-point click immediately sends a CHANGE event without going through a
     * dragged state.
     * @return {boolean} Whether a dragger is currently being dragged.
     */
    isDragging(): boolean;
    /**
     * Moves the thumbs by the specified delta as follows
     * - as long as both thumbs stay within [min,max], both thumbs are moved
     * - once a thumb reaches or exceeds min (or max, respectively), it stays
     * - at min (or max, respectively).
     * In case both thumbs have reached min (or max), no change event will fire.
     * If the specified delta is smaller than the step size, it will be rounded
     * to the step size.
     * @param {number} delta The delta by which to move the selected range.
     * @suppress {strictPrimitiveOperators} Part of the go/strict_warnings_migration
     */
    moveThumbs(delta: number): void;
    /**
     * Sets the position of the given thumb. The set is ignored and no CHANGE event
     * fires if it violates the constraint minimum <= value (valueThumb position) <=
     * value + extent (extentThumb position) <= maximum.
     *
     * Note: To keep things simple, the setThumbPosition_ function does not have the
     * side-effect of "correcting" value or extent to fit the above constraint as it
     * is the case in the underlying range model. Instead, we simply ignore the
     * call. Callers must make these adjustements explicitly if they wish.
     * @param {?Element} thumb The thumb whose position to set.
     * @param {number} position The position to move the thumb to.
     * @private
     */
    private setThumbPosition_;
    /**
     * Sets the value and extent of the underlying range model. We enforce that
     * getMinimum() <= value <= getMaximum() - extent and
     * getMinExtent <= extent <= getMaximum() - getValue()
     * If this is not satisfied for the given extent, the call is ignored and no
     * CHANGE event fires. This is a utility method to allow setting the thumbs
     * simultaneously and ensuring that only one event fires.
     * @param {number} value The value to which to set the value.
     * @param {number} extent The value to which to set the extent.
     */
    setValueAndExtent(value: number, extent: number): void;
    /**
     * @return {number} The minimum value.
     */
    getMinimum(): number;
    /**
     * Sets the minimum number.
     * @param {number} min The minimum value.
     */
    setMinimum(min: number): void;
    /**
     * @return {number} The maximum value.
     */
    getMaximum(): number;
    /**
     * Sets the maximum number.
     * @param {number} max The maximum value.
     */
    setMaximum(max: number): void;
    /**
     * @return {?HTMLDivElement} The value thumb element.
     */
    getValueThumb(): HTMLDivElement | null;
    /**
     * @return {?HTMLDivElement} The extent thumb element.
     */
    getExtentThumb(): HTMLDivElement | null;
    /**
     * @param {number} position The position to get the closest thumb to.
     * @return {?HTMLDivElement} The thumb that is closest to the given position.
     * @private
     */
    private getClosestThumb_;
    /**
     * Call back when the internal range model changes. Sub-classes may override
     * and re-enter this method to update a11y state. Consider protected.
     * @param {?EventsEvent} e The event object.
     * @protected
     */
    protected handleRangeModelChange(e: EventsEvent | null): void;
    /**
     * This is called when we need to update the size of the thumb. This happens
     * when first created as well as when the value and the orientation changes.
     * @private
     */
    private updateUi_;
    /**
     * Calculates the start position (offset) and size of the range highlight, e.g.
     * for a horizontal slider, this will return [left, width] for the highlight.
     * @param {number} firstThumbPos The position of the first thumb along the
     *     slider axis.
     * @param {number} secondThumbPos The position of the second thumb along the
     *     slider axis, must be >= firstThumbPos.
     * @param {number} thumbSize The size of the thumb, along the slider axis.
     * @return {{offset: number, size: number}} The positioning parameters for the
     *     range highlight.
     * @private
     */
    private calculateRangeHighlightPositioning_;
    /**
     * Returns the position to move the handle to for a given value
     * @param {number} val  The value to get the coordinate for.
     * @return {!Coordinate} Coordinate with either x or y set.
     */
    getThumbCoordinateForValue(val: number): Coordinate;
    /**
     * Sets the value and starts animating the handle towards that position.
     * @param {number} v Value to set and animate to.
     * @suppress {strictPrimitiveOperators} Part of the go/strict_warnings_migration
     */
    animatedSetValue(v: number): void;
    /**
     * @return {boolean} True if the slider is animating, false otherwise.
     */
    isAnimating(): boolean;
    /**
     * Sets the factory that will be used to create additional animations to be
     * played when animating to a new value.  These animations can be for any
     * element and the animations will be played in addition to the default
     * animation(s).  The animations will also be played in the same parallel queue
     * ensuring that all animations are played at the same time.
     * @see #animatedSetValue
     *
     * @param {?AnimationFactory} factory The animation factory to
     *     use.  This will not change the default animations played by the slider.
     *     It will only allow for additional animations.
     */
    setAdditionalAnimations(factory: AnimationFactory | null): void;
    /**
     * Adds animations for the range highlight element to the animation queue.
     *
     * @param {?Element} thumb The thumb that's moving, must be
     *     either valueThumb or extentThumb.
     * @param {number} previousValue The previous value of the slider.
     * @param {number} previousExtent The previous extent of the
     *     slider.
     * @param {?Coordinate} newCoord The new pixel coordinate of the
     *     thumb that's moving.
     * @param {?AnimationParallelQueue} animations The animation queue.
     * @private
     */
    private addRangeHighlightAnimations_;
    /**
     * Sets the isAnimating_ field to false once the animation is done.
     * @param {?AnimationEvent} e Event object passed by the animation
     *     object.
     * @private
     */
    private endAnimation_;
    /**
     * Changes the orientation.
     * @param {?Orientation} orient The orientation.
     */
    setOrientation(orient: Orientation | null): void;
    /**
     * @return {?Orientation} the orientation of the slider.
     */
    getOrientation(): Orientation | null;
    /**
     * @return {number} The amount to increment/decrement for page up/down as well
     *     as when holding down the mouse button on the background.
     */
    getBlockIncrement(): number;
    /**
     * Sets the amount to increment/decrement for page up/down as well as when
     * holding down the mouse button on the background.
     *
     * @param {number} value The value to set the block increment to.
     */
    setBlockIncrement(value: number): void;
    /**
     * Sets the minimal value that the extent may have.
     *
     * @param {number} value The minimal value for the extent.
     */
    setMinExtent(value: number): void;
    /**
     * @return {number} The amount to increment/decrement for up, down, left and
     *     right arrow keys and mouse wheel events.
     */
    getUnitIncrement(): number;
    /**
     * Sets the amount to increment/decrement for up, down, left and right arrow
     * keys and mouse wheel events.
     * @param {number} value  The value to set the unit increment to.
     */
    setUnitIncrement(value: number): void;
    /**
     * @return {?number} The step value used to determine how to round the value.
     */
    getStep(): number | null;
    /**
     * Sets the step value. The step value is used to determine how to round the
     * value.
     * @param {?number} step  The step size.
     */
    setStep(step: number | null): void;
    /**
     * @return {boolean} Whether clicking on the backgtround should move directly to
     *     that point.
     */
    getMoveToPointEnabled(): boolean;
    /**
     * Sets whether clicking on the background should move directly to that point.
     * @param {boolean} val Whether clicking on the background should move directly
     *     to that point.
     */
    setMoveToPointEnabled(val: boolean): void;
    /**
     * @return {number} The value of the underlying range model.
     */
    getValue(): number;
    /**
     * Sets the value of the underlying range model. We enforce that
     * getMinimum() <= value <= getMaximum() - getExtent()
     * If this is not satisifed for the given value, the call is ignored and no
     * CHANGE event fires.
     * @param {number} value The value.
     */
    setValue(value: number): void;
    /**
     * @return {number} The value of the extent of the underlying range model.
     */
    getExtent(): number;
    /**
     * Sets the extent of the underlying range model. We enforce that
     * getMinExtent() <= extent <= getMaximum() - getValue()
     * If this is not satisifed for the given extent, the call is ignored and no
     * CHANGE event fires.
     * @param {number} extent The value to which to set the extent.
     */
    setExtent(extent: number): void;
    /**
     * Change the visibility of the slider.
     * You must call this if you had set the slider's value when it was invisible.
     * @param {boolean} visible Whether to show the slider.
     */
    setVisible(visible: boolean): void;
    /**
     * Set a11y roles and state.
     * @protected
     */
    protected setAriaRoles(): void;
    /**
     * Set a11y roles and state when values change.
     * @protected
     */
    protected updateAriaStates(): void;
    /**
     * Enables or disables mouse wheel handling for the slider. The mouse wheel
     * handler enables the user to change the value of slider using a mouse wheel.
     *
     * @param {boolean} enable Whether to enable mouse wheel handling.
     */
    setHandleMouseWheel(enable: boolean): void;
    /**
     * @return {boolean} Whether the slider handles mousewheel.
     */
    isHandleMouseWheel(): boolean;
    /**
     * Enable/Disable mouse wheel handling.
     * @param {boolean} enable Whether to enable mouse wheel handling.
     * @private
     */
    private enableMouseWheelHandling_;
    /**
     * Enables or disables the slider. A disabled slider will ignore all
     * user-initiated events. Also fires ComponentEventType.ENABLE/DISABLE
     * event as appropriate.
     * @param {boolean} enable Whether to enable the slider or not.
     */
    setEnabled(enable: boolean): void;
    /**
     * @return {boolean} Whether the slider is enabled or not.
     */
    isEnabled(): boolean;
    /**
     * @param {?Element} element An element for which we want offsetLeft.
     * @return {number} Returns the element's offsetLeft, accounting for RTL if
     *     flipForRtl_ is true.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private getOffsetStart_;
    /**
     * @return {?string} The text value for the slider's current value, or null if
     *     unavailable.
     */
    getTextValue(): string | null;
    /**
     * Sets whether focus will be moved to the top-level element when the slider is
     * dragged.
     * @param {boolean} focusElementOnSliderDrag
     */
    setFocusElementOnSliderDrag(focusElementOnSliderDrag: boolean): void;
    /**
     * The delay after mouseDownTime_ during which a click event is ignored.
     * @private
     * @type {number}
     * @const
     */
    private MOUSE_DOWN_DELAY_;
}
export namespace SliderBase {
    export namespace EventType {
        export const DRAG_VALUE_START: string;
        export const DRAG_VALUE_END: string;
        export const DRAG_EXTENT_START: string;
        export const DRAG_EXTENT_END: string;
        export const DRAG_START: string;
        export const DRAG_END: string;
        export const ANIMATION_END: string;
    }
    /**
     * *
     */
    export type EventType = string;
    export const MOUSE_DOWN_INCREMENT_INTERVAL_: number;
    export const ANIMATION_INTERVAL_: number;
    export const SLIDER_DRAGGING_CSS_CLASS_: string;
    export const THUMB_DRAGGING_CSS_CLASS_: string;
    export const DISABLED_CSS_CLASS_: string;
}
import { TransitionBase } from "../fx/transitionbase.js";
import { Component } from "./component.js";
import { RangeModel } from "./rangemodel.js";
import { Event as EventsEvent } from "../events/event.js";
import { Coordinate } from "../math/coordinate.js";
import { DomHelper } from "../dom/dom.js";
