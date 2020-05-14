/**
 * A typedef for event like objects that are dispatchable via the
 * goog.events.dispatchEvent function. strings are treated as the type for a
 * events_Event. Objects are treated as an extension of a new
 * events_Event with the type property of the object being used as the type
 * of the Event.
 */
export type EventLike = any;
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
export let EventLike: any;
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
     * @suppress {underscore} Several properties on this class are technically
     *     public, but referencing these properties outside this package is strongly
     *     discouraged.
     *
     * @param {string|!EventId} type Event Type.
     * @param {Object=} opt_target Reference to the object that is the target of
     *     this event. It has to implement the `EventTarget` interface
     *     declared at {@link http://developer.mozilla.org/en/DOM/EventTarget}.
     */
    constructor(type: string | EventId, opt_target?: any | undefined);
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
     * @public
     */
    public propagationStopped_: boolean;
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
     * Return value for in internal capture/bubble processing for IE.
     * @type {boolean}
     * @public
     */
    public returnValue_: boolean;
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
export { events_Event as Event };
