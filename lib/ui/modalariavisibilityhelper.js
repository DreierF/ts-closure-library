import * as aria from './../a11y/aria/aria.js';
import {State} from './../a11y/aria/attributes.js';
import {DomHelper} from './../dom/dom.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Helper object used by modal elements to control aria
 * visibility of the rest of the page.
 */

/**
 * Helper object to control aria visibility of the rest of the page (background)
 * for a given element. Example usage is to restrict screenreader focus to
 * a modal popup while it is visible.
 *
 * WARNING: This will work only if the element is rendered directly in the
 * 'body' element.
 *
 */
class ModalAriaVisibilityHelper {

  /**
   * Helper object to control aria visibility of the rest of the page (background)
   * for a given element. Example usage is to restrict screenreader focus to
   * a modal popup while it is visible.
   *
   * WARNING: This will work only if the element is rendered directly in the
   * 'body' element.
   *
   * @param {!Element} element The given element.
   * @param {!DomHelper} domHelper DomHelper for the page.
   */
  constructor(element, domHelper) {
    /**
     * The elements set to aria-hidden when the popup was made visible.
     * @type {Array<!Element>}
     * @private
     */
    this.hiddenElements_ = null;
  
    /**
     * @private {!Element}
     */
    this.element_ = element;
  
    /**
     * @private {!DomHelper}
     */
    this.dom_ = domHelper;
  }

  /**
   * Sets aria-hidden on the rest of the page to restrict screen reader focus.
   * Top-level elements with an explicit aria-hidden state are not altered.
   * @param {boolean} hide Whether to hide or show the rest of the page.
   */
  setBackgroundVisibility(
      hide) {
    if (hide) {
      if (!this.hiddenElements_) {
        this.hiddenElements_ = [];
      }
      var topLevelChildren = this.dom_.getChildren(this.dom_.getDocument().body);
      for (var i = 0; i < topLevelChildren.length; i++) {
        var child = topLevelChildren[i];
        if (child != this.element_ &&
            !aria.getState(child, State.HIDDEN)) {
          aria.setState(child, State.HIDDEN, true);
          this.hiddenElements_.push(child);
        }
      }
    } else if (this.hiddenElements_) {
      for (var i = 0; i < this.hiddenElements_.length; i++) {
        aria.removeState(
            this.hiddenElements_[i], State.HIDDEN);
      }
      this.hiddenElements_ = null;
    }
  };
}

export {ModalAriaVisibilityHelper};