import {TagName} from './../dom/tagname.js';
import * as google from './../google.js';
import {Component} from './component.js';
import {State} from './component.js';
import {Control} from './control.js';
import {ControlRenderer} from './control.js';
import {Textarea as UiTextarea} from './textarea.js';
// Copyright 2010 The Closure Library Authors. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Native browser textarea renderer for {@link UiTextarea}s.
 */

/**
 * Renderer for {@link UiTextarea}s.  Renders and decorates native HTML
 * textarea elements.  Since native HTML textareas have built-in support for
 * many features, overrides many expensive (and redundant) superclass methods to
 * be no-ops.
 * @extends {ControlRenderer<UiTextarea>}
 */
class TextareaRenderer extends ControlRenderer {

  /**
   * Renderer for {@link UiTextarea}s.  Renders and decorates native HTML
   * textarea elements.  Since native HTML textareas have built-in support for
   * many features, overrides many expensive (and redundant) superclass methods to
   * be no-ops.
   */
  constructor() {
    super();
  }

  /** @override @return {!TextareaRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (TextareaRenderer.instance_) {
      return /** @type {!TextareaRenderer} */ (TextareaRenderer.instance_);
    }
    return /** @type {!TextareaRenderer} */ (TextareaRenderer.instance_) = new TextareaRenderer();
  };

  /** @override */
  getAriaRole() {
    // textareas don't need ARIA roles to be recognized by screen readers.
    return undefined;
  };

  /** @override */
  decorate(control, element) {
    this.setUpTextarea_(control);
    super.decorate(control, element);
    control.setContent(element.value);
    return element;
  };

  /**
   * Returns the textarea's contents wrapped in an HTML textarea element.  Sets
   * the textarea's disabled attribute as needed.
   * @param {UiTextarea} textarea Textarea to render.
   * @return {!Element} Root element for the Textarea control (an HTML textarea
   *     element).
   * @override
   */
  createDom(textarea) {
    this.setUpTextarea_(textarea);
    var element = textarea.getDomHelper().createDom(
        TagName.TEXTAREA, {
          'class': this.getClassNames(textarea).join(' '),
          'disabled': !textarea.isEnabled()
        },
        textarea.getContent() || '');
    return element;
  };

  /**
   * Overrides {@link TextareaRenderer#canDecorate} by returning true only
   * if the element is an HTML textarea.
   * @param {Element} element Element to decorate.
   * @return {boolean} Whether the renderer can decorate the element.
   * @override
   */
  canDecorate(element) {
    return element.tagName == TagName.TEXTAREA;
  };

  /**
   * Textareas natively support right-to-left rendering.
   * @override
   */
  setRightToLeft() {}

  /**
   * Textareas are always focusable as long as they are enabled.
   * @override
   */
  isFocusable(textarea) {
    return textarea.isEnabled();
  };

  /**
   * Textareas natively support keyboard focus.
   * @override
   */
  setFocusable() {}

  /**
   * Textareas also expose the DISABLED state in the HTML textarea's
   * `disabled` attribute.
   * @override
   */
  setState(
      textarea, state, enable) {
    super.setState(textarea, state, enable);
    var element = textarea.getElement();
    if (element && state == State.DISABLED) {
      element.disabled = enable;
    }
  };

  /**
   * Textareas don't need ARIA states to support accessibility, so this is
   * a no-op.
   * @override
   */
  updateAriaState() {}

  /**
   * Sets up the textarea control such that it doesn't waste time adding
   * functionality that is already natively supported by browser
   * textareas.
   * @param {Control} textarea Textarea control to configure.
   * @private
   */
  setUpTextarea_(textarea) {
    textarea.setHandleMouseEvents(false);
    textarea.setAutoStates(State.ALL, false);
    textarea.setSupportedState(State.FOCUSED, false);
  };

  /** @override **/
  setContent(element, value) {
    if (element) {
      element.value = value;
    }
  };

  /** @override **/
  getCssClass() {
    return TextareaRenderer.CSS_CLASS;
  };
}

/** @type {?TextareaRenderer} @suppress {underscore,checkTypes} @override */
TextareaRenderer.instance_ = undefined;

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 * @override
 */
TextareaRenderer.CSS_CLASS = google.getCssName('goog-textarea');

export {TextareaRenderer};