/**
 * @fileoverview A timer class to which other classes and objects can listen on.
 * This is only an abstraction above `setInterval`.
 *
 * @see ../demos/timers.html
 */
/**
 * Class for handling timing events.
 *
 *     `setInterval`, `clearTimeout` and `clearInterval`
 *     (e.g., `window`).
 * @extends {EventsEventTarget}
 */
export class Timer extends EventsEventTarget {
    /**
     * Class for handling timing events.
     *
     * @param {number=} opt_interval Number of ms between ticks (default: 1ms).
     * @param {Object=} opt_timerObject  An object that has `setTimeout`,
     *     `setInterval`, `clearTimeout` and `clearInterval`
     *     (e.g., `window`).
     */
    constructor(opt_interval?: number | undefined, opt_timerObject?: any);
    /**
     * Whether this timer is enabled
     * @type {boolean}
     */
    enabled: boolean;
    /**
     * Variable for storing the result of `setInterval`.
     * @private
      * @type {?number}
     */
    timer_: number | null;
    /**
     * Number of ms between ticks
     * @private {number}
     */
    interval_: number;
    /**
     * An object that implements `setTimeout`, `setInterval`,
     * `clearTimeout` and `clearInterval`. We default to the window
     * object. Changing this on {@link Timer.prototype} changes the object
     * for all timer instances which can be useful if your environment has some
     * other implementation of timers than the `window` object.
     * @private {{setTimeout:!Function, clearTimeout:!Function}}
     */
    timerObject_: {
        setTimeout: any;
        clearTimeout: any;
    };
    /**
     * Cached `tick_` bound to the object for later use in the timer.
     * @private {Function}
     * @const
     */
    boundTick_: any;
    /**
     * Firefox browser often fires the timer event sooner (sometimes MUCH sooner)
     * than the requested timeout. So we compare the time to when the event was
     * last fired, and reschedule if appropriate. See also
     * {@link Timer.intervalScale}.
     * @private {number}
     */
    last_: number;
    /**
     * Gets the interval of the timer.
     * @return {number} interval Number of ms between ticks.
     */
    getInterval(): number;
    /**
     * Sets the interval of the timer.
     * @param {number} interval Number of ms between ticks.
     */
    setInterval(interval: number): void;
    /**
     * Callback for the `setTimeout` used by the timer.
     * @private
     */
    tick_(): void;
    /**
     * Dispatches the TICK event. This is its own method so subclasses can override.
     */
    dispatchTick(): void;
    /**
     * Starts the timer.
     */
    start(): void;
    /**
     * Stops the timer.
     */
    stop(): void;
    actualEventTarget_: Timer;
}
export namespace Timer {
    export const MAX_TIMEOUT_: number;
    export const INVALID_TIMEOUT_ID_: number;
    export const defaultTimerObject: {
        setTimeout;
        clearTimeout;
    };
    export const intervalScale: number;
    export const TICK: string;
}
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
