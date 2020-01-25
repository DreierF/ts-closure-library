/**
 * @fileoverview Abstract base class for positioning implementations.
 */
/**
 * Abstract position object. Encapsulates position and overflow handling.
 *
 */
export class AbstractPosition {
    /**
     * Repositions the element. Abstract method, should be overloaded.
     *
     * @param {?Element} movableElement Element to position.
     * @param {?Corner} corner Corner of the movable element that
     *     should be positioned adjacent to the anchored element.
     * @param {Box=} opt_margin A margin specified in pixels.
     * @param {Size=} opt_preferredSize PreferredSize of the
     *     movableElement.
     */
    reposition(movableElement: Element, corner: Corner, opt_margin?: Box, opt_preferredSize?: Size): void;
}
import { Corner } from "./positioning.js";
import { Box } from "../math/box.js";
import { Size } from "../math/size.js";
