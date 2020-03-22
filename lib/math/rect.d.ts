/**
 * @fileoverview A utility class for representing rectangles. Some of these
 * functions should be migrated over to non-nullable params.
 */
/**
 * Class for representing rectangular regions.
 * @class
 * @implements {IRect}
 */
export class Rect {
    /**
     * Class for representing rectangular regions.
     * @param {number} x Left.
     * @param {number} y Top.
     * @param {number} w Width.
     * @param {number} h Height.
     */
    constructor(x: number, y: number, w: number, h: number);
    /** @type {number} */
    left: number;
    /** @type {number} */
    top: number;
    /** @type {number} */
    width: number;
    /** @type {number} */
    height: number;
    /**
     * @return {!Rect} A new copy of this Rectangle.
     */
    clone(): Rect;
    /**
     * Returns a new Box object with the same position and dimensions as this
     * rectangle.
     * @return {!Math_Box} A new Box representation of this Rectangle.
     */
    toBox(): Math_Box;
    /**
     * Computes the intersection of this rectangle and the rectangle parameter.  If
     * there is no intersection, returns false and leaves this rectangle as is.
     * @param {?IRect} rect A Rectangle.
     * @return {boolean} True iff this rectangle intersects with the parameter.
     */
    intersection(rect: IRect | null): boolean;
    /**
     * Returns whether a rectangle intersects this rectangle.
     * @param {?IRect} rect A rectangle.
     * @return {boolean} Whether rect intersects this rectangle.
     */
    intersects(rect: IRect | null): boolean;
    /**
     * Computes the difference regions between this rectangle and `rect`. The
     * return value is an array of 0 to 4 rectangles defining the remaining regions
     * of this rectangle after the other has been subtracted.
     * @param {?IRect} rect A Rectangle.
     * @return {!Array<!Rect>} An array with 0 to 4 rectangles which
     *     together define the difference area of rectangle a minus rectangle b.
     */
    difference(rect: IRect | null): Rect[];
    /**
     * Expand this rectangle to also include the area of the given rectangle.
     * @param {?IRect} rect The other rectangle.
     */
    boundingRect(rect: IRect | null): void;
    /**
     * Tests whether this rectangle entirely contains another rectangle or
     * coordinate.
     *
     * @param {IRect|Coordinate} another The rectangle or
     *     coordinate to test for containment.
     * @return {boolean} Whether this rectangle contains given rectangle or
     *     coordinate.
     */
    contains(another: Coordinate | IRect): boolean;
    /**
     * @param {!Coordinate} point A coordinate.
     * @return {number} The squared distance between the point and the closest
     *     point inside the rectangle. Returns 0 if the point is inside the
     *     rectangle.
     */
    squaredDistance(point: Coordinate): number;
    /**
     * @param {!Coordinate} point A coordinate.
     * @return {number} The distance between the point and the closest point
     *     inside the rectangle. Returns 0 if the point is inside the rectangle.
     */
    distance(point: Coordinate): number;
    /**
     * @return {!Size} The size of this rectangle.
     */
    getSize(): Size;
    /**
     * @return {!Coordinate} A new coordinate for the top-left corner of
     *     the rectangle.
     */
    getTopLeft(): Coordinate;
    /**
     * @return {!Coordinate} A new coordinate for the center of the
     *     rectangle.
     */
    getCenter(): Coordinate;
    /**
     * @return {!Coordinate} A new coordinate for the bottom-right corner
     *     of the rectangle.
     */
    getBottomRight(): Coordinate;
    /**
     * Rounds the fields to the next larger integer values.
     * @return {!Rect} This rectangle with ceil'd fields.
     */
    ceil(): Rect;
    /**
     * Rounds the fields to the next smaller integer values.
     * @return {!Rect} This rectangle with floored fields.
     */
    floor(): Rect;
    /**
     * Rounds the fields to nearest integer values.
     * @return {!Rect} This rectangle with rounded fields.
     */
    round(): Rect;
    /**
     * Translates this rectangle by the given offsets. If a
     * `Coordinate` is given, then the left and top values are
     * translated by the coordinate's x and y values. Otherwise, left and top are
     * translated by `tx` and `opt_ty` respectively.
     * @param {number|Coordinate} tx The value to translate left by or the
     *     the coordinate to translate this rect by.
     * @param {number=} opt_ty The value to translate top by.
     * @return {!Rect} This rectangle after translating.
     */
    translate(tx: number | Coordinate, opt_ty?: number | undefined): Rect;
    /**
     * Scales this rectangle by the given scale factors. The left and width values
     * are scaled by `sx` and the top and height values are scaled by
     * `opt_sy`.  If `opt_sy` is not given, then all fields are scaled
     * by `sx`.
     * @param {number} sx The scale factor to use for the x dimension.
     * @param {number=} opt_sy The scale factor to use for the y dimension.
     * @return {!Rect} This rectangle after scaling.
     */
    scale(sx: number, opt_sy?: number | undefined): Rect;
}
export namespace Rect { }
import { Box as Math_Box } from "./box.js";
import { IRect } from "./irect.js";
import { Coordinate } from "./coordinate.js";
import { Size } from "./size.js";
