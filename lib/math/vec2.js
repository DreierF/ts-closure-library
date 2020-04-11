import {Coordinate as Math_Coordinate} from './coordinate.js';
import * as math from './math.js';
// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
class Vec2 extends Math_Coordinate {

  /**
   * Class for a two-dimensional vector object and assorted functions useful for
   * manipulating points.
   *
   * @param {number} x The x coordinate for the vector.
   * @param {number} y The y coordinate for the vector.
   */
  constructor(x, y) {
    super();
  
    /**
     * X-value
     * @type {number}
     */
    this.x = x;
  
    /**
     * Y-value
     * @type {number}
     */
    this.y = y;
  }

  /**
   * @return {!Vec2} A random unit-length vector.
   */
  static randomUnit() {
    var angle = Math.random() * Math.PI * 2;
    return new Vec2(Math.cos(angle), Math.sin(angle));
  };

  /**
   * @return {!Vec2} A random vector inside the unit-disc.
   */
  static random() {
    var mag = Math.sqrt(Math.random());
    var angle = Math.random() * Math.PI * 2;
  
    return new Vec2(Math.cos(angle) * mag, Math.sin(angle) * mag);
  };

  /**
   * Returns a new Vec2 object from a given coordinate.
   * @param {!Math_Coordinate} a The coordinate.
   * @return {!Vec2} A new vector object.
   */
  static fromCoordinate(a) {
    return new Vec2(a.x, a.y);
  };

  /**
   * @return {!Vec2} A new vector with the same coordinates as this one.
   * @override
   */
  clone() {
    return new Vec2(this.x, this.y);
  };

  /**
   * Returns the magnitude of the vector measured from the origin.
   * @return {number} The length of the vector.
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  /**
   * Returns the squared magnitude of the vector measured from the origin.
   * NOTE(brenneman): Leaving out the square root is not a significant
   * optimization in JavaScript.
   * @return {number} The length of the vector, squared.
   */
  squaredMagnitude() {
    return this.x * this.x + this.y * this.y;
  };

  /**
   * Reverses the sign of the vector. Equivalent to scaling the vector by -1.
   * @return {!Vec2} The inverted vector.
   */
  invert() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  };

  /**
   * Normalizes the current vector to have a magnitude of 1.
   * @return {!Vec2} The normalized vector.
   */
  normalize() {
    return this.scale(1 / this.magnitude());
  };

  /**
   * Adds another vector to this vector in-place.
   * @param {!Math_Coordinate} b The vector to add.
   * @return {!Vec2}  This vector with `b` added.
   */
  add(b) {
    this.x += b.x;
    this.y += b.y;
    return this;
  };

  /**
   * Subtracts another vector from this vector in-place.
   * @param {!Math_Coordinate} b The vector to subtract.
   * @return {!Vec2} This vector with `b` subtracted.
   */
  subtract(b) {
    this.x -= b.x;
    this.y -= b.y;
    return this;
  };

  /**
   * Rotates this vector in-place by a given angle, specified in radians.
   * @param {number} angle The angle, in radians.
   * @return {!Vec2} This vector rotated `angle` radians.
   */
  rotate(angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var newX = this.x * cos - this.y * sin;
    var newY = this.y * cos + this.x * sin;
    this.x = newX;
    this.y = newY;
    return this;
  };

  /**
   * Rotates a vector by a given angle, specified in radians, relative to a given
   * axis rotation point. The returned vector is a newly created instance - no
   * in-place changes are done.
   * @param {!Vec2} v A vector.
   * @param {!Vec2} axisPoint The rotation axis point.
   * @param {number} angle The angle, in radians.
   * @return {!Vec2} The rotated vector in a newly created instance.
   */
  static rotateAroundPoint(v, axisPoint, angle) {
    var res = v.clone();
    return res.subtract(axisPoint).rotate(angle).add(axisPoint);
  };

  /** @override */
  equals(b) {
    if (this == b) {
      return true;
    }
    return b instanceof Vec2 && !!b && this.x == b.x && this.y == b.y;
  };

  /**
   * Returns the distance between two vectors.
   * @param {!Math_Coordinate} a The first vector.
   * @param {!Math_Coordinate} b The second vector.
   * @return {number} The distance.
   * @override
   * @suppress {checkTypes}
   */
  static distance(a, b) {
    return Math_Coordinate.distance(a, b);
  }

  /**
   * Returns the squared distance between two vectors.
   * @param {!Math_Coordinate} a The first vector.
   * @param {!Math_Coordinate} b The second vector.
   * @return {number} The squared distance.
   * @override
   * @suppress {checkTypes}
   */
  static squaredDistance(a, b) {
    return Math_Coordinate.squaredDistance(a, b);
  }

  /**
   * Compares vectors for equality.
   * @param {!Math_Coordinate} a The first vector.
   * @param {!Math_Coordinate} b The second vector.
   * @return {boolean} Whether the vectors have the same x and y coordinates.
   * @override
   * @suppress {checkTypes}
   */
  static equals(a, b) {
    return Math_Coordinate.equals(a, b);
  }

  /**
   * Returns the sum of two vectors as a new Vec2.
   * @param {!Math_Coordinate} a The first vector.
   * @param {!Math_Coordinate} b The second vector.
   * @return {!Vec2} The sum vector.
   * @override
   */
  static sum(a, b) {
    return new Vec2(a.x + b.x, a.y + b.y);
  };

  /**
   * Returns the difference between two vectors as a new Vec2.
   * @param {!Math_Coordinate} a The first vector.
   * @param {!Math_Coordinate} b The second vector.
   * @return {!Vec2} The difference vector.
   * @override
   */
  static difference(a, b) {
    return new Vec2(a.x - b.x, a.y - b.y);
  };

  /**
   * Returns the dot-product of two vectors.
   * @param {!Math_Coordinate} a The first vector.
   * @param {!Math_Coordinate} b The second vector.
   * @return {number} The dot-product of the two vectors.
   */
  static dot(a, b) {
    return a.x * b.x + a.y * b.y;
  };

  /**
   * Returns the determinant of two vectors.
   * @param {!Vec2} a The first vector.
   * @param {!Vec2} b The second vector.
   * @return {number} The determinant of the two vectors.
   */
  static determinant(a, b) {
    return a.x * b.y - a.y * b.x;
  };

  /**
   * Returns a new Vec2 that is the linear interpolant between vectors a and b at
   * scale-value x.
   * @param {!Math_Coordinate} a Vector a.
   * @param {!Math_Coordinate} b Vector b.
   * @param {number} x The proportion between a and b.
   * @return {!Vec2} The interpolated vector.
   */
  static lerp(a, b, x) {
    return new Vec2(
        math.lerp(a.x, b.x, x), math.lerp(a.y, b.y, x));
  };

  /**
   * Returns a new Vec2 that is a copy of the vector a, but rescaled by a factors
   * sx and sy in the x and y directions. If only sx is specified, then y is
   * scaled by the same factor as x.
   * @param {!Math_Coordinate} a Vector a.
   * @param {number} sx X scale factor.
   * @param {number=} sy Y scale factor (optional).
   * @return {!Vec2} A new rescaled vector.
   */
  static rescaled(a, sx, sy = sx) {
    return new Vec2(a.x * sx, a.y * sy);
  };
}

/**
 * @param {number} sx The scale factor to use for the x dimension.
 * @param {number=} opt_sy The scale factor to use for the y dimension.
 * @return {!Vec2} This vector after scaling.
 * @override
 * @suppress {checkTypes}
 */
// Since the implementation of Coordinate.scale() returns "this", we
// can reuse that implementation here, and just recast the return type.
Vec2.prototype.scale =
    /** @type {function(number, number=):!Vec2} */
    (Math_Coordinate.prototype.scale);

export {Vec2};