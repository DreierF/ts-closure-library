/**
 * @fileoverview Implementation of a range model. This is an implementation of
 * the BoundedRangeModel as described by Java at
 * http://java.sun.com/javase/6/docs/api/javax/swing/BoundedRangeModel.html.
 *
 * One good way to understand the range model is to think of a scroll bar for
 * a scrollable element. In that case minimum is 0, maximum is scrollHeight,
 * value is scrollTop and extent is clientHeight.
 *
 * Based on http://webfx.eae.net/dhtml/slider/js/range.js
 */
/**
 * Creates a range model
 * @extends {EventsEventTarget}
 */
export class RangeModel extends EventsEventTarget {
    /**
     * @type {number}
     * @private
     */
    private value_;
    /**
     * @type {number}
     * @private
     */
    private minimum_;
    /**
     * @type {number}
     * @private
     */
    private maximum_;
    /**
     * @type {number}
     * @private
     */
    private extent_;
    /**
     * @type {?number}
     * @private
     */
    private step_;
    /**
     * This is true if something is changed as a side effect. This happens when for
     * example we set the maximum below the current value.
     * @type {boolean}
     * @private
     */
    private isChanging_;
    /**
     * If set to true, we do not fire any change events.
     * @type {boolean}
     * @private
     */
    private mute_;
    /**
     * Sets the model to mute / unmute.
     * @param {boolean} muteValue Whether or not to mute the range, i.e.,
     *     suppress any CHANGE events.
     */
    setMute(muteValue: boolean): void;
    /**
     * Sets the value.
     * @param {number} value The new value.
     */
    setValue(value: number): void;
    /**
     * @return {number} the current value.
     */
    getValue(): number;
    /**
     * Sets the extent. The extent is the 'size' of the value.
     * @param {number} extent The new extent.
     */
    setExtent(extent: number): void;
    /**
     * @return {number} The extent for the range model.
     */
    getExtent(): number;
    /**
     * Sets the minimum
     * @param {number} minimum The new minimum.
     */
    setMinimum(minimum: number): void;
    /**
     * @return {number} The minimum value for the range model.
     */
    getMinimum(): number;
    /**
     * Sets the maximum
     * @param {number} maximum The new maximum.
     */
    setMaximum(maximum: number): void;
    /**
     * @return {number} The maximimum value for the range model.
     */
    getMaximum(): number;
    /**
     * Returns the step value. The step value is used to determine how to round the
     * value.
     * @return {?number} The maximimum value for the range model.
     */
    getStep(): number | null;
    /**
     * Sets the step. The step value is used to determine how to round the value.
     * @param {?number} step  The step size.
     */
    setStep(step: number | null): void;
    /**
     * Rounds to the closest step using the minimum value as the base.
     * @param {number} value  The number to round.
     * @return {number} The number rounded to the closest step.
     */
    roundToStepWithMin(value: number): number;
    /**
     * Rounds to the closest step.
     * @param {number} value  The number to round.
     * @return {number} The number rounded to the closest step.
     */
    roundToStep(value: number): number;
}
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
