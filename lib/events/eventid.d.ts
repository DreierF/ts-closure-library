/**
 * A templated class that is used when registering for events. Typical usage:
 *
 *    /** @type {EventId<MyEventObj>} *\
 *    var myEventId = new EventId(
 *        goog.events.getUniqueId(('someEvent'));
 *
 *    // No need to cast or declare here since the compiler knows the
 *    // correct type of 'evt' (MyEventObj).
 *    something.listen(myEventId, function(evt) {});
 *
 * @template T
 * @class
 * @final
 */
export class EventId<T> {
    /**
     * A templated class that is used when registering for events. Typical usage:
     *
     *    /** @type {EventId<MyEventObj>} *\
     *    var myEventId = new EventId(
     *        goog.events.getUniqueId(('someEvent'));
     *
     *    // No need to cast or declare here since the compiler knows the
     *    // correct type of 'evt' (MyEventObj).
     *    something.listen(myEventId, function(evt) {});
     *
     * @param {string} eventId
     * @template T
     */
    constructor(eventId: string);
    /** @const */ id: string;
    /**
     * @override
     */
    toString(): string;
}
