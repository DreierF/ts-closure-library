import {Box} from './../math/box.js';
import {Size} from './../math/size.js';
import {AnchoredPosition} from './anchoredposition.js';
import * as goog_positioning from './positioning.js';
import {Corner} from './positioning.js';
import {Overflow} from './positioning.js';
import {OverflowStatus} from './positioning.js';
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
 * @fileoverview Anchored viewport positioning class.
 */

/**
 * Encapsulates a popup position where the popup is anchored at a corner of
 * an element. The corners are swapped if dictated by the viewport. For instance
 * if a popup is anchored with its top left corner to the bottom left corner of
 * the anchor the popup is either displayed below the anchor (as specified) or
 * above it if there's not enough room to display it below.
 *
 * When using this positioning object it's recommended that the movable element
 * be absolutely positioned.
 *
 *     anchored against.
 *     movable element should be positioned at.
 *     the element fits inside the viewport even if that means that the anchored
 *     corners are ignored.
 *     dimensions in which the movable element could be shown.
 * @extends {AnchoredPosition}
 */
class AnchoredViewportPosition extends AnchoredPosition {

  /**
   * Encapsulates a popup position where the popup is anchored at a corner of
   * an element. The corners are swapped if dictated by the viewport. For instance
   * if a popup is anchored with its top left corner to the bottom left corner of
   * the anchor the popup is either displayed below the anchor (as specified) or
   * above it if there's not enough room to display it below.
   *
   * When using this positioning object it's recommended that the movable element
   * be absolutely positioned.
   *
   * @param {Element} anchorElement Element the movable element should be
   *     anchored against.
   * @param {Corner} corner Corner of anchored element the
   *     movable element should be positioned at.
   * @param {boolean=} opt_adjust Whether the positioning should be adjusted until
   *     the element fits inside the viewport even if that means that the anchored
   *     corners are ignored.
   * @param {Box=} opt_overflowConstraint Box object describing the
   *     dimensions in which the movable element could be shown.
   */
  constructor(
      anchorElement, corner, opt_adjust, opt_overflowConstraint) {
    super(anchorElement, corner);
  
    /**
     * The last resort algorithm to use if the algorithm can't fit inside
     * the viewport.
     *
     * IGNORE = do nothing, just display at the preferred position.
     *
     * ADJUST_X | ADJUST_Y = Adjust until the element fits, even if that means
     * that the anchored corners are ignored.
     *
     * @type {number}
     * @private
     */
    this.lastResortOverflow_ = opt_adjust ? (Overflow.ADJUST_X |
                                             Overflow.ADJUST_Y) :
                                            Overflow.IGNORE;
  
    /**
     * The dimensions in which the movable element could be shown.
     * @type {Box|undefined}
     * @private
     */
    this.overflowConstraint_ = opt_overflowConstraint || undefined;
  }

  /**
   * @return {Box|undefined} The box object describing the
   *     dimensions in which the movable element will be shown.
   */
  getOverflowConstraint() {
    return this.overflowConstraint_;
  };

  /**
   * @param {Box|undefined} overflowConstraint Box object describing the
   *     dimensions in which the movable element could be shown.
   */
  setOverflowConstraint(overflowConstraint) {
    this.overflowConstraint_ = overflowConstraint;
  };

  /**
   * @return {number} A bitmask for the "last resort" overflow.
   */
  getLastResortOverflow() {
    return this.lastResortOverflow_;
  };

  /**
   * @param {number} lastResortOverflow A bitmask for the "last resort" overflow,
   *     if we fail to fit the element on-screen.
   */
  setLastResortOverflow(lastResortOverflow) {
    this.lastResortOverflow_ = lastResortOverflow;
  };

  /**
   * Repositions the movable element.
   *
   * @param {Element} movableElement Element to position.
   * @param {Corner} movableCorner Corner of the movable element
   *     that should be positioned adjacent to the anchored element.
   * @param {Box=} opt_margin A margin specified in pixels.
   * @param {Size=} opt_preferredSize The preferred size of the
   *     movableElement.
   * @override
   */
  reposition(
      movableElement, movableCorner, opt_margin, opt_preferredSize) {
    var status = goog_positioning.positionAtAnchor(
        this.element, this.corner, movableElement, movableCorner, null,
        opt_margin,
        Overflow.FAIL_X | Overflow.FAIL_Y,
        opt_preferredSize, this.overflowConstraint_);
  
    // If the desired position is outside the viewport try mirroring the corners
    // horizontally or vertically.
    if (status & OverflowStatus.FAILED) {
      var cornerFallback = this.adjustCorner(status, this.corner);
      var movableCornerFallback = this.adjustCorner(status, movableCorner);
  
      status = goog_positioning.positionAtAnchor(
          this.element, cornerFallback, movableElement, movableCornerFallback,
          null, opt_margin,
          Overflow.FAIL_X | Overflow.FAIL_Y,
          opt_preferredSize, this.overflowConstraint_);
  
      if (status & OverflowStatus.FAILED) {
        // If that also fails, pick the best corner from the two tries,
        // and adjust the position until it fits.
        cornerFallback = this.adjustCorner(status, cornerFallback);
        movableCornerFallback = this.adjustCorner(status, movableCornerFallback);
  
        goog_positioning.positionAtAnchor(
            this.element, cornerFallback, movableElement, movableCornerFallback,
            null, opt_margin, this.getLastResortOverflow(), opt_preferredSize,
            this.overflowConstraint_);
      }
    }
  };

  /**
   * Adjusts the corner if X or Y positioning failed.
   * @param {number} status The status of the last positionAtAnchor call.
   * @param {Corner} corner The corner to adjust.
   * @return {Corner} The adjusted corner.
   * @protected
   */
  adjustCorner(
      status, corner) {
    if (status & OverflowStatus.FAILED_HORIZONTAL) {
      corner = goog_positioning.flipCornerHorizontal(corner);
    }
  
    if (status & OverflowStatus.FAILED_VERTICAL) {
      corner = goog_positioning.flipCornerVertical(corner);
    }
  
    return corner;
  };
}

export {AnchoredViewportPosition};