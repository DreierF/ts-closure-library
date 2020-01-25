/**
 * @fileoverview Defines a class useful for handling functions that must be
 * invoked after a delay, especially when that delay is frequently restarted.
 * Examples include delaying before displaying a tooltip, menu hysteresis,
 * idle timers, etc.
 * @see ../demos/timers.html
 */
/**
 * A Delay object invokes the associated function after a specified delay. The
 * interval duration can be specified once in the constructor, or can be defined
 * each time the delay is started. Calling start on an active delay will reset
 * the timer.
 *
 *     delay completes.
 *     milliseconds).
 * @template THIS
 * @class
 * @extends {Disposable}
 * @final
 */
export class Delay<THIS> extends Disposable {
    /**
     * A Delay object invokes the associated function after a specified delay. The
     * interval duration can be specified once in the constructor, or can be defined
     * each time the delay is started. Calling start on an active delay will reset
     * the timer.
     *
     * @param {function(this:THIS)} listener Function to call when the
     *     delay completes.
     * @param {number=} opt_interval The default length of the invocation delay (in
     *     milliseconds).
     * @param {THIS=} opt_handler The object scope to invoke the function in.
     * @template THIS
     */
    constructor(listener: (this: THIS) => any, opt_interval?: number, opt_handler?: THIS);
    /**
     * Identifier of the active delay timeout, or 0 when inactive.
     * @type {number}
     * @private
     */
    id_: number;
    /**
     * The function that will be invoked after a delay.
     * @private {function(this:THIS)}
     */
    listener_: (this: THIS) => any;
    /**
     * The default amount of time to delay before invoking the callback.
     * @type {number}
     * @private
     */
    interval_: number;
    /**
     * The object context to invoke the callback in.
     * @type {Object|undefined}
     * @private
     */
    handler_: Object | undefined;
    /**
     * Cached callback function invoked when the delay finishes.
     * @type {?Function}
     * @private
     */
    callback_: Function | null;
    /**
     * Starts the delay timer. The provided listener function will be called after
     * the specified interval. Calling start on an active timer will reset the
     * delay interval.
     * @param {number=} opt_interval If specified, overrides the object's default
     *     interval with this one (in milliseconds).
     */
    start(opt_interval?: number): void;
    /**
     * Starts the delay timer if it's not already active.
     * @param {number=} opt_interval If specified and the timer is not already
     *     active, overrides the object's default interval with this one (in
     *     milliseconds).
     */
    startIfNotActive(opt_interval?: number): void;
    /**
     * Stops the delay timer if it is active. No action is taken if the timer is not
     * in use.
     */
    stop(): void;
    /**
     * Fires delay's action even if timer has already gone off or has not been
     * started yet; guarantees action firing. Stops the delay timer.
     */
    fire(): void;
    /**
     * Fires delay's action only if timer is currently active. Stops the delay
     * timer.
     */
    fireIfActive(): void;
    /**
     * @return {boolean} True if the delay is currently active, false otherwise.
     */
    isActive(): boolean;
    /**
     * Invokes the callback function after the delay successfully completes.
     * @private
     */
    doAction_(): void;
}
import { Disposable } from "../disposable/disposable.js";
