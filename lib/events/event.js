import {EventId} from './eventid.js';
// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview A base class for event objects.
 */

/**
 * A typedef for event like objects that are dispatchable via the
 * goog.events.dispatchEvent function. strings are treated as the type for a
 * events_Event. Objects are treated as an extension of a new
 * events_Event with the type property of the object being used as the type
 * of the Event.
 * @typedef {string|Object|events_Event|EventId}
 */
let EventLike;

/**
 * A base class for event objects, so that they can support preventDefault and
 * stopPropagation.
 *
 * @suppress {underscore} Several properties on this class are technically
 *     public, but referencing these properties outside this package is strongly
 *     discouraged.
 *
 *     this event. It has to implement the `EventTarget` interface
 *     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
 */
class events_Event {

  /**
   * A base class for event objects, so that they can support preventDefault and
   * stopPropagation.
   *
   * @suppress {underscore} Several properties on this class are technically
   *     public, but referencing these properties outside this package is strongly
   *     discouraged.
   *
   * @param {string|!EventId} type Event Type.
   * @param {Object=} opt_target Reference to the object that is the target of
   *     this event. It has to implement the `EventTarget` interface
   *     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
   */
  constructor(type, opt_target) {
    /**
     * Event type.
     * @type {string}
     */
    this.type = type instanceof EventId ? String(type) : type;
  
    /**
     * TODO(tbreisacher): The type should probably be
     * EventTarget|goog.events.EventTarget.
     *
     * Target of the event.
     * @type {Object|undefined}
     */
    this.target = opt_target;
  
    /**
     * Object that had the listener attached.
     * @type {Object|undefined}
     */
    this.currentTarget = this.target;
  
    /**
     * Whether to cancel the event in internal capture/bubble processing for IE.
     * @type {boolean}
     * @public
     */
    this.propagationStopped_ = false;
  
    /**
     * Whether the default action has been prevented.
     * This is a property to match the W3C specification at
     * {@link http://www.w3.org/TR/DOM-Level-3-Events/
     * #events-event-type-defaultPrevented}.
     * Must be treated as read-only outside the class.
     * @type {boolean}
     */
    this.defaultPrevented = false;
  
    /**
     * Return value for in internal capture/bubble processing for IE.
     * @type {boolean}
     * @public
     */
    this.returnValue_ = true;
  }

  /**
   * Stops event propagation.
   */
  stopPropagation() {
    this.propagationStopped_ = true;
  };

  /**
   * Prevents the default action, for example a link redirecting to a url.
   */
  preventDefault() {
    this.defaultPrevented = true;
    this.returnValue_ = false;
  };

  /**
   * Stops the propagation of the event. It is equivalent to
   * `e.stopPropagation()`, but can be used as the callback argument of
   * {@link goog.events.listen} without declaring another function.
   * @param {!events_Event} e An event.
   */
  static stopPropagation(e) {
    e.stopPropagation();
  };

  /**
   * Prevents the default action. It is equivalent to
   * `e.preventDefault()`, but can be used as the callback argument of
   * {@link goog.events.listen} without declaring another function.
   * @param {!events_Event} e An event.
   */
  static preventDefault(e) {
    e.preventDefault();
  };
}

export {EventLike, events_Event as Event};