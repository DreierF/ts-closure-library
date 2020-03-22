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
 * @param {?Element} element The element for which we need to determine the
 *     offsetStart position.
 * @return {number} The offsetStart for that element.
 */
export function getOffsetStart(element: Element | null): number;
/**
 * @fileoverview Bidi utility functions.
 */
/**
 * Returns the normalized scrollLeft position for a scrolled element.
 * @param {?Element} element The scrolled element.
 * @return {number} The number of pixels the element is scrolled. 0 indicates
 *     that the element is not scrolled at all (which, in general, is the
 *     left-most position in ltr and the right-most position in rtl).
 */
export function getScrollLeft(element: Element | null): number;
/**
 * Sets the element's left style attribute in LTR or right style attribute in
 * RTL.  Also clears the left attribute in RTL and the right attribute in LTR.
 * @param {?Element} elem The element to position.
 * @param {number} left The left position in LTR; will be set as right in RTL.
 * @param {?number} top The top position.  If null only the left/right is set.
 * @param {boolean} isRtl Whether we are in RTL mode.
 */
export function setPosition(elem: Element | null, left: number, top: number | null, isRtl: boolean): void;
/**
 * Sets the element's scrollLeft attribute so it is correctly scrolled by
 * offsetStart pixels.  This takes into account whether the element is RTL and
 * the nuances of different browsers.  To scroll to the "beginning" of an
 * element use getOffsetStart to obtain the element's offsetStart value and then
 * pass the value to setScrollOffset.
 * @see getOffsetStart
 * @param {?Element} element The element to set scrollLeft on.
 * @param {number} offsetStart The number of pixels to scroll the element.
 *     If this value is < 0, 0 is used.
 */
export function setScrollOffset(element: Element | null, offsetStart: number): void;
