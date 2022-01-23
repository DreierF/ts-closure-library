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
export class Collection<T> {
    /**
     * @param {T} value Value to add to the collection.
     */
    add(value: T): void;
    /**
     * @param {T} value Value to remove from the collection.
     */
    remove(value: T): void;
    /**
     * @param {T} value Value to find in the collection.
     * @return {boolean} Whether the collection contains the specified value.
     */
    contains(value: T): boolean;
    /**
     * @return {number} The number of values stored in the collection.
     */
    getCount(): number;
}
