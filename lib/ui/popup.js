import {Box as Math_Box} from './../math/box.js';
import {AbstractPosition} from './../positioning/abstractposition.js';
import {Corner} from './../positioning/positioning.js';
import * as style from './../style/style.js';
import {PopupBase as Ui_PopupBase} from './popupbase.js';
import {Type} from './popupbase.js';
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
 * @fileoverview Definition of the Popup class.
 *
 * @see ../demos/popup.html
 */

/**
 * The Popup class provides functionality for displaying an absolutely
 * positioned element at a particular location in the window. It's designed to
 * be used as the foundation for building controls like a menu or tooltip. The
 * Popup class includes functionality for displaying a Popup near adjacent to
 * an anchor element.
 *
 * This works cross browser and thus does not use IE's createPopup feature
 * which supports extending outside the edge of the brower window.
 *
 *     object.
 * @extends {Ui_PopupBase}
 */
class Popup extends Ui_PopupBase {

  /**
   * The Popup class provides functionality for displaying an absolutely
   * positioned element at a particular location in the window. It's designed to
   * be used as the foundation for building controls like a menu or tooltip. The
   * Popup class includes functionality for displaying a Popup near adjacent to
   * an anchor element.
   *
   * This works cross browser and thus does not use IE's createPopup feature
   * which supports extending outside the edge of the brower window.
   *
   * @param {Element=} opt_element A DOM element for the popup.
   * @param {AbstractPosition=} opt_position A positioning helper
   *     object.
   * @param {boolean=} opt_dontSetElement EDITED: Disables calling of setElement in the constructor.
   */
  constructor(opt_element, opt_position, opt_dontSetElement) {
    super(opt_element, undefined, opt_dontSetElement);
    /**
     * Margin for the popup used in positioning algorithms.
     *
     * @type {Math_Box|undefined}
     * @private
     */
    this.margin_ = undefined;
  
    
    /**
     * Corner of the popup to used in the positioning algorithm.
     *
     * @type {Corner}
     * @private
     */
    this.popupCorner_ = Corner.TOP_START;
  
    /**
     * Positioning helper object.
     *
     * @private {AbstractPosition|undefined}
     */
    this.position_ = opt_position || undefined;
  }

  /**
   * Returns the corner of the popup to used in the positioning algorithm.
   *
   * @return {Corner} The popup corner used for positioning.
   */
  getPinnedCorner() {
    return this.popupCorner_;
  };

  /**
   * Sets the corner of the popup to used in the positioning algorithm.
   *
   * @param {Corner} corner The popup corner used for
   *     positioning.
   */
  setPinnedCorner(corner) {
    this.popupCorner_ = corner;
    if (this.isVisible()) {
      this.reposition();
    }
  };

  /**
   * @return {AbstractPosition} The position helper object
   *     associated with the popup.
   */
  getPosition() {
    return this.position_ || null;
  };

  /**
   * Sets the position helper object associated with the popup.
   *
   * @param {AbstractPosition} position A position helper object.
   */
  setPosition(position) {
    this.position_ = position || undefined;
    if (this.isVisible()) {
      this.reposition();
    }
  };

  /**
   * Returns the margin to place around the popup.
   *
   * @return {Math_Box?} The margin.
   */
  getMargin() {
    return this.margin_ || null;
  };

  /**
   * Sets the margin to place around the popup.
   *
   * @param {Math_Box|number|null} arg1 Top value or Box.
   * @param {number=} opt_arg2 Right value.
   * @param {number=} opt_arg3 Bottom value.
   * @param {number=} opt_arg4 Left value.
   */
  setMargin(
      arg1, opt_arg2, opt_arg3, opt_arg4) {
    if (arg1 == null || arg1 instanceof Math_Box) {
      this.margin_ = arg1;
    } else {
      this.margin_ = new Math_Box(
          arg1,
          /** @type {number} */ (opt_arg2),
          /** @type {number} */ (opt_arg3),
          /** @type {number} */ (opt_arg4));
    }
    if (this.isVisible()) {
      this.reposition();
    }
  };

  /**
   * Repositions the popup according to the current state.
   * @override
   */
  reposition() {
    if (!this.position_) {
      return;
    }
  
    var hideForPositioning = !this.isVisible() &&
        this.getType() != Type.MOVE_OFFSCREEN;
    var el = this.getElement();
    if (hideForPositioning) {
      el.style.visibility = 'hidden';
      style.setElementShown(el, true);
    }
  
    this.position_.reposition(el, this.popupCorner_, this.margin_);
  
    if (hideForPositioning) {
      // NOTE(eae): The visibility property is reset to 'visible' by the show_
      // method in PopupBase. Resetting it here causes flickering in some
      // situations, even if set to visible after the display property has been
      // set to none by the call below.
      style.setElementShown(el, false);
    }
  };
}

// google.tagUnsealableClass(Popup);

export {Popup};