import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Provides inversion and inversion map functionality for storing
 * integer ranges and corresponding values.
 */

/**
 * Maps ranges to values.
 *     increasing integer values, with at least one instance.
 *     Length must be the same as rangeArray.
 * @template T
 */
class InversionMap {

  /**
   * Maps ranges to values.
   * @param {Array<number>} rangeArray An array of monotonically
   *     increasing integer values, with at least one instance.
   * @param {Array<T>} valueArray An array of corresponding values.
   *     Length must be the same as rangeArray.
   * @param {boolean=} opt_delta If true, saves only delta from previous value.
   * @template T
   */
  constructor(rangeArray, valueArray, opt_delta) {
    /**
     * @protected {?Array<number>}
     */
    this.rangeArray = null;
  
    asserts.assert(
        rangeArray.length == valueArray.length,
        'rangeArray and valueArray must have the same length.');
    this.storeInversion_(rangeArray, opt_delta);
  
    /** @protected {Array<T>} */
    this.values = valueArray;
  }

  /**
   * Stores the integers as ranges (half-open).
   * If delta is true, the integers are delta from the previous value and
   * will be restored to the absolute value.
   * When used as a set, even indices are IN, and odd are OUT.
   * @param {Array<number>} rangeArray An array of monotonically
   *     increasing integer values, with at least one instance.
   * @param {boolean=} opt_delta If true, saves only delta from previous value.
   * @private
   */
  storeInversion_(
      rangeArray, opt_delta) {
    this.rangeArray = rangeArray;
  
    for (var i = 1; i < rangeArray.length; i++) {
      if (rangeArray[i] == null) {
        rangeArray[i] = rangeArray[i - 1] + 1;
      } else if (opt_delta) {
        rangeArray[i] += rangeArray[i - 1];
      }
    }
  };

  /**
   * Splices a range -> value map into this inversion map.
   * @param {Array<number>} rangeArray An array of monotonically
   *     increasing integer values, with at least one instance.
   * @param {Array<T>} valueArray An array of corresponding values.
   *     Length must be the same as rangeArray.
   * @param {boolean=} opt_delta If true, saves only delta from previous value.
   */
  spliceInversion(
      rangeArray, valueArray, opt_delta) {
    // By building another inversion map, we build the arrays that we need
    // to splice in.
    var otherMap =
        new InversionMap(rangeArray, valueArray, opt_delta);
  
    // Figure out where to splice those arrays.
    var startRange = otherMap.rangeArray[0];
    var endRange =
        /** @type {number} */ (googarray.peek(otherMap.rangeArray));
    var startSplice = this.getLeast(startRange);
    var endSplice = this.getLeast(endRange);
  
    // The inversion map works by storing the start points of ranges...
    if (startRange != this.rangeArray[startSplice]) {
      // ...if we're splicing in a start point that isn't already here,
      // then we need to insert it after the insertion point.
      startSplice++;
    }  // otherwise we overwrite the insertion point.
  
    this.rangeArray = this.rangeArray.slice(0, startSplice)
                          .concat(otherMap.rangeArray)
                          .concat(this.rangeArray.slice(endSplice + 1));
    this.values = this.values.slice(0, startSplice)
                      .concat(otherMap.values)
                      .concat(this.values.slice(endSplice + 1));
  };

  /**
   * Gets the value corresponding to a number from the inversion map.
   * @param {number} intKey The number for which value needs to be retrieved
   *     from inversion map.
   * @return {T|null} Value retrieved from inversion map; null if not found.
   */
  at(intKey) {
    var index = this.getLeast(intKey);
    if (index < 0) {
      return null;
    }
    return this.values[index];
  };

  /**
   * Gets the largest index such that rangeArray[index] <= intKey from the
   * inversion map.
   * @param {number} intKey The probe for which rangeArray is searched.
   * @return {number} Largest index such that rangeArray[index] <= intKey.
   * @protected
   */
  getLeast(intKey) {
    var arr = this.rangeArray;
    var low = 0;
    var high = arr.length;
    while (high - low > 8) {
      var mid = (high + low) >> 1;
      if (arr[mid] <= intKey) {
        low = mid;
      } else {
        high = mid;
      }
    }
    for (; low < high; ++low) {
      if (intKey < arr[low]) {
        break;
      }
    }
    return low - 1;
  };
}

export {InversionMap};