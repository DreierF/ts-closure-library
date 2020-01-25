import {Disposable} from './../disposable/disposable.js';
import * as google from './../google.js';
import {Timer} from './../timer/timer.js';
// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
class Delay extends Disposable {

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
  constructor(listener, opt_interval, opt_handler) {
    super();
    /**
     * Identifier of the active delay timeout, or 0 when inactive.
     * @type {number}
     * @private
     */
    this.id_ = 0;
  
  
    /**
     * The function that will be invoked after a delay.
     * @private {function(this:THIS)}
     */
    this.listener_ = listener;
  
    /**
     * The default amount of time to delay before invoking the callback.
     * @type {number}
     * @private
     */
    this.interval_ = opt_interval || 0;
  
    /**
     * The object context to invoke the callback in.
     * @type {Object|undefined}
     * @private
     */
    this.handler_ = opt_handler;
  
  
    /**
     * Cached callback function invoked when the delay finishes.
     * @type {Function}
     * @private
     */
    this.callback_ = google.bind(this.doAction_, this);
  }

  /**
   * Disposes of the object, cancelling the timeout if it is still outstanding and
   * removing all object references.
   * @override
   * @protected
   */
  disposeInternal() {
    super.disposeInternal();
    this.stop();
    delete this.listener_;
    delete this.handler_;
  };

  /**
   * Starts the delay timer. The provided listener function will be called after
   * the specified interval. Calling start on an active timer will reset the
   * delay interval.
   * @param {number=} opt_interval If specified, overrides the object's default
   *     interval with this one (in milliseconds).
   */
  start(opt_interval) {
    this.stop();
    this.id_ = Timer.callOnce(
        this.callback_,
        opt_interval !== undefined ? opt_interval : this.interval_);
  };

  /**
   * Starts the delay timer if it's not already active.
   * @param {number=} opt_interval If specified and the timer is not already
   *     active, overrides the object's default interval with this one (in
   *     milliseconds).
   */
  startIfNotActive(opt_interval) {
    if (!this.isActive()) {
      this.start(opt_interval);
    }
  };

  /**
   * Stops the delay timer if it is active. No action is taken if the timer is not
   * in use.
   */
  stop() {
    if (this.isActive()) {
      Timer.clear(this.id_);
    }
    this.id_ = 0;
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
    return this.id_ != 0;
  };

  /**
   * Invokes the callback function after the delay successfully completes.
   * @private
   */
  doAction_() {
    this.id_ = 0;
    if (this.listener_) {
      this.listener_.call(this.handler_);
    }
  };
}

export {Delay};