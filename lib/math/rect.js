import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
import {Box as Math_Box} from './box.js';
import {Coordinate} from './coordinate.js';
import {IRect} from './irect.js';
import {Size} from './size.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A utility class for representing rectangles. Some of these
 * functions should be migrated over to non-nullable params.
 */

/**
 * Class for representing rectangular regions.
 * @class
 * @implements {IRect}
 */
class Rect {

  /**
   * Class for representing rectangular regions.
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} w Width.
   * @param {number} h Height.
   */
  constructor(x, y, w, h) {
    /** @type {number} */
    this.left = x;
  
    /** @type {number} */
    this.top = y;
  
    /** @type {number} */
    this.width = w;
  
    /** @type {number} */
    this.height = h;
  }

  /**
   * @return {!Rect} A new copy of this Rectangle.
   */
  clone() {
    return new Rect(this.left, this.top, this.width, this.height);
  };

  /**
   * Returns a new Box object with the same position and dimensions as this
   * rectangle.
   * @return {!Math_Box} A new Box representation of this Rectangle.
   */
  toBox() {
    var right = this.left + this.width;
    var bottom = this.top + this.height;
    return new Math_Box(this.top, right, bottom, this.left);
  };

  /**
   * Creates a new Rect object with the position and size given.
   * @param {!Coordinate} position The top-left coordinate of the Rect
   * @param {!Size} size The size of the Rect
   * @return {!Rect} A new Rect initialized with the given position and
   *     size.
   */
  static createFromPositionAndSize(position, size) {
    return new Rect(position.x, position.y, size.width, size.height);
  };

  /**
   * Creates a new Rect object with the same position and dimensions as a given
   * Box.  Note that this is only the inverse of toBox if left/top are defined.
   * @param {Math_Box} box A box.
   * @return {!Rect} A new Rect initialized with the box's position
   *     and size.
   */
  static createFromBox(box) {
    return new Rect(
        box.left, box.top, box.right - box.left, box.bottom - box.top);
  };

  /**
   * Compares rectangles for equality.
   * @param {IRect} a A Rectangle.
   * @param {IRect} b A Rectangle.
   * @return {boolean} True iff the rectangles have the same left, top, width,
   *     and height, or if both are null.
   */
  static equals(a, b) {
    if (a == b) {
      return true;
    }
    if (!a || !b) {
      return false;
    }
    return a.left == b.left && a.width == b.width && a.top == b.top &&
        a.height == b.height;
  };

  /**
   * Computes the intersection of this rectangle and the rectangle parameter.  If
   * there is no intersection, returns false and leaves this rectangle as is.
   * @param {IRect} rect A Rectangle.
   * @return {boolean} True iff this rectangle intersects with the parameter.
   */
  intersection(rect) {
    var x0 = Math.max(this.left, rect.left);
    var x1 = Math.min(this.left + this.width, rect.left + rect.width);
  
    if (x0 <= x1) {
      var y0 = Math.max(this.top, rect.top);
      var y1 = Math.min(this.top + this.height, rect.top + rect.height);
  
      if (y0 <= y1) {
        this.left = x0;
        this.top = y0;
        this.width = x1 - x0;
        this.height = y1 - y0;
  
        return true;
      }
    }
    return false;
  };

  /**
   * Returns the intersection of two rectangles. Two rectangles intersect if they
   * touch at all, for example, two zero width and height rectangles would
   * intersect if they had the same top and left.
   * @param {IRect} a A Rectangle.
   * @param {IRect} b A Rectangle.
   * @return {Rect} A new intersection rect (even if width and height
   *     are 0), or null if there is no intersection.
   */
  static intersection(a, b) {
    // There is no nice way to do intersection via a clone, because any such
    // clone might be unnecessary if this function returns null.  So, we duplicate
    // code from above.
  
    var x0 = Math.max(a.left, b.left);
    var x1 = Math.min(a.left + a.width, b.left + b.width);
  
    if (x0 <= x1) {
      var y0 = Math.max(a.top, b.top);
      var y1 = Math.min(a.top + a.height, b.top + b.height);
  
      if (y0 <= y1) {
        return new Rect(x0, y0, x1 - x0, y1 - y0);
      }
    }
    return null;
  };

  /**
   * Returns whether two rectangles intersect. Two rectangles intersect if they
   * touch at all, for example, two zero width and height rectangles would
   * intersect if they had the same top and left.
   * @param {IRect} a A Rectangle.
   * @param {IRect} b A Rectangle.
   * @return {boolean} Whether a and b intersect.
   */
  static intersects(a, b) {
    return (
        a.left <= b.left + b.width && b.left <= a.left + a.width &&
        a.top <= b.top + b.height && b.top <= a.top + a.height);
  };

  /**
   * Returns whether a rectangle intersects this rectangle.
   * @param {IRect} rect A rectangle.
   * @return {boolean} Whether rect intersects this rectangle.
   */
  intersects(rect) {
    return Rect.intersects(this, rect);
  };

  /**
   * Computes the difference regions between two rectangles. The return value is
   * an array of 0 to 4 rectangles defining the remaining regions of the first
   * rectangle after the second has been subtracted.
   * @param {Rect} a A Rectangle.
   * @param {IRect} b A Rectangle.
   * @return {!Array<!Rect>} An array with 0 to 4 rectangles which
   *     together define the difference area of rectangle a minus rectangle b.
   */
  static difference(a, b) {
    var intersection = Rect.intersection(a, b);
    if (!intersection || !intersection.height || !intersection.width) {
      return [a.clone()];
    }
  
    var result = [];
  
    var top = a.top;
    var height = a.height;
  
    var ar = a.left + a.width;
    var ab = a.top + a.height;
  
    var br = b.left + b.width;
    var bb = b.top + b.height;
  
    // Subtract off any area on top where A extends past B
    if (b.top > a.top) {
      result.push(new Rect(a.left, a.top, a.width, b.top - a.top));
      top = b.top;
      // If we're moving the top down, we also need to subtract the height diff.
      height -= b.top - a.top;
    }
    // Subtract off any area on bottom where A extends past B
    if (bb < ab) {
      result.push(new Rect(a.left, bb, a.width, ab - bb));
      height = bb - top;
    }
    // Subtract any area on left where A extends past B
    if (b.left > a.left) {
      result.push(new Rect(a.left, top, b.left - a.left, height));
    }
    // Subtract any area on right where A extends past B
    if (br < ar) {
      result.push(new Rect(br, top, ar - br, height));
    }
  
    return result;
  };

  /**
   * Computes the difference regions between this rectangle and `rect`. The
   * return value is an array of 0 to 4 rectangles defining the remaining regions
   * of this rectangle after the other has been subtracted.
   * @param {IRect} rect A Rectangle.
   * @return {!Array<!Rect>} An array with 0 to 4 rectangles which
   *     together define the difference area of rectangle a minus rectangle b.
   */
  difference(rect) {
    return Rect.difference(this, rect);
  };

  /**
   * Expand this rectangle to also include the area of the given rectangle.
   * @param {IRect} rect The other rectangle.
   */
  boundingRect(rect) {
    // We compute right and bottom before we change left and top below.
    var right = Math.max(this.left + this.width, rect.left + rect.width);
    var bottom = Math.max(this.top + this.height, rect.top + rect.height);
  
    this.left = Math.min(this.left, rect.left);
    this.top = Math.min(this.top, rect.top);
  
    this.width = right - this.left;
    this.height = bottom - this.top;
  };

  /**
   * Returns a new rectangle which completely contains both input rectangles.
   * @param {IRect} a A rectangle.
   * @param {IRect} b A rectangle.
   * @return {Rect} A new bounding rect, or null if either rect is
   *     null.
   */
  static boundingRect(a, b) {
    if (!a || !b) {
      return null;
    }
  
    var newRect = new Rect(a.left, a.top, a.width, a.height);
    newRect.boundingRect(b);
  
    return newRect;
  };

  /**
   * Tests whether this rectangle entirely contains another rectangle or
   * coordinate.
   *
   * @param {IRect|Coordinate} another The rectangle or
   *     coordinate to test for containment.
   * @return {boolean} Whether this rectangle contains given rectangle or
   *     coordinate.
   */
  contains(another) {
    if (another instanceof Coordinate) {
      return another.x >= this.left && another.x <= this.left + this.width &&
          another.y >= this.top && another.y <= this.top + this.height;
    } else {  // (another instanceof IRect)
      return this.left <= another.left &&
          this.left + this.width >= another.left + another.width &&
          this.top <= another.top &&
          this.top + this.height >= another.top + another.height;
    }
  };

  /**
   * @param {!Coordinate} point A coordinate.
   * @return {number} The squared distance between the point and the closest
   *     point inside the rectangle. Returns 0 if the point is inside the
   *     rectangle.
   */
  squaredDistance(point) {
    var dx = point.x < this.left ?
        this.left - point.x :
        Math.max(point.x - (this.left + this.width), 0);
    var dy = point.y < this.top ? this.top - point.y :
                                  Math.max(point.y - (this.top + this.height), 0);
    return dx * dx + dy * dy;
  };

  /**
   * @param {!Coordinate} point A coordinate.
   * @return {number} The distance between the point and the closest point
   *     inside the rectangle. Returns 0 if the point is inside the rectangle.
   */
  distance(point) {
    return Math.sqrt(this.squaredDistance(point));
  };

  /**
   * @return {!Size} The size of this rectangle.
   */
  getSize() {
    return new Size(this.width, this.height);
  };

  /**
   * @return {!Coordinate} A new coordinate for the top-left corner of
   *     the rectangle.
   */
  getTopLeft() {
    return new Coordinate(this.left, this.top);
  };

  /**
   * @return {!Coordinate} A new coordinate for the center of the
   *     rectangle.
   */
  getCenter() {
    return new Coordinate(
        this.left + this.width / 2, this.top + this.height / 2);
  };

  /**
   * @return {!Coordinate} A new coordinate for the bottom-right corner
   *     of the rectangle.
   */
  getBottomRight() {
    return new Coordinate(
        this.left + this.width, this.top + this.height);
  };

  /**
   * Rounds the fields to the next larger integer values.
   * @return {!Rect} This rectangle with ceil'd fields.
   */
  ceil() {
    this.left = Math.ceil(this.left);
    this.top = Math.ceil(this.top);
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this;
  };

  /**
   * Rounds the fields to the next smaller integer values.
   * @return {!Rect} This rectangle with floored fields.
   */
  floor() {
    this.left = Math.floor(this.left);
    this.top = Math.floor(this.top);
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this;
  };

  /**
   * Rounds the fields to nearest integer values.
   * @return {!Rect} This rectangle with rounded fields.
   */
  round() {
    this.left = Math.round(this.left);
    this.top = Math.round(this.top);
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this;
  };

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
  translate(tx, opt_ty) {
    if (tx instanceof Coordinate) {
      this.left += tx.x;
      this.top += tx.y;
    } else {
      this.left += asserts.assertNumber(tx);
      if (typeof opt_ty === 'number') {
        this.top += opt_ty;
      }
    }
    return this;
  };

  /**
   * Scales this rectangle by the given scale factors. The left and width values
   * are scaled by `sx` and the top and height values are scaled by
   * `opt_sy`.  If `opt_sy` is not given, then all fields are scaled
   * by `sx`.
   * @param {number} sx The scale factor to use for the x dimension.
   * @param {number=} opt_sy The scale factor to use for the y dimension.
   * @return {!Rect} This rectangle after scaling.
   */
  scale(sx, opt_sy) {
    var sy = (typeof opt_sy === 'number') ? opt_sy : sx;
    this.left *= sx;
    this.width *= sx;
    this.top *= sy;
    this.height *= sy;
    return this;
  };
}

export {Rect};