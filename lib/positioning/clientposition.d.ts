/**
 * @fileoverview Client positioning class.
 */
/**
 * Encapsulates a popup position where the popup is positioned relative to the
 * window (client) coordinates. This calculates the correct position to
 * use even if the element is relatively positioned to some other element. This
 * is for trying to position an element at the spot of the mouse cursor in
 * a MOUSEMOVE event. Just use the event.clientX and event.clientY as the
 * parameters.
 *
 * @extends {AbstractPosition}
 */
export class ClientPosition extends AbstractPosition {
    /**
     * Encapsulates a popup position where the popup is positioned relative to the
     * window (client) coordinates. This calculates the correct position to
     * use even if the element is relatively positioned to some other element. This
     * is for trying to position an element at the spot of the mouse cursor in
     * a MOUSEMOVE event. Just use the event.clientX and event.clientY as the
     * parameters.
     *
     * @param {number|Coordinate} arg1 Left position or coordinate.
     * @param {number=} opt_arg2 Top position.
     */
    constructor(arg1: number | Coordinate, opt_arg2?: number | undefined);
    /**
     * Coordinate to position popup at.
     * @type {!Coordinate}
     */
    coordinate: Coordinate;
}
import { AbstractPosition } from "./abstractposition.js";
import { Coordinate } from "../math/coordinate.js";
