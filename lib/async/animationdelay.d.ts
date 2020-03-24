/**
 * @fileoverview A delayed callback that pegs to the next animation frame
 * instead of a user-configurable timeout.
 */
/**
 * A delayed callback that pegs to the next animation frame
 * instead of a user configurable timeout. By design, this should have
 * the same interface as goog.async.Delay.
 *
 * Uses requestAnimationFrame and friends when available, but falls
 * back to a timeout of AnimationDelay.TIMEOUT.
 *
 * For more on requestAnimationFrame and how you can use it to create smoother
 * animations, see:
 * @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 *
 *     when the delay completes. Will be passed the timestamp when it's called,
 *     in unix ms.
 *     Defaults to the global object.
 * @template THIS
 * @class
 * @extends {Disposable}
 * @final
 */
export class AnimationDelay<THIS> extends Disposable {
    /**
     * A delayed callback that pegs to the next animation frame
     * instead of a user configurable timeout. By design, this should have
     * the same interface as goog.async.Delay.
     *
     * Uses requestAnimationFrame and friends when available, but falls
     * back to a timeout of AnimationDelay.TIMEOUT.
     *
     * For more on requestAnimationFrame and how you can use it to create smoother
     * animations, see:
     * @see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     *
     * @param {function(this:THIS, number)} listener Function to call
     *     when the delay completes. Will be passed the timestamp when it's called,
     *     in unix ms.
     * @param {Window=} opt_window The window object to execute the delay in.
     *     Defaults to the global object.
     * @param {THIS=} opt_handler The object scope to invoke the function in.
     * @template THIS
     */
    constructor(listener: (this: THIS, arg1: number) => any, opt_window?: Window | undefined, opt_handler?: THIS | undefined);
    /**
     * Identifier of the active delay timeout, or event listener,
     * or null when inactive.
     * @private {?Key|number}
     */
    id_: any;
    /**
     * If we're using dom listeners.
     * @private {?boolean}
     */
    usingListeners_: boolean;
    /**
     * The function that will be invoked after a delay.
     * @const
     * @private
     */
    listener_: (this: THIS, arg1: number) => any;
    /**
     * The object context to invoke the callback in.
     * @const
     * @private {(THIS|undefined)}
     */
    handler_: THIS | undefined;
    /**
     * @private {Window}
     */
    win_: Window;
    /**
     * Cached callback function invoked when the delay finishes.
     * @private {function()}
     */
    callback_: any;
    /**
     * Starts the delay timer. The provided listener function will be called
     * before the next animation frame.
     */
    start(): void;
    /**
     * Starts the delay timer if it's not already active.
     */
    startIfNotActive(): void;
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
    /**
     * @return {?function(function(number)): number} The requestAnimationFrame
     *     function, or null if not available on this browser.
     * @private
     */
    getRaf_(): ((arg0: (arg0: number) => any) => number) | null;
    /**
     * @return {?function(number): undefined} The cancelAnimationFrame function,
     *     or null if not available on this browser.
     * @private
     */
    getCancelRaf_(): ((arg0: number) => undefined) | null;
}
export namespace AnimationDelay {
    export const TIMEOUT: number;
    export const MOZ_BEFORE_PAINT_EVENT_: string;
}
import { Disposable } from "../disposable/disposable.js";
