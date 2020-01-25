import * as userAgent from './../useragent/useragent.js';
import {BrowserEvent as EventsBrowserEvent} from './browserevent.js';
import * as goog_events from './eventhandler.js';
import {Key as EventsKey} from './eventhandler.js';
import {EventTarget as EventsEventTarget} from './eventhandler.js';
import {EventType as EventsEventType} from './eventtype.js';
import {KeyCodes} from './keycodes.js';
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
 * @fileoverview This file contains a class for working with keyboard events
 * that repeat consistently across browsers and platforms. It also unifies the
 * key code so that it is the same in all browsers and platforms.
 *
 * Different web browsers have very different keyboard event handling. Most
 * importantly is that only certain browsers repeat keydown events:
 * IE, Opera, FF/Win32, and Safari 3 repeat keydown events.
 * FF/Mac and Safari 2 do not.
 *
 * For the purposes of this code, "Safari 3" means WebKit 525+, when WebKit
 * decided that they should try to match IE's key handling behavior.
 * Safari 3.0.4, which shipped with Leopard (WebKit 523), has the
 * Safari 2 behavior.
 *
 * Firefox, Safari, Opera prevent on keypress
 *
 * IE prevents on keydown
 *
 * Firefox does not fire keypress for shift, ctrl, alt
 * Firefox does fire keydown for shift, ctrl, alt, meta
 * Firefox does not repeat keydown for shift, ctrl, alt, meta
 *
 * Firefox does not fire keypress for up and down in an input
 *
 * Opera fires keypress for shift, ctrl, alt, meta
 * Opera does not repeat keypress for shift, ctrl, alt, meta
 *
 * Safari 2 and 3 do not fire keypress for shift, ctrl, alt
 * Safari 2 does not fire keydown for shift, ctrl, alt
 * Safari 3 *does* fire keydown for shift, ctrl, alt
 *
 * IE provides the keycode for keyup/down events and the charcode (in the
 * keycode field) for keypress.
 *
 * Mozilla provides the keycode for keyup/down and the charcode for keypress
 * unless it's a non text modifying key in which case the keycode is provided.
 *
 * Safari 3 provides the keycode and charcode for all events.
 *
 * Opera provides the keycode for keyup/down event and either the charcode or
 * the keycode (in the keycode field) for keypress events.
 *
 * Firefox x11 doesn't fire keydown events if a another key is already held down
 * until the first key is released. This can cause a key event to be fired with
 * a keyCode for the first key and a charCode for the second key.
 *
 * Safari in keypress
 *
 *        charCode keyCode which
 * ENTER:       13      13    13
 * F1:       63236   63236 63236
 * F8:       63243   63243 63243
 * ...
 * p:          112     112   112
 * P:           80      80    80
 *
 * Firefox, keypress:
 *
 *        charCode keyCode which
 * ENTER:        0      13    13
 * F1:           0     112     0
 * F8:           0     119     0
 * ...
 * p:          112       0   112
 * P:           80       0    80
 *
 * Opera, Mac+Win32, keypress:
 *
 *         charCode keyCode which
 * ENTER: undefined      13    13
 * F1:    undefined     112     0
 * F8:    undefined     119     0
 * ...
 * p:     undefined     112   112
 * P:     undefined      80    80
 *
 * IE7, keydown
 *
 *         charCode keyCode     which
 * ENTER: undefined      13 undefined
 * F1:    undefined     112 undefined
 * F8:    undefined     119 undefined
 * ...
 * p:     undefined      80 undefined
 * P:     undefined      80 undefined
 *
 * @see ../demos/keyhandler.html
 */

/**
 * A wrapper around an element that you want to listen to keyboard events on.
 *     capture phase (defaults to false).
 * @extends {EventsEventTarget}
 * @final
 */
class KeyHandler extends EventsEventTarget {

  /**
   * A wrapper around an element that you want to listen to keyboard events on.
   * @param {Element|Document=} opt_element The element or document to listen on.
   * @param {boolean=} opt_capture Whether to listen for browser events in
   *     capture phase (defaults to false).
   */
  constructor(opt_element, opt_capture) {
    super();
    /**
     * This is the element that we will listen to the real keyboard events on.
     * @type {?Element|?Document|null}
     * @private
     */
    this.element_ = null;
  
    /**
     * The key for the key press listener.
     * @type {?EventsKey}
     * @private
     */
    this.keyPressKey_ = null;
  
    /**
     * The key for the key down listener.
     * @type {?EventsKey}
     * @private
     */
    this.keyDownKey_ = null;
  
    /**
     * The key for the key up listener.
     * @type {?EventsKey}
     * @private
     */
    this.keyUpKey_ = null;
  
    /**
     * Used to detect keyboard repeat events.
     * @private
     * @type {number}
     */
    this.lastKey_ = -1;
  
    /**
     * Keycode recorded for key down events. As most browsers don't report the
     * keycode in the key press event we need to record it in the key down phase.
     * @private
     * @type {number}
     */
    this.keyCode_ = -1;
  
    /**
     * Alt key recorded for key down events. FF on Mac does not report the alt key
     * flag in the key press event, we need to record it in the key down phase.
     * @type {boolean}
     * @private
     */
    this.altKey_ = false;
  
  
    if (opt_element) {
      this.attach(opt_element, opt_capture);
    }
  }

  /**
   * Records the keycode for browsers that only returns the keycode for key up/
   * down events. For browser/key combinations that doesn't trigger a key pressed
   * event it also fires the patched key event.
   * @param {EventsBrowserEvent} e The key down event.
   * @private
   */
  handleKeyDown_(e) {
    // Ctrl-Tab and Alt-Tab can cause the focus to be moved to another window
    // before we've caught a key-up event.  If the last-key was one of these we
    // reset the state.
    if (userAgent.WEBKIT || userAgent.EDGE) {
      if (this.lastKey_ == KeyCodes.CTRL && !e.ctrlKey ||
          this.lastKey_ == KeyCodes.ALT && !e.altKey ||
          userAgent.MAC && this.lastKey_ == KeyCodes.META &&
              !e.metaKey) {
        this.resetState();
      }
    }
  
    if (this.lastKey_ == -1) {
      if (e.ctrlKey && e.keyCode != KeyCodes.CTRL) {
        this.lastKey_ = KeyCodes.CTRL;
      } else if (e.altKey && e.keyCode != KeyCodes.ALT) {
        this.lastKey_ = KeyCodes.ALT;
      } else if (e.metaKey && e.keyCode != KeyCodes.META) {
        this.lastKey_ = KeyCodes.META;
      }
    }
  
    if (KeyHandler.USES_KEYDOWN_ &&
        !KeyCodes.firesKeyPressEvent(
            e.keyCode, this.lastKey_, e.shiftKey, e.ctrlKey, e.altKey,
            e.metaKey)) {
      this.handleEvent(e);
    } else {
      this.keyCode_ = KeyCodes.normalizeKeyCode(e.keyCode);
      if (KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
        this.altKey_ = e.altKey;
      }
    }
  };

  /**
   * Resets the stored previous values. Needed to be called for webkit which will
   * not generate a key up for meta key operations. This should only be called
   * when having finished with repeat key possibilities.
   */
  resetState() {
    this.lastKey_ = -1;
    this.keyCode_ = -1;
  };

  /**
   * Clears the stored previous key value, resetting the key repeat status. Uses
   * -1 because the Safari 3 Windows beta reports 0 for certain keys (like Home
   * and End.)
   * @param {EventsBrowserEvent} e The keyup event.
   * @private
   */
  handleKeyup_(e) {
    this.resetState();
    this.altKey_ = e.altKey;
  };

  /**
   * Handles the events on the element.
   * @param {EventsBrowserEvent} e  The keyboard event sent from the
   *     browser.
   */
  handleEvent(e) {
    var be = e.getBrowserEvent();
    var keyCode, charCode;
    var altKey = be.altKey;
  
    // IE reports the character code in the keyCode field for keypress events.
    // There are two exceptions however, Enter and Escape.
    if (userAgent.IE && e.type == EventsEventType.KEYPRESS) {
      keyCode = this.keyCode_;
      charCode = keyCode != KeyCodes.ENTER &&
              keyCode != KeyCodes.ESC ?
          be.keyCode :
          0;
  
      // Safari reports the character code in the keyCode field for keypress
      // events but also has a charCode field.
    } else if (
        (userAgent.WEBKIT || userAgent.EDGE) &&
        e.type == EventsEventType.KEYPRESS) {
      keyCode = this.keyCode_;
      charCode = be.charCode >= 0 && be.charCode < 63232 &&
              KeyCodes.isCharacterKey(keyCode) ?
          be.charCode :
          0;
  
      // Opera reports the keycode or the character code in the keyCode field.
    } else if (userAgent.OPERA && !userAgent.WEBKIT) {
      keyCode = this.keyCode_;
      charCode = KeyCodes.isCharacterKey(keyCode) ? be.keyCode : 0;
  
      // Mozilla reports the character code in the charCode field.
    } else {
      if (e.type == EventsEventType.KEYPRESS) {
        if (KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
          altKey = this.altKey_;
        }
  
        // Newer versions of Firefox will set the keyCode of non-function keys to
        // be the same as charCode. We need to account for this and update the
        // key event values accordingly. See
        // https://github.com/google/closure-library/issues/932 for more details.
        if (be.keyCode == be.charCode) {
          // Adjust any function key (ie. non-printable, such as ESC or
          // backspace) to not have a charCode. We don't want these keys to
          // accidentally be interpreted as insertable characters.
          if (be.keyCode < 0x20) {
            keyCode = be.keyCode;
            charCode = 0;
          } else {
            // For character keys, we want to use the preserved key code rather
            // than the keyCode on the browser event, which now uses the charCode.
            // These differ (eg. pressing 'a' gives keydown with keyCode = 65,
            // keypress with keyCode = charCode = 97) and so we need to account
            // for this.
            keyCode = this.keyCode_;
            charCode = be.charCode;
          }
        } else {
          keyCode = be.keyCode || this.keyCode_;
          charCode = be.charCode || 0;
        }
      } else {
        keyCode = be.keyCode || this.keyCode_;
        charCode = be.charCode || 0;
      }
  
      // On the Mac, shift-/ triggers a question mark char code and no key code
      // (WIN_KEY_FF_LINUX), so we synthesize the latter.
      if (userAgent.MAC && charCode == KeyCodes.QUESTION_MARK &&
          keyCode == KeyCodes.WIN_KEY) {
        keyCode = KeyCodes.SLASH;
      }
    }
  
    keyCode = KeyCodes.normalizeKeyCode(keyCode);
    var key = keyCode;
  
    // Correct the key value for certain browser-specific quirks.
    if (keyCode) {
      if (keyCode >= 63232 && keyCode in KeyHandler.safariKey_) {
        // NOTE(nicksantos): Safari 3 has fixed this problem,
        // this is only needed for Safari 2.
        key = KeyHandler.safariKey_[keyCode];
      } else {
        // Safari returns 25 for Shift+Tab instead of 9.
        if (keyCode == 25 && e.shiftKey) {
          key = 9;
        }
      }
    } else if (
        be.keyIdentifier &&
        be.keyIdentifier in KeyHandler.keyIdentifier_) {
      // This is needed for Safari Windows because it currently doesn't give a
      // keyCode/which for non printable keys.
      key = KeyHandler.keyIdentifier_[be.keyIdentifier];
    }
  
    // If this was a redundant keypress event, we ignore it to avoid double-firing
    // an event as the event would've been handled by KEYDOWN. Gecko is currently
    // in the process of removing keypress events for non-printable characters
    // (https://bugzilla.mozilla.org/show_bug.cgi?id=968056) so we simulate this
    // logic here for older Gecko versions which still fire the events.
    if (userAgent.GECKO && KeyHandler.USES_KEYDOWN_ &&
        e.type == EventsEventType.KEYPRESS &&
        !KeyCodes.firesKeyPressEvent(
            key, this.lastKey_, e.shiftKey, e.ctrlKey, altKey, e.metaKey)) {
      return;
    }
  
    // If we get the same keycode as a keydown/keypress without having seen a
    // keyup event, then this event was caused by key repeat.
    var repeat = key == this.lastKey_;
    this.lastKey_ = key;
  
    var event = new KeyEvent(key, charCode, repeat, be);
    event.altKey = altKey;
    this.dispatchEvent(event);
  };

  /**
   * Returns the element listened on for the real keyboard events.
   * @return {Element|Document|null} The element listened on for the real
   *     keyboard events.
   */
  getElement() {
    return this.element_;
  };

  /**
   * Adds the proper key event listeners to the element.
   * @param {Element|Document} element The element to listen on.
   * @param {boolean=} opt_capture Whether to listen for browser events in
   *     capture phase (defaults to false).
   */
  attach(element, opt_capture) {
    if (this.keyUpKey_) {
      this.detach();
    }
  
    this.element_ = element;
  
    this.keyPressKey_ = goog_events.listen(
        this.element_, EventsEventType.KEYPRESS, this, opt_capture);
  
    // Most browsers (Safari 2 being the notable exception) doesn't include the
    // keyCode in keypress events (IE has the char code in the keyCode field and
    // Mozilla only included the keyCode if there's no charCode). Thus we have to
    // listen for keydown to capture the keycode.
    this.keyDownKey_ = goog_events.listen(
        this.element_, EventsEventType.KEYDOWN, this.handleKeyDown_,
        opt_capture, this);
  
  
    this.keyUpKey_ = goog_events.listen(
        this.element_, EventsEventType.KEYUP, this.handleKeyup_,
        opt_capture, this);
  };

  /**
   * Removes the listeners that may exist.
   */
  detach() {
    if (this.keyPressKey_) {
      goog_events.unlistenByKey(this.keyPressKey_);
      goog_events.unlistenByKey(this.keyDownKey_);
      goog_events.unlistenByKey(this.keyUpKey_);
      this.keyPressKey_ = null;
      this.keyDownKey_ = null;
      this.keyUpKey_ = null;
    }
    this.element_ = null;
    this.lastKey_ = -1;
    this.keyCode_ = -1;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    this.detach();
  };
}

/**
 * Enum type for the events fired by the key handler
 * @enum {string}
 */
let EventType = {
  KEY: 'key'
};

/**
 * An enumeration of key codes that Safari 2 does incorrectly
 * @type {Object}
 * @private
 */
KeyHandler.safariKey_ = {
  '3': KeyCodes.ENTER,             // 13
  '12': KeyCodes.NUMLOCK,          // 144
  '63232': KeyCodes.UP,            // 38
  '63233': KeyCodes.DOWN,          // 40
  '63234': KeyCodes.LEFT,          // 37
  '63235': KeyCodes.RIGHT,         // 39
  '63236': KeyCodes.F1,            // 112
  '63237': KeyCodes.F2,            // 113
  '63238': KeyCodes.F3,            // 114
  '63239': KeyCodes.F4,            // 115
  '63240': KeyCodes.F5,            // 116
  '63241': KeyCodes.F6,            // 117
  '63242': KeyCodes.F7,            // 118
  '63243': KeyCodes.F8,            // 119
  '63244': KeyCodes.F9,            // 120
  '63245': KeyCodes.F10,           // 121
  '63246': KeyCodes.F11,           // 122
  '63247': KeyCodes.F12,           // 123
  '63248': KeyCodes.PRINT_SCREEN,  // 44
  '63272': KeyCodes.DELETE,        // 46
  '63273': KeyCodes.HOME,          // 36
  '63275': KeyCodes.END,           // 35
  '63276': KeyCodes.PAGE_UP,       // 33
  '63277': KeyCodes.PAGE_DOWN,     // 34
  '63289': KeyCodes.NUMLOCK,       // 144
  '63302': KeyCodes.INSERT         // 45
};

/**
 * An enumeration of key identifiers currently part of the W3C draft for DOM3
 * and their mappings to keyCodes.
 * http://www.w3.org/TR/DOM-Level-3-Events/keyset.html#KeySet-Set
 * This is currently supported in Safari and should be platform independent.
 * @type {Object}
 * @private
 */
KeyHandler.keyIdentifier_ = {
  'Up': KeyCodes.UP,               // 38
  'Down': KeyCodes.DOWN,           // 40
  'Left': KeyCodes.LEFT,           // 37
  'Right': KeyCodes.RIGHT,         // 39
  'Enter': KeyCodes.ENTER,         // 13
  'F1': KeyCodes.F1,               // 112
  'F2': KeyCodes.F2,               // 113
  'F3': KeyCodes.F3,               // 114
  'F4': KeyCodes.F4,               // 115
  'F5': KeyCodes.F5,               // 116
  'F6': KeyCodes.F6,               // 117
  'F7': KeyCodes.F7,               // 118
  'F8': KeyCodes.F8,               // 119
  'F9': KeyCodes.F9,               // 120
  'F10': KeyCodes.F10,             // 121
  'F11': KeyCodes.F11,             // 122
  'F12': KeyCodes.F12,             // 123
  'U+007F': KeyCodes.DELETE,       // 46
  'Home': KeyCodes.HOME,           // 36
  'End': KeyCodes.END,             // 35
  'PageUp': KeyCodes.PAGE_UP,      // 33
  'PageDown': KeyCodes.PAGE_DOWN,  // 34
  'Insert': KeyCodes.INSERT        // 45
};

/**
 * If true, the KeyEvent fires on keydown. Otherwise, it fires on keypress.
 *
 * @type {boolean}
 * @private
 */
KeyHandler.USES_KEYDOWN_ =
    !userAgent.WEBKIT || userAgent.isVersionOrHigher('525');

/**
 * If true, the alt key flag is saved during the key down and reused when
 * handling the key press. FF on Mac does not set the alt flag in the key press
 * event.
 * @type {boolean}
 * @private
 */
KeyHandler.SAVE_ALT_FOR_KEYPRESS_ =
    userAgent.MAC && userAgent.GECKO;

/**
 * This class is used for the EventType.KEY event and
 * it overrides the key code with the fixed key code.
 * @extends {EventsBrowserEvent}
 * @final
 */
class KeyEvent extends EventsBrowserEvent {

  /**
   * This class is used for the EventType.KEY event and
   * it overrides the key code with the fixed key code.
   * @param {number} keyCode The adjusted key code.
   * @param {number} charCode The unicode character code.
   * @param {boolean} repeat Whether this event was generated by keyboard repeat.
   * @param {Event} browserEvent Browser event object.
   */
  constructor(keyCode, charCode, repeat, browserEvent) {
    super(browserEvent);
    this.type = EventType.KEY;
  
    /**
     * Keycode of key press.
     * @type {number}
     */
    this.keyCode = keyCode;
  
    /**
     * Unicode character code.
     * @type {number}
     */
    this.charCode = charCode;
  
    /**
     * True if this event was generated by keyboard auto-repeat (i.e., the user is
     * holding the key down.)
     * @type {boolean}
     */
    this.repeat = repeat;
  }
}

export {EventType, KeyEvent, KeyHandler};