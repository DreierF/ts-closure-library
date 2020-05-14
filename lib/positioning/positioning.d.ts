/**
 * Enum for representing an element corner for positioning the popup.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 *
 *
 */
export class Corner {
    TOP_LEFT: number;
    TOP_RIGHT: number;
    BOTTOM_LEFT: number;
    BOTTOM_RIGHT: number;
    TOP_START: number;
    TOP_END: number;
    BOTTOM_START: number;
    BOTTOM_END: number;
    TOP_CENTER: number;
    BOTTOM_CENTER: number;
}
/**
 * @fileoverview Common positioning code.
 */
/**
 * Enum for bits in the {@see Corner) bitmap.
 *
 *
 */
export class CornerBit {
    BOTTOM: number;
    CENTER: number;
    RIGHT: number;
    FLIP_RTL: number;
}
/**
 * Enum for representing position handling in cases where the element would be
 * positioned outside the viewport.
 *
 *
 */
export class Overflow {
    /** Ignore overflow */
    IGNORE: number;
    /** Try to fit horizontally in the viewport at all costs. */
    ADJUST_X: number;
    /** If the element can't fit horizontally, report positioning failure. */
    FAIL_X: number;
    /** Try to fit vertically in the viewport at all costs. */
    ADJUST_Y: number;
    /** If the element can't fit vertically, report positioning failure. */
    FAIL_Y: number;
    /** Resize the element's width to fit in the viewport. */
    RESIZE_WIDTH: number;
    /** Resize the element's height to fit in the viewport. */
    RESIZE_HEIGHT: number;
    /**
     * If the anchor goes off-screen in the x-direction, position the movable
     * element off-screen. Otherwise, try to fit horizontally in the viewport.
     */
    ADJUST_X_EXCEPT_OFFSCREEN: number;
    /**
     * If the anchor goes off-screen in the y-direction, position the movable
     * element off-screen. Otherwise, try to fit vertically in the viewport.
     */
    ADJUST_Y_EXCEPT_OFFSCREEN: number;
}
/**
 * Enum for representing the outcome of a positioning call.
 *
 *
 */
export class OverflowStatus {
    NONE: number;
    ADJUSTED_X: number;
    ADJUSTED_Y: number;
    WIDTH_ADJUSTED: number;
    HEIGHT_ADJUSTED: number;
    FAILED_LEFT: number;
    FAILED_RIGHT: number;
    FAILED_TOP: number;
    FAILED_BOTTOM: number;
    FAILED_OUTSIDE_VIEWPORT: number;
}
export namespace OverflowStatus {
    export const FAILED: number;
    export const FAILED_HORIZONTAL: number;
    export const FAILED_VERTICAL: number;
}
/**
 * Returns the corner opposite the given one horizontally and vertically.
 * @param {?Corner} corner The popup corner used to flip.
 * @return {?Corner} The opposite corner horizontally and
 *     vertically.
 */
export function flipCorner(corner: Corner | null): Corner | null;
/**
 * Returns the corner opposite the given one horizontally.
 * @param {?Corner} corner The popup corner used to flip.
 * @return {?Corner} The opposite corner horizontally.
 */
export function flipCornerHorizontal(corner: Corner | null): Corner | null;
/**
 * Returns the corner opposite the given one vertically.
 * @param {?Corner} corner The popup corner used to flip.
 * @return {?Corner} The opposite corner vertically.
 */
export function flipCornerVertical(corner: Corner | null): Corner | null;
/**
 * Returns an absolute corner (top/bottom left/right) given an absolute
 * or relative (top/bottom start/end) corner and the direction of an element.
 * Absolute corners remain unchanged.
 * @param {?Element} element DOM element to test for RTL direction.
 * @param {?Corner} corner The popup corner used for
 *     positioning.
 * @return {?Corner} Effective corner.
 */
export function getEffectiveCorner(element: Element | null, corner: Corner | null): Corner | null;
/**
 * Calculates the page offset of the given element's
 * offsetParent. This value can be used to translate any x- and
 * y-offset relative to the page to an offset relative to the
 * offsetParent, which can then be used directly with as position
 * coordinate for `positionWithCoordinate`.
 * @param {!Element} movableElement The element to calculate.
 * @return {!Coordinate} The page offset, may be (0, 0).
 */
export function getOffsetParentPageOffset(movableElement: Element): Coordinate;
/**
 * Computes the position for an element to be placed on-screen at the
 * specified coordinates. Returns an object containing both the resulting
 * rectangle, and the overflow status bitmap.
 *
 * @param {!Coordinate} absolutePos The coordinate to position the
 *     element at.
 * @param {!Size} elementSize The size of the element to be
 *     positioned.
 * @param {?Corner} elementCorner The corner of the
 *     movableElement that that should be positioned.
 * @param {Box=} opt_margin A margin specified in pixels.
 *    After the normal positioning algorithm is applied and any offset, the
 *    margin is then applied. Positive coordinates move the popup away from the
 *    spot it was positioned towards its center. Negative coordinates move it
 *    towards the spot it was positioned away from its center.
 * @param {Box=} opt_viewport Box object describing the dimensions of
 *     the viewport. Required if opt_overflow is specified.
 * @param {?number=} opt_overflow Overflow handling mode. Defaults to IGNORE
 *     if not specified, {@see Overflow}.
 * @return {{rect:!Rect, status:number}}
 *     Object containing the computed position and status bitmap.
 */
export function getPositionAtCoordinate(absolutePos: Coordinate, elementSize: Size, elementCorner: Corner | null, opt_margin?: Box | undefined, opt_viewport?: Box | undefined, opt_overflow?: (number | null) | undefined): {
    rect: Rect;
    status: number;
};
/**
 * Positions a movable element relative to an anchor element. The caller
 * specifies the corners that should touch. This functions then moves the
 * movable element accordingly.
 *
 * @param {?Element} anchorElement The element that is the anchor for where
 *    the movable element should position itself.
 * @param {?Corner} anchorElementCorner The corner of the
 *     anchorElement for positioning the movable element.
 * @param {?Element} movableElement The element to move.
 * @param {?Corner} movableElementCorner The corner of the
 *     movableElement that that should be positioned adjacent to the anchor
 *     element.
 * @param {Coordinate=} opt_offset An offset specified in pixels.
 *    After the normal positioning algorithm is applied, the offset is then
 *    applied. Positive coordinates move the popup closer to the center of the
 *    anchor element. Negative coordinates move the popup away from the center
 *    of the anchor element.
 * @param {Box=} opt_margin A margin specified in pixels.
 *    After the normal positioning algorithm is applied and any offset, the
 *    margin is then applied. Positive coordinates move the popup away from the
 *    spot it was positioned towards its center. Negative coordinates move it
 *    towards the spot it was positioned away from its center.
 * @param {?number=} opt_overflow Overflow handling mode. Defaults to IGNORE if
 *     not specified. Bitmap, {@see Overflow}.
 * @param {Size=} opt_preferredSize The preferred size of the
 *     movableElement.
 * @param {Box=} opt_viewport Box object describing the dimensions of
 *     the viewport. The viewport is specified relative to offsetParent of
 *     `movableElement`. In other words, the viewport can be thought of as
 *     describing a "position: absolute" element contained in the offsetParent.
 *     It defaults to visible area of nearest scrollable ancestor of
 *     `movableElement` (see `style.getVisibleRectForElement`).
 * @return {?number} Status bitmap,
 *     {@see number}.
 */
export function positionAtAnchor(anchorElement: Element | null, anchorElementCorner: Corner | null, movableElement: Element | null, movableElementCorner: Corner | null, opt_offset?: Coordinate | undefined, opt_margin?: Box | undefined, opt_overflow?: (number | null) | undefined, opt_preferredSize?: Size | undefined, opt_viewport?: Box | undefined): number | null;
/**
 * Positions the specified corner of the movable element at the
 * specified coordinate.
 *
 * @param {?Coordinate} absolutePos The coordinate to position the
 *     element at.
 * @param {?Element} movableElement The element to be positioned.
 * @param {?Corner} movableElementCorner The corner of the
 *     movableElement that that should be positioned.
 * @param {Box=} opt_margin A margin specified in pixels.
 *    After the normal positioning algorithm is applied and any offset, the
 *    margin is then applied. Positive coordinates move the popup away from the
 *    spot it was positioned towards its center. Negative coordinates move it
 *    towards the spot it was positioned away from its center.
 * @param {Box=} opt_viewport Box object describing the dimensions of
 *     the viewport. Required if opt_overflow is specified.
 * @param {?number=} opt_overflow Overflow handling mode. Defaults to IGNORE if
 *     not specified, {@see Overflow}.
 * @param {Size=} opt_preferredSize The preferred size of the
 *     movableElement. Defaults to the current size.
 * @return {?number} Status bitmap.
 */
export function positionAtCoordinate(absolutePos: Coordinate | null, movableElement: Element | null, movableElementCorner: Corner | null, opt_margin?: Box | undefined, opt_viewport?: Box | undefined, opt_overflow?: (number | null) | undefined, opt_preferredSize?: Size | undefined): number | null;
import { Coordinate } from "../math/coordinate.js";
import { Size } from "../math/size.js";
import { Box } from "../math/box.js";
import { Rect } from "../math/rect.js";
