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
     * Calls the given function once, after the optional pause.
     * <p>
     * The function is always called asynchronously, even if the delay is 0. This
     * is a common trick to schedule a function to run after a batch of browser
     * event processing.
     *
     * @param {function(this:SCOPE)|{handleEvent:function()}|null} listener Function
     *     or object that has a handleEvent method.
     * @param {number=} opt_delay Milliseconds to wait; default is 0.
     * @param {SCOPE=} opt_handler Object in whose scope to call the listener.
     * @return {number} A handle to the timer ID.
     * @template SCOPE
     * @suppress{checkTypes}
     */
    static callOnce<SCOPE>(listener: {
        handleEvent: () => void;
    } | ((this: SCOPE) => any) | null, opt_delay?: number | undefined, opt_handler?: SCOPE | undefined): number;
    /**
     * Clears a timeout initiated by {@link #callOnce}.
     * @param {?number} timerId A timer ID.
     */
    static clear(timerId: number | null): void;
    /**
     * @param {number} delay Milliseconds to wait.
     * @param {(RESULT|Thenable<RESULT>|Thenable)=} opt_result The value
     *     with which the promise will be resolved.
     * @return {!GoogPromise<RESULT>} A promise that will be resolved after
     *     the specified delay, unless it is canceled first.
     * @template RESULT
     */
    static promise<RESULT>(delay: number, opt_result?: Thenable<any> | RESULT | Thenable<RESULT> | undefined): GoogPromise<RESULT, any>;
    /**
     * Class for handling timing events.
     *
     * @param {number=} opt_interval Number of ms between ticks (default: 1ms).
     * @param {Object=} opt_timerObject  An object that has `setTimeout`,
     *     `setInterval`, `clearTimeout` and `clearInterval`
     *     (e.g., `window`).
     */
    constructor(opt_interval?: number | undefined, opt_timerObject?: any | undefined);
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
    private timer_;
    /**
     * Number of ms between ticks
     * @private {number}
     */
    private interval_;
    /**
     * An object that implements `setTimeout`, `setInterval`,
     * `clearTimeout` and `clearInterval`. We default to the window
     * object. Changing this on {@link Timer.prototype} changes the object
     * for all timer instances which can be useful if your environment has some
     * other implementation of timers than the `window` object.
     * @private {{setTimeout:!Function, clearTimeout:!Function}}
     */
    private timerObject_;
    /**
     * Cached `tick_` bound to the object for later use in the timer.
     * @private {Function}
     * @const
     */
    private boundTick_;
    /**
     * Firefox browser often fires the timer event sooner (sometimes MUCH sooner)
     * than the requested timeout. So we compare the time to when the event was
     * last fired, and reschedule if appropriate. See also
     * {@link Timer.intervalScale}.
     * @private {number}
     */
    private last_;
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
    private tick_;
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
import { Thenable } from "../promise/promise.js";
import { Promise as GoogPromise } from "../promise/promise.js";
