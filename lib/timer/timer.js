import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import * as google from './../google.js';
import {Thenable} from './../promise/thenable.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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
class Timer extends EventsEventTarget {

  /**
   * Class for handling timing events.
   *
   * @param {number=} opt_interval Number of ms between ticks (default: 1ms).
   * @param {Object=} opt_timerObject  An object that has `setTimeout`,
   *     `setInterval`, `clearTimeout` and `clearInterval`
   *     (e.g., `window`).
   */
  constructor(opt_interval, opt_timerObject) {
    super();
    /**
     * Whether this timer is enabled
     * @type {boolean}
     */
    this.enabled = false;
  
    /**
     * Variable for storing the result of `setInterval`.
     * @private
      * @type {?number}
     */
    this.timer_ = null;
  
  
    /**
     * Number of ms between ticks
     * @private {number}
     */
    this.interval_ = opt_interval || 1;
  
    /**
     * An object that implements `setTimeout`, `setInterval`,
     * `clearTimeout` and `clearInterval`. We default to the window
     * object. Changing this on {@link Timer.prototype} changes the object
     * for all timer instances which can be useful if your environment has some
     * other implementation of timers than the `window` object.
     * @private {{setTimeout:!Function, clearTimeout:!Function}}
     */
    this.timerObject_ = /** @type {{setTimeout, clearTimeout}} */ (
        opt_timerObject || Timer.defaultTimerObject);
  
    /**
     * Cached `tick_` bound to the object for later use in the timer.
     * @private {Function}
     * @const
     */
    this.boundTick_ = google.bind(this.tick_, this);
  
    /**
     * Firefox browser often fires the timer event sooner (sometimes MUCH sooner)
     * than the requested timeout. So we compare the time to when the event was
     * last fired, and reschedule if appropriate. See also
     * {@link Timer.intervalScale}.
     * @private {number}
     */
    this.last_ = google.now();
  }

  /**
   * Gets the interval of the timer.
   * @return {number} interval Number of ms between ticks.
   */
  getInterval() {
    return this.interval_;
  };

  /**
   * Sets the interval of the timer.
   * @param {number} interval Number of ms between ticks.
   */
  setInterval(interval) {
    this.interval_ = interval;
    if (this.timer_ && this.enabled) {
      // Stop and then start the timer to reset the interval.
      this.stop();
      this.start();
    } else if (this.timer_) {
      this.stop();
    }
  };

  /**
   * Callback for the `setTimeout` used by the timer.
   * @private
   */
  tick_() {
    if (this.enabled) {
      var elapsed = google.now() - this.last_;
      if (elapsed > 0 && elapsed < this.interval_ * Timer.intervalScale) {
        this.timer_ = this.timerObject_.setTimeout(
            this.boundTick_, this.interval_ - elapsed);
        return;
      }
  
      // Prevents setInterval from registering a duplicate timeout when called
      // in the timer event handler.
      if (this.timer_) {
        this.timerObject_.clearTimeout(this.timer_);
        this.timer_ = null;
      }
  
      this.dispatchTick();
      // The timer could be stopped in the timer event handler.
      if (this.enabled) {
        // Stop and start to ensure there is always only one timeout even if
        // start is called in the timer event handler.
        this.stop();
        this.start();
      }
    }
  };

  /**
   * Dispatches the TICK event. This is its own method so subclasses can override.
   */
  dispatchTick() {
    this.dispatchEvent(Timer.TICK);
  };

  /**
   * Starts the timer.
   */
  start() {
    this.enabled = true;
  
    // If there is no interval already registered, start it now
    if (!this.timer_) {
      // IMPORTANT!
      // window.setInterval in FireFox has a bug - it fires based on
      // absolute time, rather than on relative time. What this means
      // is that if a computer is sleeping/hibernating for 24 hours
      // and the timer interval was configured to fire every 1000ms,
      // then after the PC wakes up the timer will fire, in rapid
      // succession, 3600*24 times.
      // This bug is described here and is already fixed, but it will
      // take time to propagate, so for now I am switching this over
      // to setTimeout logic.
      //     https://bugzilla.mozilla.org/show_bug.cgi?id=376643
      //
      this.timer_ = this.timerObject_.setTimeout(this.boundTick_, this.interval_);
      this.last_ = google.now();
    }
  };

  /**
   * Stops the timer.
   */
  stop() {
    this.enabled = false;
    if (this.timer_) {
      this.timerObject_.clearTimeout(this.timer_);
      this.timer_ = null;
    }
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    this.stop();
    delete this.timerObject_;
  };

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
  static callOnce(listener, opt_delay, opt_handler) {
    if (typeof listener === 'function') {
      if (opt_handler) {
        listener = google.bind(listener, opt_handler);
      }
    } else if (listener && typeof listener.handleEvent == 'function') {
      // using typeof to prevent strict js warning
      listener = google.bind(listener.handleEvent, listener);
    } else {
      throw new Error('Invalid listener argument');
    }
  
    if (Number(opt_delay) > Timer.MAX_TIMEOUT_) {
      // Timeouts greater than MAX_INT return immediately due to integer
      // overflow in many browsers.  Since MAX_INT is 24.8 days, just don't
      // schedule anything at all.
      return Timer.INVALID_TIMEOUT_ID_;
    } else {
      return Timer.defaultTimerObject.setTimeout(listener, opt_delay || 0);
    }
  };

  /**
   * Clears a timeout initiated by {@link #callOnce}.
   * @param {?number} timerId A timer ID.
   */
  static clear(timerId) {
    Timer.defaultTimerObject.clearTimeout(timerId);
  };

  /**
   * @param {number} delay Milliseconds to wait.
   * @param {(RESULT|Thenable)=} opt_result The value
   *     with which the promise will be resolved.
   * @return {!Promise<RESULT>} A promise that will be resolved after
   *     the specified delay, unless it is canceled first.
   * @template RESULT
   */
  static promise(delay, opt_result) {
    var timerKey = null;
    return new Promise(function(resolve, reject) {
          timerKey = Timer.callOnce(function() {
            resolve(opt_result);
          }, delay);
          if (timerKey == Timer.INVALID_TIMEOUT_ID_) {
            reject(new Error('Failed to schedule timer.'));
          }
        })
        .catch(function(error) {
          // Clear the timer. The most likely reason is "cancel" signal.
          Timer.clear(timerKey);
          throw error;
        });
  };
}

/**
 * Maximum timeout value.
 *
 * Timeout values too big to fit into a signed 32-bit integer may cause overflow
 * in FF, Safari, and Chrome, resulting in the timeout being scheduled
 * immediately. It makes more sense simply not to schedule these timeouts, since
 * 24.8 days is beyond a reasonable expectation for the browser to stay open.
 *
 * @private {number}
 * @const
 */
Timer.MAX_TIMEOUT_ = 2147483647;

/**
 * A timer ID that cannot be returned by any known implementation of
 * `window.setTimeout`. Passing this value to `window.clearTimeout`
 * should therefore be a no-op.
 *
 * @private {number}
 * @const
 */
Timer.INVALID_TIMEOUT_ID_ = -1;

/**
 * An object that implements `setTimeout`, `setInterval`,
 * `clearTimeout` and `clearInterval`. We default to the global
 * object. Changing `Timer.defaultTimerObject` changes the object for
 * all timer instances which can be useful if your environment has some other
 * implementation of timers you'd like to use.
 * @type {{setTimeout, clearTimeout}}
 */
Timer.defaultTimerObject = window;

/**
 * Variable that controls the timer error correction. If the timer is called
 * before the requested interval times `intervalScale`, which often
 * happens on Mozilla, the timer is rescheduled.
 * @see {@link #last_}
 * @type {number}
 */
Timer.intervalScale = 0.8;

/**
 * Constant for the timer's event type.
 * @const
 */
Timer.TICK = 'tick';

export {Timer};