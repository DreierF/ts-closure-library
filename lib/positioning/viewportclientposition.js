import * as dom from './../dom/dom.js';
import {Box} from './../math/box.js';
import {Coordinate} from './../math/coordinate.js';
import {Size} from './../math/size.js';
import * as style from './../style/style.js';
import {ClientPosition} from './clientposition.js';
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
 * @fileoverview Client viewport positioning class.
 */

/**
 * Encapsulates a popup position where the popup is positioned relative to the
 * window (client) coordinates, and made to stay within the viewport.
 *
 *     left position, ignored otherwise.
 * @extends {ClientPosition}
 */
class ViewportClientPosition extends ClientPosition {

  /**
   * Encapsulates a popup position where the popup is positioned relative to the
   * window (client) coordinates, and made to stay within the viewport.
   *
   * @param {number|Coordinate} arg1 Left position or coordinate.
   * @param {number=} opt_arg2 Top position if arg1 is a number representing the
   *     left position, ignored otherwise.
   */
  constructor(arg1, opt_arg2) {
    super(arg1, opt_arg2);
    /**
     * The last-resort overflow strategy, if the popup fails to fit.
     * @type {number}
     * @private
     */
    this.lastResortOverflow_ = 0;
  
  }

  /**
   * Set the last-resort overflow strategy, if the popup fails to fit.
   * @param {number} overflow A bitmask of Overflow strategies.
   */
  setLastResortOverflow(overflow) {
    this.lastResortOverflow_ = overflow;
  };

  /**
   * Repositions the popup according to the current state.
   *
   * @param {Element} element The DOM element of the popup.
   * @param {Corner} popupCorner The corner of the popup
   *     element that that should be positioned adjacent to the anchorElement.
   *     One of the Corner constants.
   * @param {Box=} opt_margin A margin specified in pixels.
   * @param {Size=} opt_preferredSize Preferred size fo the element.
   * @override
   */
  reposition(
      element, popupCorner, opt_margin, opt_preferredSize) {
    var viewportElt = style.getClientViewportElement(element);
    var viewport = style.getVisibleRectForElement(viewportElt);
    var scrollEl = dom.getDomHelper(element).getDocumentScrollElement();
    var clientPos = new Coordinate(
        this.coordinate.x + scrollEl.scrollLeft,
        this.coordinate.y + scrollEl.scrollTop);
  
    var failXY =
        Overflow.FAIL_X | Overflow.FAIL_Y;
    var corner = popupCorner;
  
    // Try the requested position.
    var status = goog_positioning.positionAtCoordinate(
        clientPos, element, corner, opt_margin, viewport, failXY,
        opt_preferredSize);
    if ((status & OverflowStatus.FAILED) == 0) {
      return;
    }
  
    // Outside left or right edge of viewport, try try to flip it horizontally.
    if (status & OverflowStatus.FAILED_LEFT ||
        status & OverflowStatus.FAILED_RIGHT) {
      corner = goog_positioning.flipCornerHorizontal(corner);
    }
  
    // Outside top or bottom edge of viewport, try try to flip it vertically.
    if (status & OverflowStatus.FAILED_TOP ||
        status & OverflowStatus.FAILED_BOTTOM) {
      corner = goog_positioning.flipCornerVertical(corner);
    }
  
    // Try flipped position.
    status = goog_positioning.positionAtCoordinate(
        clientPos, element, corner, opt_margin, viewport, failXY,
        opt_preferredSize);
    if ((status & OverflowStatus.FAILED) == 0) {
      return;
    }
  
    // If that failed, the viewport is simply too small to contain the popup.
    // Revert to the original position.
    goog_positioning.positionAtCoordinate(
        clientPos, element, popupCorner, opt_margin, viewport,
        this.lastResortOverflow_, opt_preferredSize);
  };
}

export {ViewportClientPosition};