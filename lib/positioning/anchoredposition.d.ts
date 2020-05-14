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
export class AnchoredPosition extends AbstractPosition {
    /**
     * Encapsulates a popup position where the popup is anchored at a corner of
     * an element.
     *
     * When using AnchoredPosition, it is recommended that the popup element
     * specified in the Popup constructor or Popup.setElement be absolutely
     * positioned.
     *
     * @param {?Element} anchorElement Element the movable element should be
     *     anchored against.
     * @param {?Corner} corner Corner of anchored element the
     *     movable element should be positioned at.
     * @param {number=} opt_overflow Overflow handling mode. Defaults to IGNORE if
     *     not specified. Bitmap, {@see Overflow}.
     */
    constructor(anchorElement: Element | null, corner: Corner | null, opt_overflow?: number | undefined);
    /**
     * Element the movable element should be anchored against.
     * @type {?Element}
     */
    element: Element | null;
    /**
     * Corner of anchored element the movable element should be positioned at.
     * @type {?Corner}
     */
    corner: Corner | null;
    /**
     * Overflow handling mode. Defaults to IGNORE if not specified.
     * Bitmap, {@see Overflow}.
     * @type {number|undefined}
     * @private
     */
    private overflow_;
}
import { AbstractPosition } from "./abstractposition.js";
import { Corner } from "./positioning.js";
