/**
 * Different capture simulation mode for IE8-.
 */
export type CaptureSimulationMode = number;
export type Key = number | ListenableKey;
export type ListenableType = EventTarget | Listenable;
/**
 * @type {number} The capture simulation mode for IE8-. By default,
 *     this is ON.
 */
export const CAPTURE_SIMULATION_MODE: number;
export namespace CaptureSimulationMode {
    export const OFF_AND_FAIL: number;
    export const OFF_AND_SILENT: number;
    export const ON: number;
}
/**
 * @type {boolean} Whether to enable the monitoring of the
 *     Listener instances. Switching on the monitoring is only
 *     recommended for debugging because it has a significant impact on
 *     performance and memory usage. If switched off, the monitoring code
 *     compiles down to 0 bytes.
 */
export const ENABLE_MONITORING: boolean;
/**
 * @fileoverview Class to create objects which want to handle multiple events
 * and have their listeners easily cleaned up via a dispose method.
 *
 * Example:
 * <pre>
 * function Something() {
 *   Something.base(this);
 *
 *   ... set up object ...
 *
 *   // Add event listeners
 *   this.listen(this.starEl, goog.events.EventType.CLICK, this.handleStar);
 *   this.listen(this.headerEl, goog.events.EventType.CLICK, this.expand);
 *   this.listen(this.collapseEl, goog.events.EventType.CLICK, this.collapse);
 *   this.listen(this.infoEl, goog.events.EventType.MOUSEOVER, this.showHover);
 *   this.listen(this.infoEl, goog.events.EventType.MOUSEOUT, this.hideHover);
 * }
 * google.inherits(Something, EventHandler);
 *
 * Something.prototype.disposeInternal = function() {
 *   Something.base(this, 'disposeInternal');
 *   goog.dom.removeNode(this.container);
 * };
 *
 *
 * // Then elsewhere:
 *
 * var activeSomething = null;
 * function openSomething() {
 *   activeSomething = new Something();
 * }
 *
 * function closeSomething() {
 *   if (activeSomething) {
 *     activeSomething.dispose();  // Remove event listeners
 *     activeSomething = null;
 *   }
 * }
 * </pre>
 */
/**
 * Super class for objects that want to easily manage a number of event
 * listeners.  It allows a short cut to listen and also provides a quick way
 * to remove all events listeners belonging to this object.
 * @extends {Disposable}
 * @template SCOPE
 */
export class EventHandler<SCOPE> extends GoogDisposable {
    /**
     * Super class for objects that want to easily manage a number of event
     * listeners.  It allows a short cut to listen and also provides a quick way
     * to remove all events listeners belonging to this object.
     * @param {SCOPE=} opt_scope Object in whose scope to call the listeners.
     * @template SCOPE
     */
    constructor(opt_scope?: SCOPE | undefined);
    handler_: SCOPE | undefined;
    /**
     * Keys for events that are being listened to.
     * @type {!Object<!Key>}
     * @private
     */
    private keys_;
    /**
     * Listen to an event on a Listenable.  If the function is omitted then the
     * EventHandler's handleEvent method will be used.
     * @param {?ListenableType} src Event source.
     * @param {string|Array<string>|
     *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
     *     type Event type to listen for or array of event types.
     * @param {function(this:SCOPE, EVENTOBJ):?|{handleEvent:function(?):?}|null=}
     *     opt_fn Optional callback function to be used as the listener or an object
     *     with handleEvent function.
     * @param {(boolean|!AddEventListenerOptions)=} opt_options
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template EVENTOBJ, THIS
     * @suppress{checkTypes}
     */
    listen<EVENTOBJ, THIS>(src: ListenableType | null, type: string | string[] | EventId<EVENTOBJ> | EventId<EVENTOBJ>[], opt_fn?: ((this: SCOPE, arg1: EVENTOBJ) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null) | undefined, opt_options?: (boolean | AddEventListenerOptions) | undefined): THIS | null;
    /**
     * Listen to an event on a Listenable.  If the function is omitted then the
     * EventHandler's handleEvent method will be used.
     * @param {?ListenableType} src Event source.
     * @param {string|Array<string>|
     *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
     *     type Event type to listen for or array of event types.
     * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(this:T, ?):?}|
     *     null|undefined} fn Optional callback function to be used as the
     *     listener or an object with handleEvent function.
     * @param {boolean|!AddEventListenerOptions|undefined} options
     * @param {T} scope Object in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template T, EVENTOBJ, THIS
     */
    listenWithScope<T, EVENTOBJ, THIS>(src: ListenableType | null, type: string | string[] | EventId<EVENTOBJ> | EventId<EVENTOBJ>[], fn: (this: T, arg1: EVENTOBJ) => any, options: boolean | AddEventListenerOptions | undefined, scope: T): THIS | null;
    /**
     * Listen to an event on a Listenable.  If the function is omitted then the
     * EventHandler's handleEvent method will be used.
     * @param {?ListenableType} src Event source.
     * @param {string|Array<string>|
     *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
     *     type Event type to listen for or array of event types.
     * @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
     *     Optional callback function to be used as the listener or an object with
     *     handleEvent function.
     * @param {(boolean|!AddEventListenerOptions)=} opt_options
     * @param {Object=} opt_scope Object in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template EVENTOBJ, THIS
     * @suppress{checkTypes}
     * @private
     */
    private listen_;
    /**
     * Listen to an event on a Listenable.  If the function is omitted, then the
     * EventHandler's handleEvent method will be used. After the event has fired the
     * event listener is removed from the target. If an array of event types is
     * provided, each event type will be listened to once.
     * @param {?ListenableType} src Event source.
     * @param {string|Array<string>|
     *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
     *     type Event type to listen for or array of event types.
     * @param {function(this:SCOPE, EVENTOBJ):?|{handleEvent:function(?):?}|null=}
     * opt_fn
     *    Optional callback function to be used as the listener or an object with
     *    handleEvent function.
     * @param {(boolean|!AddEventListenerOptions)=} opt_options
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template EVENTOBJ, THIS
     * @suppress{checkTypes}
     */
    listenOnce<EVENTOBJ, THIS_4>(src: ListenableType | null, type: string | string[] | EventId<EVENTOBJ> | EventId<EVENTOBJ>[], opt_fn?: ((this: SCOPE, arg1: EVENTOBJ) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null) | undefined, opt_options?: (boolean | AddEventListenerOptions) | undefined): THIS_4 | null;
    /**
     * Listen to an event on a Listenable.  If the function is omitted, then the
     * EventHandler's handleEvent method will be used. After the event has fired the
     * event listener is removed from the target. If an array of event types is
     * provided, each event type will be listened to once.
     * @param {?ListenableType} src Event source.
     * @param {string|Array<string>|
     *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
     *     type Event type to listen for or array of event types.
     * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(this:T, ?):?}|
     *     null|undefined} fn Optional callback function to be used as the
     *     listener or an object with handleEvent function.
     * @param {boolean|undefined} capture Optional whether to use capture phase.
     * @param {T} scope Object in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template T, EVENTOBJ, THIS
     */
    listenOnceWithScope<T, EVENTOBJ, THIS_6>(src: ListenableType | null, type: string | string[] | EventId<EVENTOBJ> | EventId<EVENTOBJ>[], fn: (this: T, arg1: EVENTOBJ) => any, capture: boolean | undefined, scope: T): THIS_6 | null;
    /**
     * Listen to an event on a Listenable.  If the function is omitted, then the
     * EventHandler's handleEvent method will be used. After the event has fired
     * the event listener is removed from the target. If an array of event types is
     * provided, each event type will be listened to once.
     * @param {?ListenableType} src Event source.
     * @param {string|Array<string>|
     *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
     *     type Event type to listen for or array of event types.
     * @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
     *    Optional callback function to be used as the listener or an object with
     *    handleEvent function.
     * @param {(boolean|!AddEventListenerOptions)=} opt_options
     * @param {Object=} opt_scope Object in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template EVENTOBJ, THIS
     * @suppress{checkTypes}
     * @private
     */
    private listenOnce_;
    /**
     * Adds an event listener with a specific event wrapper on a DOM Node or an
     * object that has implemented {@link events_EventTarget}. A listener can
     * only be added once to an object.
     *
     * @param {?EventTarget|events_EventTarget} src The node to listen to
     *     events on.
     * @param {?EventWrapper} wrapper Event wrapper to use.
     * @param {function(this:SCOPE, ?):?|{handleEvent:function(?):?}|null} listener
     *     Callback method, or an object with a handleEvent function.
     * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
     *     false).
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template THIS
     */
    listenWithWrapper<THIS_8>(src: (EventTarget | events_EventTarget) | null, wrapper: EventWrapper | null, listener: (this: SCOPE, arg1: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null, opt_capt?: boolean | undefined): THIS_8 | null;
    /**
     * Adds an event listener with a specific event wrapper on a DOM Node or an
     * object that has implemented {@link events_EventTarget}. A listener can
     * only be added once to an object.
     *
     * @param {?EventTarget|events_EventTarget} src The node to listen to
     *     events on.
     * @param {?EventWrapper} wrapper Event wrapper to use.
     * @param {function(this:T, ?):?|{handleEvent:function(this:T, ?):?}|null}
     *     listener Optional callback function to be used as the
     *     listener or an object with handleEvent function.
     * @param {boolean|undefined} capture Optional whether to use capture phase.
     * @param {T} scope Object in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template T, THIS
     */
    listenWithWrapperAndScope<T_4, THIS_10>(src: (EventTarget | events_EventTarget) | null, wrapper: EventWrapper | null, listener: (this: T_4, arg1: unknown) => any, capture: boolean | undefined, scope: T_4): THIS_10 | null;
    /**
     * Adds an event listener with a specific event wrapper on a DOM Node or an
     * object that has implemented {@link events_EventTarget}. A listener can
     * only be added once to an object.
     *
     * @param {?EventTarget|events_EventTarget} src The node to listen to
     *     events on.
     * @param {?EventWrapper} wrapper Event wrapper to use.
     * @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
     *     method, or an object with a handleEvent function.
     * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
     *     false).
     * @param {Object=} opt_scope Element in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template THIS
     * @private
     */
    private listenWithWrapper_;
    /**
     * @return {number} Number of listeners registered by this handler.
     */
    getListenerCount(): number;
    /**
     * Unlistens on an event.
     * @param {?ListenableType} src Event source.
     * @param {string|Array<string>|
     *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
     *     type Event type or array of event types to unlisten to.
     * @param {function(this:?, EVENTOBJ):?|{handleEvent:function(?):?}|null=}
     *     opt_fn Optional callback function to be used as the listener or an object
     *     with handleEvent function.
     * @param {(boolean|!EventListenerOptions)=} opt_options
     * @param {Object=} opt_scope Object in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template EVENTOBJ, THIS
     * @suppress{checkTypes}
     */
    unlisten<EVENTOBJ_4, THIS_12>(src: ListenableType | null, type: string | string[] | EventId<EVENTOBJ_4> | EventId<EVENTOBJ_4>[], opt_fn?: ((this: unknown, arg1: EVENTOBJ_4) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null) | undefined, opt_options?: (boolean | EventListenerOptions) | undefined, opt_scope?: any | undefined): THIS_12 | null;
    /**
     * Removes an event listener which was added with listenWithWrapper().
     *
     * @param {?EventTarget|events_EventTarget} src The target to stop
     *     listening to events on.
     * @param {?EventWrapper} wrapper Event wrapper to use.
     * @param {function(?):?|{handleEvent:function(?):?}|null} listener The
     *     listener function to remove.
     * @param {boolean=} opt_capt In DOM-compliant browsers, this determines
     *     whether the listener is fired during the capture or bubble phase of the
     *     event.
     * @param {Object=} opt_scope Element in whose scope to call the listener.
     * @return {?THIS} This object, allowing for chaining of calls.
     * @this {THIS}
     * @template THIS
     */
    unlistenWithWrapper<THIS_14>(src: (EventTarget | events_EventTarget) | null, wrapper: EventWrapper | null, listener: (arg0: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null, opt_capt?: boolean | undefined, opt_scope?: any | undefined): THIS_14 | null;
    /**
     * Unlistens to all events.
     */
    removeAll(): void;
    /**
     * Default event handler
     * @param {?EventsEvent} e Event object.
     */
    handleEvent(e: EventsEvent | null): void;
}
export namespace EventHandler {
    export const typeArray_: Array<string>;
}
/**
 * @fileoverview Definition of the EventWrapper interface.
 */
/**
 * Interface for event wrappers.
 * @interface
 */
export class EventWrapper {
    /**
     * Adds an event listener using the wrapper on a DOM Node or an object that has
     * implemented {@link events_EventTarget}. A listener can only be added
     * once to an object.
     *
     * @param {?ListenableType} src The node to listen to events on.
     * @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
     *     method, or an object with a handleEvent function.
     * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
     *     false).
     * @param {Object=} opt_scope Element in whose scope to call the listener.
     * @param {EventHandler=} opt_eventHandler Event handler to add
     *     listener to.
     */
    listen(src: ListenableType | null, listener: (arg0: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null, opt_capt?: boolean | undefined, opt_scope?: any | undefined, opt_eventHandler?: EventHandler | undefined): void;
    /**
     * Removes an event listener added using EventWrapper.listen.
     *
     * @param {?ListenableType} src The node to remove listener from.
     * @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
     *     method, or an object with a handleEvent function.
     * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
     *     false).
     * @param {Object=} opt_scope Element in whose scope to call the listener.
     * @param {EventHandler=} opt_eventHandler Event handler to remove
     *     listener from.
     */
    unlisten(src: ListenableType | null, listener: (arg0: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null, opt_capt?: boolean | undefined, opt_scope?: any | undefined, opt_eventHandler?: EventHandler | undefined): void;
}
/**
 * An interface that describes a single registered listener.
 * @interface
 */
export class ListenableKey {
    /**
     * Reserves a key to be used for ListenableKey#key field.
     * @return {number} A number to be used to fill ListenableKey#key
     *     field.
     */
    static reserveKey(): number;
    /**
     * The source event target.
     * @type {Object|Listenable|events_EventTarget}
     */
    src: any | Listenable | events_EventTarget;
    /**
     * The event type the listener is listening to.
     * @type {string|null}
     */
    type: string | null;
    /**
     * The listener function.
     * @type {function(?):?|{handleEvent:function(?):?}|null}
     */
    listener: (arg0: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null;
    /**
     * Whether the listener works on capture phase.
     * @type {boolean|null}
     */
    capture: boolean | null;
    /**
     * The 'this' object for the listener function's scope.
     * @type {Object|undefined}
     */
    handler: any | undefined;
    /**
     * A globally unique number to identify the key.
     * @type {number|null}
     */
    key: number | null;
}
export namespace ListenableKey {
    export const counter_: number;
}
/**
 * @fileoverview An event manager for both native browser event
 * targets and custom JavaScript event targets
 * (`Listenable`). This provides an abstraction
 * over browsers' event systems.
 *
 * It also provides a simulation of W3C event model's capture phase in
 * Internet Explorer (IE 8 and below). Caveat: the simulation does not
 * interact well with listeners registered directly on the elements
 * (bypassing google.events) or even with listeners registered via
 * google.events in a separate JS binary. In these cases, we provide
 * no ordering guarantees.
 *
 * The listeners will receive a "patched" event object. Such event object
 * contains normalized values for certain event properties that differs in
 * different browsers.
 *
 * Example usage:
 * <pre>
 * listen(myNode, 'click', function(e) { alert('woo') });
 * listen(myNode, 'mouseover', mouseHandler, true);
 * unlisten(myNode, 'mouseover', mouseHandler, true);
 * removeAll(myNode);
 * </pre>
 *
 *                                            in IE and event object patching]
 *
 * @see ../demos/events.html
 * @see ../demos/event-propagation.html
 * @see ../demos/stopevent.html
 */
/**
 * @typedef {number|ListenableKey}
 */
export let Key: any;
/**
 * @fileoverview An interface for a listenable JavaScript object.
 */
/**  */
/**
 * A listenable interface. A listenable is an object with the ability
 * to dispatch/broadcast events to "event listeners" registered via
 * listen/listenOnce.
 *
 * The interface allows for an event propagation mechanism similar
 * to one offered by native browser event targets, such as
 * capture/bubble mechanism, stopping propagation, and preventing
 * default actions. Capture/bubble mechanism depends on the ancestor
 * tree constructed via `#getParentEventTarget`; this tree
 * must be directed acyclic graph. The meaning of default action(s)
 * in preventDefault is specific to a particular use case.
 *
 * Implementations that do not support capture/bubble or can not have
 * a parent listenable can simply not implement any ability to set the
 * parent listenable (and have `#getParentEventTarget` return
 * null).
 *
 * Implementation of this class can be used with or independently from
 * goog.events.
 *
 * Implementation must call `#addImplementation(implClass)`.
 *
 * @interface
 * @see google.events
 * @see http://www.w3.org/TR/DOM-Level-2-Events/events.html
 */
export class Listenable {
    /**
     * Marks a given class (constructor) as an implementation of
     * Listenable, so that we can query that fact at runtime. The class
     * must have already implemented the interface.
     * @param {function(new:Listenable,...)} cls The class constructor.
     *     The corresponding class must have already implemented the interface.
     */
    static addImplementation(cls: new (...args: any[]) => Listenable): void;
    /**
     * @param {?Object} obj The object to check.
     * @return {boolean} Whether a given instance implements Listenable. The
     *     class/superclass of the instance must call addImplementation.
     */
    static isImplementedBy(obj: any | null): boolean;
    /**
     * Adds an event listener. A listener can only be added once to an
     * object and if it is added again the key for the listener is
     * returned. Note that if the existing listener is a one-off listener
     * (registered via listenOnce), it will no longer be a one-off
     * listener after a call to listen().
     *
     * @param {string|!EventId<EVENTOBJ>} type The event type id.
     * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
     *     method.
     * @param {boolean=} opt_useCapture Whether to fire in capture phase
     *     (defaults to false).
     * @param {SCOPE=} opt_listenerScope Object in whose scope to call the
     *     listener.
     * @return {!ListenableKey} Unique key for the listener.
     * @template SCOPE,EVENTOBJ
     */
    listen<SCOPE, EVENTOBJ>(type: string | EventId<EVENTOBJ>, listener: (this: SCOPE, arg1: EVENTOBJ) => (boolean | undefined), opt_useCapture?: boolean | undefined, opt_listenerScope?: SCOPE | undefined): ListenableKey;
    /**
     * Adds an event listener that is removed automatically after the
     * listener fired once.
     *
     * If an existing listener already exists, listenOnce will do
     * nothing. In particular, if the listener was previously registered
     * via listen(), listenOnce() will not turn the listener into a
     * one-off listener. Similarly, if there is already an existing
     * one-off listener, listenOnce does not modify the listeners (it is
     * still a once listener).
     *
     * @param {string|!EventId<EVENTOBJ>} type The event type id.
     * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
     *     method.
     * @param {boolean=} opt_useCapture Whether to fire in capture phase
     *     (defaults to false).
     * @param {SCOPE=} opt_listenerScope Object in whose scope to call the
     *     listener.
     * @return {!ListenableKey} Unique key for the listener.
     * @template SCOPE,EVENTOBJ
     */
    listenOnce<SCOPE, EVENTOBJ>(type: string | EventId<EVENTOBJ>, listener: (this: SCOPE, arg1: EVENTOBJ) => (boolean | undefined), opt_useCapture?: boolean | undefined, opt_listenerScope?: SCOPE | undefined): ListenableKey;
    /**
     * Removes an event listener which was added with listen() or listenOnce().
     *
     * @param {string|!EventId<EVENTOBJ>} type The event type id.
     * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
     *     method.
     * @param {boolean=} opt_useCapture Whether to fire in capture phase
     *     (defaults to false).
     * @param {SCOPE=} opt_listenerScope Object in whose scope to call
     *     the listener.
     * @return {boolean} Whether any listener was removed.
     * @template SCOPE,EVENTOBJ
     */
    unlisten<SCOPE, EVENTOBJ>(type: string | EventId<EVENTOBJ>, listener: (this: SCOPE, arg1: EVENTOBJ) => (boolean | undefined), opt_useCapture?: boolean | undefined, opt_listenerScope?: SCOPE | undefined): boolean;
    /**
     * Removes an event listener which was added with listen() by the key
     * returned by listen().
     *
     * @param {!ListenableKey} key The key returned by
     *     listen() or listenOnce().
     * @return {boolean} Whether any listener was removed.
     */
    unlistenByKey(key: ListenableKey): boolean;
    /**
     * Dispatches an event (or event like object) and calls all listeners
     * listening for events of this type. The type of the event is decided by the
     * type property on the event object.
     *
     * If any of the listeners returns false OR calls preventDefault then this
     * function will return false.  If one of the capture listeners calls
     * stopPropagation, then the bubble listeners won't fire.
     *
     * @param {?EventLike} e Event object.
     * @return {boolean} If anyone called preventDefault on the event object (or
     *     if any of the listeners returns false) this will also return false.
     */
    dispatchEvent(e: EventLike | null): boolean;
    /**
     * Removes all listeners from this listenable. If type is specified,
     * it will only remove listeners of the particular type. otherwise all
     * registered listeners will be removed.
     *
     * @param {string=} opt_type Type of event to remove, default is to
     *     remove all types.
     * @return {number} Number of listeners removed.
     */
    removeAllListeners(opt_type?: string | undefined): number;
    /**
     * Returns the parent of this event target to use for capture/bubble
     * mechanism.
     *
     * NOTE(chrishenry): The name reflects the original implementation of
     * custom event target (`events_EventTarget`). We decided
     * that changing the name is not worth it.
     *
     * @return {?Listenable} The parent EventTarget or null if
     *     there is no parent.
     */
    getParentEventTarget(): Listenable | null;
    /**
     * Fires all registered listeners in this listenable for the given
     * type and capture mode, passing them the given eventObject. This
     * does not perform actual capture/bubble. Only implementors of the
     * interface should be using this.
     *
     * @param {string|!EventId<EVENTOBJ>} type The type of the
     *     listeners to fire.
     * @param {boolean} capture The capture mode of the listeners to fire.
     * @param {?EVENTOBJ} eventObject The event object to fire.
     * @return {boolean} Whether all listeners succeeded without
     *     attempting to prevent default behavior. If any listener returns
     *     false or called EventsEvent#preventDefault, this returns
     *     false.
     * @template EVENTOBJ
     */
    fireListeners<EVENTOBJ = BrowserEvent>(type: string | EventId<EVENTOBJ>, capture: boolean, eventObject: EVENTOBJ | null): boolean;
    /**
     * Gets all listeners in this listenable for the given type and
     * capture mode.
     *
     * @param {string|!EventId} type The type of the listeners to fire.
     * @param {boolean} capture The capture mode of the listeners to fire.
     * @return {!Array<!ListenableKey>} An array of registered
     *     listeners.
     * @template EVENTOBJ
     */
    getListeners<EVENTOBJ_4>(type: string | EventId, capture: boolean): Array<ListenableKey>;
    /**
     * Gets the ListenableKey for the event or null if no such
     * listener is in use.
     *
     * @param {string|!EventId<EVENTOBJ>} type The name of the event
     *     without the 'on' prefix.
     * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener The
     *     listener function to get.
     * @param {boolean} capture Whether the listener is a capturing listener.
     * @param {SCOPE=} opt_listenerScope Object in whose scope to call the
     *     listener.
     * @return {?ListenableKey} the found listener or null if not found.
     * @template SCOPE,EVENTOBJ
     */
    getListener<SCOPE, EVENTOBJ_5>(type: string | EventId<EVENTOBJ_5>, listener: (this: SCOPE, arg1: EVENTOBJ_5) => (boolean | undefined), capture: boolean, opt_listenerScope?: SCOPE | undefined): ListenableKey | null;
    /**
     * Whether there is any active listeners matching the specified
     * signature. If either the type or capture parameters are
     * unspecified, the function will match on the remaining criteria.
     *
     * @param {string|!EventId<EVENTOBJ>=} opt_type Event type.
     * @param {boolean=} opt_capture Whether to check for capture or bubble
     *     listeners.
     * @return {boolean} Whether there is any active listeners matching
     *     the requested type and/or capture phase.
     * @template EVENTOBJ
     */
    hasListener<EVENTOBJ_6>(opt_type?: string | EventId<EVENTOBJ_6> | undefined, opt_capture?: boolean | undefined): boolean;
}
export namespace Listenable {
    export const IMPLEMENTED_BY_PROP: string;
}
/**
 * @typedef {?EventTarget|Listenable}
 */
export let ListenableType: any;
/**
 * @fileoverview Listener object.
 * @see ../demos/events.html
 */
/**
 * Simple class that stores information about a listener
 *     the event.
 * @implements {ListenableKey}
 */
export class Listener implements ListenableKey {
    /**
     * Simple class that stores information about a listener
     * @param {function(?):?} listener Callback function.
     * @param {?Function} proxy Wrapper for the listener that patches the event.
     * @param {?EventTarget|Listenable} src Source object for
     *     the event.
     * @param {string} type Event type.
     * @param {boolean} capture Whether in capture or bubble phase.
     * @param {Object=} opt_handler Object in whose context to execute the callback.
     */
    constructor(listener: (arg0: unknown) => unknown, proxy: Function | null, src: (EventTarget | Listenable) | null, type: string, capture: boolean, opt_handler?: any | undefined);
    /**
     * If monitoring the Listener instances is enabled, stores the
     * creation stack trace of the Disposable instance.
     * @type {string|null}
     */
    creationStack: string | null;
    /** @override */
    listener: (arg0: unknown) => unknown;
    /**
     * A wrapper over the original listener. This is used solely to
     * handle native browser events (it is used to simulate the capture
     * phase and to patch the event object).
     * @type {?Function}
     */
    proxy: Function | null;
    /**
     * Object or node that callback is listening to
     * @type {?EventTarget|Listenable}
     */
    src: (EventTarget | Listenable) | null;
    /**
     * The event type.
     * @const {string}
     */
    type: string;
    /**
     * Whether the listener is being called in the capture or bubble phase
     * @const {boolean}
     */
    capture: boolean;
    /**
     * Optional object whose context to execute the listener in
     * @type {Object|undefined}
     */
    handler: any | undefined;
    /**
     * The key of the listener.
     * @const {number}
     * @override
     */
    key: number;
    /**
     * Whether to remove the listener after it has been called.
     * @type {boolean}
     */
    callOnce: boolean;
    /**
     * Whether the listener has been removed.
     * @type {boolean}
     */
    removed: boolean;
    /**
     * Marks this listener as removed. This also remove references held by
     * this listener object (such as listener and event source).
     */
    markAsRemoved(): void;
}
/**
 * @fileoverview A map of listeners that provides utility functions to
 * deal with listeners on an event target. Used by
 * `events_EventTarget`.
 *
 * WARNING: Do not use this class from outside google.events package.
 */
/**
 * Creates a new listener map.
 * @final
 */
export class ListenerMap {
    /**
     * Finds the index of a matching Listener in the given
     * listenerArray.
     * @param {!Array<!Listener>} listenerArray Array of listener.
     * @param {!Function} listener The listener function.
     * @param {boolean=} opt_useCapture The capture flag for the listener.
     * @param {Object=} opt_listenerScope The listener scope.
     * @return {number} The index of the matching listener within the
     *     listenerArray.
     * @private
     */
    private static findListenerIndex_;
    /**
     * Creates a new listener map.
     * @param {?EventTarget|Listenable} src The src object.
     */
    constructor(src: (EventTarget | Listenable) | null);
    /** @type {?EventTarget|Listenable} */
    src: (EventTarget | Listenable) | null;
    /**
     * Maps of event type to an array of listeners.
     * @type {!Object<string, !Array<!Listener>>}
     */
    listeners: {
        [x: string]: Array<Listener>;
    };
    /**
     * The count of types in this map that have registered listeners.
     * @private {number}
     */
    private typeCount_;
    /**
     * @return {number} The count of event types in this map that actually
     *     have registered listeners.
     */
    getTypeCount(): number;
    /**
     * @return {number} Total number of registered listeners.
     */
    getListenerCount(): number;
    /**
     * Adds an event listener. A listener can only be added once to an
     * object and if it is added again the key for the listener is
     * returned.
     *
     * Note that a one-off listener will not change an existing listener,
     * if any. On the other hand a normal listener will change existing
     * one-off listener to become a normal listener.
     *
     * @param {string|!EventId} type The listener event type.
     * @param {!Function} listener This listener callback method.
     * @param {boolean} callOnce Whether the listener is a one-off
     *     listener.
     * @param {boolean=} opt_useCapture The capture mode of the listener.
     * @param {Object=} opt_listenerScope Object in whose scope to call the
     *     listener.
     * @return {!ListenableKey} Unique key for the listener.
     */
    add(type: string | EventId, listener: Function, callOnce: boolean, opt_useCapture?: boolean | undefined, opt_listenerScope?: any | undefined): ListenableKey;
    /**
     * Removes a matching listener.
     * @param {string|!EventId} type The listener event type.
     * @param {!Function} listener This listener callback method.
     * @param {boolean=} opt_useCapture The capture mode of the listener.
     * @param {Object=} opt_listenerScope Object in whose scope to call the
     *     listener.
     * @return {boolean} Whether any listener was removed.
     */
    remove(type: string | EventId, listener: Function, opt_useCapture?: boolean | undefined, opt_listenerScope?: any | undefined): boolean;
    /**
     * Removes the given listener object.
     * @param {!ListenableKey} listener The listener to remove.
     * @return {boolean} Whether the listener is removed.
     */
    removeByKey(listener: ListenableKey): boolean;
    /**
     * Removes all listeners from this map. If opt_type is provided, only
     * listeners that match the given type are removed.
     * @param {string|!EventId=} opt_type Type of event to remove.
     * @return {number} Number of listeners removed.
     */
    removeAll(opt_type?: (string | EventId) | undefined): number;
    /**
     * Gets all listeners that match the given type and capture mode. The
     * returned array is a copy (but the listener objects are not).
     * @param {string|!EventId} type The type of the listeners
     *     to retrieve.
     * @param {boolean} capture The capture mode of the listeners to retrieve.
     * @return {!Array<!ListenableKey>} An array of matching
     *     listeners.
     */
    getListeners(type: string | EventId, capture: boolean): Array<ListenableKey>;
    /**
     * Gets the ListenableKey for the event or null if no such
     * listener is in use.
     *
     * @param {string|!EventId} type The type of the listener
     *     to retrieve.
     * @param {!Function} listener The listener function to get.
     * @param {boolean} capture Whether the listener is a capturing listener.
     * @param {Object=} opt_listenerScope Object in whose scope to call the
     *     listener.
     * @return {?ListenableKey} the found listener or null if not found.
     */
    getListener(type: string | EventId, listener: Function, capture: boolean, opt_listenerScope?: any | undefined): ListenableKey | null;
    /**
     * Whether there is a matching listener. If either the type or capture
     * parameters are unspecified, the function will match on the
     * remaining criteria.
     *
     * @param {string|!EventId=} opt_type The type of the listener.
     * @param {boolean=} opt_capture The capture mode of the listener.
     * @return {boolean} Whether there is an active listener matching
     *     the requested type and/or capture phase.
     */
    hasListener(opt_type?: (string | EventId) | undefined, opt_capture?: boolean | undefined): boolean;
}
/**
 * Dispatches an event (or event like object) and calls all listeners
 * listening for events of this type. The type of the event is decided by the
 * type property on the event object.
 *
 * If any of the listeners returns false OR calls preventDefault then this
 * function will return false.  If one of the capture listeners calls
 * stopPropagation, then the bubble listeners won't fire.
 *
 * @param {?Listenable} src The event target.
 * @param {?EventLike} e Event object.
 * @return {boolean} If anyone called preventDefault on the event object (or
 *     if any of the handlers returns false) this will also return false.
 *     If there are no handlers, or if all handlers return true, this returns
 *     true.
 */
export function dispatchEvent(src: Listenable | null, e: EventLike | null): boolean;
/**
 * @fileoverview A disposable implementation of a custom
 * listenable/event target. See also: documentation for
 * `Listenable`.
 *
 * @see ../demos/eventtarget.html
 * @see Listenable
 */
/**
 * An implementation of `Listenable` with full W3C
 * EventTarget-like support (capture/bubble mechanism, stopping event
 * propagation, preventing default actions).
 *
 * You may subclass this class to turn your class into a Listenable.
 *
 * Unless propagation is stopped, an event dispatched by an
 * EventTarget will bubble to the parent returned by
 * `getParentEventTarget`. To set the parent, call
 * `setParentEventTarget`. Subclasses that don't support
 * changing the parent can override the setter to throw an error.
 *
 * Example usage:
 * <pre>
 *   var source = new events_EventTarget();
 *   function handleEvent(e) {
 *     alert('Type: ' + e.type + '; Target: ' + e.target);
 *   }
 *   source.listen('foo', handleEvent);
 *   // Or: listen(source, 'foo', handleEvent);
 *   ...
 *   source.dispatchEvent('foo');  // will call handleEvent
 *   ...
 *   source.unlisten('foo', handleEvent);
 *   // Or: unlisten(source, 'foo', handleEvent);
 * </pre>
 *
 * @extends {Disposable}
 * @implements {Listenable}
 */
declare class events_EventTarget extends GoogDisposable implements Listenable {
    /**
     * Dispatches the given event on the ancestorsTree.
     *
     * @param {!Object} target The target to dispatch on.
     * @param {EventsEvent|Object|string} e The event object.
     * @param {Array<Listenable>=} opt_ancestorsTree The ancestors
     *     tree of the target, in reverse order from the closest ancestor
     *     to the root event target. May be null if the target has no ancestor.
     * @return {boolean} If anyone called preventDefault on the event object (or
     *     if any of the listeners returns false) this will also return false.
     * @private
     */
    private static dispatchEventInternal_;
    /**
     * Maps of event type to an array of listeners.
     * @private {!ListenerMap}
     */
    private eventTargetListeners_;
    /**
     * The object to use for event.target. Useful when mixing in an
     * EventTarget to another object.
     * @private {!Object}
     */
    private actualEventTarget_;
    /**
     * Parent event target, used during event bubbling.
     *
     * TODO(chrishenry): Change this to Listenable. This
     * currently breaks people who expect getParentEventTarget to return
     * events_EventTarget.
     *
     * @private {?events_EventTarget}
     */
    private parentEventTarget_;
    /**
     * Returns the parent of this event target to use for bubbling.
     *
     * @return {events_EventTarget} The parent EventTarget or null if
     *     there is no parent.
     * @override
     */
    getParentEventTarget(): events_EventTarget;
    /**
     * Sets the parent of this event target to use for capture/bubble
     * mechanism.
     * @param {events_EventTarget} parent Parent listenable (null if none).
     */
    setParentEventTarget(parent: events_EventTarget): void;
    /**
     * Adds an event listener to the event target. The same handler can only be
     * added once per the type. Even if you add the same handler multiple times
     * using the same type then it will only be called once when the event is
     * dispatched.
     *
     * @param {string|!EventId} type The type of the event to listen for
     * @param {function(?):?|{handleEvent:function(?):?}|null} handler The function
     *     to handle the event. The handler can also be an object that implements
     *     the handleEvent method which takes the event object as argument.
     * @param {boolean=} opt_capture In DOM-compliant browsers, this determines
     *     whether the listener is fired during the capture or bubble phase
     *     of the event.
     * @param {Object=} opt_handlerScope Object in whose scope to call
     *     the listener.
     * @deprecated Use `#listen` instead, when possible. Otherwise, use
     *     `listen` if you are passing Object
     *     (instead of Function) as handler.
     */
    addEventListener(type: string | EventId, handler: (arg0: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null, opt_capture?: boolean | undefined, opt_handlerScope?: any | undefined): void;
    /**
     * Removes an event listener from the event target. The handler must be the
     * same object as the one added. If the handler has not been added then
     * nothing is done.
     *
     * @param {string} type The type of the event to listen for.
     * @param {function(?):?|{handleEvent:function(?):?}|null} handler The function
     *     to handle the event. The handler can also be an object that implements
     *     the handleEvent method which takes the event object as argument.
     * @param {boolean=} opt_capture In DOM-compliant browsers, this determines
     *     whether the listener is fired during the capture or bubble phase
     *     of the event.
     * @param {Object=} opt_handlerScope Object in whose scope to call
     *     the listener.
     * @deprecated Use `#unlisten` instead, when possible. Otherwise, use
     *     `unlisten` if you are passing Object
     *     (instead of Function) as handler.
     */
    removeEventListener(type: string, handler: (arg0: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null, opt_capture?: boolean | undefined, opt_handlerScope?: any | undefined): void;
    /** @override */
    dispatchEvent(e: any): any;
    /** @override */
    listen(type: any, listener: any, opt_useCapture?: any, opt_listenerScope?: any): any;
    /** @override */
    listenOnce(type: any, listener: any, opt_useCapture?: any, opt_listenerScope?: any): any;
    /** @override */
    unlisten(type: any, listener: any, opt_useCapture?: any, opt_listenerScope?: any): any;
    /** @override */
    unlistenByKey(key: any): any;
    /** @override */
    removeAllListeners(opt_type?: any): any;
    /** @override */
    fireListeners(type: any, capture: any, eventObject: any): boolean;
    /** @override */
    getListeners(type: any, capture: any): any;
    /** @override */
    getListener(type: any, listener: any, capture: any, opt_listenerScope?: any): any;
    /** @override */
    hasListener(opt_type?: any, opt_capture?: any): any;
    /**
     * Sets the target to be used for `event.target` when firing
     * event. Mainly used for testing. For example, see
     * `goog.testing.events.mixinListenable`.
     * @param {!Object} target The target.
     */
    setTargetForTesting(target: any): void;
    /**
     * Asserts that the event target instance is initialized properly.
     * @private
     */
    private assertInitialized_;
}
declare namespace events_EventTarget {
    export const MAX_ANCESTORS_: number;
}
/**
 * Provides a nice string showing the normalized event objects public members
 * @param {?Object} e Event Object.
 * @return {string} String of the public members of the normalized event object.
 */
export function expose(e: any | null): string;
/**
 * Fires a listener with a set of arguments
 *
 * @param {?Listener} listener The listener object to call.
 * @param {?Object} eventObject The event object to pass to the listener.
 * @return {*} Result of listener.
 */
export function fireListener(listener: Listener | null, eventObject: any | null): any;
/**
 * Fires an object's listeners of a particular type and phase
 *
 * @param {?Object} obj Object whose listeners to call.
 * @param {string|!EventId} type Event type.
 * @param {boolean} capture Which event phase.
 * @param {?Object} eventObject Event object to be passed to listener.
 * @return {boolean} True if all listeners returned true else false.
 */
export function fireListeners(obj: any | null, type: string | EventId, capture: boolean, eventObject: any | null): boolean;
/**
 * Gets the Listener for the event or null if no such listener is
 * in use.
 *
 * @param {?EventTarget|Listenable} src The target from
 *     which to get listeners.
 * @param {?string|!EventId<EVENTOBJ>} type The type of the event.
 * @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null} listener The
 *     listener function to get.
 * @param {boolean=} opt_capt In DOM-compliant browsers, this determines
 *                            whether the listener is fired during the
 *                            capture or bubble phase of the event.
 * @param {Object=} opt_handler Element in whose scope to call the listener.
 * @return {?ListenableKey} the found listener or null if not found.
 * @template EVENTOBJ
 */
export function getListener<EVENTOBJ = BrowserEvent>(src: (EventTarget | Listenable) | null, type: string | EventId<EVENTOBJ> | null, listener: (arg0: EVENTOBJ) => unknown | {
    handleEvent: (arg0: unknown) => unknown;
} | null, opt_capt?: boolean | undefined, opt_handler?: any | undefined): ListenableKey | null;
/**
 * Gets the listeners for a given object, type and capture phase.
 *
 * @param {?Object} obj Object to get listeners for.
 * @param {string|!EventId} type Event type.
 * @param {boolean} capture Capture phase?.
 * @return {Array<!Listener>} Array of listener objects.
 */
export function getListeners(obj: any | null, type: string | EventId, capture: boolean): Array<Listener>;
/**
 * Helper function for returning a proxy function.
 * @return {!Function} A new or reused function object.
 */
export function getProxy(): Function;
/**
 * Gets the total number of listeners currently in the system.
 * @return {number} Number of listeners.
 * @deprecated This returns estimated count, now that Closure no longer
 * stores a central listener registry. We still return an estimation
 * to keep existing listener-related tests passing. In the near future,
 * this function will be removed.
 */
export function getTotalListenerCount(): number;
/**
 * Creates a unique event id.
 *
 * @param {string} identifier The identifier.
 * @return {string} A unique identifier.
 * @idGenerator {unique}
 */
export function getUniqueId(identifier: string): string;
/**
 * Returns whether an event target has any active listeners matching the
 * specified signature. If either the type or capture parameters are
 * unspecified, the function will match on the remaining criteria.
 *
 * @param {?EventTarget|Listenable} obj Target to get
 *     listeners for.
 * @param {string|!EventId=} opt_type Event type.
 * @param {boolean=} opt_capture Whether to check for capture or bubble-phase
 *     listeners.
 * @return {boolean} Whether an event target has one or more listeners matching
 *     the requested type and/or capture phase.
 */
export function hasListener(obj: (EventTarget | Listenable) | null, opt_type?: (string | EventId) | undefined, opt_capture?: boolean | undefined): boolean;
/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link Listenable}. A listener can only be added once
 * to an object and if it is added again the key for the listener is
 * returned. Note that if the existing listener is a one-off listener
 * (registered via listenOnce), it will no longer be a one-off
 * listener after a call to listen().
 *
 * @param {?EventTarget|Listenable} src The node to listen
 *     to events on.
 * @param {string|Array<string>|
 *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
 *     type Event type or array of event types.
 * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(?):?}|null}
 *     listener Callback method, or an object with a handleEvent function.
 *     WARNING: passing an Object is now softly deprecated.
 * @param {(boolean|!AddEventListenerOptions)=} opt_options
 * @param {T=} opt_handler Element in whose scope to call the listener.
 * @return {?Key} Unique key for the listener.
 * @template T,EVENTOBJ
 * @suppress{checkTypes}
 */
export function listen<T = any, EVENTOBJ = BrowserEvent>(src: (EventTarget | Listenable) | null, type: string | string[] | EventId<EVENTOBJ> | EventId<EVENTOBJ>[], listener: (this: T, arg1: EVENTOBJ) => unknown | {
    handleEvent: (arg0: unknown) => unknown;
} | null, opt_options?: (boolean | AddEventListenerOptions) | undefined, opt_handler?: T | undefined): Key | null;
/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link Listenable}. After the event has fired the event
 * listener is removed from the target.
 *
 * If an existing listener already exists, listenOnce will do
 * nothing. In particular, if the listener was previously registered
 * via listen(), listenOnce() will not turn the listener into a
 * one-off listener. Similarly, if there is already an existing
 * one-off listener, listenOnce does not modify the listeners (it is
 * still a once listener).
 *
 * @param {?EventTarget|Listenable} src The node to listen
 *     to events on.
 * @param {string|Array<string>|
 *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
 *     type Event type or array of event types.
 * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(?):?}|null}
 *     listener Callback method.
 * @param {(boolean|!AddEventListenerOptions)=} opt_options
 * @param {T=} opt_handler Element in whose scope to call the listener.
 * @return {?Key} Unique key for the listener.
 * @template T,EVENTOBJ
 * @suppress{checkTypes}
 */
export function listenOnce<T = any, EVENTOBJ = BrowserEvent>(src: (EventTarget | Listenable) | null, type: string | string[] | EventId<EVENTOBJ> | EventId<EVENTOBJ>[], listener: (this: T, arg1: EVENTOBJ) => unknown | {
    handleEvent: (arg0: unknown) => unknown;
} | null, opt_options?: (boolean | AddEventListenerOptions) | undefined, opt_handler?: T | undefined): Key | null;
/**
 * Adds an event listener with a specific event wrapper on a DOM Node or an
 * object that has implemented {@link Listenable}. A listener can
 * only be added once to an object.
 *
 * @param {?EventTarget|Listenable} src The target to
 *     listen to events on.
 * @param {?EventWrapper} wrapper Event wrapper to use.
 * @param {function(this:T, ?):?|{handleEvent:function(?):?}|null} listener
 *     Callback method, or an object with a handleEvent function.
 * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
 *     false).
 * @param {T=} opt_handler Element in whose scope to call the listener.
 * @template T
 */
export function listenWithWrapper<T>(src: (EventTarget | Listenable) | null, wrapper: EventWrapper | null, listener: (this: T, arg1: unknown) => unknown | {
    handleEvent: (arg0: unknown) => unknown;
} | null, opt_capt?: boolean | undefined, opt_handler?: T | undefined): void;
/**
 * Installs exception protection for the browser event entry point using the
 * given error handler.
 *
 * @param {?ErrorHandler} errorHandler Error handler with which to
 *     protect the entry point.
 */
export function protectBrowserEventEntryPoint(errorHandler: ErrorHandler | null): void;
/**
 * Removes all listeners from an object. You can also optionally
 * remove listeners of a particular type.
 *
 * @param {Object|undefined} obj Object to remove listeners from. Must be an
 *     EventTarget or a Listenable.
 * @param {string|!EventId=} opt_type Type of event to remove.
 *     Default is all types.
 * @return {number} Number of listeners removed.
 */
export function removeAll(obj: any | undefined, opt_type?: (string | EventId) | undefined): number;
/**
 * Removes an event listener which was added with listen().
 *
 * @param {?EventTarget|Listenable} src The target to stop
 *     listening to events on.
 * @param {string|Array<string>|
 *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
 *     type Event type or array of event types to unlisten to.
 * @param {function(?):?|{handleEvent:function(?):?}|null} listener The
 *     listener function to remove.
 * @param {(boolean|!EventListenerOptions)=} opt_options
 *     whether the listener is fired during the capture or bubble phase of the
 *     event.
 * @param {Object=} opt_handler Element in whose scope to call the listener.
 * @return {?boolean} indicating whether the listener was there to remove.
 * @suppress{checkTypes}
 * @template EVENTOBJ
 */
export function unlisten<EVENTOBJ = BrowserEvent>(src: (EventTarget | Listenable) | null, type: string | string[] | EventId<EVENTOBJ> | EventId<EVENTOBJ>[], listener: (...arg0: any[]) => unknown | {
    handleEvent: (arg0: unknown) => unknown;
} | null, opt_options?: (boolean | EventListenerOptions) | undefined, opt_handler?: any | undefined): boolean | null;
/**
 * Removes an event listener which was added with listen() by the key
 * returned by listen().
 *
 * @param {?Key} key The key returned by listen() for this
 *     event listener.
 * @return {boolean} indicating whether the listener was there to remove.
 * @suppress {checkTypes}
  * @suppress {checkTypes}
 */
export function unlistenByKey(key: Key | null): boolean;
/**
 * Removes an event listener which was added with listenWithWrapper().
 *
 * @param {?EventTarget|Listenable} src The target to stop
 *     listening to events on.
 * @param {?EventWrapper} wrapper Event wrapper to use.
 * @param {function(?):?|{handleEvent:function(?):?}|null} listener The
 *     listener function to remove.
 * @param {boolean=} opt_capt In DOM-compliant browsers, this determines
 *     whether the listener is fired during the capture or bubble phase of the
 *     event.
 * @param {Object=} opt_handler Element in whose scope to call the listener.
 */
export function unlistenWithWrapper(src: (EventTarget | Listenable) | null, wrapper: EventWrapper | null, listener: (arg0: unknown) => unknown | {
    handleEvent: (arg0: unknown) => unknown;
} | null, opt_capt?: boolean | undefined, opt_handler?: any | undefined): void;
/**
 * @param {Object|Function} listener The listener function or an
 *     object that contains handleEvent method.
 * @return {!Function} Either the original function or a function that
 *     calls obj.handleEvent. If the same listener is passed to this
 *     function more than once, the same function is guaranteed to be
 *     returned.
 */
export function wrapListener(listener: any | Function): Function;
import { Disposable as GoogDisposable } from "../disposable/disposable.js";
import { EventId } from "./eventid.js";
import { Event as EventsEvent } from "./event.js";
import { EventLike } from "./event.js";
import { ErrorHandler } from "../debug/errorhandler.js";
export { events_EventTarget as EventTarget };

import { BrowserEvent } from './browserevent';