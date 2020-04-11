import * as googarray from './../array/array.js';
import * as googasserts from './../asserts/asserts.js';
import * as asserts from './../asserts/asserts.js';
import * as entryPointRegistry from './../debug/entrypointregistry.js';
import {ErrorHandler} from './../debug/errorhandler.js';
import {Disposable as GoogDisposable} from './../disposable/disposable.js';
import {Disposable} from './../disposable/disposable.js';
import * as google from './../google.js';
import * as goog_objects from './../object/object.js';
import * as goog_object from './../object/object.js';
import {BrowserEvent as EventsBrowserEvent} from './browserevent.js';
import {BrowserFeature} from './browserfeature.js';
import {Event as EventsEvent} from './event.js';
import {EventLike} from './event.js';
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
class EventHandler extends Disposable {

  /**
   * Super class for objects that want to easily manage a number of event
   * listeners.  It allows a short cut to listen and also provides a quick way
   * to remove all events listeners belonging to this object.
   * @param {SCOPE=} opt_scope Object in whose scope to call the listeners.
   * @template SCOPE
   */
  constructor(opt_scope) {
    super();
    // TODO(mknichel): Rename this to this.scope_ and fix the classes in google3
    // that access this private variable. :(
    this.handler_ = opt_scope;
  
    /**
     * Keys for events that are being listened to.
     * @type {!Object<!Key>}
     * @private
     */
    this.keys_ = {};
  }

  /**
   * Listen to an event on a Listenable.  If the function is omitted then the
   * EventHandler's handleEvent method will be used.
   * @param {ListenableType} src Event source.
   * @param {string|Array<string>|
   *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
   *     type Event type to listen for or array of event types.
   * @param {function(this:SCOPE, EVENTOBJ):?|{handleEvent:function(?):?}|null=}
   *     opt_fn Optional callback function to be used as the listener or an object
   *     with handleEvent function.
   * @param {(boolean|!AddEventListenerOptions)=} opt_options
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template EVENTOBJ, THIS
   * @suppress{checkTypes}
   */
  listen(
      src, type, opt_fn, opt_options) {
    var self = /** @type {!EventHandler} */ (this);
    return self.listen_(src, type, opt_fn, opt_options);
  };

  /**
   * Listen to an event on a Listenable.  If the function is omitted then the
   * EventHandler's handleEvent method will be used.
   * @param {ListenableType} src Event source.
   * @param {string|Array<string>|
   *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
   *     type Event type to listen for or array of event types.
   * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(this:T, ?):?}|
   *     null|undefined} fn Optional callback function to be used as the
   *     listener or an object with handleEvent function.
   * @param {boolean|!AddEventListenerOptions|undefined} options
   * @param {T} scope Object in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template T, EVENTOBJ, THIS
   */
  listenWithScope(
      src, type, fn, options, scope) {
    var self = /** @type {!EventHandler} */ (this);
    // TODO(mknichel): Deprecate this function.
    return self.listen_(src, type, fn, options, scope);
  };

  /**
   * Listen to an event on a Listenable.  If the function is omitted then the
   * EventHandler's handleEvent method will be used.
   * @param {ListenableType} src Event source.
   * @param {string|Array<string>|
   *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
   *     type Event type to listen for or array of event types.
   * @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
   *     Optional callback function to be used as the listener or an object with
   *     handleEvent function.
   * @param {(boolean|!AddEventListenerOptions)=} opt_options
   * @param {Object=} opt_scope Object in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template EVENTOBJ, THIS
   * @suppress{checkTypes}
   * @private
   */
  listen_(
      src, type, opt_fn, opt_options, opt_scope) {
    var self = /** @type {!EventHandler} */ (this);
    if (!google.isArray(type)) {
      if (type) {
        EventHandler.typeArray_[0] = type.toString();
      }
      type = EventHandler.typeArray_;
    }
    for (var i = 0; i < type.length; i++) {
      var listenerObj = listen(
          src, type[i], opt_fn || self.handleEvent, opt_options || false,
          opt_scope || self.handler_ || self);
  
      if (!listenerObj) {
        // When listen run on OFF_AND_FAIL or OFF_AND_SILENT
        // (CaptureSimulationMode) in IE8-, it will return null
        // value.
        return self;
      }
  
      var key = listenerObj.key;
      self.keys_[key] = listenerObj;
    }
  
    return self;
  };

  /**
   * Listen to an event on a Listenable.  If the function is omitted, then the
   * EventHandler's handleEvent method will be used. After the event has fired the
   * event listener is removed from the target. If an array of event types is
   * provided, each event type will be listened to once.
   * @param {ListenableType} src Event source.
   * @param {string|Array<string>|
   *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
   *     type Event type to listen for or array of event types.
   * @param {function(this:SCOPE, EVENTOBJ):?|{handleEvent:function(?):?}|null=}
   * opt_fn
   *    Optional callback function to be used as the listener or an object with
   *    handleEvent function.
   * @param {(boolean|!AddEventListenerOptions)=} opt_options
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template EVENTOBJ, THIS
   * @suppress{checkTypes}
   */
  listenOnce(
      src, type, opt_fn, opt_options) {
    var self = /** @type {!EventHandler} */ (this);
    return self.listenOnce_(src, type, opt_fn, opt_options);
  };

  /**
   * Listen to an event on a Listenable.  If the function is omitted, then the
   * EventHandler's handleEvent method will be used. After the event has fired the
   * event listener is removed from the target. If an array of event types is
   * provided, each event type will be listened to once.
   * @param {ListenableType} src Event source.
   * @param {string|Array<string>|
   *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
   *     type Event type to listen for or array of event types.
   * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(this:T, ?):?}|
   *     null|undefined} fn Optional callback function to be used as the
   *     listener or an object with handleEvent function.
   * @param {boolean|undefined} capture Optional whether to use capture phase.
   * @param {T} scope Object in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template T, EVENTOBJ, THIS
   */
  listenOnceWithScope(
      src, type, fn, capture, scope) {
    var self = /** @type {!EventHandler} */ (this);
    // TODO(mknichel): Deprecate this function.
    return self.listenOnce_(src, type, fn, capture, scope);
  };

  /**
   * Listen to an event on a Listenable.  If the function is omitted, then the
   * EventHandler's handleEvent method will be used. After the event has fired
   * the event listener is removed from the target. If an array of event types is
   * provided, each event type will be listened to once.
   * @param {ListenableType} src Event source.
   * @param {string|Array<string>|
   *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
   *     type Event type to listen for or array of event types.
   * @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null=} opt_fn
   *    Optional callback function to be used as the listener or an object with
   *    handleEvent function.
   * @param {(boolean|!AddEventListenerOptions)=} opt_options
   * @param {Object=} opt_scope Object in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template EVENTOBJ, THIS
   * @suppress{checkTypes}
   * @private
   */
  listenOnce_(
      src, type, opt_fn, opt_options, opt_scope) {
    var self = /** @type {!EventHandler} */ (this);
    if (google.isArray(type)) {
      for (var i = 0; i < type.length; i++) {
        self.listenOnce_(src, type[i], opt_fn, opt_options, opt_scope);
      }
    } else {
      var listenerObj = listenOnce(
          src, type, opt_fn || self.handleEvent, opt_options,
          opt_scope || self.handler_ || self);
      if (!listenerObj) {
        // When listen run on OFF_AND_FAIL or OFF_AND_SILENT
        // (CaptureSimulationMode) in IE8-, it will return null
        // value.
        return self;
      }
  
      var key = listenerObj.key;
      self.keys_[key] = listenerObj;
    }
  
    return self;
  };

  /**
   * Adds an event listener with a specific event wrapper on a DOM Node or an
   * object that has implemented {@link events_EventTarget}. A listener can
   * only be added once to an object.
   *
   * @param {EventTarget|events_EventTarget} src The node to listen to
   *     events on.
   * @param {EventWrapper} wrapper Event wrapper to use.
   * @param {function(this:SCOPE, ?):?|{handleEvent:function(?):?}|null} listener
   *     Callback method, or an object with a handleEvent function.
   * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
   *     false).
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template THIS
   */
  listenWithWrapper(
      src, wrapper, listener, opt_capt) {
    var self = /** @type {!EventHandler} */ (this);
    // TODO(mknichel): Remove the opt_scope from this function and then
    // templatize it.
    return self.listenWithWrapper_(src, wrapper, listener, opt_capt);
  };

  /**
   * Adds an event listener with a specific event wrapper on a DOM Node or an
   * object that has implemented {@link events_EventTarget}. A listener can
   * only be added once to an object.
   *
   * @param {EventTarget|events_EventTarget} src The node to listen to
   *     events on.
   * @param {EventWrapper} wrapper Event wrapper to use.
   * @param {function(this:T, ?):?|{handleEvent:function(this:T, ?):?}|null}
   *     listener Optional callback function to be used as the
   *     listener or an object with handleEvent function.
   * @param {boolean|undefined} capture Optional whether to use capture phase.
   * @param {T} scope Object in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template T, THIS
   */
  listenWithWrapperAndScope(
      src, wrapper, listener, capture, scope) {
    var self = /** @type {!EventHandler} */ (this);
    // TODO(mknichel): Deprecate this function.
    return self.listenWithWrapper_(src, wrapper, listener, capture, scope);
  };

  /**
   * Adds an event listener with a specific event wrapper on a DOM Node or an
   * object that has implemented {@link events_EventTarget}. A listener can
   * only be added once to an object.
   *
   * @param {EventTarget|events_EventTarget} src The node to listen to
   *     events on.
   * @param {EventWrapper} wrapper Event wrapper to use.
   * @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
   *     method, or an object with a handleEvent function.
   * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
   *     false).
   * @param {Object=} opt_scope Element in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template THIS
   * @private
   */
  listenWithWrapper_(
      src, wrapper, listener, opt_capt, opt_scope) {
    var self = /** @type {!EventHandler} */ (this);
    wrapper.listen(
        src, listener, opt_capt, opt_scope || self.handler_ || self, self);
    return self;
  };

  /**
   * @return {number} Number of listeners registered by this handler.
   */
  getListenerCount() {
    var count = 0;
    for (var key in this.keys_) {
      if (Object.prototype.hasOwnProperty.call(this.keys_, key)) {
        count++;
      }
    }
    return count;
  };

  /**
   * Unlistens on an event.
   * @param {ListenableType} src Event source.
   * @param {string|Array<string>|
   *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
   *     type Event type or array of event types to unlisten to.
   * @param {function(this:?, EVENTOBJ):?|{handleEvent:function(?):?}|null=}
   *     opt_fn Optional callback function to be used as the listener or an object
   *     with handleEvent function.
   * @param {(boolean|!EventListenerOptions)=} opt_options
   * @param {Object=} opt_scope Object in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template EVENTOBJ, THIS
   * @suppress{checkTypes}
   */
  unlisten(
      src, type, opt_fn, opt_options, opt_scope) {
    var self = /** @type {!EventHandler} */ (this);
    if (google.isArray(type)) {
      for (var i = 0; i < type.length; i++) {
        self.unlisten(src, type[i], opt_fn, opt_options, opt_scope);
      }
    } else {
      var capture =
          google.isObject(opt_options) ? !!opt_options.capture : !!opt_options;
      var listener = getListener(
          src, type, opt_fn || self.handleEvent, capture,
          opt_scope || self.handler_ || self);
  
      if (listener) {
        unlistenByKey(listener);
        delete self.keys_[listener.key];
      }
    }
  
    return self;
  };

  /**
   * Removes an event listener which was added with listenWithWrapper().
   *
   * @param {EventTarget|events_EventTarget} src The target to stop
   *     listening to events on.
   * @param {EventWrapper} wrapper Event wrapper to use.
   * @param {function(?):?|{handleEvent:function(?):?}|null} listener The
   *     listener function to remove.
   * @param {boolean=} opt_capt In DOM-compliant browsers, this determines
   *     whether the listener is fired during the capture or bubble phase of the
   *     event.
   * @param {Object=} opt_scope Element in whose scope to call the listener.
   * @return {THIS} This object, allowing for chaining of calls.
   * @this {THIS}
   * @template THIS
   */
  unlistenWithWrapper(
      src, wrapper, listener, opt_capt, opt_scope) {
    var self = /** @type {!EventHandler} */ (this);
    wrapper.unlisten(
        src, listener, opt_capt, opt_scope || self.handler_ || self, self);
    return self;
  };

  /**
   * Unlistens to all events.
   */
  removeAll() {
    goog_object.forEach(this.keys_, function(listenerObj, key) {
      if (this.keys_.hasOwnProperty(key)) {
        unlistenByKey(listenerObj);
      }
    }, this);
  
    this.keys_ = {};
  };

  /**
   * Disposes of this EventHandler and removes all listeners that it registered.
   * @override
   * @protected
   */
  disposeInternal() {
    super.disposeInternal();
    this.removeAll();
  };

  /**
   * Default event handler
   * @param {EventsEvent} e Event object.
   */
  handleEvent(e) {
    throw new Error('EventHandler.handleEvent not implemented');
  };
}

/**
 * Utility array used to unify the cases of listening for an array of types
 * and listening for a single event, without using recursion or allocating
 * an array each time.
 * @type {!Array<string>}
 * @const
 * @private
 */
EventHandler.typeArray_ = [];

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

// IMPLEMENTATION NOTES:
// google.events stores an auxiliary data structure on each EventTarget
// source being listened on. This allows us to take advantage of GC,
// having the data structure GC'd when the EventTarget is GC'd. This
// GC behavior is equivalent to using W3C DOM Events directly.

/**
 * @typedef {number|ListenableKey}
 */
let Key;

/**
 * @typedef {EventTarget|Listenable}
 */
let ListenableType;

/**
 * Property name on a native event target for the listener map
 * associated with the event target.
 * @private @const {string}
 */
let LISTENER_MAP_PROP_ = 'closure_lm_' + ((Math.random() * 1e6) | 0);

/**
 * String used to prepend to IE event types.
 * @const
 * @private
 */
let onString_ = 'on';

/**
 * Map of computed "on<eventname>" strings for IE event types. Caching
 * this removes an extra object allocation in listen which
 * improves IE6 performance.
 * @const
 * @dict
 * @private
 */
let onStringMap_ = {};

/**
 * @enum {number} Different capture simulation mode for IE8-.
 */
let CaptureSimulationMode = {
  /**
   * Does not perform capture simulation. Will asserts in IE8- when you
   * add capture listeners.
   */
  OFF_AND_FAIL: 0,

  /**
   * Does not perform capture simulation, silently ignore capture
   * listeners.
   */
  OFF_AND_SILENT: 1,

  /**
   * Performs capture simulation.
   */
  ON: 2
};

/**
 * @type {number} The capture simulation mode for IE8-. By default,
 *     this is ON.
 */
const CAPTURE_SIMULATION_MODE = 2;

/**
 * Estimated count of total native listeners.
 * @private {number}
 */
let listenerCountEstimate_ = 0;

/**
 * Adds an event listener for a specific event on a native event
 * target (such as a DOM element) or an object that has implemented
 * {@link Listenable}. A listener can only be added once
 * to an object and if it is added again the key for the listener is
 * returned. Note that if the existing listener is a one-off listener
 * (registered via listenOnce), it will no longer be a one-off
 * listener after a call to listen().
 *
 * @param {EventTarget|Listenable} src The node to listen
 *     to events on.
 * @param {string|Array<string>|
 *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
 *     type Event type or array of event types.
 * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(?):?}|null}
 *     listener Callback method, or an object with a handleEvent function.
 *     WARNING: passing an Object is now softly deprecated.
 * @param {(boolean|!AddEventListenerOptions)=} opt_options
 * @param {T=} opt_handler Element in whose scope to call the listener.
 * @return {Key} Unique key for the listener.
 * @template T,EVENTOBJ
 * @suppress{checkTypes}
 */
function listen(src, type, listener, opt_options, opt_handler) {
  if (opt_options && opt_options.once) {
    return listenOnce(
        src, type, listener, opt_options, opt_handler);
  }
  if (google.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      listen(src, type[i], listener, opt_options, opt_handler);
    }
    return null;
  }

  listener = wrapListener(listener);
  if (Listenable.isImplementedBy(src)) {
    var capture =
        google.isObject(opt_options) ? !!opt_options.capture : !!opt_options;
    return src.listen(
        /** @type {string|!EventId} */ (type), listener, capture,
        opt_handler);
  } else {
    return listen_(
        /** @type {!EventTarget} */ (src), type, listener,
        /* callOnce */ false, opt_options, opt_handler);
  }
};

/**
 * Adds an event listener for a specific event on a native event
 * target. A listener can only be added once to an object and if it
 * is added again the key for the listener is returned.
 *
 * Note that a one-off listener will not change an existing listener,
 * if any. On the other hand a normal listener will change existing
 * one-off listener to become a normal listener.
 *
 * @param {EventTarget} src The node to listen to events on.
 * @param {string|?EventId<EVENTOBJ>} type Event type.
 * @param {!Function} listener Callback function.
 * @param {boolean} callOnce Whether the listener is a one-off
 *     listener or otherwise.
 * @param {(boolean|!AddEventListenerOptions)=} opt_options
 * @param {Object=} opt_handler Element in whose scope to call the listener.
 * @return {ListenableKey} Unique key for the listener.
 * @template EVENTOBJ
 * @private
 */
function listen_(
    src, type, listener, callOnce, opt_options, opt_handler) {
  if (!type) {
    throw new Error('Invalid event type');
  }

  var capture =
      google.isObject(opt_options) ? !!opt_options.capture : !!opt_options;
  if (capture && !BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    if (CAPTURE_SIMULATION_MODE ==
        CaptureSimulationMode.OFF_AND_FAIL) {
      asserts.fail('Can not register capture listener in IE8-.');
      return null;
    } else if (
        CAPTURE_SIMULATION_MODE ==
        CaptureSimulationMode.OFF_AND_SILENT) {
      return null;
    }
  }

  var listenerMap = getListenerMap_(src);
  if (!listenerMap) {
    src[LISTENER_MAP_PROP_] = listenerMap =
        new ListenerMap(src);
  }

  var listenerObj = /** @type {Listener} */ (
      listenerMap.add(type, listener, callOnce, capture, opt_handler));

  // If the listenerObj already has a proxy, it has been set up
  // previously. We simply return.
  if (listenerObj.proxy) {
    return listenerObj;
  }

  var proxy = getProxy();
  listenerObj.proxy = proxy;

  proxy.src = src;
  proxy.listener = listenerObj;

  // Attach the proxy through the browser's API
  if (src.addEventListener) {
    // Don't pass an object as `capture` if the browser doesn't support that.
    if (!BrowserFeature.PASSIVE_EVENTS) {
      opt_options = capture;
    }
    // Don't break tests that expect a boolean.
    if (opt_options === undefined) opt_options = false;
    src.addEventListener(type.toString(), proxy, opt_options);
  } else if (src.attachEvent) {
    // The else if above used to be an unconditional else. It would call
    // exception on IE11, spoiling the day of some callers. The previous
    // incarnation of this code, from 2007, indicates that it replaced an
    // earlier still version that caused excess allocations on IE6.
    src.attachEvent(getOnString_(type.toString()), proxy);
  } else if (src.addListener && src.removeListener) {
    // In IE, MediaQueryList uses addListener() insteadd of addEventListener. In
    // Safari, there is no global for the MediaQueryList constructor, so we just
    // check whether the object "looks like" MediaQueryList.
    asserts.assert(
        type === 'change', 'MediaQueryList only has a change event');
    src.addListener(proxy);
  } else {
    throw new Error('addEventListener and attachEvent are unavailable.');
  }

  listenerCountEstimate_++;
  return listenerObj;
};

/**
 * Helper function for returning a proxy function.
 * @return {!Function} A new or reused function object.
 */
function getProxy() {
  var proxyCallbackFunction = handleBrowserEvent_;
  // Use a local var f to prevent one allocation.
  var f =
      BrowserFeature.HAS_W3C_EVENT_SUPPORT ? function(eventObject) {
        return proxyCallbackFunction.call(f.src, f.listener, eventObject);
      } : function(eventObject) {
        var v = proxyCallbackFunction.call(f.src, f.listener, eventObject);
        // NOTE(chrishenry): In IE, we hack in a capture phase. However, if
        // there is inline event handler which tries to prevent default (for
        // example <a href="..." onclick="return false">...</a>) in a
        // descendant element, the prevent default will be overridden
        // by this listener if this listener were to return true. Hence, we
        // return undefined.
        if (!v) return v;
      };
  return f;
};

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
 * @param {EventTarget|Listenable} src The node to listen
 *     to events on.
 * @param {string|Array<string>|
 *     !EventId<EVENTOBJ>|!Array<!EventId<EVENTOBJ>>}
 *     type Event type or array of event types.
 * @param {function(this:T, EVENTOBJ):?|{handleEvent:function(?):?}|null}
 *     listener Callback method.
 * @param {(boolean|!AddEventListenerOptions)=} opt_options
 * @param {T=} opt_handler Element in whose scope to call the listener.
 * @return {Key} Unique key for the listener.
 * @template T,EVENTOBJ
 * @suppress{checkTypes}
 */
function listenOnce(
    src, type, listener, opt_options, opt_handler) {
  if (google.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      listenOnce(src, type[i], listener, opt_options, opt_handler);
    }
    return null;
  }

  listener = wrapListener(listener);
  if (Listenable.isImplementedBy(src)) {
    var capture =
        google.isObject(opt_options) ? !!opt_options.capture : !!opt_options;
    return src.listenOnce(
        /** @type {string|!EventId} */ (type), listener, capture,
        opt_handler);
  } else {
    return listen_(
        /** @type {!EventTarget} */ (src), type, listener,
        /* callOnce */ true, opt_options, opt_handler);
  }
};

/**
 * Adds an event listener with a specific event wrapper on a DOM Node or an
 * object that has implemented {@link Listenable}. A listener can
 * only be added once to an object.
 *
 * @param {EventTarget|Listenable} src The target to
 *     listen to events on.
 * @param {EventWrapper} wrapper Event wrapper to use.
 * @param {function(this:T, ?):?|{handleEvent:function(?):?}|null} listener
 *     Callback method, or an object with a handleEvent function.
 * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
 *     false).
 * @param {T=} opt_handler Element in whose scope to call the listener.
 * @template T
 */
function listenWithWrapper(
    src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.listen(src, listener, opt_capt, opt_handler);
};

/**
 * Removes an event listener which was added with listen().
 *
 * @param {EventTarget|Listenable} src The target to stop
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
function unlisten(src, type, listener, opt_options, opt_handler) {
  if (google.isArray(type)) {
    for (var i = 0; i < type.length; i++) {
      unlisten(src, type[i], listener, opt_options, opt_handler);
    }
    return null;
  }
  var capture =
      google.isObject(opt_options) ? !!opt_options.capture : !!opt_options;

  listener = wrapListener(listener);
  if (Listenable.isImplementedBy(src)) {
    return src.unlisten(
        /** @type {string|!EventId} */ (type), listener, capture,
        opt_handler);
  }

  if (!src) {
    // TODO(chrishenry): We should tighten the API to only accept
    // non-null objects, or add an assertion here.
    return false;
  }

  var listenerMap = getListenerMap_(
      /** @type {!EventTarget} */ (src));
  if (listenerMap) {
    var listenerObj = listenerMap.getListener(
        /** @type {string|!EventId} */ (type), listener, capture,
        opt_handler);
    if (listenerObj) {
      return unlistenByKey(listenerObj);
    }
  }

  return false;
};

/**
 * Removes an event listener which was added with listen() by the key
 * returned by listen().
 *
 * @param {Key} key The key returned by listen() for this
 *     event listener.
 * @return {boolean} indicating whether the listener was there to remove.
 * @suppress {checkTypes}
  * @suppress {checkTypes}
 */
function unlistenByKey(key) {
  // TODO(chrishenry): Remove this check when tests that rely on this
  // are fixed.
  if (typeof key === 'number') {
    return false;
  }

  var listener = /** @type {?Listener|undefined} */ (key);
  if (!listener || listener.removed) {
    return false;
  }

  var src = listener.src;
  if (Listenable.isImplementedBy(src)) {
    return /** @type {!Listenable} */ (src).unlistenByKey(listener);
  }

  var type = listener.type;
  var proxy = listener.proxy;
  if (src.removeEventListener) {
    src.removeEventListener(type, proxy, listener.capture);
  } else if (src.detachEvent) {
    src.detachEvent(getOnString_(type), proxy);
  } else if (src.addListener && src.removeListener) {
    src.removeListener(proxy);
  }
  listenerCountEstimate_--;

  var listenerMap = getListenerMap_(
      /** @type {!EventTarget} */ (src));
  // TODO(chrishenry): Try to remove this conditional and execute the
  // first branch always. This should be safe.
  if (listenerMap) {
    listenerMap.removeByKey(listener);
    if (listenerMap.getTypeCount() == 0) {
      // Null the src, just because this is simple to do (and useful
      // for IE <= 7).
      listenerMap.src = null;
      // We don't use delete here because IE does not allow delete
      // on a window object.
      src[LISTENER_MAP_PROP_] = null;
    }
  } else {
    /** @type {!Listener} */ (listener).markAsRemoved();
  }

  return true;
};

/**
 * Removes an event listener which was added with listenWithWrapper().
 *
 * @param {EventTarget|Listenable} src The target to stop
 *     listening to events on.
 * @param {EventWrapper} wrapper Event wrapper to use.
 * @param {function(?):?|{handleEvent:function(?):?}|null} listener The
 *     listener function to remove.
 * @param {boolean=} opt_capt In DOM-compliant browsers, this determines
 *     whether the listener is fired during the capture or bubble phase of the
 *     event.
 * @param {Object=} opt_handler Element in whose scope to call the listener.
 */
function unlistenWithWrapper(
    src, wrapper, listener, opt_capt, opt_handler) {
  wrapper.unlisten(src, listener, opt_capt, opt_handler);
};

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
function removeAll(obj, opt_type) {
  // TODO(chrishenry): Change the type of obj to
  // (!EventTarget|!Listenable).

  if (!obj) {
    return 0;
  }

  if (Listenable.isImplementedBy(obj)) {
    return /** @type {?} */ (obj).removeAllListeners(opt_type);
  }

  var listenerMap = getListenerMap_(
      /** @type {!EventTarget} */ (obj));
  if (!listenerMap) {
    return 0;
  }

  var count = 0;
  var typeStr = opt_type && opt_type.toString();
  for (var type in listenerMap.listeners) {
    if (!typeStr || type == typeStr) {
      // Clone so that we don't need to worry about unlistenByKey
      // changing the content of the ListenerMap.
      var listeners = listenerMap.listeners[type].concat();
      for (var i = 0; i < listeners.length; ++i) {
        if (unlistenByKey(listeners[i])) {
          ++count;
        }
      }
    }
  }
  return count;
};

/**
 * Gets the listeners for a given object, type and capture phase.
 *
 * @param {Object} obj Object to get listeners for.
 * @param {string|!EventId} type Event type.
 * @param {boolean} capture Capture phase?.
 * @return {Array<!Listener>} Array of listener objects.
 */
function getListeners(obj, type, capture) {
  if (Listenable.isImplementedBy(obj)) {
    return /** @type {!Listenable} */ (obj).getListeners(
        type, capture);
  } else {
    if (!obj) {
      // TODO(chrishenry): We should tighten the API to accept
      // !EventTarget|Listenable, and add an assertion here.
      return [];
    }

    var listenerMap = getListenerMap_(
        /** @type {!EventTarget} */ (obj));
    return listenerMap ? listenerMap.getListeners(type, capture) : [];
  }
};

/**
 * Gets the Listener for the event or null if no such listener is
 * in use.
 *
 * @param {EventTarget|Listenable} src The target from
 *     which to get listeners.
 * @param {?string|!EventId<EVENTOBJ>} type The type of the event.
 * @param {function(EVENTOBJ):?|{handleEvent:function(?):?}|null} listener The
 *     listener function to get.
 * @param {boolean=} opt_capt In DOM-compliant browsers, this determines
 *                            whether the listener is fired during the
 *                            capture or bubble phase of the event.
 * @param {Object=} opt_handler Element in whose scope to call the listener.
 * @return {ListenableKey} the found listener or null if not found.
 * @template EVENTOBJ
 */
function getListener(src, type, listener, opt_capt, opt_handler) {
  // TODO(chrishenry): Change type from ?string to string, or add assertion.
  type = /** @type {string} */ (type);
  listener = wrapListener(listener);
  var capture = !!opt_capt;
  if (Listenable.isImplementedBy(src)) {
    return src.getListener(type, listener, capture, opt_handler);
  }

  if (!src) {
    // TODO(chrishenry): We should tighten the API to only accept
    // non-null objects, or add an assertion here.
    return null;
  }

  var listenerMap = getListenerMap_(
      /** @type {!EventTarget} */ (src));
  if (listenerMap) {
    return listenerMap.getListener(type, listener, capture, opt_handler);
  }
  return null;
};

/**
 * Returns whether an event target has any active listeners matching the
 * specified signature. If either the type or capture parameters are
 * unspecified, the function will match on the remaining criteria.
 *
 * @param {EventTarget|Listenable} obj Target to get
 *     listeners for.
 * @param {string|!EventId=} opt_type Event type.
 * @param {boolean=} opt_capture Whether to check for capture or bubble-phase
 *     listeners.
 * @return {boolean} Whether an event target has one or more listeners matching
 *     the requested type and/or capture phase.
 */
function hasListener(obj, opt_type, opt_capture) {
  if (Listenable.isImplementedBy(obj)) {
    return obj.hasListener(opt_type, opt_capture);
  }

  var listenerMap = getListenerMap_(
      /** @type {!EventTarget} */ (obj));
  return !!listenerMap && listenerMap.hasListener(opt_type, opt_capture);
};

/**
 * Provides a nice string showing the normalized event objects public members
 * @param {Object} e Event Object.
 * @return {string} String of the public members of the normalized event object.
 */
function expose(e) {
  var str = [];
  for (var key in e) {
    if (e[key] && e[key].id) {
      str.push(key + ' = ' + e[key] + ' (' + e[key].id + ')');
    } else {
      str.push(key + ' = ' + e[key]);
    }
  }
  return str.join('\n');
};

/**
 * Returns a string with on prepended to the specified type. This is used for IE
 * which expects "on" to be prepended. This function caches the string in order
 * to avoid extra allocations in steady state.
 * @param {string} type Event type.
 * @return {string} The type string with 'on' prepended.
 * @private
 */
function getOnString_(type) {
  if (type in onStringMap_) {
    return onStringMap_[type];
  }
  return onStringMap_[type] = onString_ + type;
};

/**
 * Fires an object's listeners of a particular type and phase
 *
 * @param {Object} obj Object whose listeners to call.
 * @param {string|!EventId} type Event type.
 * @param {boolean} capture Which event phase.
 * @param {Object} eventObject Event object to be passed to listener.
 * @return {boolean} True if all listeners returned true else false.
 */
function fireListeners(obj, type, capture, eventObject) {
  if (Listenable.isImplementedBy(obj)) {
    return /** @type {!Listenable} */ (obj).fireListeners(
        type, capture, eventObject);
  }

  return fireListeners_(obj, type, capture, eventObject);
};

/**
 * Fires an object's listeners of a particular type and phase.
 * @param {Object} obj Object whose listeners to call.
 * @param {string|!EventId} type Event type.
 * @param {boolean} capture Which event phase.
 * @param {Object} eventObject Event object to be passed to listener.
 * @return {boolean} True if all listeners returned true else false.
 * @private
 */
function fireListeners_(obj, type, capture, eventObject) {
  /** @type {boolean} */
  var retval = true;

  var listenerMap = getListenerMap_(
      /** @type {EventTarget} */ (obj));
  if (listenerMap) {
    // TODO(chrishenry): Original code avoids array creation when there
    // is no listener, so we do the same. If this optimization turns
    // out to be not required, we can replace this with
    // listenerMap.getListeners(type, capture) instead, which is simpler.
    var listenerArray = listenerMap.listeners[type.toString()];
    if (listenerArray) {
      listenerArray = listenerArray.concat();
      for (var i = 0; i < listenerArray.length; i++) {
        var listener = listenerArray[i];
        // We might not have a listener if the listener was removed.
        if (listener && listener.capture == capture && !listener.removed) {
          var result = fireListener(listener, eventObject);
          retval = retval && (result !== false);
        }
      }
    }
  }
  return retval;
};

/**
 * Fires a listener with a set of arguments
 *
 * @param {Listener} listener The listener object to call.
 * @param {Object} eventObject The event object to pass to the listener.
 * @return {*} Result of listener.
 */
function fireListener(listener, eventObject) {
  var listenerFn = listener.listener;
  var listenerHandler = listener.handler || listener.src;

  if (listener.callOnce) {
    unlistenByKey(listener);
  }
  return listenerFn.call(listenerHandler, eventObject);
};

/**
 * Gets the total number of listeners currently in the system.
 * @return {number} Number of listeners.
 * @deprecated This returns estimated count, now that Closure no longer
 * stores a central listener registry. We still return an estimation
 * to keep existing listener-related tests passing. In the near future,
 * this function will be removed.
 */
function getTotalListenerCount() {
  return listenerCountEstimate_;
};

/**
 * Dispatches an event (or event like object) and calls all listeners
 * listening for events of this type. The type of the event is decided by the
 * type property on the event object.
 *
 * If any of the listeners returns false OR calls preventDefault then this
 * function will return false.  If one of the capture listeners calls
 * stopPropagation, then the bubble listeners won't fire.
 *
 * @param {Listenable} src The event target.
 * @param {EventLike} e Event object.
 * @return {boolean} If anyone called preventDefault on the event object (or
 *     if any of the handlers returns false) this will also return false.
 *     If there are no handlers, or if all handlers return true, this returns
 *     true.
 */
function dispatchEvent(src, e) {
  asserts.assert(
      Listenable.isImplementedBy(src),
      'Can not use dispatchEvent with ' +
          'non-Listenable instance.');
  return src.dispatchEvent(e);
};

/**
 * Installs exception protection for the browser event entry point using the
 * given error handler.
 *
 * @param {ErrorHandler} errorHandler Error handler with which to
 *     protect the entry point.
 */
function protectBrowserEventEntryPoint(errorHandler) {
  handleBrowserEvent_ =
      errorHandler.protectEntryPoint(handleBrowserEvent_);
};

/**
 * Handles an event and dispatches it to the correct listeners. This
 * function is a proxy for the real listener the user specified.
 *
 * @param {Listener} listener The listener object.
 * @param {Event=} opt_evt Optional event object that gets passed in via the
 *     native event handlers.
 * @return {*} Result of the event handler.
 * @this {EventTarget} The object or Element that fired the event.
 * @private
 */
function handleBrowserEvent_(listener, opt_evt) {
  if (listener.removed) {
    return true;
  }

  // Synthesize event propagation if the browser does not support W3C
  // event model.
  if (!BrowserFeature.HAS_W3C_EVENT_SUPPORT) {
    var ieEvent = opt_evt ||
        /** @type {Event} */ (google.getObjectByName('window.event'));
    var evt = new EventsBrowserEvent(ieEvent, this);
    /** @type {*} */
    var retval = true;

    if (CAPTURE_SIMULATION_MODE ==
        CaptureSimulationMode.ON) {
      // If we have not marked this event yet, we should perform capture
      // simulation.
      if (!isMarkedIeEvent_(ieEvent)) {
        markIeEvent_(ieEvent);

        var ancestors = [];
        for (var parent = evt.currentTarget; parent;
             parent = parent.parentNode) {
          ancestors.push(parent);
        }

        // Fire capture listeners.
        var type = listener.type;
        for (var i = ancestors.length - 1; !evt.propagationStopped_ && i >= 0;
             i--) {
          evt.currentTarget = ancestors[i];
          var result =
              fireListeners_(ancestors[i], type, true, evt);
          retval = retval && result;
        }

        // Fire bubble listeners.
        //
        // We can technically rely on IE to perform bubble event
        // propagation. However, it turns out that IE fires events in
        // opposite order of attachEvent registration, which broke
        // some code and tests that rely on the order. (While W3C DOM
        // Level 2 Events TR leaves the event ordering unspecified,
        // modern browsers and W3C DOM Level 3 Events Working Draft
        // actually specify the order as the registration order.)
        for (var i = 0; !evt.propagationStopped_ && i < ancestors.length; i++) {
          evt.currentTarget = ancestors[i];
          var result =
              fireListeners_(ancestors[i], type, false, evt);
          retval = retval && result;
        }
      }
    } else {
      retval = fireListener(listener, evt);
    }
    return retval;
  }

  // Otherwise, simply fire the listener.
  return fireListener(
      listener, new EventsBrowserEvent(opt_evt, this));
};

/**
 * This is used to mark the IE event object so we do not do the Closure pass
 * twice for a bubbling event.
 * @param {Event} e The IE browser event.
 * @private
 */
function markIeEvent_(e) {
  // Only the keyCode and the returnValue can be changed. We use keyCode for
  // non keyboard events.
  // event.returnValue is a bit more tricky. It is undefined by default. A
  // boolean false prevents the default action. In a window.onbeforeunload and
  // the returnValue is non undefined it will be alerted. However, we will only
  // modify the returnValue for keyboard events. We can get a problem if non
  // closure events sets the keyCode or the returnValue

  var useReturnValue = false;

  if (e.keyCode == 0) {
    // We cannot change the keyCode in case that srcElement is input[type=file].
    // We could test that that is the case but that would allocate 3 objects.
    // If we use try/catch we will only allocate extra objects in the case of a
    // failure.

    try {
      e.keyCode = -1;
      return;
    } catch (ex) {
      useReturnValue = true;
    }
  }

  if (useReturnValue ||
      /** @type {boolean|undefined} */ (e.returnValue) == undefined) {
    e.returnValue = true;
  }
};

/**
 * This is used to check if an IE event has already been handled by the Closure
 * system so we do not do the Closure pass twice for a bubbling event.
 * @param {Event} e  The IE browser event.
 * @return {boolean} True if the event object has been marked.
 * @private
 */
function isMarkedIeEvent_(e) {
  return e.keyCode < 0 || e.returnValue != undefined;
};

/**
 * Counter to create unique event ids.
 * @private {number}
 */
let uniqueIdCounter_ = 0;

/**
 * Creates a unique event id.
 *
 * @param {string} identifier The identifier.
 * @return {string} A unique identifier.
 * @idGenerator {unique}
 */
function getUniqueId(identifier) {
  return identifier + '_' + uniqueIdCounter_++;
};

/**
 * @param {EventTarget} src The source object.
 * @return {ListenerMap} A listener map for the given
 *     source object, or null if none exists.
 * @private
 */
function getListenerMap_(src) {
  var listenerMap = src[LISTENER_MAP_PROP_];
  // IE serializes the property as well (e.g. when serializing outer
  // HTML). So we must check that the value is of the correct type.
  return listenerMap instanceof ListenerMap ? listenerMap : null;
};

/**
 * Expando property for listener function wrapper for Object with
 * handleEvent.
 * @private @const {string}
 */
let LISTENER_WRAPPER_PROP_ =
    '__closure_events_fn_' + ((Math.random() * 1e9) >>> 0);

/**
 * @param {Object|Function} listener The listener function or an
 *     object that contains handleEvent method.
 * @return {!Function} Either the original function or a function that
 *     calls obj.handleEvent. If the same listener is passed to this
 *     function more than once, the same function is guaranteed to be
 *     returned.
 */
function wrapListener(listener) {
  asserts.assert(listener, 'Listener can not be null.');

  if (google.isFunction(listener)) {
    return /** @type {!Function} */ (listener);
  }

  asserts.assert(
      listener.handleEvent, 'An object listener must have handleEvent method.');
  if (!listener[LISTENER_WRAPPER_PROP_]) {
    listener[LISTENER_WRAPPER_PROP_] = function(e) {
      return /** @type {?} */ (listener).handleEvent(e);
    };
  }
  return listener[LISTENER_WRAPPER_PROP_];
};

// Register the browser event handler as an entry point, so that
// it can be monitored for exception handling, etc.
entryPointRegistry.register(
    /**
     * @param {function(!Function): !Function} transformer The transforming
     *     function.
     */
    function(transformer) {
      handleBrowserEvent_ =
          transformer(handleBrowserEvent_);
    });

// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Definition of the EventWrapper interface.
 */

/**
 * Interface for event wrappers.
 * @interface
 */
class EventWrapper {

  /**
   * Interface for event wrappers.
   */
  constructor() {}

  /**
   * Adds an event listener using the wrapper on a DOM Node or an object that has
   * implemented {@link events_EventTarget}. A listener can only be added
   * once to an object.
   *
   * @param {ListenableType} src The node to listen to events on.
   * @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
   *     method, or an object with a handleEvent function.
   * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
   *     false).
   * @param {Object=} opt_scope Element in whose scope to call the listener.
   * @param {EventHandler=} opt_eventHandler Event handler to add
   *     listener to.
   */
  listen(
      src, listener, opt_capt, opt_scope, opt_eventHandler) {};

  /**
   * Removes an event listener added using EventWrapper.listen.
   *
   * @param {ListenableType} src The node to remove listener from.
   * @param {function(?):?|{handleEvent:function(?):?}|null} listener Callback
   *     method, or an object with a handleEvent function.
   * @param {boolean=} opt_capt Whether to fire in capture phase (defaults to
   *     false).
   * @param {Object=} opt_scope Element in whose scope to call the listener.
   * @param {EventHandler=} opt_eventHandler Event handler to remove
   *     listener from.
   */
  unlisten(
      src, listener, opt_capt, opt_scope, opt_eventHandler) {};
}

// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
class Listenable {

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
   * @see google.events
   * @see http://www.w3.org/TR/DOM-Level-2-Events/events.html
   */
  constructor() {}

  /**
   * Marks a given class (constructor) as an implementation of
   * Listenable, so that we can query that fact at runtime. The class
   * must have already implemented the interface.
   * @param {function(new:Listenable,...)} cls The class constructor.
   *     The corresponding class must have already implemented the interface.
   */
  static addImplementation(cls) {
    cls.prototype[Listenable.IMPLEMENTED_BY_PROP] = true;
  };

  /**
   * @param {Object} obj The object to check.
   * @return {boolean} Whether a given instance implements Listenable. The
   *     class/superclass of the instance must call addImplementation.
   */
  static isImplementedBy(obj) {
    return !!(obj && obj[Listenable.IMPLEMENTED_BY_PROP]);
  };

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
  listen(type, listener, opt_useCapture, opt_listenerScope) {}

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
  listenOnce(type, listener, opt_useCapture, opt_listenerScope) {}

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
  unlisten(type, listener, opt_useCapture, opt_listenerScope) {}

  /**
   * Removes an event listener which was added with listen() by the key
   * returned by listen().
   *
   * @param {!ListenableKey} key The key returned by
   *     listen() or listenOnce().
   * @return {boolean} Whether any listener was removed.
   */
  unlistenByKey(key) {}

  /**
   * Dispatches an event (or event like object) and calls all listeners
   * listening for events of this type. The type of the event is decided by the
   * type property on the event object.
   *
   * If any of the listeners returns false OR calls preventDefault then this
   * function will return false.  If one of the capture listeners calls
   * stopPropagation, then the bubble listeners won't fire.
   *
   * @param {EventLike} e Event object.
   * @return {boolean} If anyone called preventDefault on the event object (or
   *     if any of the listeners returns false) this will also return false.
   */
  dispatchEvent(e) {}

  /**
   * Removes all listeners from this listenable. If type is specified,
   * it will only remove listeners of the particular type. otherwise all
   * registered listeners will be removed.
   *
   * @param {string=} opt_type Type of event to remove, default is to
   *     remove all types.
   * @return {number} Number of listeners removed.
   */
  removeAllListeners(opt_type) {}

  /**
   * Returns the parent of this event target to use for capture/bubble
   * mechanism.
   *
   * NOTE(chrishenry): The name reflects the original implementation of
   * custom event target (`events_EventTarget`). We decided
   * that changing the name is not worth it.
   *
   * @return {Listenable} The parent EventTarget or null if
   *     there is no parent.
   */
  getParentEventTarget() {}

  /**
   * Fires all registered listeners in this listenable for the given
   * type and capture mode, passing them the given eventObject. This
   * does not perform actual capture/bubble. Only implementors of the
   * interface should be using this.
   *
   * @param {string|!EventId<EVENTOBJ>} type The type of the
   *     listeners to fire.
   * @param {boolean} capture The capture mode of the listeners to fire.
   * @param {EVENTOBJ} eventObject The event object to fire.
   * @return {boolean} Whether all listeners succeeded without
   *     attempting to prevent default behavior. If any listener returns
   *     false or called EventsEvent#preventDefault, this returns
   *     false.
   * @template EVENTOBJ
   */
  fireListeners(type, capture, eventObject) {}

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
  getListeners(type, capture) {}

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
   * @return {ListenableKey} the found listener or null if not found.
   * @template SCOPE,EVENTOBJ
   */
  getListener(type, listener, capture, opt_listenerScope) {}

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
  hasListener(opt_type, opt_capture) {}
}

/**
 * An expando property to indicate that an object implements
 * Listenable.
 *
 * See addImplementation/isImplementedBy.
 *
 * @type {string}
 * @const
 */
Listenable.IMPLEMENTED_BY_PROP =
    'closure_listenable_' + ((Math.random() * 1e6) | 0);

/**
 * An interface that describes a single registered listener.
 * @interface
 */
class ListenableKey {

  /**
   * An interface that describes a single registered listener.
   */
  constructor() {
    /**
     * The source event target.
     * @type {Object|Listenable|events_EventTarget}
     */
    this.src = null;
  
    /**
     * The event type the listener is listening to.
     * @type {string|null}
     */
    this.type = null;
  
    /**
     * The listener function.
     * @type {function(?):?|{handleEvent:function(?):?}|null}
     */
    this.listener = null;
  
    /**
     * Whether the listener works on capture phase.
     * @type {boolean|null}
     */
    this.capture = null;
  
    /**
     * The 'this' object for the listener function's scope.
     * @type {Object|undefined}
     */
    this.handler = undefined;
  
    /**
     * A globally unique number to identify the key.
     * @type {number|null}
     */
    this.key = null;
  }

  /**
   * Reserves a key to be used for ListenableKey#key field.
   * @return {number} A number to be used to fill ListenableKey#key
   *     field.
   */
  static reserveKey() {
    return ++ListenableKey.counter_;
  };
}

/**
 * Counter used to create a unique key
 * @type {number}
 * @private
 */
ListenableKey.counter_ = 0;

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
class events_EventTarget extends Disposable {

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
   */
  constructor() {
    super();
  
    /**
     * Maps of event type to an array of listeners.
     * @private {!ListenerMap}
     */
    this.eventTargetListeners_ = new ListenerMap(this);
  
    /**
     * The object to use for event.target. Useful when mixing in an
     * EventTarget to another object.
     * @private {!Object}
     */
    this.actualEventTarget_ = this;
  
    /**
     * Parent event target, used during event bubbling.
     *
     * TODO(chrishenry): Change this to Listenable. This
     * currently breaks people who expect getParentEventTarget to return
     * events_EventTarget.
     *
     * @private {?events_EventTarget}
     */
    this.parentEventTarget_ = null;
  }

  /**
   * Returns the parent of this event target to use for bubbling.
   *
   * @return {events_EventTarget} The parent EventTarget or null if
   *     there is no parent.
   * @override
   */
  getParentEventTarget() {
    return this.parentEventTarget_;
  };

  /**
   * Sets the parent of this event target to use for capture/bubble
   * mechanism.
   * @param {events_EventTarget} parent Parent listenable (null if none).
   */
  setParentEventTarget(parent) {
    this.parentEventTarget_ = parent;
  };

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
  addEventListener(
      type, handler, opt_capture, opt_handlerScope) {
    listen(this, type, handler, opt_capture, opt_handlerScope);
  };

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
  removeEventListener(
      type, handler, opt_capture, opt_handlerScope) {
    unlisten(this, type, handler, opt_capture, opt_handlerScope);
  };

  /** @override */
  dispatchEvent(e) {
    this.assertInitialized_();
  
    var ancestorsTree, ancestor = this.getParentEventTarget();
    if (ancestor) {
      ancestorsTree = [];
      var ancestorCount = 1;
      for (; ancestor; ancestor = ancestor.getParentEventTarget()) {
        ancestorsTree.push(ancestor);
        asserts.assert(
            (++ancestorCount < events_EventTarget.MAX_ANCESTORS_),
            'infinite loop');
      }
    }
  
    return events_EventTarget.dispatchEventInternal_(
        this.actualEventTarget_, e, ancestorsTree);
  };

  /**
   * Removes listeners from this object.  Classes that extend EventTarget may
   * need to override this method in order to remove references to DOM Elements
   * and additional listeners.
   * @override
   * @protected
   */
  disposeInternal() {
    super.disposeInternal();
  
    this.removeAllListeners();
    this.parentEventTarget_ = null;
  };

  /** @override */
  listen(
      type, listener, opt_useCapture, opt_listenerScope) {
    this.assertInitialized_();
    return this.eventTargetListeners_.add(
        String(type), listener, false /* callOnce */, opt_useCapture,
        opt_listenerScope);
  };

  /** @override */
  listenOnce(
      type, listener, opt_useCapture, opt_listenerScope) {
    return this.eventTargetListeners_.add(
        String(type), listener, true /* callOnce */, opt_useCapture,
        opt_listenerScope);
  };

  /** @override */
  unlisten(
      type, listener, opt_useCapture, opt_listenerScope) {
    return this.eventTargetListeners_.remove(
        String(type), listener, opt_useCapture, opt_listenerScope);
  };

  /** @override */
  unlistenByKey(key) {
    return this.eventTargetListeners_.removeByKey(key);
  };

  /** @override */
  removeAllListeners(opt_type) {
    // TODO(chrishenry): Previously, removeAllListeners can be called on
    // uninitialized EventTarget, so we preserve that behavior. We
    // should remove this when usages that rely on that fact are purged.
    if (!this.eventTargetListeners_) {
      return 0;
    }
    return this.eventTargetListeners_.removeAll(opt_type);
  };

  /** @override */
  fireListeners(
      type, capture, eventObject) {
    // TODO(chrishenry): Original code avoids array creation when there
    // is no listener, so we do the same. If this optimization turns
    // out to be not required, we can replace this with
    // getListeners(type, capture) instead, which is simpler.
    var listenerArray = this.eventTargetListeners_.listeners[String(type)];
    if (!listenerArray) {
      return true;
    }
    listenerArray = listenerArray.concat();
  
    var rv = true;
    for (var i = 0; i < listenerArray.length; ++i) {
      var listener = listenerArray[i];
      // We might not have a listener if the listener was removed.
      if (listener && !listener.removed && listener.capture == capture) {
        var listenerFn = listener.listener;
        var listenerHandler = listener.handler || listener.src;
  
        if (listener.callOnce) {
          this.unlistenByKey(listener);
        }
        rv = listenerFn.call(listenerHandler, eventObject) !== false && rv;
      }
    }
  
    return rv && eventObject.returnValue_ != false;
  };

  /** @override */
  getListeners(type, capture) {
    return this.eventTargetListeners_.getListeners(String(type), capture);
  };

  /** @override */
  getListener(
      type, listener, capture, opt_listenerScope) {
    return this.eventTargetListeners_.getListener(
        String(type), listener, capture, opt_listenerScope);
  };

  /** @override */
  hasListener(
      opt_type, opt_capture) {
    var id = (opt_type !== undefined) ? String(opt_type) : undefined;
    return this.eventTargetListeners_.hasListener(id, opt_capture);
  };

  /**
   * Sets the target to be used for `event.target` when firing
   * event. Mainly used for testing. For example, see
   * `goog.testing.events.mixinListenable`.
   * @param {!Object} target The target.
   */
  setTargetForTesting(target) {
    this.actualEventTarget_ = target;
  };

  /**
   * Asserts that the event target instance is initialized properly.
   * @private
   */
  assertInitialized_() {
    asserts.assert(
        this.eventTargetListeners_,
        'Event target is not initialized. Did you call the superclass ' +
            '(events_EventTarget) constructor?');
  };

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
  static dispatchEventInternal_(
      target, e, opt_ancestorsTree) {
    /** @suppress {missingProperties} */
    var type = e.type || /** @type {string} */ (e);
  
    // If accepting a string or object, create a custom event object so that
    // preventDefault and stopPropagation work with the event.
    if (typeof e === 'string') {
      e = new EventsEvent(e, target);
    } else if (!(e instanceof EventsEvent)) {
      var oldEvent = e;
      e = new EventsEvent(type, target);
      goog_object.extend(e, oldEvent);
    } else {
      e.target = e.target || target;
    }
  
    var rv = true, currentTarget;
  
    // Executes all capture listeners on the ancestors, if any.
    if (opt_ancestorsTree) {
      for (var i = opt_ancestorsTree.length - 1; !e.propagationStopped_ && i >= 0;
           i--) {
        currentTarget = e.currentTarget = opt_ancestorsTree[i];
        rv = currentTarget.fireListeners(type, true, e) && rv;
      }
    }
  
    // Executes capture and bubble listeners on the target.
    if (!e.propagationStopped_) {
      currentTarget = /** @type {?} */ (e.currentTarget = target);
      rv = currentTarget.fireListeners(type, true, e) && rv;
      if (!e.propagationStopped_) {
        rv = currentTarget.fireListeners(type, false, e) && rv;
      }
    }
  
    // Executes all bubble listeners on the ancestors, if any.
    if (opt_ancestorsTree) {
      for (i = 0; !e.propagationStopped_ && i < opt_ancestorsTree.length; i++) {
        currentTarget = e.currentTarget = opt_ancestorsTree[i];
        rv = currentTarget.fireListeners(type, false, e) && rv;
      }
    }
  
    return rv;
  };
}

Listenable.addImplementation(events_EventTarget);

/**
 * An artificial cap on the number of ancestors you can have. This is mainly
 * for loop detection.
 * @const {number}
 * @private
 */
events_EventTarget.MAX_ANCESTORS_ = 1000;

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
 * @fileoverview Listener object.
 * @see ../demos/events.html
 */

/**
 * Simple class that stores information about a listener
 *     the event.
 * @implements {ListenableKey}
 */
class Listener {

  /**
   * Simple class that stores information about a listener
   * @param {function(?):?} listener Callback function.
   * @param {Function} proxy Wrapper for the listener that patches the event.
   * @param {EventTarget|Listenable} src Source object for
   *     the event.
   * @param {string} type Event type.
   * @param {boolean} capture Whether in capture or bubble phase.
   * @param {Object=} opt_handler Object in whose context to execute the callback.
   */
  constructor(
      listener, proxy, src, type, capture, opt_handler) {
    /**
     * If monitoring the Listener instances is enabled, stores the
     * creation stack trace of the Disposable instance.
     * @type {string|null}
     */
    this.creationStack = null;
  
    if (ENABLE_MONITORING) {
      this.creationStack = new Error().stack;
    }
  
    /** @override */
    this.listener = listener;
  
    /**
     * A wrapper over the original listener. This is used solely to
     * handle native browser events (it is used to simulate the capture
     * phase and to patch the event object).
     * @type {Function}
     */
    this.proxy = proxy;
  
    /**
     * Object or node that callback is listening to
     * @type {EventTarget|Listenable}
     */
    this.src = src;
  
    /**
     * The event type.
     * @const {string}
     */
    this.type = type;
  
    /**
     * Whether the listener is being called in the capture or bubble phase
     * @const {boolean}
     */
    this.capture = !!capture;
  
    /**
     * Optional object whose context to execute the listener in
     * @type {Object|undefined}
     */
    this.handler = opt_handler;
  
    /**
     * The key of the listener.
     * @const {number}
     * @override
     */
    this.key = ListenableKey.reserveKey();
  
    /**
     * Whether to remove the listener after it has been called.
     * @type {boolean}
     */
    this.callOnce = false;
  
    /**
     * Whether the listener has been removed.
     * @type {boolean}
     */
    this.removed = false;
  }

  /**
   * Marks this listener as removed. This also remove references held by
   * this listener object (such as listener and event source).
   */
  markAsRemoved() {
    this.removed = true;
    this.listener = null;
    this.proxy = null;
    this.src = null;
    this.handler = null;
  };
}

/**
 * @type {boolean} Whether to enable the monitoring of the
 *     Listener instances. Switching on the monitoring is only
 *     recommended for debugging because it has a significant impact on
 *     performance and memory usage. If switched off, the monitoring code
 *     compiles down to 0 bytes.
 */
const ENABLE_MONITORING = false;

// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
class ListenerMap {

  /**
   * Creates a new listener map.
   * @param {EventTarget|Listenable} src The src object.
   */
  constructor(src) {
    /** @type {EventTarget|Listenable} */
    this.src = src;
  
    /**
     * Maps of event type to an array of listeners.
     * @type {!Object<string, !Array<!Listener>>}
     */
    this.listeners = {};
  
    /**
     * The count of types in this map that have registered listeners.
     * @private {number}
     */
    this.typeCount_ = 0;
  }

  /**
   * @return {number} The count of event types in this map that actually
   *     have registered listeners.
   */
  getTypeCount() {
    return this.typeCount_;
  };

  /**
   * @return {number} Total number of registered listeners.
   */
  getListenerCount() {
    var count = 0;
    for (var type in this.listeners) {
      count += this.listeners[type].length;
    }
    return count;
  };

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
  add(
      type, listener, callOnce, opt_useCapture, opt_listenerScope) {
    var typeStr = type.toString();
    var listenerArray = this.listeners[typeStr];
    if (!listenerArray) {
      listenerArray = this.listeners[typeStr] = [];
      this.typeCount_++;
    }
  
    var listenerObj;
    var index = ListenerMap.findListenerIndex_(
        listenerArray, listener, opt_useCapture, opt_listenerScope);
    if (index > -1) {
      listenerObj = listenerArray[index];
      if (!callOnce) {
        // Ensure that, if there is an existing callOnce listener, it is no
        // longer a callOnce listener.
        listenerObj.callOnce = false;
      }
    } else {
      listenerObj = new Listener(
          listener, null, this.src, typeStr, !!opt_useCapture, opt_listenerScope);
      listenerObj.callOnce = callOnce;
      listenerArray.push(listenerObj);
    }
    return listenerObj;
  };

  /**
   * Removes a matching listener.
   * @param {string|!EventId} type The listener event type.
   * @param {!Function} listener This listener callback method.
   * @param {boolean=} opt_useCapture The capture mode of the listener.
   * @param {Object=} opt_listenerScope Object in whose scope to call the
   *     listener.
   * @return {boolean} Whether any listener was removed.
   */
  remove(
      type, listener, opt_useCapture, opt_listenerScope) {
    var typeStr = type.toString();
    if (!(typeStr in this.listeners)) {
      return false;
    }
  
    var listenerArray = this.listeners[typeStr];
    var index = ListenerMap.findListenerIndex_(
        listenerArray, listener, opt_useCapture, opt_listenerScope);
    if (index > -1) {
      var listenerObj = listenerArray[index];
      listenerObj.markAsRemoved();
      googarray.removeAt(listenerArray, index);
      if (listenerArray.length == 0) {
        delete this.listeners[typeStr];
        this.typeCount_--;
      }
      return true;
    }
    return false;
  };

  /**
   * Removes the given listener object.
   * @param {!ListenableKey} listener The listener to remove.
   * @return {boolean} Whether the listener is removed.
   */
  removeByKey(listener) {
    var type = /** @type {string}*/(listener.type);
    if (!(type in this.listeners)) {
      return false;
    }
  
    var removed = googarray.remove(this.listeners[type], listener);
    if (removed) {
      /** @type {!Listener} */ (listener).markAsRemoved();
      if (this.listeners[type].length == 0) {
        delete this.listeners[type];
        this.typeCount_--;
      }
    }
    return removed;
  };

  /**
   * Removes all listeners from this map. If opt_type is provided, only
   * listeners that match the given type are removed.
   * @param {string|!EventId=} opt_type Type of event to remove.
   * @return {number} Number of listeners removed.
   */
  removeAll(opt_type) {
    var typeStr = opt_type && opt_type.toString();
    var count = 0;
    for (var type in this.listeners) {
      if (!typeStr || type == typeStr) {
        var listenerArray = this.listeners[type];
        for (var i = 0; i < listenerArray.length; i++) {
          ++count;
          listenerArray[i].markAsRemoved();
        }
        delete this.listeners[type];
        this.typeCount_--;
      }
    }
    return count;
  };

  /**
   * Gets all listeners that match the given type and capture mode. The
   * returned array is a copy (but the listener objects are not).
   * @param {string|!EventId} type The type of the listeners
   *     to retrieve.
   * @param {boolean} capture The capture mode of the listeners to retrieve.
   * @return {!Array<!ListenableKey>} An array of matching
   *     listeners.
   */
  getListeners(type, capture) {
    var listenerArray = this.listeners[type.toString()];
    var rv = [];
    if (listenerArray) {
      for (var i = 0; i < listenerArray.length; ++i) {
        var listenerObj = listenerArray[i];
        if (listenerObj.capture == capture) {
          rv.push(listenerObj);
        }
      }
    }
    return rv;
  };

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
   * @return {ListenableKey} the found listener or null if not found.
   */
  getListener(
      type, listener, capture, opt_listenerScope) {
    var listenerArray = this.listeners[type.toString()];
    var i = -1;
    if (listenerArray) {
      i = ListenerMap.findListenerIndex_(
          listenerArray, listener, capture, opt_listenerScope);
    }
    return i > -1 ? listenerArray[i] : null;
  };

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
  hasListener(
      opt_type, opt_capture) {
    var hasType = (opt_type !== undefined);
    var typeStr = hasType ? opt_type.toString() : '';
    var hasCapture = (opt_capture !== undefined);
  
    return goog_object.some(this.listeners, function(listenerArray, type) {
      for (var i = 0; i < listenerArray.length; ++i) {
        if ((!hasType || listenerArray[i].type == typeStr) &&
            (!hasCapture || listenerArray[i].capture == opt_capture)) {
          return true;
        }
      }
  
      return false;
    });
  };

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
  static findListenerIndex_(
      listenerArray, listener, opt_useCapture, opt_listenerScope) {
    for (var i = 0; i < listenerArray.length; ++i) {
      var listenerObj = listenerArray[i];
      if (!listenerObj.removed && listenerObj.listener == listener &&
          listenerObj.capture == !!opt_useCapture &&
          listenerObj.handler == opt_listenerScope) {
        return i;
      }
    }
    return -1;
  };
}

export {CAPTURE_SIMULATION_MODE, CaptureSimulationMode, ENABLE_MONITORING, EventHandler, EventWrapper, Key, Listenable, ListenableKey, ListenableType, Listener, ListenerMap, dispatchEvent, events_EventTarget as EventTarget, expose, fireListener, fireListeners, getListener, getListeners, getProxy, getTotalListenerCount, getUniqueId, hasListener, listen, listenOnce, listenWithWrapper, protectBrowserEventEntryPoint, removeAll, unlisten, unlistenByKey, unlistenWithWrapper, wrapListener};