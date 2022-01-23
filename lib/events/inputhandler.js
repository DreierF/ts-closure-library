import {TagName} from './../dom/tagname.js';
import {Timer} from './../timer/timer.js';
import * as userAgent from './../useragent/useragent.js';
import {BrowserEvent as EventsBrowserEvent} from './browserevent.js';
import {EventTarget as EventsEventTarget} from './eventhandler.js';
import {EventHandler} from './eventhandler.js';
import {KeyCodes} from './keycodes.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview An object that encapsulates text changed events for textareas
 * and input element of type text and password. The event occurs after the value
 * has been changed. The event does not occur if value was changed
 * programmatically.<br>
 * <br>
 * Note: this does not guarantee the correctness of `keyCode` or
 * `charCode`, or attempt to unify them across browsers. See
 * `goog.events.KeyHandler` for that functionality<br>
 * <br>
 * Known issues:
 * <ul>
 * <li>IE doesn't have native support for input event. WebKit before version 531
 *     doesn't have support for textareas. For those browsers an emulation mode
 *     based on key, clipboard and drop events is used. Thus this event won't
 *     trigger in emulation mode if text was modified by context menu commands
 *     such as 'Undo' and 'Delete'.
 * </ul>
 * @see ../demos/inputhandler.html
 */

/**
 * This event handler will dispatch events when the user types into a text
 * input, password input or a textarea
 *     events on.
 * @extends {EventsEventTarget}
 */
class InputHandler extends EventsEventTarget {

  /**
   * This event handler will dispatch events when the user types into a text
   * input, password input or a textarea
   * @param {Element} element  The element that you want to listen for input
   *     events on.
   */
  constructor(element) {
    super();
  
    /**
     * Id of a timer used to postpone firing input event in emulation mode.
     * @type {?number}
     * @private
     */
    this.timer_ = null;
  
    /**
     * The element that you want to listen for input events on.
     * @type {Element}
     * @private
     */
    this.element_ = element;
  
    // Determine whether input event should be emulated.
    // IE8 doesn't support input events. We could use property change events but
    // they are broken in many ways:
    // - Fire even if value was changed programmatically.
    // - Aren't always delivered. For example, if you change value or even width
    //   of input programmatically, next value change made by user won't fire an
    //   event.
    // IE9 supports input events when characters are inserted, but not deleted.
    // WebKit before version 531 did not support input events for textareas.
    var emulateInputEvents = userAgent.IE || userAgent.EDGE ||
        (userAgent.WEBKIT && !userAgent.isVersionOrHigher('531') &&
         element.tagName == TagName.TEXTAREA);
  
    /**
     * @type {EventHandler<!InputHandler>}
     * @private
     */
    this.eventHandler_ = new EventHandler(this);
  
    // Even if input event emulation is enabled, still listen for input events
    // since they may be partially supported by the browser (such as IE9).
    // If the input event does fire, we will be able to dispatch synchronously.
    // (InputHandler events being asynchronous for IE is a common issue for
    // cases like auto-grow textareas where they result in a quick flash of
    // scrollbars between the textarea content growing and it being resized to
    // fit.)
    this.eventHandler_.listen(
        this.element_,
        emulateInputEvents ? ['keydown', 'paste', 'cut', 'drop', 'input'] :
                             'input',
        this);
  }

  /**
   * This handles the underlying events and dispatches a new event as needed.
   * @param {EventsBrowserEvent} e The underlying browser event.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleEvent(e) {
    if (e.type == 'input') {
      // http://stackoverflow.com/questions/18389732/changing-placeholder-triggers-input-event-in-ie-10
      // IE 10+ fires an input event when there are inputs with placeholders.
      // It fires the event with keycode 0, so if we detect it we don't
      // propagate the input event.
      if (userAgent.IE && userAgent.isVersionOrHigher(10) &&
          e.keyCode == 0 && e.charCode == 0) {
        return;
      }
      // This event happens after all the other events we listen to, so cancel
      // an asynchronous event dispatch if we have it queued up.  Otherwise, we
      // will end up firing an extra event.
      this.cancelTimerIfSet_();
  
      this.dispatchEvent(this.createInputEvent_(e));
    } else {
      // Filter out key events that don't modify text.
      if (e.type == 'keydown' &&
          !KeyCodes.isTextModifyingKeyEvent(e)) {
        return;
      }
  
      // It is still possible that pressed key won't modify the value of an
      // element. Storing old value will help us to detect modification but is
      // also a little bit dangerous. If value is changed programmatically in
      // another key down handler, we will detect it as user-initiated change.
      var valueBeforeKey = e.type == 'keydown' ? this.element_.value : null;
  
      // In IE on XP, IME the element's value has already changed when we get
      // keydown events when the user is using an IME. In this case, we can't
      // check the current value normally, so we assume that it's a modifying key
      // event. This means that ENTER when used to commit will fire a spurious
      // input event, but it's better to have a false positive than let some input
      // slip through the cracks.
      if (userAgent.IE && e.keyCode == KeyCodes.WIN_IME) {
        valueBeforeKey = null;
      }
  
      // Create an input event now, because when we fire it on timer, the
      // underlying event will already be disposed.
      var inputEvent = this.createInputEvent_(e);
  
      // Since key down, paste, cut and drop events are fired before actual value
      // of the element has changed, we need to postpone dispatching input event
      // until value is updated.
      this.cancelTimerIfSet_();
      this.timer_ = Timer.callOnce(/** @suppress {strictMissingProperties} Part of the go/strict_warnings_migration */
                                        function() {
        this.timer_ = null;
        if (this.element_.value != valueBeforeKey) {
          this.dispatchEvent(inputEvent);
        }
      }, 0, this);
    }
  };

  /**
   * Cancels timer if it is set, does nothing otherwise.
   * @private
   */
  cancelTimerIfSet_() {
    if (this.timer_ != null) {
      Timer.clear(this.timer_);
      this.timer_ = null;
    }
  };

  /**
   * Creates an input event from the browser event.
   * @param {EventsBrowserEvent} be A browser event.
   * @return {!EventsBrowserEvent} An input event.
   * @private
   */
  createInputEvent_(be) {
    var e = new EventsBrowserEvent(be.getBrowserEvent());
    e.type = EventType.INPUT;
    return e;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    this.eventHandler_.dispose();
    this.cancelTimerIfSet_();
    delete this.element_;
  };
}

/**
 * Enum type for the events fired by the input handler
 * @enum {string}
 */
let EventType = {
  INPUT: 'input'
};

export {EventType, InputHandler};