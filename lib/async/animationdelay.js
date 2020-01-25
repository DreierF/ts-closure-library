import {Disposable} from './../disposable/disposable.js';
import * as events from './../events/eventhandler.js';
import {Key} from './../events/eventhandler.js';
import * as goog_functions from './../functions/functions.js';
import * as google from './../google.js';
// Copyright 2012 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview A delayed callback that pegs to the next animation frame
 * instead of a user-configurable timeout.
 */

// TODO(nicksantos): Should we factor out the common code between this and
// goog.async.Delay? I'm not sure if there's enough code for this to really
// make sense. Subclassing seems like the wrong approach for a variety of
// reasons. Maybe there should be a common interface?

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
class AnimationDelay extends Disposable {

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
  constructor(listener, opt_window, opt_handler) {
    super();
  
    /**
     * Identifier of the active delay timeout, or event listener,
     * or null when inactive.
     * @private {?Key|number}
     */
    this.id_ = null;
  
    /**
     * If we're using dom listeners.
     * @private {?boolean}
     */
    this.usingListeners_ = false;
  
    /**
     * The function that will be invoked after a delay.
     * @const
     * @private
     */
    this.listener_ = listener;
  
    /**
     * The object context to invoke the callback in.
     * @const
     * @private {(THIS|undefined)}
     */
    this.handler_ = opt_handler;
  
    /**
     * @private {Window}
     */
    this.win_ = opt_window || window;
  
    /**
     * Cached callback function invoked when the delay finishes.
     * @private {function()}
     */
    this.callback_ = google.bind(this.doAction_, this);
  }

  /**
   * Starts the delay timer. The provided listener function will be called
   * before the next animation frame.
   */
  start() {
    this.stop();
    this.usingListeners_ = false;
  
    var raf = this.getRaf_();
    var cancelRaf = this.getCancelRaf_();
    if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {
      // Because Firefox (Gecko) runs animation in separate threads, it also saves
      // time by running the requestAnimationFrame callbacks in that same thread.
      // Sadly this breaks the assumption of implicit thread-safety in JS, and can
      // thus create thread-based inconsistencies on counters etc.
      //
      // Calling cycleAnimations_ using the MozBeforePaint event instead of as
      // callback fixes this.
      //
      // Trigger this condition only if the mozRequestAnimationFrame is available,
      // but not the W3C requestAnimationFrame function (as in draft) or the
      // equivalent cancel functions.
      this.id_ = events.listen(
          this.win_, AnimationDelay.MOZ_BEFORE_PAINT_EVENT_,
          this.callback_);
      this.win_.mozRequestAnimationFrame(null);
      this.usingListeners_ = true;
    } else if (raf && cancelRaf) {
      this.id_ = raf.call(this.win_, this.callback_);
    } else {
      this.id_ = this.win_.setTimeout(
          // Prior to Firefox 13, Gecko passed a non-standard parameter
          // to the callback that we want to ignore.
          goog_functions.lock(this.callback_), AnimationDelay.TIMEOUT);
    }
  };

  /**
   * Starts the delay timer if it's not already active.
   */
  startIfNotActive() {
    if (!this.isActive()) {
      this.start();
    }
  };

  /**
   * Stops the delay timer if it is active. No action is taken if the timer is not
   * in use.
   */
  stop() {
    if (this.isActive()) {
      var raf = this.getRaf_();
      var cancelRaf = this.getCancelRaf_();
      if (raf && !cancelRaf && this.win_.mozRequestAnimationFrame) {
        events.unlistenByKey(this.id_);
      } else if (raf && cancelRaf) {
        cancelRaf.call(this.win_, /** @type {number} */ (this.id_));
      } else {
        this.win_.clearTimeout(/** @type {number} */ (this.id_));
      }
    }
    this.id_ = null;
  };

  /**
   * Fires delay's action even if timer has already gone off or has not been
   * started yet; guarantees action firing. Stops the delay timer.
   */
  fire() {
    this.stop();
    this.doAction_();
  };

  /**
   * Fires delay's action only if timer is currently active. Stops the delay
   * timer.
   */
  fireIfActive() {
    if (this.isActive()) {
      this.fire();
    }
  };

  /**
   * @return {boolean} True if the delay is currently active, false otherwise.
   */
  isActive() {
    return this.id_ != null;
  };

  /**
   * Invokes the callback function after the delay successfully completes.
   * @private
   */
  doAction_() {
    if (this.usingListeners_ && this.id_) {
      events.unlistenByKey(this.id_);
    }
    this.id_ = null;
  
    // We are not using the timestamp returned by requestAnimationFrame
    // because it may be either a Date.now-style time or a
    // high-resolution time (depending on browser implementation). Using
    // google.now() will ensure that the timestamp used is consistent and
    // compatible with goog.fx.Animation.
    this.listener_.call(this.handler_, google.now());
  };

  /** @override */
  disposeInternal() {
    this.stop();
    super.disposeInternal();
  };

  /**
   * @return {?function(function(number)): number} The requestAnimationFrame
   *     function, or null if not available on this browser.
   * @private
   */
  getRaf_() {
    var win = this.win_;
    return win.requestAnimationFrame || win.webkitRequestAnimationFrame ||
        win.mozRequestAnimationFrame || win.oRequestAnimationFrame ||
        win.msRequestAnimationFrame || null;
  };

  /**
   * @return {?function(number): undefined} The cancelAnimationFrame function,
   *     or null if not available on this browser.
   * @private
   */
  getCancelRaf_() {
    var win = this.win_;
    return win.cancelAnimationFrame || win.cancelRequestAnimationFrame ||
        win.webkitCancelRequestAnimationFrame ||
        win.mozCancelRequestAnimationFrame || win.oCancelRequestAnimationFrame ||
        win.msCancelRequestAnimationFrame || null;
  };
}

/**
 * Default wait timeout for animations (in milliseconds).  Only used for timed
 * animation, which uses a timer (setTimeout) to schedule animation.
 *
 * @type {number}
 * @const
 */
AnimationDelay.TIMEOUT = 20;

/**
 * Name of event received from the requestAnimationFrame in Firefox.
 *
 * @type {string}
 * @const
 * @private
 */
AnimationDelay.MOZ_BEFORE_PAINT_EVENT_ = 'MozBeforePaint';

export {AnimationDelay};