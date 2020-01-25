import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {Transition as FxTransition} from './transition.js';
import {EventType} from './transition.js';
// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview An abstract base class for transitions. This is a simple
 * interface that allows for playing, pausing and stopping an animation. It adds
 * a simple event model, and animation status.
 */

  // Unreferenced: interface

/**
 * Constructor for a transition object.
 *
 * @class
 * @implements {FxTransition}
 * @extends {EventsEventTarget}
 * @suppress {checkTypes}
 * @abstract
 */
class TransitionBase extends EventsEventTarget {

  /**
   * Constructor for a transition object.
   *
   * @suppress {checkTypes}
   */
  constructor() {
    super();
  
    /**
     * The internal state of the animation.
     * @type {State}
     * @private
     */
    this.state_ = State.STOPPED;
  
    /**
     * Timestamp for when the animation was started.
     * @type {?number}
     * @protected
     */
    this.startTime = null;
  
    /**
     * Timestamp for when the animation finished or was stopped.
     * @type {?number}
     * @protected
     */
    this.endTime = null;
  }

  /**
   * Plays the animation.
   *
   * @param {boolean=} opt_restart Optional parameter to restart the animation.
   * @return {boolean} True iff the animation was started.
   * @override
   * @abstract
   */
  play(opt_restart) {}

  /**
   * Stops the animation.
   *
   * @param {boolean=} opt_gotoEnd Optional boolean parameter to go the the end of
   *     the animation.
   * @override
   * @abstract
   */
  stop(opt_gotoEnd) {}

  /**
   * Pauses the animation.
   * @abstract
   */
  pause() {}

  /**
   * Returns the current state of the animation.
   * @return {State} State of the animation.
   */
  getStateInternal() {
    return this.state_;
  };

  /**
   * Sets the current state of the animation to playing.
   * @protected
   */
  setStatePlaying() {
    this.state_ = State.PLAYING;
  };

  /**
   * Sets the current state of the animation to paused.
   * @protected
   */
  setStatePaused() {
    this.state_ = State.PAUSED;
  };

  /**
   * Sets the current state of the animation to stopped.
   * @protected
   */
  setStateStopped() {
    this.state_ = State.STOPPED;
  };

  /**
   * @return {boolean} True iff the current state of the animation is playing.
   */
  isPlaying() {
    return this.state_ == State.PLAYING;
  };

  /**
   * @return {boolean} True iff the current state of the animation is paused.
   */
  isPaused() {
    return this.state_ == State.PAUSED;
  };

  /**
   * @return {boolean} True iff the current state of the animation is stopped.
   */
  isStopped() {
    return this.state_ == State.STOPPED;
  };

  /**
   * Dispatches the BEGIN event. Sub classes should override this instead
   * of listening to the event, and call this instead of dispatching the event.
   * @protected
   */
  onBegin() {
    this.dispatchAnimationEvent(EventType.BEGIN);
  };

  /**
   * Dispatches the END event. Sub classes should override this instead
   * of listening to the event, and call this instead of dispatching the event.
   * @protected
   */
  onEnd() {
    this.dispatchAnimationEvent(EventType.END);
  };

  /**
   * Dispatches the FINISH event. Sub classes should override this instead
   * of listening to the event, and call this instead of dispatching the event.
   * @protected
   */
  onFinish() {
    this.dispatchAnimationEvent(EventType.FINISH);
  };

  /**
   * Dispatches the PAUSE event. Sub classes should override this instead
   * of listening to the event, and call this instead of dispatching the event.
   * @protected
   */
  onPause() {
    this.dispatchAnimationEvent(EventType.PAUSE);
  };

  /**
   * Dispatches the PLAY event. Sub classes should override this instead
   * of listening to the event, and call this instead of dispatching the event.
   * @protected
   */
  onPlay() {
    this.dispatchAnimationEvent(EventType.PLAY);
  };

  /**
   * Dispatches the RESUME event. Sub classes should override this instead
   * of listening to the event, and call this instead of dispatching the event.
   * @protected
   */
  onResume() {
    this.dispatchAnimationEvent(EventType.RESUME);
  };

  /**
   * Dispatches the STOP event. Sub classes should override this instead
   * of listening to the event, and call this instead of dispatching the event.
   * @protected
   */
  onStop() {
    this.dispatchAnimationEvent(EventType.STOP);
  };

  /**
   * Dispatches an event object for the current animation.
   * @param {string} type Event type that will be dispatched.
   * @protected
   */
  dispatchAnimationEvent(type) {
    this.dispatchEvent(type);
  };
}

/**
 * Enum for the possible states of an animation.
 * @enum {number}
 */
let State = {
  STOPPED: 0,
  PAUSED: -1,
  PLAYING: 1
};

export {State, TransitionBase};