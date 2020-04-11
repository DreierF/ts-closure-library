import * as aria from './../a11y/aria/aria.js';
import {State} from './../a11y/aria/attributes.js';
import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {InputType} from './../dom/inputtype.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import {EventHandler} from './../events/eventhandler.js';
import {EventType} from './../events/eventtype.js';
import * as google from './../google.js';
import {Timer} from './../timer/timer.js';
import * as userAgent from './../useragent/useragent.js';
import {Component} from './component.js';
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
 * @fileoverview This behavior is applied to a text input and it shows a text
 * message inside the element if the user hasn't entered any text.
 *
 * This uses the HTML5 placeholder attribute where it is supported.
 *
 * This is ported from http://go/labelinput.js
 *
 * Known issue: Safari does not allow you get to the window object from a
 * document. We need that to listen to the onload event. For now we hard code
 * the window to the current window.
 *
 * Known issue: We need to listen to the form submit event but we attach the
 * event only once (when created or when it is changed) so if you move the DOM
 * node to another form it will not be cleared correctly before submitting.
 *
 * @see ../demos/labelinput.html
 */

/**
 * This creates the label input object.
 * @extends {Component}
 */
class LabelInput extends Component {

  /**
   * This creates the label input object.
   * @param {string=} opt_label The text to show as the label.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   */
  constructor(opt_label, opt_domHelper) {
    super(opt_domHelper);
    /**
     * Variable used to store the element value on keydown and restore it on
     * keypress.  See {@link #handleEscapeKeys_}
     * @type {?string}
     * @private
     */
    this.ffKeyRestoreValue_ = null;
  
    /**
     * The label restore delay after leaving the input.
     * @type {number} Delay for restoring the label.
     * @protected
     */
    this.labelRestoreDelayMs = 10;
  
    /** @private
      * @type {boolean|null} */
    this.inFocusAndSelect_ = null;
  
    /** @private
      * @type {boolean|null} */
    this.formAttached_ = null;
  
    /**
     * @type {EventHandler}
     * @private
     */
    this.eventHandler_ = null;
  
    /**
     * @type {boolean}
     * @private
     */
    this.hasFocus_ = false;
  
    /**
     * The CSS class name to add to the input when the user has not entered a
     * value.
     */
    this.labelCssClassName =
        google.getCssName('label-input-label');
  
  
    /**
     * The text to show as the label.
     * @type {string}
     * @private
     */
    this.label_ = opt_label || '';
  }

  /**
   * Checks browser support for placeholder attribute.
   * @return {boolean} Whether placeholder attribute is supported.
   * @private
   */
  static isPlaceholderSupported_() {
    if (LabelInput.supportsPlaceholder_ == null) {
      LabelInput.supportsPlaceholder_ =
          ('placeholder' in goog_dom.createElement(TagName.INPUT));
    }
    return LabelInput.supportsPlaceholder_;
  };

  /**
   * Creates the DOM nodes needed for the label input.
   * @override
   */
  createDom() {
    this.setElementInternal(
        this.getDomHelper().createDom(
            TagName.INPUT, {'type': InputType.TEXT}));
  };

  /**
   * Decorates an existing HTML input element as a label input. If the element
   * has a "label" attribute then that will be used as the label property for the
   * label input object.
   * @param {Element} element The HTML input element to decorate.
   * @override
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  decorateInternal(element) {
    super.decorateInternal(element);
    if (!this.label_) {
      this.label_ = element.getAttribute('label') || '';
    }
  
    // Check if we're attaching to an element that already has focus.
    if (goog_dom.getActiveElement(goog_dom.getOwnerDocument(element)) ==
        element) {
      this.hasFocus_ = true;
      var el = this.getElement();
      asserts.assert(el);
      classlist.remove(el, this.labelCssClassName);
    }
  
    if (LabelInput.isPlaceholderSupported_()) {
      this.getElement().placeholder = this.label_;
    }
    var labelInputElement = this.getElement();
    asserts.assert(
        labelInputElement, 'The label input element cannot be null.');
    aria.setState(
        labelInputElement, State.LABEL, this.label_);
  };

  /**
   * @override
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  enterDocument() {
    super.enterDocument();
    this.attachEvents_();
    this.check_();
  
    // Make it easy for other closure widgets to play nicely with inputs using
    // LabelInput:
    this.getElement().labelInput_ = this;
  };

  /**
   * @override
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  exitDocument() {
    super.exitDocument();
    this.detachEvents_();
  
    this.getElement().labelInput_ = null;
  };

  /**
   * Attaches the events we need to listen to.
   * @private
   */
  attachEvents_() {
    var eh = new EventHandler(this);
    eh.listen(this.getElement(), EventType.FOCUS, this.handleFocus_);
    eh.listen(this.getElement(), EventType.BLUR, this.handleBlur_);
  
    if (LabelInput.isPlaceholderSupported_()) {
      this.eventHandler_ = eh;
      return;
    }
  
    if (userAgent.GECKO) {
      eh.listen(
          this.getElement(),
          [
            EventType.KEYPRESS, EventType.KEYDOWN,
            EventType.KEYUP
          ],
          this.handleEscapeKeys_);
    }
  
    // IE sets defaultValue upon load so we need to test that as well.
    var d = goog_dom.getOwnerDocument(this.getElement());
    var w = goog_dom.getWindow(d);
    eh.listen(w, EventType.LOAD, this.handleWindowLoad_);
  
    this.eventHandler_ = eh;
    this.attachEventsToForm_();
  };

  /**
   * Adds a listener to the form so that we can clear the input before it is
   * submitted.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  attachEventsToForm_() {
    // in case we have are in a form we need to make sure the label is not
    // submitted
    if (!this.formAttached_ && this.eventHandler_ && this.getElement().form) {
      this.eventHandler_.listen(
          this.getElement().form, EventType.SUBMIT,
          this.handleFormSubmit_);
      this.formAttached_ = true;
    }
  };

  /**
   * Stops listening to the events.
   * @private
   */
  detachEvents_() {
    if (this.eventHandler_) {
      this.eventHandler_.dispose();
      this.eventHandler_ = null;
    }
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    this.detachEvents_();
  };

  /**
   * Handler for the focus event.
   * @param {EventsEvent} e The event object passed in to the event handler.
   * @private
   */
  handleFocus_(e) {
    this.hasFocus_ = true;
    var el = this.getElement();
    asserts.assert(el);
    classlist.remove(el, this.labelCssClassName);
    if (LabelInput.isPlaceholderSupported_()) {
      return;
    }
    if (!this.hasChanged() && !this.inFocusAndSelect_) {
      var me = this;
      /** @suppress {strictMissingProperties} Part of the go/strict_warnings_migration */
      function clearValue() {
        // Component could be disposed by the time this is called.
        if (me.getElement()) {
          me.getElement().value = '';
        }
      };
      if (userAgent.IE) {
        Timer.callOnce(clearValue, 10);
      } else {
        clearValue();
      }
    }
  };

  /**
   * Handler for the blur event.
   * @param {EventsEvent} e The event object passed in to the event handler.
   * @private
   */
  handleBlur_(e) {
    // We listen to the click event when we enter focusAndSelect mode so we can
    // fake an artificial focus when the user clicks on the input box. However,
    // if the user clicks on something else (and we lose focus), there is no
    // need for an artificial focus event.
    if (!LabelInput.isPlaceholderSupported_()) {
      this.eventHandler_.unlisten(
          this.getElement(), EventType.CLICK, this.handleFocus_);
      this.ffKeyRestoreValue_ = null;
    }
    this.hasFocus_ = false;
    this.check_();
  };

  /**
   * Handler for key events in Firefox.
   *
   * If the escape key is pressed when a text input has not been changed manually
   * since being focused, the text input will revert to its previous value.
   * Firefox does not honor preventDefault for the escape key. The revert happens
   * after the keydown event and before every keypress. We therefore store the
   * element's value on keydown and restore it on keypress. The restore value is
   * nullified on keyup so that {@link #getValue} returns the correct value.
   *
   * IE and Chrome don't have this problem, Opera blurs in the input box
   * completely in a way that preventDefault on the escape key has no effect.
   * @param {EventsBrowserEvent} e The event object passed in to
   *     the event handler.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleEscapeKeys_(e) {
    if (e.keyCode == 27) {
      if (e.type == EventType.KEYDOWN) {
        this.ffKeyRestoreValue_ = this.getElement().value;
      } else if (e.type == EventType.KEYPRESS) {
        this.getElement().value = /** @type {string} */ (this.ffKeyRestoreValue_);
      } else if (e.type == EventType.KEYUP) {
        this.ffKeyRestoreValue_ = null;
      }
      e.preventDefault();
    }
  };

  /**
   * Handler for the submit event of the form element.
   * @param {EventsEvent} e The event object passed in to the event handler.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleFormSubmit_(e) {
    if (!this.hasChanged()) {
      this.getElement().value = '';
      // allow form to be sent before restoring value
      Timer.callOnce(this.handleAfterSubmit_, 10, this);
    }
  };

  /**
   * Restore value after submit
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleAfterSubmit_() {
    if (!this.hasChanged()) {
      this.getElement().value = this.label_;
    }
  };

  /**
   * Handler for the load event the window. This is needed because
   * IE sets defaultValue upon load.
   * @param {Event} e The event object passed in to the event handler.
   * @private
   */
  handleWindowLoad_(e) {
    this.check_();
  };

  /**
   * @return {boolean} Whether the control is currently focused on.
   */
  hasFocus() {
    return this.hasFocus_;
  };

  /**
   * @return {boolean} Whether the value has been changed by the user.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  hasChanged() {
    return !!this.getElement() && this.getElement().value != '' &&
        this.getElement().value != this.label_;
  };

  /**
   * Clears the value of the input element without resetting the default text.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  clear() {
    this.getElement().value = '';
  
    // Reset ffKeyRestoreValue_ when non-null
    if (this.ffKeyRestoreValue_ != null) {
      this.ffKeyRestoreValue_ = '';
    }
  };

  /**
   * Clears the value of the input element and resets the default text.
   */
  reset() {
    if (this.hasChanged()) {
      this.clear();
      this.check_();
    }
  };

  /**
   * Use this to set the value through script to ensure that the label state is
   * up to date
   * @param {string} s The new value for the input.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  setValue(s) {
    if (this.ffKeyRestoreValue_ != null) {
      this.ffKeyRestoreValue_ = s;
    }
    this.getElement().value = s;
    this.check_();
  };

  /**
   * Returns the current value of the text box, returning an empty string if the
   * search box is the default value
   * @return {string} The value of the input box.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  getValue() {
    if (this.ffKeyRestoreValue_ != null) {
      // Fix the Firefox from incorrectly reporting the value to calling code
      // that attached the listener to keypress before the labelinput
      return this.ffKeyRestoreValue_;
    }
    return this.hasChanged() ? /** @type {string} */ (this.getElement().value) :
                                                     '';
  };

  /**
   * Sets the label text as aria-label, and placeholder when supported.
   * @param {string} label The text to show as the label.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  setLabel(label) {
    var labelInputElement = this.getElement();
  
    if (LabelInput.isPlaceholderSupported_()) {
      if (labelInputElement) {
        labelInputElement.placeholder = label;
      }
      this.label_ = label;
    } else if (!this.hasChanged()) {
      // The this.hasChanged() call relies on non-placeholder behavior checking
      // prior to setting this.label_ - it also needs to happen prior to the
      // this.restoreLabel_() call.
      if (labelInputElement) {
        labelInputElement.value = '';
      }
      this.label_ = label;
      this.restoreLabel_();
    }
    // Check if this has been called before DOM structure building
    if (labelInputElement) {
      aria.setState(
          labelInputElement, State.LABEL, this.label_);
    }
  };

  /**
   * @return {string} The text to show as the label.
   */
  getLabel() {
    return this.label_;
  };

  /**
   * Checks the state of the input element
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  check_() {
    var labelInputElement = this.getElement();
    asserts.assert(
        labelInputElement, 'The label input element cannot be null.');
    if (!LabelInput.isPlaceholderSupported_()) {
      // if we haven't got a form yet try now
      this.attachEventsToForm_();
    } else if (this.getElement().placeholder != this.label_) {
      this.getElement().placeholder = this.label_;
    }
    aria.setState(
        labelInputElement, State.LABEL, this.label_);
  
    if (!this.hasChanged()) {
      if (!this.inFocusAndSelect_ && !this.hasFocus_) {
        var el = this.getElement();
        asserts.assert(el);
        classlist.add(el, this.labelCssClassName);
      }
  
      // Allow browser to catchup with CSS changes before restoring the label.
      if (!LabelInput.isPlaceholderSupported_()) {
        Timer.callOnce(this.restoreLabel_, this.labelRestoreDelayMs, this);
      }
    } else {
      var el = this.getElement();
      asserts.assert(el);
      classlist.remove(el, this.labelCssClassName);
    }
  };

  /**
   * This method focuses the input and selects all the text. If the value hasn't
   * changed it will set the value to the label so that the label text is
   * selected.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  focusAndSelect() {
    // We need to check whether the input has changed before focusing
    var hc = this.hasChanged();
    this.inFocusAndSelect_ = true;
    this.getElement().focus();
    if (!hc && !LabelInput.isPlaceholderSupported_()) {
      this.getElement().value = this.label_;
    }
    this.getElement().select();
  
    // Since the object now has focus, we won't get a focus event when they
    // click in the input element. The expected behavior when you click on
    // the default text is that it goes away and allows you to type...so we
    // have to fire an artificial focus event when we're in focusAndSelect mode.
    if (LabelInput.isPlaceholderSupported_()) {
      return;
    }
    if (this.eventHandler_) {
      this.eventHandler_.listenOnce(
          this.getElement(), EventType.CLICK, this.handleFocus_);
    }
  
    // set to false in timer to let IE trigger the focus event
    Timer.callOnce(this.focusAndSelect_, 10, this);
  };

  /**
   * Enables/Disables the label input.
   * @param {boolean} enabled Whether to enable (true) or disable (false) the
   *     label input.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  setEnabled(enabled) {
    this.getElement().disabled = !enabled;
    var el = this.getElement();
    asserts.assert(el);
    classlist.enable(
        el, google.getCssName(this.labelCssClassName, 'disabled'), !enabled);
  };

  /**
   * @return {boolean} True if the label input is enabled, false otherwise.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  isEnabled() {
    return !this.getElement().disabled;
  };

  /**
   * @private
   */
  focusAndSelect_() {
    this.inFocusAndSelect_ = false;
  };

  /**
   * Sets the value of the input element to label.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  restoreLabel_() {
    // Check again in case something changed since this was scheduled.
    // We check that the element is still there since this is called by a timer
    // and the dispose method may have been called prior to this.
    if (this.getElement() && !this.hasChanged() && !this.hasFocus_) {
      this.getElement().value = this.label_;
    }
  };
}

// google.tagUnsealableClass(LabelInput);

/**
 * Indicates whether the browser supports the placeholder attribute, new in
 * HTML5.
 * @type {?boolean}
 * @private
 */
LabelInput.supportsPlaceholder_;

export {LabelInput};