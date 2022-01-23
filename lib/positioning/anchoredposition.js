import {Box} from './../math/box.js';
import {Size} from './../math/size.js';
import {AbstractPosition} from './abstractposition.js';
import * as goog_positioning from './positioning.js';
import {Corner} from './positioning.js';
import {Overflow} from './positioning.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Client positioning class.
 */

/**
 * Encapsulates a popup position where the popup is anchored at a corner of
 * an element.
 *
 * When using AnchoredPosition, it is recommended that the popup element
 * specified in the Popup constructor or Popup.setElement be absolutely
 * positioned.
 *
 *     anchored against.
 *     movable element should be positioned at.
 *     not specified. Bitmap, {@see Overflow}.
 * @extends {AbstractPosition}
 */
class AnchoredPosition extends AbstractPosition {

  /**
   * Encapsulates a popup position where the popup is anchored at a corner of
   * an element.
   *
   * When using AnchoredPosition, it is recommended that the popup element
   * specified in the Popup constructor or Popup.setElement be absolutely
   * positioned.
   *
   * @param {Element} anchorElement Element the movable element should be
   *     anchored against.
   * @param {Corner} corner Corner of anchored element the
   *     movable element should be positioned at.
   * @param {number=} opt_overflow Overflow handling mode. Defaults to IGNORE if
   *     not specified. Bitmap, {@see Overflow}.
   */
  constructor(
      anchorElement, corner, opt_overflow) {
    super();
  
    /**
     * Element the movable element should be anchored against.
     * @type {Element}
     */
    this.element = anchorElement;
  
    /**
     * Corner of anchored element the movable element should be positioned at.
     * @type {Corner}
     */
    this.corner = corner;
  
    /**
     * Overflow handling mode. Defaults to IGNORE if not specified.
     * Bitmap, {@see Overflow}.
     * @type {number|undefined}
     * @private
     */
    this.overflow_ = opt_overflow;
  }

  /**
   * Repositions the movable element.
   *
   * @param {Element} movableElement Element to position.
   * @param {Corner} movableCorner Corner of the movable element
   *     that should be positioned adjacent to the anchored element.
   * @param {Box=} opt_margin A margin specifin pixels.
   * @param {Size=} opt_preferredSize PreferredSize of the
   *     movableElement (unused in this class).
   * @override
   */
  reposition(
      movableElement, movableCorner, opt_margin, opt_preferredSize) {
    goog_positioning.positionAtAnchor(
        this.element, this.corner, movableElement, movableCorner, undefined,
        opt_margin, this.overflow_);
  };
}

export {AnchoredPosition};