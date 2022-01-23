/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Defines the collection interface.
 */

/**
 * An interface for a collection of values.
 * @interface
 * @template T
 */
class Collection {

  /**
   * An interface for a collection of values.
   * @template T
   */
  constructor() {}

  /**
   * @param {T} value Value to add to the collection.
   */
  add(value) {}

  /**
   * @param {T} value Value to remove from the collection.
   */
  remove(value) {}

  /**
   * @param {T} value Value to find in the collection.
   * @return {boolean} Whether the collection contains the specified value.
   */
  contains(value) {}

  /**
   * @return {number} The number of values stored in the collection.
   */
  getCount() {}
}

export {Collection};