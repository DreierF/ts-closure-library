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
export class IterableMechanism extends Mechanism {
    /**
     * Get the number of stored key-value pairs.
     *
     * Could be overridden in a subclass, as the default implementation is not very
     * efficient - it iterates over all keys.
     *
     * @return {number} Number of stored elements.
     */
    getCount(): number;
    /**
     * Returns an iterator that iterates over the elements in the storage. Will
     * throw StopIteration after the last element.
     *
     * @param {boolean=} opt_keys True to iterate over the keys. False to iterate
     *     over the values.  The default value is false.
     * @return {!Iterator} The iterator.
     * @abstract
     */
    __iterator__(opt_keys?: boolean | undefined): goog_iter.Iterator<any>;
    /**
     * Remove all key-value pairs.
     *
     * Could be overridden in a subclass, as the default implementation is not very
     * efficient - it iterates over all keys.
     */
    clear(): void;
}
import { Mechanism } from "./mechanism.js";
import * as goog_iter from "../../iter/iter.js";
