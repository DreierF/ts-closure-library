import * as googarray from './../../array/array.js';
import * as asserts from './../../asserts/asserts.js';
import * as goog_iter from './../../iter/iter.js';
import {Iterator} from './../../iter/iter.js';
import {StopIteration} from './../../iter/iter.js';
import {Mechanism} from './mechanism.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Interface for storing, retieving and scanning data using some
 * persistence mechanism.
 */

/**
 * Interface for all iterable storage mechanisms.
 *
 * @class
 * @extends {Mechanism}
 * @abstract
 */
class IterableMechanism extends Mechanism {

  /**
   * Interface for all iterable storage mechanisms.
   *
   */
  constructor() {
    super();
  }

  /**
   * Get the number of stored key-value pairs.
   *
   * Could be overridden in a subclass, as the default implementation is not very
   * efficient - it iterates over all keys.
   *
   * @return {number} Number of stored elements.
   */
  getCount() {
    var count = 0;
    goog_iter.forEach(this.__iterator__(true), function(key) {
      asserts.assertString(key);
      count++;
    });
    return count;
  };

  /**
   * Returns an iterator that iterates over the elements in the storage. Will
   * throw StopIteration after the last element.
   *
   * @param {boolean=} opt_keys True to iterate over the keys. False to iterate
   *     over the values.  The default value is false.
   * @return {!Iterator} The iterator.
   * @abstract
   */
  __iterator__(opt_keys) {}

  /**
   * Remove all key-value pairs.
   *
   * Could be overridden in a subclass, as the default implementation is not very
   * efficient - it iterates over all keys.
   */
  clear() {
    // This converts the keys to an array first because otherwise
    // removing while iterating results in unstable ordering of keys and
    // can skip keys or terminate early.
    var keys = goog_iter.toArray(this.__iterator__(true));
    var selfObj = this;
    googarray.forEach(keys, function(key) { selfObj.remove(key); });
  };
}

export {IterableMechanism};