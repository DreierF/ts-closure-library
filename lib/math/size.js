import * as google from './../google.js';
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
 * @fileoverview A utility class for representing two-dimensional sizes.
 */

/**
 * Class for representing sizes consisting of a width and height. Undefined
 * width and height support is deprecated and results in compiler warning.
 * @class
 */
class Size {

  /**
   * Class for representing sizes consisting of a width and height. Undefined
   * width and height support is deprecated and results in compiler warning.
   * @param {number} width Width.
   * @param {number} height Height.
   */
  constructor(width, height) {
    /**
     * Width
     * @type {number}
     */
    this.width = width;
  
    /**
     * Height
     * @type {number}
     */
    this.height = height;
  }

  /**
   * Compares sizes for equality.
   * @param {Size} a A Size.
   * @param {Size} b A Size.
   * @return {boolean} True iff the sizes have equal widths and equal
   *     heights, or if both are null.
   */
  static equals(a, b) {
    if (a == b) {
      return true;
    }
    if (!a || !b) {
      return false;
    }
    return a.width == b.width && a.height == b.height;
  };

  /**
   * @return {!Size} A new copy of the Size.
   */
  clone() {
    return new Size(this.width, this.height);
  };

  /**
   * @return {number} The longer of the two dimensions in the size.
   */
  getLongest() {
    return Math.max(this.width, this.height);
  };

  /**
   * @return {number} The shorter of the two dimensions in the size.
   */
  getShortest() {
    return Math.min(this.width, this.height);
  };

  /**
   * @return {number} The area of the size (width * height).
   */
  area() {
    return this.width * this.height;
  };

  /**
   * @return {number} The perimeter of the size (width + height) * 2.
   */
  perimeter() {
    return (this.width + this.height) * 2;
  };

  /**
   * @return {number} The ratio of the size's width to its height.
   */
  aspectRatio() {
    return this.width / this.height;
  };

  /**
   * @return {boolean} True if the size has zero area, false if both dimensions
   *     are non-zero numbers.
   */
  isEmpty() {
    return !this.area();
  };

  /**
   * Clamps the width and height parameters upward to integer values.
   * @return {!Size} This size with ceil'd components.
   */
  ceil() {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this;
  };

  /**
   * @param {!Size} target The target size.
   * @return {boolean} True if this Size is the same size or smaller than the
   *     target size in both dimensions.
   */
  fitsInside(target) {
    return this.width <= target.width && this.height <= target.height;
  };

  /**
   * Clamps the width and height parameters downward to integer values.
   * @return {!Size} This size with floored components.
   */
  floor() {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this;
  };

  /**
   * Rounds the width and height parameters to integer values.
   * @return {!Size} This size with rounded components.
   */
  round() {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this;
  };

  /**
   * Scales this size by the given scale factors. The width and height are scaled
   * by `sx` and `opt_sy` respectively.  If `opt_sy` is not
   * given, then `sx` is used for both the width and height.
   * @param {number} sx The scale factor to use for the width.
   * @param {number=} opt_sy The scale factor to use for the height.
   * @return {!Size} This Size object after scaling.
   */
  scale(sx, opt_sy) {
    const sy = (typeof opt_sy === 'number') ? opt_sy : sx;
    this.width *= sx;
    this.height *= sy;
    return this;
  };

  /**
   * Uniformly scales the size to perfectly cover the dimensions of a given size.
   * If the size is already larger than the target, it will be scaled down to the
   * minimum size at which it still covers the entire target. The original aspect
   * ratio will be preserved.
   *
   * This function assumes that both Sizes contain strictly positive dimensions.
   * @param {!Size} target The target size.
   * @return {!Size} This Size object, after optional scaling.
   */
  scaleToCover(target) {
    const s = this.aspectRatio() <= target.aspectRatio() ?
        target.width / this.width :
        target.height / this.height;
  
    return this.scale(s);
  };

  /**
   * Uniformly scales the size to fit inside the dimensions of a given size. The
   * original aspect ratio will be preserved.
   *
   * This function assumes that both Sizes contain strictly positive dimensions.
   * @param {!Size} target The target size.
   * @return {!Size} This Size object, after optional scaling.
   */
  scaleToFit(target) {
    const s = this.aspectRatio() > target.aspectRatio() ?
        target.width / this.width :
        target.height / this.height;
  
    return this.scale(s);
  };
}

export {Size};