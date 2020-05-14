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
export class AnchoredViewportPosition extends AnchoredPosition {
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
     * @param {?Element} anchorElement Element the movable element should be
     *     anchored against.
     * @param {?Corner} corner Corner of anchored element the
     *     movable element should be positioned at.
     * @param {boolean=} opt_adjust Whether the positioning should be adjusted until
     *     the element fits inside the viewport even if that means that the anchored
     *     corners are ignored.
     * @param {Box=} opt_overflowConstraint Box object describing the
     *     dimensions in which the movable element could be shown.
     */
    constructor(anchorElement: Element | null, corner: Corner | null, opt_adjust?: boolean | undefined, opt_overflowConstraint?: Box | undefined);
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
    private lastResortOverflow_;
    /**
     * The dimensions in which the movable element could be shown.
     * @type {Box|undefined}
     * @private
     */
    private overflowConstraint_;
    /**
     * @return {Box|undefined} The box object describing the
     *     dimensions in which the movable element will be shown.
     */
    getOverflowConstraint(): Box | undefined;
    /**
     * @param {Box|undefined} overflowConstraint Box object describing the
     *     dimensions in which the movable element could be shown.
     */
    setOverflowConstraint(overflowConstraint: Box | undefined): void;
    /**
     * @return {number} A bitmask for the "last resort" overflow.
     */
    getLastResortOverflow(): number;
    /**
     * @param {number} lastResortOverflow A bitmask for the "last resort" overflow,
     *     if we fail to fit the element on-screen.
     */
    setLastResortOverflow(lastResortOverflow: number): void;
    /**
     * Adjusts the corner if X or Y positioning failed.
     * @param {number} status The status of the last positionAtAnchor call.
     * @param {?Corner} corner The corner to adjust.
     * @return {?Corner} The adjusted corner.
     * @protected
     */
    protected adjustCorner(status: number, corner: Corner | null): Corner | null;
}
import { AnchoredPosition } from "./anchoredposition.js";
import { Box } from "../math/box.js";
import { Corner } from "./positioning.js";
