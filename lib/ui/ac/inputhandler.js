import * as aria from './../../a11y/aria/aria.js';
import {State} from './../../a11y/aria/attributes.js';
import {Role} from './../../a11y/aria/roles.js';
import {dispose} from './../../disposable/disposable.js';
import {Disposable} from './../../disposable/disposable.js';
import * as dom from './../../dom/dom.js';
import * as selection from './../../dom/selection.js';
import {BrowserEvent as EventsBrowserEvent} from './../../events/browserevent.js';
import {Event as EventsEvent} from './../../events/event.js';
import {EventTarget as EventsEventTarget} from './../../events/eventhandler.js';
import {EventHandler} from './../../events/eventhandler.js';
import {EventType as EventsEventType} from './../../events/eventtype.js';
import {KeyCodes} from './../../events/keycodes.js';
import {KeyHandler} from './../../events/keyhandler.js';
import {EventType} from './../../events/keyhandler.js';
import * as google from './../../google.js';
import * as strings from './../../string/string.js';
import {Timer} from './../../timer/timer.js';
import * as product from './../../useragent/product.js';
import * as userAgent from './../../useragent/useragent.js';
import {AutoComplete} from './autocomplete.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Class for managing the interactions between an
 * auto-complete object and a text-input or textarea.
 *
 * IME note:
 *
 * We used to suspend autocomplete while there are IME preedit characters, but
 * now for parity with Search we do not. We still detect the beginning and end
 * of IME entry because we need to listen to more events while an IME commit is
 * happening, but we update continuously as the user types.
 *
 * IMEs vary across operating systems, browsers, and even input languages. This
 * class tries to handle IME for:
 * - Windows x {FF3, IE7, Chrome} x MS IME 2002 (Japanese)
 * - Mac     x {FF3, Safari3}     x Kotoeri (Japanese)
 * - Linux   x {FF3}              x UIM + Anthy (Japanese)
 *
 * TODO(user): We cannot handle {Mac, Linux} x FF3 correctly.
 * TODO(user): We need to support Windows x Google IME.
 *
 * This class was tested with hiragana input. The event sequence when inputting
 * 'ai<enter>' with IME on (which commits two characters) is as follows:
 *
 * Notation: [key down code, key press, key up code]
 *           key code or +: event fired
 *           -: event not fired
 *
 * - Win/FF3: [WIN_IME, +, A], [-, -, ENTER]
 *            Note: No events are fired for 'i'.
 *
 * - Win/IE7: [WIN_IME, -, A], [WIN_IME, -, I], [WIN_IME, -, ENTER]
 *
 * - Win/Chrome: Same as Win/IE7
 *
 * - Mac/FF3: [A, -, A], [I, -, I], [ENTER, -, ENTER]
 *
 * - Mac/Safari3: Same as Win/IE7
 *
 * - Linux/FF3: No events are generated.
 *
 * With IME off,
 *
 * - ALL: [A, +, A], [I, +, I], [ENTER, +, ENTER]
 *        Note: Key code of key press event varies across configuration.
 *
 * With Microsoft Pinyin IME 3.0 (Simplified Chinese),
 *
 * - Win/IE7: Same as Win/IE7 with MS IME 2002 (Japanese)
 *
 *   The issue with this IME is that the key sequence that ends preedit is not
 *   a single ENTER key up.
 *   - ENTER key up following either ENTER or SPACE ends preedit.
 *   - SPACE key up following even number of LEFT, RIGHT, or SPACE (any
 *     combination) ends preedit.
 *   TODO(user): We only support SPACE-then-ENTER sequence.
 *   TODO(mpd): With the change to autocomplete during IME, this might not be an
 *   issue. Remove this comment once tested.
 *
 * With Microsoft Korean IME 2002,
 *
 * - Win/IE7: Same as Win/IE7 with MS IME 2002 (Japanese), but there is no
 *   sequence that ends the preedit.
 *
 * The following is the algorithm we use to detect IME preedit:
 *
 * - WIN_IME key down starts predit.
 * - (1) ENTER key up or (2) CTRL-M key up ends preedit.
 * - Any key press not immediately following WIN_IME key down signifies that
 *   preedit has ended.
 *
 * If you need to change this algorithm, please note the OS, browser, language,
 * and behavior above so that we can avoid regressions. Contact mpd or yuzo
 * if you have questions or concerns.
 */

/**
 * Class for managing the interaction between an auto-complete object and a
 * text-input or textarea.
 *
 *     If none passed, uses ',' and ';'.
 *     (Default: true).
 *     keyevents with (Default: 150). Use -1 to disable updates on typing. Note
 *     that typing the separator will update autocomplete suggestions.
 * @extends {Disposable}
 */
class InputHandler extends Disposable {

  /**
   * Class for managing the interaction between an auto-complete object and a
   * text-input or textarea.
   *
   * @param {?string=} opt_separators Separators to split multiple entries.
   *     If none passed, uses ',' and ';'.
   * @param {?string=} opt_literals Characters used to delimit text literals.
   * @param {?boolean=} opt_multi Whether to allow multiple entries
   *     (Default: true).
   * @param {?number=} opt_throttleTime Number of milliseconds to throttle
   *     keyevents with (Default: 150). Use -1 to disable updates on typing. Note
   *     that typing the separator will update autocomplete suggestions.
   */
  constructor(
      opt_separators, opt_literals, opt_multi, opt_throttleTime) {
    super();
    /**
     * The AutoComplete instance this inputhandler is associated with.
     * @type {AutoComplete}
     */
    this.ac_ = null;
  
    /**
     * Characters that can be used to split multiple entries in an input string
     * @type {string|null}
     * @private
     */
    this.separators_ = null;
  
    /**
     * The separator we use to reconstruct the string
     * @type {string|null}
     * @private
     */
    this.defaultSeparator_ = null;
  
    /**
     * Regular expression used from trimming tokens or null for no trimming.
     * @type {?RegExp}
     * @private
     */
    this.trimmer_ = null;
  
    /**
     * Regular expression to test whether a separator exists
     * @type {?RegExp}
     * @private
     */
    this.separatorCheck_ = null;
  
    /**
     * Should auto-completed tokens be wrapped in whitespace?  Used in selectRow.
     * @type {boolean}
     * @private
     */
    this.whitespaceWrapEntries_ = true;
  
    /**
     * Should the occurrence of a literal indicate a token boundary?
     * @type {boolean}
     * @private
     */
    this.generateNewTokenOnLiteral_ = true;
  
    /**
     * Whether to flip the orientation of up & down for hiliting next
     * and previous autocomplete entries.
     * @type {boolean}
     * @private
     */
    this.upsideDown_ = false;
  
    /**
     * If we're in 'multi' mode, does typing a separator force the updating of
     * suggestions?
     * For example, if somebody finishes typing "obama, hillary,", should the last
     * comma trigger updating suggestions in a guaranteed manner? Especially useful
     * when the suggestions depend on complete keywords. Note that "obama, hill"
     * (a leading sub-string of "obama, hillary" will lead to different and possibly
     * irrelevant suggestions.
     * @type {boolean}
     * @private
     */
    this.separatorUpdates_ = true;
  
    /**
     * If we're in 'multi' mode, does typing a separator force the current term to
     * autocomplete?
     * For example, if 'tomato' is a suggested completion and the user has typed
     * 'to,', do we autocomplete to turn that into 'tomato,'?
     * @type {boolean}
     * @private
     */
    this.separatorSelects_ = true;
  
    /**
     * The id of the currently active timeout, so it can be cleared if required.
     * @type {?number}
     * @private
     */
    this.activeTimeoutId_ = null;
  
    /**
     * The element that is currently active.
     * @type {?Element}
     * @private
     */
    this.activeElement_ = null;
  
    /**
     * The previous value of the active element.
     * @type {string}
     * @private
     */
    this.lastValue_ = '';
  
    /**
     * Flag used to indicate that the IME key has been seen and we need to wait for
     * the up event.
     * @type {boolean}
     * @private
     */
    this.waitingForIme_ = false;
  
    /**
     * Flag used to indicate that the user just selected a row and we should
     * therefore ignore the change of the input value.
     * @type {boolean}
     * @private
     */
    this.rowJustSelected_ = false;
  
    /**
     * Flag indicating whether the result list should be updated continuously
     * during typing or only after a short pause.
     * @type {boolean}
     * @private
     */
    this.updateDuringTyping_ = true;
  
    var throttleTime = opt_throttleTime || 150;
  
    /**
     * Whether this input accepts multiple values
     * @type {boolean}
     * @private
     */
    this.multi_ = opt_multi != null ? opt_multi : true;
  
    // Set separators depends on this.multi_ being set correctly
    this.setSeparators(
        opt_separators || InputHandler.STANDARD_LIST_SEPARATORS);
  
    /**
     * Characters that are used to delimit literal text. Separarator characters
     * found within literal text are not processed as separators
     * @type {string}
     * @private
     */
    this.literals_ = opt_literals || '';
  
    /**
     * Whether to prevent highlighted item selection when tab is pressed.
     * @type {boolean}
     * @private
     */
    this.preventSelectionOnTab_ = false;
  
    /**
     * Whether to prevent the default behavior (moving focus to another element)
     * when tab is pressed.  This occurs by default only for multi-value mode.
     * @type {boolean}
     * @private
     */
    this.preventDefaultOnTab_ = this.multi_;
  
    /**
     * A timer object used to monitor for changes when an element is active.
     *
     * TODO(user): Consider tuning the throttle time, so that it takes into
     * account the length of the token.  When the token is short it is likely to
     * match lots of rows, therefore we want to check less frequently.  Even
     * something as simple as <3-chars = 150ms, then 100ms otherwise.
     *
     * @type {Timer}
     * @private
     */
    this.timer_ = throttleTime > 0 ? new Timer(throttleTime) : null;
  
    /**
     * Event handler used by the input handler to manage events.
     * @type {EventHandler<!InputHandler>}
     * @private
     */
    this.eh_ = new EventHandler(this);
  
    /**
     * Event handler to help us find an input element that already has the focus.
     * @type {EventHandler<!InputHandler>}
     * @private
     */
    this.activateHandler_ = new EventHandler(this);
  
    /**
     * The keyhandler used for listening on most key events.  This takes care of
     * abstracting away some of the browser differences.
     * @type {KeyHandler}
     * @private
     */
    this.keyHandler_ = new KeyHandler();
  
    /**
     * The last key down key code.
     * @type {number}
     * @private
     */
    this.lastKeyCode_ = -1;  // Initialize to a non-existent value.
  }

  /**
   * Attach an instance of an AutoComplete
   * @param {AutoComplete} ac Autocomplete object.
   */
  attachAutoComplete(ac) {
    this.ac_ = ac;
  };

  /**
   * Returns the associated autocomplete instance.
   * @return {AutoComplete} The associated autocomplete instance.
   */
  getAutoComplete() {
    return this.ac_;
  };

  /**
   * Returns the current active element.
   * @return {Element} The currently active element.
   */
  getActiveElement() {
    return this.activeElement_;
  };

  /**
   * Returns the value of the current active element.
   * @return {string} The value of the current active element.
   */
  getValue() {
    return this.activeElement_.value;
  };

  /**
   * Sets the value of the current active element.
   * @param {string} value The new value.
   */
  setValue(value) {
    this.activeElement_.value = value;
  };

  /**
   * Returns the current cursor position.
   * @return {number} The index of the cursor position.
   */
  getCursorPosition() {
    return selection.getStart(this.activeElement_);
  };

  /**
   * Sets the cursor at the given position.
   * @param {number} pos The index of the cursor position.
   */
  setCursorPosition(pos) {
    selection.setStart(this.activeElement_, pos);
    selection.setEnd(this.activeElement_, pos);
  };

  /**
   * Attaches the input handler to a target element. The target element
   * should be a textarea, input box, or other focusable element with the
   * same interface.
   * @param {Element|EventsEventTarget} target An element to attach the
   *     input handler to.
   */
  attachInput(target) {
    if (dom.isElement(target)) {
      var el = /** @type {!Element} */ (target);
      aria.setRole(el, Role.COMBOBOX);
      aria.setState(el, State.AUTOCOMPLETE, 'list');
    }
  
    this.eh_.listen(target, EventsEventType.FOCUS, this.handleFocus);
    this.eh_.listen(target, EventsEventType.BLUR, this.handleBlur);
  
    if (!this.activeElement_) {
      this.activateHandler_.listen(
          target, EventsEventType.KEYDOWN,
          this.onKeyDownOnInactiveElement_);
  
      // Don't wait for a focus event if the element already has focus.
      if (dom.isElement(target)) {
        var ownerDocument = dom.getOwnerDocument(
            /** @type {Element} */ (target));
        if (dom.getActiveElement(ownerDocument) == target) {
          this.processFocus(/** @type {!Element} */ (target));
        }
      }
    }
  };

  /**
   * Detaches the input handler from the provided element.
   * @param {Element|EventsEventTarget} target An element to detach the
   *     input handler from.
   */
  detachInput(target) {
    if (dom.isElement(target)) {
      var el = /** @type {!Element} */ (target);
      aria.removeRole(el);
      aria.removeState(el, State.AUTOCOMPLETE);
    }
  
    if (target == this.activeElement_) {
      this.handleBlur();
    }
    this.eh_.unlisten(target, EventsEventType.FOCUS, this.handleFocus);
    this.eh_.unlisten(target, EventsEventType.BLUR, this.handleBlur);
  
    if (!this.activeElement_) {
      this.activateHandler_.unlisten(
          target, EventsEventType.KEYDOWN,
          this.onKeyDownOnInactiveElement_);
    }
  };

  /**
   * Attaches the input handler to multiple elements.
   * @param {...Element} var_args Elements to attach the input handler too.
   */
  attachInputs(var_args) {
    for (var i = 0; i < arguments.length; i++) {
      this.attachInput(arguments[i]);
    }
  };

  /**
   * Detaches the input handler from multuple elements.
   * @param {...Element} var_args Variable arguments for elements to unbind from.
   */
  detachInputs(var_args) {
    for (var i = 0; i < arguments.length; i++) {
      this.detachInput(arguments[i]);
    }
  };

  /**
   * Selects the given row.  Implements the SelectionHandler interface.
   * @param {?} row The row to select.
   * @param {boolean=} opt_multi Should this be treated as a single or multi-token
   *     auto-complete?  Overrides previous setting of opt_multi on constructor.
   * @return {boolean} Whether to suppress the update event.
   */
  selectRow(row, opt_multi) {
    if (this.activeElement_) {
      this.setTokenText(row.toString(), opt_multi);
    }
    return false;
  };

  /**
   * Sets the text of the current token without updating the autocomplete
   * choices.
   * @param {string} tokenText The text for the current token.
   * @param {boolean=} opt_multi Should this be treated as a single or multi-token
   *     auto-complete?  Overrides previous setting of opt_multi on constructor.
   * @protected
   */
  setTokenText(
      tokenText, opt_multi) {
    if (opt_multi !== undefined ? opt_multi : this.multi_) {
      var index = this.getTokenIndex_(this.getValue(), this.getCursorPosition());
  
      // Break up the current input string.
      var entries = this.splitInput_(this.getValue());
  
      // Get the new value, ignoring whitespace associated with the entry.
      var replaceValue = tokenText;
  
      // Only add punctuation if there isn't already a separator available.
      if (this.separatorCheck_ && !this.separatorCheck_.test(replaceValue)) {
        replaceValue =
            strings.trimRight(replaceValue) + this.defaultSeparator_;
      }
  
      // Ensure there's whitespace wrapping the entries, if whitespaceWrapEntries_
      // has been set to true.
      if (this.whitespaceWrapEntries_) {
        if (index != 0 && !strings.isEmptyOrWhitespace(entries[index - 1])) {
          replaceValue = ' ' + replaceValue;
        }
        // Add a space only if it's the last token; otherwise, we assume the
        // next token already has the proper spacing.
        if (index == entries.length - 1) {
          replaceValue = replaceValue + ' ';
        }
      }
  
      // If the token needs changing, then update the input box and move the
      // cursor to the correct position.
      if (replaceValue != entries[index]) {
        // Replace the value in the array.
        entries[index] = replaceValue;
  
        var el = this.activeElement_;
        // If there is an uncommitted IME in Firefox or IE 9, setting the value
        // fails and results in actually clearing the value that's already in the
        // input.
        // The FF bug is http://bugzilla.mozilla.org/show_bug.cgi?id=549674
        // Blurring before setting the value works around this problem. We'd like
        // to do this only if there is an uncommitted IME, but this isn't possible
        // to detect. Since text editing is finicky we restrict this
        // workaround to Firefox and IE 9 where it's necessary.
        // (Note: this has been fixed in Edge and since FF 41)
        if (userAgent.GECKO ||
            (userAgent.IE && userAgent.isVersionOrHigher('9'))) {
          el.blur();
        }
        // Join the array and replace the contents of the input.
        el.value = entries.join('');
  
        // Calculate which position to put the cursor at.
        var pos = 0;
        for (var i = 0; i <= index; i++) {
          pos += entries[i].length;
        }
  
        // Set the cursor.
        el.focus();
        this.setCursorPosition(pos);
      }
    } else {
      this.setValue(tokenText);
    }
  
    // Avoid triggering an autocomplete just because the value changed.
    this.rowJustSelected_ = true;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    if (this.activeTimeoutId_ != null) {
      // Need to check against null explicitly because 0 is a valid value.
      window.clearTimeout(this.activeTimeoutId_);
    }
    this.eh_.dispose();
    delete this.eh_;
    this.activateHandler_.dispose();
    this.keyHandler_.dispose();
    dispose(this.timer_);
  };

  /**
   * Sets the entry separator characters.
   *
   * @param {string} separators The separator characters to set.
   * @param {string=} opt_defaultSeparators The defaultSeparator character to set.
   */
  setSeparators(
      separators, opt_defaultSeparators) {
    this.separators_ = separators;
    this.defaultSeparator_ = (opt_defaultSeparators != null) ?
        opt_defaultSeparators :
        this.separators_.substring(0, 1);
  
    var wspaceExp = this.multi_ ? '[\\s' + this.separators_ + ']+' : '[\\s]+';
  
    this.trimmer_ = new RegExp('^' + wspaceExp + '|' + wspaceExp + '$', 'g');
    this.separatorCheck_ = new RegExp('\\s*[' + this.separators_ + ']$');
  };

  /**
   * Sets whether to flip the orientation of up & down for hiliting next
   * and previous autocomplete entries.
   * @param {boolean} upsideDown Whether the orientation is upside down.
   */
  setUpsideDown(upsideDown) {
    this.upsideDown_ = upsideDown;
  };

  /**
   * Sets whether auto-completed tokens should be wrapped with whitespace.
   * @param {boolean} newValue boolean value indicating whether or not
   *     auto-completed tokens should be wrapped with whitespace.
   */
  setWhitespaceWrapEntries(
      newValue) {
    this.whitespaceWrapEntries_ = newValue;
  };

  /**
   * Sets whether new tokens should be generated from literals.  That is, should
   * hello'world be two tokens, assuming ' is a literal?
   * @param {boolean} newValue boolean value indicating whether or not
   * new tokens should be generated from literals.
   */
  setGenerateNewTokenOnLiteral(
      newValue) {
    this.generateNewTokenOnLiteral_ = newValue;
  };

  /**
   * Sets the regular expression used to trim the tokens before passing them to
   * the matcher:  every substring that matches the given regular expression will
   * be removed.  This can also be set to null to disable trimming.
   * @param {?RegExp} trimmer Regexp to use for trimming or null to disable it.
   */
  setTrimmingRegExp(trimmer) {
    this.trimmer_ = trimmer;
  };

  /**
   * Sets the regular expression used to check whether the replacement (used to
   * update the text area after a row is selected) ends with a separator. This can
   * be set to null if the input handler should never automatically append a
   * separator to the replacement string.
   * @param {?RegExp} separatorCheck Regexp to use for checking whether the
   *     replacement ends with a separator.
   */
  setEndsWithSeparatorRegExp(
      separatorCheck) {
    this.separatorCheck_ = separatorCheck;
  };

  /**
   * Sets whether we will prevent the default input behavior (moving focus to the
   * next focusable  element) on TAB.
   * @param {boolean} newValue Whether to preventDefault on TAB.
   */
  setPreventDefaultOnTab(newValue) {
    this.preventDefaultOnTab_ = newValue;
  };

  /**
   * Sets whether we will prevent highlighted item selection on TAB.
   * @param {boolean} newValue Whether to prevent selection on TAB.
   */
  setPreventSelectionOnTab(
      newValue) {
    this.preventSelectionOnTab_ = newValue;
  };

  /**
   * Sets whether separators perform autocomplete.
   * @param {boolean} newValue Whether to autocomplete on separators.
   */
  setSeparatorCompletes(newValue) {
    this.separatorUpdates_ = newValue;
    this.separatorSelects_ = newValue;
  };

  /**
   * Sets whether separators perform autocomplete.
   * @param {boolean} newValue Whether to autocomplete on separators.
   */
  setSeparatorSelects(newValue) {
    this.separatorSelects_ = newValue;
  };

  /**
   * Gets the time to wait before updating the results. If the update during
   * typing flag is switched on, this delay counts from the last update,
   * otherwise from the last keypress.
   * @return {number} Throttle time in milliseconds.
   */
  getThrottleTime() {
    return this.timer_ ? this.timer_.getInterval() : -1;
  };

  /**
   * Sets whether a row has just been selected.
   * @param {boolean} justSelected Whether or not the row has just been selected.
   */
  setRowJustSelected(justSelected) {
    this.rowJustSelected_ = justSelected;
  };

  /**
   * Sets the time to wait before updating the results.
   * @param {number} time New throttle time in milliseconds.
   */
  setThrottleTime(time) {
    if (time < 0) {
      this.timer_.dispose();
      this.timer_ = null;
      return;
    }
    if (this.timer_) {
      this.timer_.setInterval(time);
    } else {
      this.timer_ = new Timer(time);
    }
  };

  /**
   * Gets whether the result list is updated during typing.
   * @return {boolean} Value of the flag.
   */
  getUpdateDuringTyping() {
    return this.updateDuringTyping_;
  };

  /**
   * Sets whether the result list should be updated during typing.
   * @param {boolean} value New value of the flag.
   */
  setUpdateDuringTyping(value) {
    this.updateDuringTyping_ = value;
  };

  /**
   * Handles a key event.
   * @param {EventsBrowserEvent} e Browser event object.
   * @return {boolean} True if the key event was handled.
   * @protected
   */
  handleKeyEvent(e) {
    switch (e.keyCode) {
      // If the menu is open and 'down' caused a change then prevent the default
      // action and prevent scrolling.  If the box isn't a multi autocomplete
      // and the menu isn't open, we force it open now.
      case KeyCodes.DOWN:
        if (this.ac_.isOpen()) {
          this.moveDown_();
          e.preventDefault();
          return true;
  
        } else if (!this.multi_) {
          this.update(true);
          e.preventDefault();
          return true;
        }
        break;
  
      // If the menu is open and 'up' caused a change then prevent the default
      // action and prevent scrolling.
      case KeyCodes.UP:
        if (this.ac_.isOpen()) {
          this.moveUp_();
          e.preventDefault();
          return true;
        }
        break;
  
      // If tab key is pressed, select the current highlighted item.  The default
      // action is also prevented if the input is a multi input, to prevent the
      // user tabbing out of the field.
      case KeyCodes.TAB:
        if (this.ac_.isOpen() && !e.shiftKey && !this.preventSelectionOnTab_) {
          // Ensure the menu is up to date before completing.
          this.update();
          if (this.ac_.selectHilited() && this.preventDefaultOnTab_) {
            e.preventDefault();
            return true;
          }
        } else {
          this.ac_.dismiss();
        }
        break;
  
      // On enter, just select the highlighted row.
      case KeyCodes.ENTER:
        if (this.ac_.isOpen()) {
          // Ensure the menu is up to date before completing.
          this.update();
          if (this.ac_.selectHilited()) {
            e.preventDefault();
            e.stopPropagation();
            return true;
          }
        } else {
          this.ac_.dismiss();
        }
        break;
  
      // On escape tell the autocomplete to dismiss.
      case KeyCodes.ESC:
        if (this.ac_.isOpen()) {
          this.ac_.dismiss();
          e.preventDefault();
          e.stopPropagation();
          return true;
        }
        break;
  
      // The IME keycode indicates an IME sequence has started, we ignore all
      // changes until we get an enter key-up.
      case KeyCodes.WIN_IME:
        if (!this.waitingForIme_) {
          this.startWaitingForIme_();
          return true;
        }
        break;
  
      default:
        if (this.timer_ && !this.updateDuringTyping_) {
          // Waits throttle time before sending the request again.
          this.timer_.stop();
          this.timer_.start();
        }
    }
  
    return this.handleSeparator_(e);
  };

  /**
   * Handles a key event for a separator key.
   * @param {EventsBrowserEvent} e Browser event object.
   * @return {boolean} True if the key event was handled.
   * @private
   */
  handleSeparator_(e) {
    var isSeparatorKey = this.multi_ && e.charCode &&
        this.separators_.indexOf(String.fromCharCode(e.charCode)) != -1;
    if (this.separatorUpdates_ && isSeparatorKey) {
      this.update();
    }
    if (this.separatorSelects_ && isSeparatorKey) {
      if (this.ac_.selectHilited()) {
        e.preventDefault();
        return true;
      }
    }
    return false;
  };

  /**
   * @return {boolean} Whether this inputhandler need to listen on key-up.
   * @protected
   */
  needKeyUpListener() {
    return false;
  };

  /**
   * Handles the key up event. Registered only if needKeyUpListener returns true.
   * @param {EventsEvent} e The keyup event.
   * @return {boolean} Whether an action was taken or not.
   * @protected
   */
  handleKeyUp(e) {
    return false;
  };

  /**
   * Adds the necessary input event handlers.
   * @private
   */
  addEventHandlers_() {
    this.keyHandler_.attach(this.activeElement_);
    this.eh_.listen(
        this.keyHandler_, EventType.KEY, this.onKey_);
    if (this.needKeyUpListener()) {
      this.eh_.listen(
          this.activeElement_, EventsEventType.KEYUP, this.handleKeyUp);
    }
    this.eh_.listen(
        this.activeElement_, EventsEventType.MOUSEDOWN, this.onMouseDown_);
  
    // IE6 also needs a keypress to check if the user typed a separator
    if (userAgent.IE) {
      this.eh_.listen(
          this.activeElement_, EventsEventType.KEYPRESS,
          this.onIeKeyPress_);
    }
  };

  /**
   * Removes the necessary input event handlers.
   * @private
   */
  removeEventHandlers_() {
    this.eh_.unlisten(
        this.keyHandler_, EventType.KEY, this.onKey_);
    this.keyHandler_.detach();
    this.eh_.unlisten(
        this.activeElement_, EventsEventType.KEYUP, this.handleKeyUp);
    this.eh_.unlisten(
        this.activeElement_, EventsEventType.MOUSEDOWN, this.onMouseDown_);
  
    if (userAgent.IE) {
      this.eh_.unlisten(
          this.activeElement_, EventsEventType.KEYPRESS,
          this.onIeKeyPress_);
    }
  
    if (this.waitingForIme_) {
      this.stopWaitingForIme_();
    }
  };

  /**
   * Handles an element getting focus.
   * @param {EventsEvent} e Browser event object.
   * @protected
   */
  handleFocus(e) {
    this.processFocus(/** @type {Element} */ (e.target || null));
  };

  /**
   * Registers handlers for the active element when it receives focus.
   * @param {Element} target The element to focus.
   * @protected
   */
  processFocus(target) {
    this.activateHandler_.removeAll();
  
    if (this.ac_) {
      this.ac_.cancelDelayedDismiss();
    }
  
    // Double-check whether the active element has actually changed.
    // This is a fix for Safari 3, which fires spurious focus events.
    if (target != this.activeElement_) {
      this.activeElement_ = target;
      if (this.timer_) {
        this.timer_.start();
        this.eh_.listen(this.timer_, Timer.TICK, this.onTick_);
      }
      this.lastValue_ = this.getValue();
      this.addEventHandlers_();
    }
  };

  /**
   * Handles an element blurring.
   * @param {EventsEvent=} opt_e Browser event object.
   * @protected
   */
  handleBlur(opt_e) {
    // Phones running iOS prior to version 4.2.
    if (InputHandler.REQUIRES_ASYNC_BLUR_) {
      // @bug 4484488 This is required so that the menu works correctly on
      // iOS prior to version 4.2. Otherwise, the blur action closes the menu
      // before the menu button click can be processed.
      // In order to fix the bug, we set a timeout to process the blur event, so
      // that any pending selection event can be processed first.
      this.activeTimeoutId_ =
          window.setTimeout(google.bind(this.processBlur, this), 0);
      return;
    } else {
      this.processBlur();
    }
  };

  /**
   * Helper function that does the logic to handle an element blurring.
   * @protected
   */
  processBlur() {
    // it's possible that a blur event could fire when there's no active element,
    // in the case where attachInput was called on an input that already had
    // the focus
    if (this.activeElement_) {
      this.removeEventHandlers_();
      this.activeElement_ = null;
  
      if (this.timer_) {
        this.timer_.stop();
        this.eh_.unlisten(this.timer_, Timer.TICK, this.onTick_);
      }
  
      if (this.ac_) {
        // Pause dismissal slightly to take into account any other events that
        // might fire on the renderer (e.g. a click will lose the focus).
        this.ac_.dismissOnDelay();
      }
    }
  };

  /**
   * Handles the timer's tick event.  Calculates the current token, and reports
   * any update to the autocomplete.
   * @param {EventsEvent} e Browser event object.
   * @private
   */
  onTick_(e) {
    this.update();
  };

  /**
   * Handles typing in an inactive input element. Activate it.
   * @param {EventsBrowserEvent} e Browser event object.
   * @private
   */
  onKeyDownOnInactiveElement_(e) {
    this.handleFocus(e);
  };

  /**
   * Handles typing in the active input element.  Checks if the key is a special
   * key and does the relevant action as appropriate.
   * @param {EventsBrowserEvent} e Browser event object.
   * @private
   */
  onKey_(e) {
    this.lastKeyCode_ = e.keyCode;
    if (this.ac_) {
      this.handleKeyEvent(e);
    }
  };

  /**
   * Handles a KEYPRESS event generated by typing in the active input element.
   * Checks if IME input is ended.
   * @param {EventsBrowserEvent} e Browser event object.
   * @private
   */
  onKeyPress_(e) {
    if (this.waitingForIme_ &&
        this.lastKeyCode_ != KeyCodes.WIN_IME) {
      this.stopWaitingForIme_();
    }
  };

  /**
   * Handles the key-up event.  This is only ever used by Mac FF or when we are in
   * an IME entry scenario.
   * @param {EventsBrowserEvent} e Browser event object.
   * @private
   */
  onKeyUp_(e) {
    if (this.waitingForIme_ &&
        (e.keyCode == KeyCodes.ENTER ||
         (e.keyCode == KeyCodes.M && e.ctrlKey))) {
      this.stopWaitingForIme_();
    }
  };

  /**
   * Handles mouse-down event.
   * @param {EventsBrowserEvent} e Browser event object.
   * @private
   */
  onMouseDown_(e) {
    if (this.ac_) {
      this.handleMouseDown(e);
    }
  };

  /**
   * For subclasses to override to handle the mouse-down event.
   * @param {EventsBrowserEvent} e Browser event object.
   * @protected
   */
  handleMouseDown(e) {};

  /**
   * Starts waiting for IME.
   * @private
   */
  startWaitingForIme_() {
    if (this.waitingForIme_) {
      return;
    }
    this.eh_.listen(
        this.activeElement_, EventsEventType.KEYUP, this.onKeyUp_);
    this.eh_.listen(
        this.activeElement_, EventsEventType.KEYPRESS, this.onKeyPress_);
    this.waitingForIme_ = true;
  };

  /**
   * Stops waiting for IME.
   * @private
   */
  stopWaitingForIme_() {
    if (!this.waitingForIme_) {
      return;
    }
    this.waitingForIme_ = false;
    this.eh_.unlisten(
        this.activeElement_, EventsEventType.KEYPRESS, this.onKeyPress_);
    this.eh_.unlisten(
        this.activeElement_, EventsEventType.KEYUP, this.onKeyUp_);
  };

  /**
   * Handles the key-press event for IE, checking to see if the user typed a
   * separator character.
   * @param {EventsBrowserEvent} e Browser event object.
   * @private
   */
  onIeKeyPress_(e) {
    this.handleSeparator_(e);
  };

  /**
   * Checks if an update has occurred and notified the autocomplete of the new
   * token.
   * @param {boolean=} opt_force If true the menu will be forced to update.
   */
  update(opt_force) {
    if (this.activeElement_ &&
        (opt_force || this.getValue() != this.lastValue_)) {
      if (opt_force || !this.rowJustSelected_) {
        var token = this.parseToken();
  
        if (this.ac_) {
          this.ac_.setTarget(this.activeElement_);
          this.ac_.setToken(token, this.getValue());
        }
      }
      this.lastValue_ = this.getValue();
    }
    this.rowJustSelected_ = false;
  };

  /**
   * Parses a text area or input box for the currently highlighted token.
   * @return {string} Token to complete.
   * @protected
   */
  parseToken() {
    return this.parseToken_();
  };

  /**
   * Moves hilite up.  May hilite next or previous depending on orientation.
   * @return {boolean} True if successful.
   * @private
   */
  moveUp_() {
    return this.upsideDown_ ? this.ac_.hiliteNext() : this.ac_.hilitePrev();
  };

  /**
   * Moves hilite down.  May hilite next or previous depending on orientation.
   * @return {boolean} True if successful.
   * @private
   */
  moveDown_() {
    return this.upsideDown_ ? this.ac_.hilitePrev() : this.ac_.hiliteNext();
  };

  /**
   * Parses a text area or input box for the currently highlighted token.
   * @return {string} Token to complete.
   * @private
   */
  parseToken_() {
    var caret = this.getCursorPosition();
    var text = this.getValue();
    return this.trim_(this.splitInput_(text)[this.getTokenIndex_(text, caret)]);
  };

  /**
   * Trims a token of characters that we want to ignore
   * @param {string} text string to trim.
   * @return {string} Trimmed string.
   * @private
   */
  trim_(text) {
    return this.trimmer_ ? String(text).replace(this.trimmer_, '') : text;
  };

  /**
   * Gets the index of the currently highlighted token
   * @param {string} text string to parse.
   * @param {number} caret Position of cursor in string.
   * @return {number} Index of token.
   * @private
   */
  getTokenIndex_(text, caret) {
    // Split up the input string into multiple entries
    var entries = this.splitInput_(text);
  
    // Short-circuit to select the last entry
    if (caret == text.length) return entries.length - 1;
  
    // Calculate which of the entries the cursor is currently in
    var current = 0;
    for (var i = 0, pos = 0; i < entries.length && pos <= caret; i++) {
      pos += entries[i].length;
      current = i;
    }
  
    // Get the token for the current item
    return current;
  };

  /**
   * Splits an input string of text at the occurrence of a character in
   * {@link InputHandler.prototype.separators_} and creates
   * an array of tokens.  Each token may contain additional whitespace and
   * formatting marks.  If necessary use
   * {@link InputHandler.prototype.trim_} to clean up the
   * entries.
   *
   * @param {string} text Input text.
   * @return {!Array<string>} Parsed array.
   * @private
   */
  splitInput_(text) {
    if (!this.multi_) {
      return [text];
    }
  
    var arr = String(text).split('');
    var parts = [];
    var cache = [];
  
    for (var i = 0, inLiteral = false; i < arr.length; i++) {
      if (this.literals_ && this.literals_.indexOf(arr[i]) != -1) {
        if (this.generateNewTokenOnLiteral_ && !inLiteral) {
          parts.push(cache.join(''));
          cache.length = 0;
        }
        cache.push(arr[i]);
        inLiteral = !inLiteral;
  
      } else if (!inLiteral && this.separators_.indexOf(arr[i]) != -1) {
        cache.push(arr[i]);
        parts.push(cache.join(''));
        cache.length = 0;
  
      } else {
        cache.push(arr[i]);
      }
    }
    parts.push(cache.join(''));
  
    return parts;
  };
}

// google.tagUnsealableClass(InputHandler);

/**
 * Whether or not we need to pause the execution of the blur handler in order
 * to allow the execution of the selection handler to run first. This is
 * currently true when running on IOS version prior to 4.2, since we need
 * some special logic for these devices to handle bug 4484488.
 * @type {boolean}
 * @private
 */
InputHandler.REQUIRES_ASYNC_BLUR_ =
    (product.IPHONE || product.IPAD) &&
    // Check the webkit version against the version for iOS 4.2.1.
    !userAgent.isVersionOrHigher('533.17.9');

/**
 * Standard list separators.
 * @type {string}
 * @const
 */
InputHandler.STANDARD_LIST_SEPARATORS = ',;';

/**
 * Literals for quotes.
 * @type {string}
 * @const
 */
InputHandler.QUOTE_LITERALS = '"';

export {InputHandler};