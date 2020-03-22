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
export class MenuAnchoredPosition extends AnchoredViewportPosition {
    /**
     * Encapsulates a popup position where the popup is anchored at a corner of
     * an element.  The positioning behavior changes based on the values of
     * opt_adjust and opt_resize.
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
     * @param {boolean=} opt_resize Whether the positioning should be adjusted until
     *     the element fits inside the viewport on the X axis and its height is
     *     resized so if fits in the viewport. This take precedence over opt_adjust.
     */
    constructor(anchorElement: Element | null, corner: Corner | null, opt_adjust?: boolean | undefined, opt_resize?: boolean | undefined);
}
import { AnchoredViewportPosition } from "./anchoredviewportposition.js";
import { Corner } from "./positioning.js";
