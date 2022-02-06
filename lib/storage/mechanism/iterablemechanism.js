import {assertString} from './../../asserts/asserts.js';
import {ShimIterable} from './../../iter/es6.js';
import {Iterator as GoogIterator} from './../../iter/iter.js';
import {StopIteration} from './../../iter/iter.js';
import {Mechanism} from './mechanism.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Interface for storing, retrieving and scanning data using some
 * persistence mechanism.
 */

/**
 * Interface for all iterable storage mechanisms.
 *
 * @class
 * @extends {Mechanism}
 * @implements {Iterable<!Array<string>>}
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
    let count = 0;
    for (const key of this) {
      assertString(key);
      count++;
    }
    return count;
  };

  /**
   * Returns an iterator that iterates over the elements in the storage. Will
   * throw StopIteration after the last element.
   *
   * @param {boolean=} opt_keys True to iterate over the keys. False to iterate
   *     over the values.  The default value is false.
   * @return {!GoogIterator} The iterator.
   * @deprecated Use ES6 iteration protocols instead.
   * @abstract
   */
  __iterator__(opt_keys) {}

  /**
   * Remove all key-value pairs.
   *
   * Could be overridden in a subclass, as the default implementation is not
   * very efficient - it iterates over all keys.
   */
  clear() {
    // This converts the keys to an array first because otherwise
    // removing while iterating results in unstable ordering of keys and
    // can skip keys or terminate early.
    const keys = Array.from(this);
    for (const key of keys) {
      this.remove(key);
    }
  };
}

/**
 * Returns an interator that iterates over all the keys for elements in storage.
 *
 * @return {!IteratorIterable<string>}
 */
IterableMechanism.prototype[Symbol.iterator] = function() {
  return ShimIterable.of(this.__iterator__(true)).toEs6();
};

export {IterableMechanism};