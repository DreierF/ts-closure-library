export { events_Event as Event };
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
declare class events_Event {
    /**
     * Stops the propagation of the event. It is equivalent to
     * `e.stopPropagation()`, but can be used as the callback argument of
     * {@link goog.events.listen} without declaring another function.
     * @param {!events_Event} e An event.
     */
    static stopPropagation(e: events_Event): void;
    /**
     * Prevents the default action. It is equivalent to
     * `e.preventDefault()`, but can be used as the callback argument of
     * {@link goog.events.listen} without declaring another function.
     * @param {!events_Event} e An event.
     */
    static preventDefault(e: events_Event): void;
    /**
     * A base class for event objects, so that they can support preventDefault and
     * stopPropagation.
     *
     * @param {string|!EventId} type Event Type.
     * @param {Object=} opt_target Reference to the object that is the target of
     *     this event. It has to implement the `EventTarget` interface
     *     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
     */
    constructor(type: string | EventId<any>, opt_target?: any | undefined);
    /**
     * Event type.
     * @type {string}
     */
    type: string;
    /**
     * TODO(tbreisacher): The type should probably be
     * EventTarget|goog.events.EventTarget.
     *
     * Target of the event.
     * @type {Object|undefined}
     */
    target: any | undefined;
    /**
     * Object that had the listener attached.
     * @type {Object|undefined}
     */
    currentTarget: any | undefined;
    /**
     * Whether to cancel the event in internal capture/bubble processing for IE.
     * @type {boolean}
     * @private
     */
    private propagationStopped_;
    /**
     * Whether the default action has been prevented.
     * This is a property to match the W3C specification at
     * {@link http://www.w3.org/TR/DOM-Level-3-Events/
     * #events-event-type-defaultPrevented}.
     * Must be treated as read-only outside the class.
     * @type {boolean}
     */
    defaultPrevented: boolean;
    /**
     * @return {boolean} true iff internal propagation has been stopped.
     */
    hasPropagationStopped(): boolean;
    /**
     * Stops event propagation.
     */
    stopPropagation(): void;
    /**
     * Prevents the default action, for example a link redirecting to a url.
     */
    preventDefault(): void;
}
import { EventId } from "./eventid.js";
