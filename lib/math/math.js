import * as asserts from './../asserts/asserts.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Additional mathematical functions.
 */

/**
 * Returns a random integer greater than or equal to 0 and less than `a`.
 * @param {number} a  The upper bound for the random integer (exclusive).
 * @return {number} A random integer N such that 0 <= N < a.
 */
function randomInt(a) {
  return Math.floor(Math.random() * a);
};

/**
 * Returns a random number greater than or equal to `a` and less than
 * `b`.
 * @param {number} a  The lower bound for the random number (inclusive).
 * @param {number} b  The upper bound for the random number (exclusive).
 * @return {number} A random number N such that a <= N < b.
 */
function uniformRandom(a, b) {
  return a + Math.random() * (b - a);
};

/**
 * Takes a number and clamps it to within the provided bounds.
 * @param {number} value The input number.
 * @param {number} min The minimum value to return.
 * @param {number} max The maximum value to return.
 * @return {number} The input number if it is within bounds, or the nearest
 *     number within the bounds.
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};

/**
 * The % operator in JavaScript returns the remainder of a / b, but differs from
 * some other languages in that the result will have the same sign as the
 * dividend. For example, -1 % 8 == -1, whereas in some other languages
 * (such as Python) the result would be 7. This function emulates the more
 * correct modulo behavior, which is useful for certain applications such as
 * calculating an offset index in a circular list.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
 *     or b < x <= 0, depending on the sign of b).
 */
function modulo(a, b) {
  var r = a % b;
  // If r and b differ in sign, add b to wrap the result to the correct sign.
  return (r * b < 0) ? r + b : r;
};

/**
 * Performs linear interpolation between values a and b. Returns the value
 * between a and b proportional to x (when x is between 0 and 1. When x is
 * outside this range, the return value is a linear extrapolation).
 * @param {number} a A number.
 * @param {number} b A number.
 * @param {number} x The proportion between a and b.
 * @return {number} The interpolated value between a and b.
 */
function lerp(a, b, x) {
  return a + x * (b - a);
};

/**
 * Tests whether the two values are equal to each other, within a certain
 * tolerance to adjust for floating point errors.
 * @param {number} a A number.
 * @param {number} b A number.
 * @param {number=} opt_tolerance Optional tolerance range. Defaults
 *     to 0.000001. If specified, should be greater than 0.
 * @return {boolean} Whether `a` and `b` are nearly equal.
 */
function nearlyEquals(a, b, opt_tolerance) {
  return Math.abs(a - b) <= (opt_tolerance || 0.000001);
};

// TODO(user): Rename to normalizeAngle, retaining old name as deprecated
// alias.
/**
 * Normalizes an angle to be in range [0-360). Angles outside this range will
 * be normalized to be the equivalent angle with that range.
 * @param {number} angle Angle in degrees.
 * @return {number} Standardized angle.
 */
function standardAngle(angle) {
  return modulo(angle, 360);
};

/**
 * Normalizes an angle to be in range [0-2*PI). Angles outside this range will
 * be normalized to be the equivalent angle with that range.
 * @param {number} angle Angle in radians.
 * @return {number} Standardized angle.
 */
function standardAngleInRadians(angle) {
  return modulo(angle, 2 * Math.PI);
};

/**
 * Converts degrees to radians.
 * @param {number} angleDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */
function toRadians(angleDegrees) {
  return angleDegrees * Math.PI / 180;
};

/**
 * Converts radians to degrees.
 * @param {number} angleRadians Angle in radians.
 * @return {number} Angle in degrees.
 */
function toDegrees(angleRadians) {
  return angleRadians * 180 / Math.PI;
};

/**
 * For a given angle and radius, finds the X portion of the offset.
 * @param {number} degrees Angle in degrees (zero points in +X direction).
 * @param {number} radius Radius.
 * @return {number} The x-distance for the angle and radius.
 */
function angleDx(degrees, radius) {
  return radius * Math.cos(toRadians(degrees));
};

/**
 * For a given angle and radius, finds the Y portion of the offset.
 * @param {number} degrees Angle in degrees (zero points in +X direction).
 * @param {number} radius Radius.
 * @return {number} The y-distance for the angle and radius.
 */
function angleDy(degrees, radius) {
  return radius * Math.sin(toRadians(degrees));
};

/**
 * Computes the angle between two points (x1,y1) and (x2,y2).
 * Angle zero points in the +X direction, 90 degrees points in the +Y
 * direction (down) and from there we grow clockwise towards 360 degrees.
 * @param {number} x1 x of first point.
 * @param {number} y1 y of first point.
 * @param {number} x2 x of second point.
 * @param {number} y2 y of second point.
 * @return {number} Standardized angle in degrees of the vector from
 *     x1,y1 to x2,y2.
 */
function angle(x1, y1, x2, y2) {
  return standardAngle(
      toDegrees(Math.atan2(y2 - y1, x2 - x1)));
};

/**
 * Computes the difference between startAngle and endAngle (angles in degrees).
 * @param {number} startAngle  Start angle in degrees.
 * @param {number} endAngle  End angle in degrees.
 * @return {number} The number of degrees that when added to
 *     startAngle will result in endAngle. Positive numbers mean that the
 *     direction is clockwise. Negative numbers indicate a counter-clockwise
 *     direction.
 *     The shortest route (clockwise vs counter-clockwise) between the angles
 *     is used.
 *     When the difference is 180 degrees, the function returns 180 (not -180)
 *     angleDifference(30, 40) is 10, and angleDifference(40, 30) is -10.
 *     angleDifference(350, 10) is 20, and angleDifference(10, 350) is -20.
 */
function angleDifference(startAngle, endAngle) {
  var d =
      standardAngle(endAngle) - standardAngle(startAngle);
  if (d > 180) {
    d = d - 360;
  } else if (d <= -180) {
    d = 360 + d;
  }
  return d;
};

/**
 * Returns the sign of a number as per the "sign" or "signum" function.
 * @param {number} x The number to take the sign of.
 * @return {number} -1 when negative, 1 when positive, 0 when 0. Preserves
 *     signed zeros and NaN.
 */
function sign(x) {
  if (x > 0) {
    return 1;
  }
  if (x < 0) {
    return -1;
  }
  return x;  // Preserves signed zeros and NaN.
};

/**
 * JavaScript implementation of Longest Common Subsequence problem.
 * http://en.wikipedia.org/wiki/Longest_common_subsequence
 *
 * Returns the longest possible array that is subarray of both of given arrays.
 *
 * @param {IArrayLike<S>} array1 First array of objects.
 * @param {IArrayLike<T>} array2 Second array of objects.
 * @param {Function=} opt_compareFn Function that acts as a custom comparator
 *     for the array ojects. Function should return true if objects are equal,
 *     otherwise false.
 * @param {Function=} opt_collectorFn Function used to decide what to return
 *     as a result subsequence. It accepts 2 arguments: index of common element
 *     in the first array and index in the second. The default function returns
 *     element from the first array.
 * @return {!Array<S|T>} A list of objects that are common to both arrays
 *     such that there is no common subsequence with size greater than the
 *     length of the list.
 * @template S,T
 */
function longestCommonSubsequence(
    array1, array2, opt_compareFn, opt_collectorFn) {
  var compare = opt_compareFn || function(a, b) {
    return a == b;
  };

  var collect = opt_collectorFn || function(i1, i2) {
    return array1[i1];
  };

  var length1 = array1.length;
  var length2 = array2.length;

  var arr = [];
  for (var i = 0; i < length1 + 1; i++) {
    arr[i] = [];
    arr[i][0] = 0;
  }

  for (var j = 0; j < length2 + 1; j++) {
    arr[0][j] = 0;
  }

  for (i = 1; i <= length1; i++) {
    for (j = 1; j <= length2; j++) {
      if (compare(array1[i - 1], array2[j - 1])) {
        arr[i][j] = arr[i - 1][j - 1] + 1;
      } else {
        arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
      }
    }
  }

  // Backtracking
  var result = [];
  var i = length1, j = length2;
  while (i > 0 && j > 0) {
    if (compare(array1[i - 1], array2[j - 1])) {
      result.unshift(collect(i - 1, j - 1));
      i--;
      j--;
    } else {
      if (arr[i - 1][j] > arr[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }
  }

  return result;
};

/**
 * Returns the sum of the arguments.
 * @param {...number} var_args Numbers to add.
 * @return {number} The sum of the arguments (0 if no arguments were provided,
 *     `NaN` if any of the arguments is not a valid number).
 */
function sum(var_args) {
  return /** @type {number} */ (
      Array.prototype.reduce.call(arguments, function(sum, value) {
        return sum + value;
      }, 0));
};

/**
 * Returns the arithmetic mean of the arguments.
 * @param {...number} var_args Numbers to average.
 * @return {number} The average of the arguments (`NaN` if no arguments
 *     were provided or any of the arguments is not a valid number).
 */
function average(var_args) {
  return sum.apply(null, arguments) / arguments.length;
};

/**
 * Returns the unbiased sample variance of the arguments. For a definition,
 * see e.g. http://en.wikipedia.org/wiki/Variance
 * @param {...number} var_args Number samples to analyze.
 * @return {number} The unbiased sample variance of the arguments (0 if fewer
 *     than two samples were provided, or `NaN` if any of the samples is
 *     not a valid number).
 */
function sampleVariance(var_args) {
  var sampleSize = arguments.length;
  if (sampleSize < 2) {
    return 0;
  }

  var mean = average.apply(null, arguments);
  var variance = sum.apply(
                     null,
                     Array.prototype.map.call(
                         arguments,
                         function(val) {
                           return Math.pow(val - mean, 2);
                         })) /
      (sampleSize - 1);

  return variance;
};

/**
 * Returns the sample standard deviation of the arguments.  For a definition of
 * sample standard deviation, see e.g.
 * http://en.wikipedia.org/wiki/Standard_deviation
 * @param {...number} var_args Number samples to analyze.
 * @return {number} The sample standard deviation of the arguments (0 if fewer
 *     than two samples were provided, or `NaN` if any of the samples is
 *     not a valid number).
 */
function standardDeviation(var_args) {
  return Math.sqrt(sampleVariance.apply(null, arguments));
};

/**
 * Returns whether the supplied number represents an integer, i.e. that is has
 * no fractional component.  No range-checking is performed on the number.
 * @param {number} num The number to test.
 * @return {boolean} Whether `num` is an integer.
 */
function isInt(num) {
  return isFinite(num) && num % 1 == 0;
};

/**
 * Returns whether the supplied number is finite and not NaN.
 * @param {number} num The number to test.
 * @return {boolean} Whether `num` is a finite number.
 * @deprecated Use {@link isFinite} instead.
 */
function isFiniteNumber(num) {
  return isFinite(num);
};

/**
 * @param {number} num The number to test.
 * @return {boolean} Whether it is negative zero.
 */
function isNegativeZero(num) {
  return num == 0 && 1 / num < 0;
};

/**
 * Returns the precise value of floor(log10(num)).
 * Simpler implementations didn't work because of floating point rounding
 * errors. For example
 * <ul>
 * <li>Math.floor(Math.log(num) / Math.LN10) is off by one for num == 1e+3.
 * <li>Math.floor(Math.log(num) * Math.LOG10E) is off by one for num == 1e+15.
 * <li>Math.floor(Math.log10(num)) is off by one for num == 1e+15 - 1.
 * </ul>
 * @param {number} num A floating point number.
 * @return {number} Its logarithm to base 10 rounded down to the nearest
 *     integer if num > 0. -Infinity if num == 0. NaN if num < 0.
 */
function log10Floor(num) {
  if (num > 0) {
    var x = Math.round(Math.log(num) * Math.LOG10E);
    return x - (parseFloat('1e' + x) > num ? 1 : 0);
  }
  return num == 0 ? -Infinity : NaN;
};

/**
 * A tweaked variant of `Math.floor` which tolerates if the passed number
 * is infinitesimally smaller than the closest integer. It often happens with
 * the results of floating point calculations because of the finite precision
 * of the intermediate results. For example {@code Math.floor(Math.log(1000) /
 * Math.LN10) == 2}, not 3 as one would expect.
 * @param {number} num A number.
 * @param {number=} opt_epsilon An infinitesimally small positive number, the
 *     rounding error to tolerate.
 * @return {number} The largest integer less than or equal to `num`.
 */
function safeFloor(num, opt_epsilon) {
  asserts.assert(opt_epsilon === undefined || opt_epsilon > 0);
  return Math.floor(num + (opt_epsilon || 2e-15));
};

/**
 * A tweaked variant of `Math.ceil`. See `safeFloor` for
 * details.
 * @param {number} num A number.
 * @param {number=} opt_epsilon An infinitesimally small positive number, the
 *     rounding error to tolerate.
 * @return {number} The smallest integer greater than or equal to `num`.
 */
function safeCeil(num, opt_epsilon) {
  asserts.assert(opt_epsilon === undefined || opt_epsilon > 0);
  return Math.ceil(num - (opt_epsilon || 2e-15));
};

export {angle, angleDifference, angleDx, angleDy, average, clamp, isFiniteNumber, isInt, isNegativeZero, lerp, log10Floor, longestCommonSubsequence, modulo, nearlyEquals, randomInt, safeCeil, safeFloor, sampleVariance, sign, standardAngle, standardAngleInRadians, standardDeviation, sum, toDegrees, toRadians, uniformRandom};