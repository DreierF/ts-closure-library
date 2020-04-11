import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import {Event as EventsEvent} from './../events/event.js';
import * as google from './../google.js';
import * as fx_anim from './anim/anim.js';
import {Animated} from './anim/anim.js';
import {Transition} from './transition.js';
import {EventType as TransitionEventType} from './transition.js';
import {TransitionBase} from './transitionbase.js';
import {State as TransitionBaseState} from './transitionbase.js';
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
 * @fileoverview Classes for doing animations and visual effects.
 *
 * (Based loosly on my animation code for 13thparallel.org, with extra
 * inspiration from the DojoToolkit's modifications to my code)
 */

/**
 * Constructor for an animation object.
 * @class
 * @implements {Animated}
 * @implements {Transition}
 * @extends {TransitionBase}
 */
class Animation extends TransitionBase {

  /**
   * Constructor for an animation object.
   * @param {Array<number>} start Array for start coordinates.
   * @param {Array<number>} end Array for end coordinates.
   * @param {number} duration Length of animation in milliseconds.
   * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
   */
  constructor(start, end, duration, opt_acc) {
    super();
  
    if (!google.isArray(start) || !google.isArray(end)) {
      throw new Error('Start and end parameters must be arrays');
    }
  
    if (start.length != end.length) {
      throw new Error('Start and end points must be the same length');
    }
  
    /**
     * Start point.
     * @type {Array<number>}
     * @protected
     */
    this.startPoint = start;
  
    /**
     * End point.
     * @type {Array<number>}
     * @protected
     */
    this.endPoint = end;
  
    /**
     * Duration of animation in milliseconds.
     * @type {number}
     * @protected
     */
    this.duration = duration;
  
    /**
     * Acceleration function, which must return a number between 0 and 1 for
     * inputs between 0 and 1.
     * @type {Function|undefined}
     * @private
     */
    this.accel_ = opt_acc;
  
    /**
     * Current coordinate for animation.
     * @type {Array<number>}
     * @protected
     */
    this.coords = [];
  
    /**
     * Whether the animation should use "right" rather than "left" to position
     * elements in RTL.  This is a temporary flag to allow clients to transition
     * to the new behavior at their convenience.  At some point it will be the
     * default.
     * @type {boolean}
     * @private
     */
    this.useRightPositioningForRtl_ = false;
  
    /**
     * Current frame rate.
     * @private {number}
     */
    this.fps_ = 0;
  
    /**
     * Percent of the way through the animation.
     * @protected {number}
     */
    this.progress = 0;
  
    /**
     * Timestamp for when last frame was run.
     * @protected {?number}
     */
    this.lastFrame = null;
  }

  /**
   * @return {number} The duration of this animation in milliseconds.
   */
  getDuration() {
    return this.duration;
  };

  /**
   * Sets whether the animation should use "right" rather than "left" to position
   * elements.  This is a temporary flag to allow clients to transition
   * to the new component at their convenience.  At some point "right" will be
   * used for RTL elements by default.
   * @param {boolean} useRightPositioningForRtl True if "right" should be used for
   *     positioning, false if "left" should be used for positioning.
   */
  enableRightPositioningForRtl(
      useRightPositioningForRtl) {
    this.useRightPositioningForRtl_ = useRightPositioningForRtl;
  };

  /**
   * Whether the animation should use "right" rather than "left" to position
   * elements.  This is a temporary flag to allow clients to transition
   * to the new component at their convenience.  At some point "right" will be
   * used for RTL elements by default.
   * @return {boolean} True if "right" should be used for positioning, false if
   *     "left" should be used for positioning.
   */
  isRightPositioningForRtlEnabled() {
    return this.useRightPositioningForRtl_;
  };

  /**
   * @deprecated Use fx_anim.setAnimationWindow.
   * @param {Window} animationWindow The window in which to animate elements.
   */
  static setAnimationWindow(animationWindow) {
    fx_anim.setAnimationWindow(animationWindow);
  };

  /**
   * Starts or resumes an animation.
   * @param {boolean=} opt_restart Whether to restart the
   *     animation from the beginning if it has been paused.
   * @return {boolean} Whether animation was started.
   * @override
   * @suppress {checkTypes}
   */
  play(opt_restart) {
    if (opt_restart || this.isStopped()) {
      this.progress = 0;
      this.coords = this.startPoint;
    } else if (this.isPlaying()) {
      return false;
    }
  
    fx_anim.unregisterAnimation(this);
  
    var now = /** @type {number} */ (google.now());
  
    this.startTime = now;
    if (this.isPaused()) {
      this.startTime -= this.duration * this.progress;
    }
  
    this.endTime = this.startTime + this.duration;
    this.lastFrame = this.startTime;
  
    if (!this.progress) {
      this.onBegin();
    }
  
    this.onPlay();
  
    if (this.isPaused()) {
      this.onResume();
    }
  
    this.setStatePlaying();
  
    fx_anim.registerAnimation(this);
    this.cycle(now);
  
    return true;
  };

  /**
   * Stops the animation.
   * @param {boolean=} opt_gotoEnd If true the animation will move to the
   *     end coords.
   * @override
   */
  stop(opt_gotoEnd) {
    fx_anim.unregisterAnimation(this);
    this.setStateStopped();
  
    if (opt_gotoEnd) {
      this.progress = 1;
    }
  
    this.updateCoords_(this.progress);
  
    this.onStop();
    this.onEnd();
  };

  /**
   * Pauses the animation (iff it's playing).
   * @override
   */
  pause() {
    if (this.isPlaying()) {
      fx_anim.unregisterAnimation(this);
      this.setStatePaused();
      this.onPause();
    }
  };

  /**
   * @return {number} The current progress of the animation, the number
   *     is between 0 and 1 inclusive.
   */
  getProgress() {
    return this.progress;
  };

  /**
   * Sets the progress of the animation.
   * @param {number} progress The new progress of the animation.
   */
  setProgress(progress) {
    this.progress = progress;
    if (this.isPlaying()) {
      var now = google.now();
      // If the animation is already playing, we recompute startTime and endTime
      // such that the animation plays consistently, that is:
      // now = startTime + progress * duration.
      this.startTime = now - this.duration * this.progress;
      this.endTime = this.startTime + this.duration;
    }
  };

  /**
   * Disposes of the animation.  Stops an animation, fires a 'destroy' event and
   * then removes all the event handlers to clean up memory.
   * @override
   * @protected
   */
  disposeInternal() {
    if (!this.isStopped()) {
      this.stop(false);
    }
    this.onDestroy();
    super.disposeInternal();
  };

  /**
   * Stops an animation, fires a 'destroy' event and then removes all the event
   * handlers to clean up memory.
   * @deprecated Use dispose() instead.
   */
  destroy() {
    this.dispose();
  };

  /** @override */
  onAnimationFrame(now) {
    this.cycle(now);
  };

  /**
   * Handles the actual iteration of the animation in a timeout
   * @param {number} now The current time.
   */
  cycle(now) {
    asserts.assertNumber(this.startTime);
    asserts.assertNumber(this.endTime);
    asserts.assertNumber(this.lastFrame);
    // Happens in rare system clock reset.
    if (now < this.startTime) {
      this.endTime = now + this.endTime - this.startTime;
      this.startTime = now;
    }
    this.progress = (now - this.startTime) / (this.endTime - this.startTime);
  
    if (this.progress > 1) {
      this.progress = 1;
    }
  
    this.fps_ = 1000 / (now - this.lastFrame);
    this.lastFrame = now;
  
    this.updateCoords_(this.progress);
  
    // Animation has finished.
    if (this.progress == 1) {
      this.setStateStopped();
      fx_anim.unregisterAnimation(this);
  
      this.onFinish();
      this.onEnd();
  
      // Animation is still under way.
    } else if (this.isPlaying()) {
      this.onAnimate();
    }
  };

  /**
   * Calculates current coordinates, based on the current state.  Applies
   * the acceleration function if it exists.
   * @param {number} t Percentage of the way through the animation as a decimal.
   * @private
   */
  updateCoords_(t) {
    if (google.isFunction(this.accel_)) {
      t = this.accel_(t);
    }
    this.coords = new Array(this.startPoint.length);
    for (var i = 0; i < this.startPoint.length; i++) {
      this.coords[i] =
          (this.endPoint[i] - this.startPoint[i]) * t + this.startPoint[i];
    }
  };

  /**
   * Dispatches the ANIMATE event. Sub classes should override this instead
   * of listening to the event.
   * @protected
   */
  onAnimate() {
    this.dispatchAnimationEvent(EventType.ANIMATE);
  };

  /**
   * Dispatches the DESTROY event. Sub classes should override this instead
   * of listening to the event.
   * @protected
   */
  onDestroy() {
    this.dispatchAnimationEvent(EventType.DESTROY);
  };

  /** @override */
  dispatchAnimationEvent(type) {
    this.dispatchEvent(new AnimationEvent(type, this));
  };
}

/**
 * Events fired by the animation.
 * @enum {string}
 */
let EventType = {
  /**
   * Dispatched when played for the first time OR when it is resumed.
   * @deprecated Use TransitionEventType.PLAY.
   */
  PLAY: TransitionEventType.PLAY,

  /**
   * Dispatched only when the animation starts from the beginning.
   * @deprecated Use TransitionEventType.BEGIN.
   */
  BEGIN: TransitionEventType.BEGIN,

  /**
   * Dispatched only when animation is restarted after a pause.
   * @deprecated Use TransitionEventType.RESUME.
   */
  RESUME: TransitionEventType.RESUME,

  /**
   * Dispatched when animation comes to the end of its duration OR stop
   * is called.
   * @deprecated Use TransitionEventType.END.
   */
  END: TransitionEventType.END,

  /**
   * Dispatched only when stop is called.
   * @deprecated Use TransitionEventType.STOP.
   */
  STOP: TransitionEventType.STOP,

  /**
   * Dispatched only when animation comes to its end naturally.
   * @deprecated Use TransitionEventType.FINISH.
   */
  FINISH: TransitionEventType.FINISH,

  /**
   * Dispatched when an animation is paused.
   * @deprecated Use TransitionEventType.PAUSE.
   */
  PAUSE: TransitionEventType.PAUSE,

  /**
   * Dispatched each frame of the animation.  This is where the actual animator
   * will listen.
   */
  ANIMATE: 'animate',

  /**
   * Dispatched when the animation is destroyed.
   */
  DESTROY: 'destroy'
};

/**
 * @deprecated Use fx_anim.TIMEOUT.
 */
Animation.TIMEOUT = fx_anim.TIMEOUT;

/**
 * Enum for the possible states of an animation.
 * @deprecated Use Transition.State instead.
 * @enum {number}
 */
let State = TransitionBaseState;

/**
 * Class for an animation event object.
 * @class
 * @extends {EventsEvent}
 */
class AnimationEvent extends EventsEvent {

  /**
   * Class for an animation event object.
   * @param {string} type Event type.
   * @param {Animation} anim An animation object.
   */
  constructor(type, anim) {
    super(type);
  
    /**
     * The current coordinates.
     * @type {Array<number>}
     */
    this.coords = anim.coords;
  
    /**
     * The x coordinate.
     * @type {number}
     */
    this.x = anim.coords[0];
  
    /**
     * The y coordinate.
     * @type {number}
     */
    this.y = anim.coords[1];
  
    /**
     * The z coordinate.
     * @type {number}
     */
    this.z = anim.coords[2];
  
    /**
     * The current duration.
     * @type {number}
     */
    this.duration = anim.duration;
  
    /**
     * The current progress.
     * @type {number}
     */
    this.progress = anim.getProgress();
  
    /**
     * Frames per second so far.
     */
    this.fps = anim.fps_;
  
    /**
     * The state of the animation.
     * @type {number}
     */
    this.state = anim.getStateInternal();
  
    /**
     * The animation object.
     * @type {Animation}
     */
    // TODO(arv): This can be removed as this is the same as the target
    this.anim = anim;
  }

  /**
   * Returns the coordinates as integers (rounded to nearest integer).
   * @return {!Array<number>} An array of the coordinates rounded to
   *     the nearest integer.
   */
  coordsAsInts() {
    return googarray.map(this.coords, Math.round);
  };
}

export {Animation, AnimationEvent, EventType, State};