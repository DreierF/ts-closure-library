import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {InputType} from './../dom/inputtype.js';
import {TagName} from './../dom/tagname.js';
import * as events from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import * as functions from './../functions/functions.js';
import * as google from './../google.js';
import {SafeHtml} from './../html/safehtml.js';
import {Timer} from './../timer/timer.js';
import * as userAgent from './../useragent/useragent.js';
import {Component} from './component.js';
import {Error as ComponentError} from './component.js';
import {Dialog} from './dialog.js';
import {Event as DialogEvent} from './dialog.js';
import {EventType as DialogEventType} from './dialog.js';
import {ButtonSet} from './dialog.js';
import {EventType} from './dialog.js';
import {DefaultButtonKeys} from './dialog.js';
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
 * @fileoverview DHTML prompt to replace javascript's prompt().
 *
 * @see ../demos/prompt.html
 */

/**
 * Creates an object that represents a prompt (used in place of javascript's
 * prompt). The html structure of the prompt is the same as the layout for
 * dialog.js except for the addition of a text box which is placed inside the
 * "Content area" and has the default class-name 'modal-dialog-userInput'
 *
 *     String is treated as plain text and it will be HTML-escaped.
 *     Cancel. The function should expect a single argument which represents
 *     what the user entered into the prompt. If the user presses cancel, the
 *     value of the argument will be null.
 *     the text box when the prompt appears.
 *     z-index issue by using a an iframe instead of a div for bg element.
 *    Component} for semantics.
 * @extends {Dialog}
 */
class Prompt extends Dialog {

  /**
   * Creates an object that represents a prompt (used in place of javascript's
   * prompt). The html structure of the prompt is the same as the layout for
   * dialog.js except for the addition of a text box which is placed inside the
   * "Content area" and has the default class-name 'modal-dialog-userInput'
   *
   * @param {string} promptTitle The title of the prompt.
   * @param {string|!SafeHtml} promptBody The body of the prompt.
   *     String is treated as plain text and it will be HTML-escaped.
   * @param {Function} callback The function to call when the user selects Ok or
   *     Cancel. The function should expect a single argument which represents
   *     what the user entered into the prompt. If the user presses cancel, the
   *     value of the argument will be null.
   * @param {string=} opt_defaultValue Optional default value that should be in
   *     the text box when the prompt appears.
   * @param {string=} opt_class Optional prefix for the classes.
   * @param {boolean=} opt_useIframeForIE For IE, workaround windowed controls
   *     z-index issue by using a an iframe instead of a div for bg element.
   * @param {DomHelper=} opt_domHelper Optional DOM helper; see {@link
   *    Component} for semantics.
   */
  constructor(
      promptTitle, promptBody, callback, opt_defaultValue, opt_class,
      opt_useIframeForIE, opt_domHelper) {
    super(opt_class, opt_useIframeForIE, opt_domHelper);
    /**
     * Callback function which is invoked with the response to the prompt
     * @type {Function}
     * @private
     */
    this.callback_ = google.nullFunction;
  
    /**
     * Default value to display in prompt window
     * @type {string}
     * @private
     */
    this.defaultValue_ = '';
  
    /**
     * Element in which user enters response (HTML <input> text box)
     * @type {?HTMLInputElement|?HTMLTextAreaElement}
     * @private
     */
    this.userInputEl_ = null;
  
    /**
     * Tracks whether the prompt is in the process of closing to prevent multiple
     * calls to the callback when the user presses enter.
     * @type {boolean}
     * @private
     */
    this.isClosing_ = false;
  
    /**
     * Number of rows in the user input element.
     * The default is 1 which means use an <input> element.
     * @type {number}
     * @private
     */
    this.rows_ = 1;
  
    /**
     * Number of cols in the user input element.
     * The default is 0 which means use browser default.
     * @type {number}
     * @private
     */
    this.cols_ = 0;
  
    /**
     * The input decorator function.
     * @type {?function(?Element)}
     * @private
     */
    this.inputDecoratorFn_ = null;
  
    /**
     * A validation function that takes a string and returns true if the string is
     * accepted, false otherwise.
     * @type {function(string):boolean}
     * @private
     */
    this.validationFn_ = functions.TRUE;
  
  
    /**
     * The id of the input element.
     * @type {string}
     * @private
     */
    this.inputElementId_ = this.makeId('ie');
  
    this.setTitle(promptTitle);
  
    var label = SafeHtml.create(
        'label', {'for': this.inputElementId_},
        SafeHtml.htmlEscapePreservingNewlines(promptBody));
    var br = SafeHtml.BR;
    this.setSafeHtmlContent(SafeHtml.concat(label, br, br));
  
    this.callback_ = callback;
    this.defaultValue_ = (opt_defaultValue !== undefined) ? opt_defaultValue : '';
  
    /** @desc label for a dialog button. */
    var MSG_PROMPT_OK = google.getMsg('OK');
    /** @desc label for a dialog button. */
    var MSG_PROMPT_CANCEL = google.getMsg('Cancel');
    var buttonSet = new ButtonSet(opt_domHelper);
    buttonSet.set(DefaultButtonKeys.OK, MSG_PROMPT_OK, true);
    buttonSet.set(
        DefaultButtonKeys.CANCEL, MSG_PROMPT_CANCEL, false, true);
    this.setButtonSet(buttonSet);
  }

  /**
   * Sets the validation function that takes a string and returns true if the
   * string is accepted, false otherwise.
   * @param {function(string): boolean} fn The validation function to use on user
   *     input.
   */
  setValidationFunction(fn) {
    this.validationFn_ = fn;
  };

  /** @override */
  enterDocument() {
    if (this.inputDecoratorFn_) {
      this.inputDecoratorFn_(this.userInputEl_);
    }
    super.enterDocument();
    this.getHandler().listen(
        this, EventType.SELECT, this.onPromptExit_);
  
    this.getHandler().listen(
        this.userInputEl_,
        [EventsEventType.KEYUP, EventsEventType.CHANGE],
        this.handleInputChanged_);
  };

  /**
   * @return {?HTMLInputElement|?HTMLTextAreaElement} The user input element. May
   *     be null if the Prompt has not been rendered.
   */
  getInputElement() {
    return this.userInputEl_;
  };

  /**
   * Sets an input decorator function.  This function will be called in
   * #enterDocument and will be passed the input element.  This is useful for
   * attaching handlers to the input element for specific change events,
   * for example.
   * @param {function(Element)} inputDecoratorFn A function to call on the input
   *     element on #enterDocument.
   */
  setInputDecoratorFn(inputDecoratorFn) {
    this.inputDecoratorFn_ = inputDecoratorFn;
  };

  /**
   * Set the number of rows in the user input element.
   * A values of 1 means use an `<input>` element.  If the prompt is already
   * rendered then you cannot change from `<input>` to `<textarea>` or vice versa.
   * @param {number} rows Number of rows for user input element.
   * @throws {ComponentError.ALREADY_RENDERED} If the component is
   *    already rendered and an attempt to change between `<input>` and
   *    `<textarea>` is made.
   */
  setRows(rows) {
    if (this.isInDocument()) {
      if (this.userInputEl_.tagName == TagName.INPUT) {
        if (rows > 1) {
          throw new Error(ComponentError.ALREADY_RENDERED);
        }
      } else {
        if (rows <= 1) {
          throw new Error(ComponentError.ALREADY_RENDERED);
        }
        this.userInputEl_.rows = rows;
      }
    }
    this.rows_ = rows;
  };

  /**
   * @return {number} The number of rows in the user input element.
   */
  getRows() {
    return this.rows_;
  };

  /**
   * Set the number of cols in the user input element.
   * @param {number} cols Number of cols for user input element.
   */
  setCols(cols) {
    this.cols_ = cols;
    if (this.userInputEl_) {
      if (this.userInputEl_.tagName == TagName.INPUT) {
        this.userInputEl_.size = cols;
      } else {
        this.userInputEl_.cols = cols;
      }
    }
  };

  /**
   * @return {number} The number of cols in the user input element.
   */
  getCols() {
    return this.cols_;
  };

  /**
   * Create the initial DOM representation for the prompt.
   * @override
   */
  createDom() {
    super.createDom();
  
    var cls = this.getClass();
  
    // add input box to the content
    if (this.rows_ == 1) {
      // If rows == 1 then use an input element.
      this.userInputEl_ = this.getDomHelper().createDom(TagName.INPUT, {
        'className': google.getCssName(cls, 'userInput'),
        'value': this.defaultValue_
      });
      this.userInputEl_.type = InputType.TEXT;
      if (this.cols_) {
        this.userInputEl_.size = this.cols_;
      }
    } else {
      // If rows > 1 then use a textarea.
      this.userInputEl_ =
          this.getDomHelper().createDom(TagName.TEXTAREA, {
            'className': google.getCssName(cls, 'userInput'),
            'value': this.defaultValue_
          });
      this.userInputEl_.rows = this.rows_;
      if (this.cols_) {
        this.userInputEl_.cols = this.cols_;
      }
    }
  
    this.userInputEl_.id = this.inputElementId_;
    var contentEl = this.getContentElement();
    contentEl.appendChild(
        this.getDomHelper().createDom(
            TagName.DIV, {'style': 'overflow: auto'},
            this.userInputEl_));
  };

  /**
   * Handles input change events on the input field.  Disables the OK button if
   * validation fails on the new input value.
   * @private
   */
  handleInputChanged_() {
    this.updateOkButtonState_();
  };

  /**
   * Set OK button enabled/disabled state based on input.
   * @private
   */
  updateOkButtonState_() {
    var enableOkButton = this.validationFn_(this.userInputEl_.value);
    var buttonSet = this.getButtonSet();
    buttonSet.setButtonEnabled(
        DefaultButtonKeys.OK, enableOkButton);
  };

  /**
   * Causes the prompt to appear, centered on the screen, gives focus
   * to the text box, and selects the text
   * @param {boolean} visible Whether the dialog should be visible.
   * @override
   */
  setVisible(visible) {
    super.setVisible(visible);
  
    if (visible) {
      this.isClosing_ = false;
      this.userInputEl_.value = this.defaultValue_;
      this.focus();
      this.updateOkButtonState_();
    }
  };

  /**
   * Overrides setFocus to put focus on the input element.
   * @override
   */
  focus() {
    super.focus();
  
    if (userAgent.OPERA) {
      // select() doesn't focus <input> elements in Opera.
      this.userInputEl_.focus();
    }
    this.userInputEl_.select();
  };

  /**
   * Sets the default value of the prompt when it is displayed.
   * @param {string} defaultValue The default value to display.
   */
  setDefaultValue(defaultValue) {
    this.defaultValue_ = defaultValue;
  };

  /**
   * Handles the closing of the prompt, invoking the callback function that was
   * registered to handle the value returned by the prompt.
   * @param {DialogEvent} e The dialog's selection event.
   * @private
   */
  onPromptExit_(e) {
    /*
     * The timeouts below are required for one edge case. If after the dialog
     * hides, suppose validation of the input fails which displays an alert. If
     * the user pressed the Enter key to dismiss the alert that was displayed it
     * can trigger the event handler a second time. This timeout ensures that the
     * alert is displayed only after the prompt is able to clean itself up.
     */
    if (!this.isClosing_) {
      this.isClosing_ = true;
      if (e.key == 'ok') {
        Timer.callOnce(
            google.bind(this.callback_, this, this.userInputEl_.value), 1);
      } else {
        Timer.callOnce(google.bind(this.callback_, this, null), 1);
      }
    }
  };

  /** @override */
  disposeInternal() {
    goog_dom.removeNode(this.userInputEl_);
  
    events.unlisten(
        this, EventType.SELECT, this.onPromptExit_, true, this);
  
    super.disposeInternal();
  
    this.userInputEl_ = null;
  };
}

// google.tagUnsealableClass(Prompt);

export {Prompt};