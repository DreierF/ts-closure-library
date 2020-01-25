/**
 * @fileoverview A utility class for representing a numeric box.
 */
/**
 * Class for representing a box. A box is specified as a top, right, bottom,
 * and left. A box is useful for representing margins and padding.
 *
 * This class assumes 'screen coordinates': larger Y coordinates are further
 * from the top of the screen.
 *
 * @class
 */
export class Box {
    /**
     * Class for representing a box. A box is specified as a top, right, bottom,
     * and left. A box is useful for representing margins and padding.
     *
     * This class assumes 'screen coordinates': larger Y coordinates are further
     * from the top of the screen.
     *
     * @param {number} top Top.
     * @param {number} right Right.
     * @param {number} bottom Bottom.
     * @param {number} left Left.
     */
    constructor(top: number, right: number, bottom: number, left: number);
    /**
     * Top
     * @type {number}
     */
    top: number;
    /**
     * Right
     * @type {number}
     */
    right: number;
    /**
     * Bottom
     * @type {number}
     */
    bottom: number;
    /**
     * Left
     * @type {number}
     */
    left: number;
    /**
     * @return {number} width The width of this Box.
     */
    getWidth(): number;
    /**
     * @return {number} height The height of this Box.
     */
    getHeight(): number;
    /**
     * Creates a copy of the box with the same dimensions.
     * @return {!Box} A clone of this Box.
     */
    clone(): Box;
    /**
     * Returns whether the box contains a coordinate or another box.
     *
     * @param {Math_Coordinate|Box} other A Coordinate or a Box.
     * @return {boolean} Whether the box contains the coordinate or other box.
     */
    contains(other: Math_Coordinate | Box): boolean;
    /**
     * Expands box with the given margins.
     *
     * @param {number|Box} top Top margin or box with all margins.
     * @param {number=} opt_right Right margin.
     * @param {number=} opt_bottom Bottom margin.
     * @param {number=} opt_left Left margin.
     * @return {!Box} A reference to this Box.
     */
    expand(top: number | Box, opt_right?: number, opt_bottom?: number, opt_left?: number): Box;
    /**
     * Expand this box to include another box.
     * NOTE(user): This is used in code that needs to be very fast, please don't
     * add functionality to this function at the expense of speed (variable
     * arguments, accepting multiple argument types, etc).
     * @param {?Box} box The box to include in this one.
     */
    expandToInclude(box: Box): void;
    /**
     * Expand this box to include the coordinate.
     * @param {!Math_Coordinate} coord The coordinate to be included
     *     inside the box.
     */
    expandToIncludeCoordinate(coord: Math_Coordinate): void;
    /**
     * Rounds the fields to the next larger integer values.
     *
     * @return {!Box} This box with ceil'd fields.
     */
    ceil(): Box;
    /**
     * Rounds the fields to the next smaller integer values.
     *
     * @return {!Box} This box with floored fields.
     */
    floor(): Box;
    /**
     * Rounds the fields to nearest integer values.
     *
     * @return {!Box} This box with rounded fields.
     */
    round(): Box;
    /**
     * Translates this box by the given offsets. If a `Math_Coordinate`
     * is given, then the left and right values are translated by the coordinate's
     * x value and the top and bottom values are translated by the coordinate's y
     * value.  Otherwise, `tx` and `opt_ty` are used to translate the x
     * and y dimension values.
     *
     * @param {number|Math_Coordinate} tx The value to translate the x
     *     dimension values by or the the coordinate to translate this box by.
     * @param {number=} opt_ty The value to translate y dimension values by.
     * @return {!Box} This box after translating.
     */
    translate(tx: number | Math_Coordinate, opt_ty?: number): Box;
    /**
     * Scales this coordinate by the given scale factors. The x and y dimension
     * values are scaled by `sx` and `opt_sy` respectively.
     * If `opt_sy` is not given, then `sx` is used for both x and y.
     *
     * @param {number} sx The scale factor to use for the x dimension.
     * @param {number=} opt_sy The scale factor to use for the y dimension.
     * @return {!Box} This box after scaling.
     */
    scale(sx: number, opt_sy?: number): Box;
}
export namespace Box { }
import { Coordinate as Math_Coordinate } from "./coordinate.js";
