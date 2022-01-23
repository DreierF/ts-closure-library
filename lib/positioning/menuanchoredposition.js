import {AnchoredViewportPosition} from './anchoredviewportposition.js';
import {Corner} from './positioning.js';
import {Overflow} from './positioning.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Anchored viewport positioning class with both adjust and
 *     resize options for the popup.
 */

/**
 * Encapsulates a popup position where the popup is anchored at a corner of
 * an element.  The positioning behavior changes based on the values of
 * opt_adjust and opt_resize.
 *
 * When using this positioning object it's recommended that the movable element
 * be absolutely positioned.
 *
 *     anchored against.
 *     movable element should be positioned at.
 *     the element fits inside the viewport even if that means that the anchored
 *     corners are ignored.
 *     the element fits inside the viewport on the X axis and its height is
 *     resized so if fits in the viewport. This take precedence over opt_adjust.
 * @extends {AnchoredViewportPosition}
 */
class MenuAnchoredPosition extends AnchoredViewportPosition {

  /**
   * Encapsulates a popup position where the popup is anchored at a corner of
   * an element.  The positioning behavior changes based on the values of
   * opt_adjust and opt_resize.
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
   * @param {boolean=} opt_resize Whether the positioning should be adjusted until
   *     the element fits inside the viewport on the X axis and its height is
   *     resized so if fits in the viewport. This take precedence over opt_adjust.
   */
  constructor(
      anchorElement, corner, opt_adjust, opt_resize) {
    super(anchorElement, corner, opt_adjust || opt_resize);
  
    if (opt_adjust || opt_resize) {
      var overflowX = Overflow.ADJUST_X_EXCEPT_OFFSCREEN;
      var overflowY = opt_resize ?
          Overflow.RESIZE_HEIGHT :
          Overflow.ADJUST_Y_EXCEPT_OFFSCREEN;
      this.setLastResortOverflow(overflowX | overflowY);
    }
  }
}

export {MenuAnchoredPosition};