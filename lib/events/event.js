import {Disposable} from './../disposable/disposable.js';
import {EventId} from './eventid.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A base class for event objects.
 */

/**
 * events_Event no longer depends on Disposable. Keep requiring
 * Disposable here to not break projects which assume this dependency.
 * 
 */

/**
 * A base class for event objects, so that they can support preventDefault and
 * stopPropagation.
 *
 *     this event. It has to implement the `EventTarget` interface
 *     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
 */
class events_Event {

  /**
   * A base class for event objects, so that they can support preventDefault and
   * stopPropagation.
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
     * @private
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
  }

  /**
   * @return {boolean} true iff internal propagation has been stopped.
   */
  hasPropagationStopped() {
    return this.propagationStopped_;
  };

  /**
   * Stops event propagation.
   * @return {void}
   */
  stopPropagation() {
    this.propagationStopped_ = true;
  };

  /**
   * Prevents the default action, for example a link redirecting to a url.
   * @return {void}
   */
  preventDefault() {
    this.defaultPrevented = true;
  };

  /**
   * Stops the propagation of the event. It is equivalent to
   * `e.stopPropagation()`, but can be used as the callback argument of
   * {@link goog.events.listen} without declaring another function.
   * @param {!events_Event} e An event.
   * @return {void}
   */
  static stopPropagation(e) {
    e.stopPropagation();
  };

  /**
   * Prevents the default action. It is equivalent to
   * `e.preventDefault()`, but can be used as the callback argument of
   * {@link goog.events.listen} without declaring another function.
   * @param {!events_Event} e An event.
   * @return {void}
   */
  static preventDefault(e) {
    e.preventDefault();
  };
}

export {events_Event as Event};