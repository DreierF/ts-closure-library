/**
 * @fileoverview Defines a 2-element vector class that can be used for
 * coordinate math, useful for animation systems and point manipulation.
 *
 * Vec2 objects inherit from Math_Coordinate and may be used wherever a
 * Coordinate is required. Where appropriate, Vec2 functions accept both Vec2
 * and Coordinate objects as input.
 */
/**
 * Class for a two-dimensional vector object and assorted functions useful for
 * manipulating points.
 *
 * @class
 * @extends {Math_Coordinate}
 */
export class Vec2 extends Math_Coordinate {
    /**
     * @return {!Vec2} A random unit-length vector.
     */
    static randomUnit(): Vec2;
    /**
     * @return {!Vec2} A random vector inside the unit-disc.
     */
    static random(): Vec2;
    /**
     * Returns a new Vec2 object from a given coordinate.
     * @param {!Math_Coordinate} a The coordinate.
     * @return {!Vec2} A new vector object.
     */
    static fromCoordinate(a: Math_Coordinate): Vec2;
    /**
     * Rotates a vector by a given angle, specified in radians, relative to a given
     * axis rotation point. The returned vector is a newly created instance - no
     * in-place changes are done.
     * @param {!Vec2} v A vector.
     * @param {!Vec2} axisPoint The rotation axis point.
     * @param {number} angle The angle, in radians.
     * @return {!Vec2} The rotated vector in a newly created instance.
     */
    static rotateAroundPoint(v: Vec2, axisPoint: Vec2, angle: number): Vec2;
    /**
     * Compares vectors for equality.
     * @param {!Math_Coordinate} a The first vector.
     * @param {!Math_Coordinate} b The second vector.
     * @return {boolean} Whether the vectors have the same x and y coordinates.
     * @override
     * @suppress {checkTypes}
     */
    static equals(a: Math_Coordinate, b: Math_Coordinate): boolean;
    /**
     * Returns the sum of two vectors as a new Vec2.
     * @param {!Math_Coordinate} a The first vector.
     * @param {!Math_Coordinate} b The second vector.
     * @return {!Vec2} The sum vector.
     * @override
     */
    static sum(a: Math_Coordinate, b: Math_Coordinate): Vec2;
    /**
     * Returns the difference between two vectors as a new Vec2.
     * @param {!Math_Coordinate} a The first vector.
     * @param {!Math_Coordinate} b The second vector.
     * @return {!Vec2} The difference vector.
     * @override
     */
    static difference(a: Math_Coordinate, b: Math_Coordinate): Vec2;
    /**
     * Returns the dot-product of two vectors.
     * @param {!Math_Coordinate} a The first vector.
     * @param {!Math_Coordinate} b The second vector.
     * @return {number} The dot-product of the two vectors.
     */
    static dot(a: Math_Coordinate, b: Math_Coordinate): number;
    /**
     * Returns the determinant of two vectors.
     * @param {!Vec2} a The first vector.
     * @param {!Vec2} b The second vector.
     * @return {number} The determinant of the two vectors.
     */
    static determinant(a: Vec2, b: Vec2): number;
    /**
     * Returns a new Vec2 that is the linear interpolant between vectors a and b at
     * scale-value x.
     * @param {!Math_Coordinate} a Vector a.
     * @param {!Math_Coordinate} b Vector b.
     * @param {number} x The proportion between a and b.
     * @return {!Vec2} The interpolated vector.
     */
    static lerp(a: Math_Coordinate, b: Math_Coordinate, x: number): Vec2;
    /**
     * Returns a new Vec2 that is a copy of the vector a, but rescaled by a factors
     * sx and sy in the x and y directions. If only sx is specified, then y is
     * scaled by the same factor as x.
     * @param {!Math_Coordinate} a Vector a.
     * @param {number} sx X scale factor.
     * @param {number=} sy Y scale factor (optional).
     * @return {!Vec2} A new rescaled vector.
     */
    static rescaled(a: Math_Coordinate, sx: number, sy?: number | undefined): Vec2;
    /**
     * Class for a two-dimensional vector object and assorted functions useful for
     * manipulating points.
     *
     * @param {number} x The x coordinate for the vector.
     * @param {number} y The y coordinate for the vector.
     */
    constructor(x: number, y: number);
    /**
     * Returns the magnitude of the vector measured from the origin.
     * @return {number} The length of the vector.
     */
    magnitude(): number;
    /**
     * Returns the squared magnitude of the vector measured from the origin.
     * NOTE(brenneman): Leaving out the square root is not a significant
     * optimization in JavaScript.
     * @return {number} The length of the vector, squared.
     */
    squaredMagnitude(): number;
    /**
     * Reverses the sign of the vector. Equivalent to scaling the vector by -1.
     * @return {!Vec2} The inverted vector.
     */
    invert(): Vec2;
    /**
     * Normalizes the current vector to have a magnitude of 1.
     * @return {!Vec2} The normalized vector.
     */
    normalize(): Vec2;
    /**
     * Adds another vector to this vector in-place.
     * @param {!Math_Coordinate} b The vector to add.
     * @return {!Vec2}  This vector with `b` added.
     */
    add(b: Math_Coordinate): Vec2;
    /**
     * Subtracts another vector from this vector in-place.
     * @param {!Math_Coordinate} b The vector to subtract.
     * @return {!Vec2} This vector with `b` subtracted.
     */
    subtract(b: Math_Coordinate): Vec2;
    /**
     * Rotates this vector in-place by a given angle, specified in radians.
     * @param {number} angle The angle, in radians.
     * @return {!Vec2} This vector rotated `angle` radians.
     */
    rotate(angle: number): Vec2;
}
import { Coordinate as Math_Coordinate } from "./coordinate.js";
