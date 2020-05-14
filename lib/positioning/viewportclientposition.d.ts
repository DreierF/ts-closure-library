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
export class ViewportClientPosition extends ClientPosition {
    /**
     * Encapsulates a popup position where the popup is positioned relative to the
     * window (client) coordinates, and made to stay within the viewport.
     *
     * @param {number|Coordinate} arg1 Left position or coordinate.
     * @param {number=} opt_arg2 Top position if arg1 is a number representing the
     *     left position, ignored otherwise.
     */
    constructor(arg1: number | Coordinate, opt_arg2?: number | undefined);
    /**
     * The last-resort overflow strategy, if the popup fails to fit.
     * @type {number}
     * @private
     */
    private lastResortOverflow_;
    /**
     * Set the last-resort overflow strategy, if the popup fails to fit.
     * @param {number} overflow A bitmask of Overflow strategies.
     */
    setLastResortOverflow(overflow: number): void;
}
import { ClientPosition } from "./clientposition.js";
import { Coordinate } from "../math/coordinate.js";
