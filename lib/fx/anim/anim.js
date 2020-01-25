import {AnimationDelay} from './../../async/animationdelay.js';
import {Delay} from './../../async/delay.js';
import {dispose} from './../../disposable/disposable.js';
import * as google from './../../google.js';
import * as object from './../../object/object.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Basic animation controls.
 */

/**
 * An interface for programatically animated objects. I.e. rendered in
 * javascript frame by frame.
 *
 * @interface
 */
class Animated {

  /**
   * An interface for programatically animated objects. I.e. rendered in
   * javascript frame by frame.
   *
   */
  constructor() {}

  /**
   * Function called when a frame is requested for the animation.
   *
   * @param {number} now Current time in milliseconds.
   */
  onAnimationFrame(now) {}
}

/**
 * Default wait timeout for animations (in milliseconds).  Only used for timed
 * animation, which uses a timer (setTimeout) to schedule animation.
 *
 * @type {number}
 * @const
 */
let TIMEOUT = AnimationDelay.TIMEOUT;

/**
 * A map of animations which should be cycled on the global timer.
 *
 * @type {!Object<number, Animated>}
 * @private
 */
let activeAnimations_ = {};

/**
 * An optional animation window.
 * @type {?Window}
 * @private
 */
let animationWindow_ = null;

/**
 * An interval ID for the global timer or event handler uid.
 * @type {?Delay|?AnimationDelay}
 * @private
 */
let animationDelay_ = null;

/**
 * Registers an animation to be cycled on the global timer.
 * @param {Animated} animation The animation to register.
 */
function registerAnimation(animation) {
  var uid = google.getUid(animation);
  if (!(uid in activeAnimations_)) {
    activeAnimations_[uid] = animation;
  }

  // If the timer is not already started, start it now.
  requestAnimationFrame_();
};

/**
 * Removes an animation from the list of animations which are cycled on the
 * global timer.
 * @param {Animated} animation The animation to unregister.
 */
function unregisterAnimation(animation) {
  var uid = google.getUid(animation);
  delete activeAnimations_[uid];

  // If a timer is running and we no longer have any active timers we stop the
  // timers.
  if (object.isEmpty(activeAnimations_)) {
    cancelAnimationFrame_();
  }
};

/**
 * Tears down this module. Useful for testing.
 */
// TODO(nicksantos): Wow, this api is pretty broken. This should be fixed.
function tearDown() {
  animationWindow_ = null;
  dispose(animationDelay_);
  animationDelay_ = null;
  activeAnimations_ = {};
};

/**
 * Registers an animation window. This allows usage of the timing control API
 * for animations. Note that this window must be visible, as non-visible
 * windows can potentially stop animating. This window does not necessarily
 * need to be the window inside which animation occurs, but must remain visible.
 * See: https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame.
 *
 * @param {Window} animationWindow The window in which to animate elements.
 */
function setAnimationWindow(animationWindow) {
  // If a timer is currently running, reset it and restart with new functions
  // after a timeout. This is to avoid mismatching timer UIDs if we change the
  // animation window during a running animation.
  //
  // In practice this cannot happen before some animation window and timer
  // control functions has already been set.
  var hasTimer =
      animationDelay_ && animationDelay_.isActive();

  dispose(animationDelay_);
  animationDelay_ = null;
  animationWindow_ = animationWindow;

  // If the timer was running, start it again.
  if (hasTimer) {
    requestAnimationFrame_();
  }
};

/**
 * Requests an animation frame based on the requestAnimationFrame and
 * cancelRequestAnimationFrame function pair.
 * @private
 */
function requestAnimationFrame_() {
  if (!animationDelay_) {
    // We cannot guarantee that the global window will be one that fires
    // requestAnimationFrame events (consider off-screen chrome extension
    // windows). Default to use Delay, unless
    // the client has explicitly set an animation window.
    if (animationWindow_) {
      // requestAnimationFrame will call cycleAnimations_ with the current
      // time in ms, as returned from google.now().
      animationDelay_ =
          new AnimationDelay(function(now) {
            cycleAnimations_(now);
          }, animationWindow_);
    } else {
      animationDelay_ = new Delay(function() {
        cycleAnimations_(google.now());
      }, TIMEOUT);
    }
  }

  var delay = animationDelay_;
  if (!delay.isActive()) {
    delay.start();
  }
};

/**
 * Cancels an animation frame created by requestAnimationFrame_().
 * @private
 */
function cancelAnimationFrame_() {
  if (animationDelay_) {
    animationDelay_.stop();
  }
};

/**
 * Cycles through all registered animations.
 * @param {number} now Current time in milliseconds.
 * @private
 */
function cycleAnimations_(now) {
  object.forEach(activeAnimations_, function(anim) {
    anim.onAnimationFrame(now);
  });

  if (!object.isEmpty(activeAnimations_)) {
    requestAnimationFrame_();
  }
};

export {Animated, TIMEOUT, registerAnimation, setAnimationWindow, tearDown, unregisterAnimation};