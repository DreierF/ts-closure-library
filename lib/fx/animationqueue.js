import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import {Event as EventsEvent} from './../events/event.js';
import * as events from './../events/eventhandler.js';
import * as google from './../google.js';
import {Animation as FxAnimation} from './animation.js';
import {Transition} from './transition.js';
import {EventType} from './transition.js';
import {TransitionBase} from './transitionbase.js';
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
 * @fileoverview A class which automatically plays through a queue of
 * animations.  AnimationParallelQueue and AnimationSerialQueue provide
 * specific implementations of the abstract class AnimationQueue.
 *
 * @see ../demos/animationqueue.html
 */

/**
 * Constructor for AnimationQueue object.
 *
 * @class
 * @extends {TransitionBase}
 * @abstract
 */
class AnimationQueue extends TransitionBase {

  /**
   * Constructor for AnimationQueue object.
   *
   */
  constructor() {
    super();
  
    /**
     * An array holding all animations in the queue.
     * @type {Array<TransitionBase>}
     * @protected
     */
    this.queue = [];
  }

  /**
   * Pushes an Animation to the end of the queue.
   * @param {TransitionBase} animation The animation to add to the queue.
   */
  add(animation) {
    asserts.assert(
        this.isStopped(),
        'Not allowed to add animations to a running animation queue.');
  
    if (googarray.contains(this.queue, animation)) {
      return;
    }
  
    this.queue.push(animation);
    events.listen(
        animation, EventType.FINISH, this.onAnimationFinish,
        false, this);
  };

  /**
   * Removes an Animation from the queue.
   * @param {FxAnimation} animation The animation to remove.
   */
  remove(animation) {
    asserts.assert(
        this.isStopped(),
        'Not allowed to remove animations from a running animation queue.');
  
    if (googarray.remove(this.queue, animation)) {
      events.unlisten(
          animation, EventType.FINISH, this.onAnimationFinish,
          false, this);
    }
  };

  /**
   * Handles the event that an animation has finished.
   * @param {EventsEvent} e The finishing event.
   * @protected
   * @abstract
   */
  onAnimationFinish(e) {}

  /**
   * Disposes of the animations.
   * @override
   */
  disposeInternal() {
    googarray.forEach(this.queue, function(animation) { animation.dispose(); });
    this.queue.length = 0;
  
    super.disposeInternal();
  };
}

/**
 * Constructor for AnimationParallelQueue object.
 * @class
 * @extends {AnimationQueue}
 */
class AnimationParallelQueue extends AnimationQueue {

  /**
   * Constructor for AnimationParallelQueue object.
   */
  constructor() {
    super();
  
    /**
     * Number of finished animations.
     * @type {number}
     * @private
     */
    this.finishedCounter_ = 0;
  }

  /**
   * @override
   * @suppress {checkTypes}
   */
  play(opt_restart) {
    if (this.queue.length == 0) {
      return false;
    }
  
    if (opt_restart || this.isStopped()) {
      this.finishedCounter_ = 0;
      this.onBegin();
    } else if (this.isPlaying()) {
      return false;
    }
  
    this.onPlay();
    if (this.isPaused()) {
      this.onResume();
    }
    var resuming = this.isPaused() && !opt_restart;
  
    this.startTime = google.now();
    this.endTime = null;
    this.setStatePlaying();
  
    googarray.forEach(this.queue, function(anim) {
      if (!resuming || anim.isPaused()) {
        anim.play(opt_restart);
      }
    });
  
    return true;
  };

  /** @override */
  pause() {
    if (this.isPlaying()) {
      googarray.forEach(this.queue, function(anim) {
        if (anim.isPlaying()) {
          anim.pause();
        }
      });
  
      this.setStatePaused();
      this.onPause();
    }
  };

  /** @override */
  stop(opt_gotoEnd) {
    googarray.forEach(this.queue, function(anim) {
      if (!anim.isStopped()) {
        anim.stop(opt_gotoEnd);
      }
    });
  
    this.setStateStopped();
    this.endTime = google.now();
  
    this.onStop();
    this.onEnd();
  };

  /** @override */
  onAnimationFinish(e) {
    this.finishedCounter_++;
    if (this.finishedCounter_ == this.queue.length) {
      this.endTime = google.now();
  
      this.setStateStopped();
  
      this.onFinish();
      this.onEnd();
    }
  };
}

/**
 * Constructor for AnimationSerialQueue object.
 * @class
 * @extends {AnimationQueue}
 */
class AnimationSerialQueue extends AnimationQueue {

  /**
   * Constructor for AnimationSerialQueue object.
   */
  constructor() {
    super();
  
    /**
     * Current animation in queue currently active.
     * @type {number}
     * @private
     */
    this.current_ = 0;
  }

  /**
   * @override
   * @suppress {checkTypes}
   */
  play(opt_restart) {
    if (this.queue.length == 0) {
      return false;
    }
  
    if (opt_restart || this.isStopped()) {
      if (this.current_ < this.queue.length &&
          !this.queue[this.current_].isStopped()) {
        this.queue[this.current_].stop(false);
      }
  
      this.current_ = 0;
      this.onBegin();
    } else if (this.isPlaying()) {
      return false;
    }
  
    this.onPlay();
    if (this.isPaused()) {
      this.onResume();
    }
  
    this.startTime = google.now();
    this.endTime = null;
    this.setStatePlaying();
  
    this.queue[this.current_].play(opt_restart);
  
    return true;
  };

  /** @override */
  pause() {
    if (this.isPlaying()) {
      this.queue[this.current_].pause();
      this.setStatePaused();
      this.onPause();
    }
  };

  /** @override */
  stop(opt_gotoEnd) {
    this.setStateStopped();
    this.endTime = google.now();
  
    if (opt_gotoEnd) {
      for (var i = this.current_; i < this.queue.length; ++i) {
        var anim = this.queue[i];
        // If the animation is stopped, start it to initiate rendering.  This
        // might be needed to make the next line work.
        if (anim.isStopped()) anim.play();
        // If the animation is not done, stop it and go to the end state of the
        // animation.
        if (!anim.isStopped()) anim.stop(true);
      }
    } else if (this.current_ < this.queue.length) {
      this.queue[this.current_].stop(false);
    }
  
    this.onStop();
    this.onEnd();
  };

  /** @override */
  onAnimationFinish(e) {
    if (this.isPlaying()) {
      this.current_++;
      if (this.current_ < this.queue.length) {
        this.queue[this.current_].play();
      } else {
        this.endTime = google.now();
        this.setStateStopped();
  
        this.onFinish();
        this.onEnd();
      }
    }
  };
}

export {AnimationParallelQueue, AnimationQueue, AnimationSerialQueue};