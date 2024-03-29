import * as dom from './../dom/dom.js';
import * as platform from './../useragent/platform.js';
import * as userAgent_product from './../useragent/product.js';
import {isVersion} from './../useragent/product.js';
import * as userAgent from './../useragent/useragent.js';
import * as style from './style.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Bidi utility functions.
 */

/**
 * Returns the normalized scrollLeft position for a scrolled element.
 * @param {Element} element The scrolled element.
 * @return {number} The number of pixels the element is scrolled. 0 indicates
 *     that the element is not scrolled at all (which, in general, is the
 *     left-most position in ltr and the right-most position in rtl).
 */
function getScrollLeft(element) {
  var isRtl = style.isRightToLeft(element);
  if (isRtl && usesNegativeScrollLeftInRtl_()) {
    return -element.scrollLeft;
  } else if (isRtl && !userAgent.EDGE_OR_IE) {
    // ScrollLeft starts at the maximum positive value and decreases towards
    // 0 as the element is scrolled towards the left. However, for overflow
    // visible, there is no scrollLeft and the value always stays correctly at 0
    var overflowX = style.getComputedOverflowX(element);
    if (overflowX == 'visible') {
      return element.scrollLeft;
    } else {
      return element.scrollWidth - element.clientWidth - element.scrollLeft;
    }
  }
  // ScrollLeft behavior is identical in rtl and ltr, it starts at 0 and
  // increases as the element is scrolled away from the start.
  return element.scrollLeft;
};

/**
 * Returns the "offsetStart" of an element, analogous to offsetLeft but
 * normalized for right-to-left environments and various browser
 * inconsistencies. This value returned can always be passed to setScrollOffset
 * to scroll to an element's left edge in a left-to-right offsetParent or
 * right edge in a right-to-left offsetParent.
 *
 * For example, here offsetStart is 10px in an LTR environment and 5px in RTL:
 *
 * <pre>
 * |          xxxxxxxxxx     |
 *  ^^^^^^^^^^   ^^^^   ^^^^^
 *     10px      elem    5px
 * </pre>
 *
 * If an element is positioned before the start of its offsetParent, the
 * startOffset may be negative.  This can be used with setScrollOffset to
 * reliably scroll to an element:
 *
 * <pre>
 * var scrollOffset = getOffsetStart(element);
 * setScrollOffset(element.offsetParent, scrollOffset);
 * </pre>
 *
 * @see setScrollOffset
 *
 * @param {Element} element The element for which we need to determine the
 *     offsetStart position.
 * @return {number} The offsetStart for that element.
 */
function getOffsetStart(element) {
  element = /** @type {!HTMLElement} */ (element);
  var offsetLeftForReal = element.offsetLeft;

  // The element might not have an offsetParent.
  // For example, the node might not be attached to the DOM tree,
  // and position:fixed children do not have an offset parent.
  // Just try to do the best we can with what we have.
  var bestParent = element.offsetParent;

  if (!bestParent && style.getComputedPosition(element) == 'fixed') {
    bestParent = dom.getOwnerDocument(element).documentElement;
  }

  // Just give up in this case.
  if (!bestParent) {
    return offsetLeftForReal;
  }

  if (userAgent.GECKO && !userAgent.isVersionOrHigher(58)) {
    // When calculating an element's offsetLeft, Firefox 57 and below
    // erroneously subtracts the border width from the actual distance.
    // So we need to add it back. (Fixed in FireFox 58+)
    var borderWidths = style.getBorderBox(bestParent);
    offsetLeftForReal += borderWidths.left;
  } else if (
      userAgent.isDocumentModeOrHigher(8) &&
      !userAgent.isDocumentModeOrHigher(9)) {
    // When calculating an element's offsetLeft, IE8/9-Standards Mode
    // erroneously adds the border width to the actual distance.  So we need to
    // subtract it.
    var borderWidths = style.getBorderBox(bestParent);
    offsetLeftForReal -= borderWidths.left;
  }

  if (style.isRightToLeft(bestParent)) {
    // Right edge of the element relative to the left edge of its parent.
    var elementRightOffset = offsetLeftForReal + element.offsetWidth;

    // Distance from the parent's right edge to the element's right edge.
    return bestParent.clientWidth - elementRightOffset;
  }

  return offsetLeftForReal;
};

/**
 * Sets the element's scrollLeft attribute so it is correctly scrolled by
 * offsetStart pixels.  This takes into account whether the element is RTL and
 * the nuances of different browsers.  To scroll to the "beginning" of an
 * element use getOffsetStart to obtain the element's offsetStart value and then
 * pass the value to setScrollOffset.
 * @see getOffsetStart
 * @param {Element} element The element to set scrollLeft on.
 * @param {number} offsetStart The number of pixels to scroll the element.
 *     If this value is < 0, 0 is used.
 */
function setScrollOffset(element, offsetStart) {
  offsetStart = Math.max(offsetStart, 0);
  // In LTR and in "mirrored" browser RTL (such as IE), we set scrollLeft to
  // the number of pixels to scroll.
  // Otherwise, in RTL, we need to account for different browser behavior.
  if (!style.isRightToLeft(element)) {
    element.scrollLeft = offsetStart;
  } else if (usesNegativeScrollLeftInRtl_()) {
    element.scrollLeft = -offsetStart;
  } else if (!userAgent.EDGE_OR_IE) {
    // Take the current scrollLeft value and move to the right by the
    // offsetStart to get to the left edge of the element, and then by
    // the clientWidth of the element to get to the right edge.
    element.scrollLeft =
        element.scrollWidth - offsetStart - element.clientWidth;
  } else {
    element.scrollLeft = offsetStart;
  }
};

/**
 * @return {boolean} Whether the current browser returns negative scrollLeft
 *     values for RTL elements. If true, then scrollLeft starts at 0 and then
 *     becomes more negative as the element is scrolled towards the left.
 * @private
 */
function usesNegativeScrollLeftInRtl_() {
  var isSafari10Plus =
      userAgent_product.SAFARI && isVersion(10);
  var isIOS10Plus = userAgent.IOS && platform.isVersion(10);
  const isChrome85Plus =
      userAgent_product.CHROME && isVersion(85);
  return userAgent.GECKO || isSafari10Plus || isIOS10Plus ||
      isChrome85Plus;
};

/**
 * Sets the element's left style attribute in LTR or right style attribute in
 * RTL.  Also clears the left attribute in RTL and the right attribute in LTR.
 * @param {Element} elem The element to position.
 * @param {number} left The left position in LTR; will be set as right in RTL.
 * @param {?number} top The top position.  If null only the left/right is set.
 * @param {boolean} isRtl Whether we are in RTL mode.
 */
function setPosition(elem, left, top, isRtl) {
  if (top !== null) {
    elem.style.top = top + 'px';
  }
  if (isRtl) {
    elem.style.right = left + 'px';
    elem.style.left = '';
  } else {
    elem.style.left = left + 'px';
    elem.style.right = '';
  }
};

export {getOffsetStart, getScrollLeft, setPosition, setScrollOffset};