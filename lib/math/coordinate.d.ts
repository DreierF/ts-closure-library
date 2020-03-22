/**
 * @fileoverview A utility class for representing two-dimensional positions.
 */
/**
 * Class for representing coordinates and positions.
 * @class
 */
export class Coordinate {
    /**
     * Class for representing coordinates and positions.
     * @param {number=} opt_x Left, defaults to 0.
     * @param {number=} opt_y Top, defaults to 0.
     */
    constructor(opt_x?: number | undefined, opt_y?: number | undefined);
    /**
     * X-value
     * @type {number}
     */
    x: number;
    /**
     * Y-value
     * @type {number}
     */
    y: number;
    /**
     * Returns a new copy of the coordinate.
     * @return {!Coordinate} A clone of this coordinate.
     */
    clone(): Coordinate;
    /**
     * Returns whether the specified value is equal to this coordinate.
     * @param {*} other Some other value.
     * @return {boolean} Whether the specified value is equal to this coordinate.
     */
    equals(other: any): boolean;
    /**
     * Rounds the x and y fields to the next larger integer values.
     * @return {!Coordinate} This coordinate with ceil'd fields.
     */
    ceil(): Coordinate;
    /**
     * Rounds the x and y fields to the next smaller integer values.
     * @return {!Coordinate} This coordinate with floored fields.
     */
    floor(): Coordinate;
    /**
     * Rounds the x and y fields to the nearest integer values.
     * @return {!Coordinate} This coordinate with rounded fields.
     */
    round(): Coordinate;
    /**
     * Translates this box by the given offsets. If a `Coordinate`
     * is given, then the x and y values are translated by the coordinate's x and y.
     * Otherwise, x and y are translated by `tx` and `opt_ty`
     * respectively.
     * @param {number|Coordinate} tx The value to translate x by or the
     *     the coordinate to translate this coordinate by.
     * @param {number=} opt_ty The value to translate y by.
     * @return {!Coordinate} This coordinate after translating.
     */
    translate(tx: number | Coordinate, opt_ty?: number | undefined): Coordinate;
    /**
     * Scales this coordinate by the given scale factors. The x and y values are
     * scaled by `sx` and `opt_sy` respectively.  If `opt_sy`
     * is not given, then `sx` is used for both x and y.
     * @param {number} sx The scale factor to use for the x dimension.
     * @param {number=} opt_sy The scale factor to use for the y dimension.
     * @return {!Coordinate} This coordinate after scaling.
     */
    scale(sx: number, opt_sy?: number | undefined): Coordinate;
    /**
     * Rotates this coordinate clockwise about the origin (or, optionally, the given
     * center) by the given angle, in radians.
     * @param {number} radians The angle by which to rotate this coordinate
     *     clockwise about the given center, in radians.
     * @param {!Coordinate=} opt_center The center of rotation. Defaults
     *     to (0, 0) if not given.
     */
    rotateRadians(radians: number, opt_center?: Coordinate | undefined): void;
    /**
     * Rotates this coordinate clockwise about the origin (or, optionally, the given
     * center) by the given angle, in degrees.
     * @param {number} degrees The angle by which to rotate this coordinate
     *     clockwise about the given center, in degrees.
     * @param {!Coordinate=} opt_center The center of rotation. Defaults
     *     to (0, 0) if not given.
     */
    rotateDegrees(degrees: number, opt_center?: Coordinate | undefined): void;
}
export namespace Coordinate { }
