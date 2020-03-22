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
     * Class for a two-dimensional vector object and assorted functions useful for
     * manipulating points.
     *
     * @param {number} x The x coordinate for the vector.
     * @param {number} y The y coordinate for the vector.
     */
    constructor(x: number, y: number);
    /**
     * @return {!Vec2} A new vector with the same coordinates as this one.
     * @override
     */
    clone(): Vec2;
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
    /** @override */
    equals(b: any): boolean;
    /**
     * @param {number} sx The scale factor to use for the x dimension.
     * @param {number=} opt_sy The scale factor to use for the y dimension.
     * @return {!Vec2} This vector after scaling.
     * @override
     * @suppress {checkTypes}
     */
    scale: any;
}
export namespace Vec2 {
    export const distance: (a: Math_Coordinate, b: Math_Coordinate) => number;
    export const squaredDistance: (a: Math_Coordinate, b: Math_Coordinate) => number;
    export const equals: (a: Math_Coordinate | null, b: Math_Coordinate | null) => boolean;
}
import { Coordinate as Math_Coordinate } from "./coordinate.js";
