/**
 * @fileoverview Client positioning class.
 */
/**
 * Encapsulates a popup position where the popup is positioned according to
 * coordinates relative to the  element's viewport (page). This calculates the
 * correct position to use even if the element is relatively positioned to some
 * other element.
 *
 * @extends {AbstractPosition}
 */
export class ViewportPosition extends AbstractPosition {
    /**
     * Encapsulates a popup position where the popup is positioned according to
     * coordinates relative to the  element's viewport (page). This calculates the
     * correct position to use even if the element is relatively positioned to some
     * other element.
     *
     * @param {number|Coordinate} arg1 Left position or coordinate.
     * @param {number=} opt_arg2 Top position.
     */
    constructor(arg1: number | Coordinate, opt_arg2?: number | undefined);
    coordinate: Coordinate;
}
import { AbstractPosition } from "./abstractposition.js";
import { Coordinate } from "../math/coordinate.js";
