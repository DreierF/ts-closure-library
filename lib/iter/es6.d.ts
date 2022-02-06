/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Shims between goog.iter.Iterator and ES6 iterator.
 */
/**
 * Common interface extending both `goog.iter.Iterable` and ES6 `Iterable`,
 * and providing `toGoog()` and `toEs6()` methods to get either kind
 * of iterator.  `ShimIterable.of()` is the primary entry point for
 * this library.  If it is given an iterable that is *not* also an
 * iterator, then it will inherit any reusability from its argument
 * (i.e. `ShimIterable.of(mySet)` will be reusable, since mySet makes
 * a fresh Iterator every time, whereas `ShimIterable.of(myIterator)`
 * will be one-shot).
 *
 * `ShimGoogIterator` and `ShimEs6Iterator` extend `ShimIterable` and
 * also implement one or the other iterator API.  Since they extend
 * `ShimIterable`, it is easy to convert back and forth between the two
 * APIs.  Any such conversion will expose a view to the same underlying
 * iterator, so elements pulled via one API will not be available from
 * the other.
 *
 * @interface
 * @extends {Iterable<VALUE>}
 * @template VALUE
 */
export class ShimIterable<VALUE> {
    /**
     * @param {!Iterable<VALUE>|!Iterator<VALUE>|
     *         !GoogIterator<VALUE>|!GoogIterable} iter
     * @return {!ShimIterable}
     * @template VALUE
     */
    static of<VALUE>(iter: any): ShimIterable<any>;
    /** @return {!GoogIterator<VALUE>} */
    __iterator__(): GoogIterator<VALUE>;
    /** @return {!ShimGoogIterator<VALUE>} */
    toGoog(): ShimGoogIterator<VALUE>;
    /** @return {!ShimEs6Iterator<VALUE>} */
    toEs6(): ShimEs6Iterator<VALUE>;
}
/**
 * Concrete ES6 `Iterator` that also implements `ShimIterable`.
 * @implements {IteratorIterable<VALUE>}
 * @extends {ShimIterableImpl<VALUE>}
 * @template VALUE
 */
export class ShimEs6Iterator<VALUE> extends ShimIterableImpl<VALUE> {
    /** @param {!Iterator<VALUE>} iter */
    constructor(iter: any);
    /** @const @private */
    private iter_;
    /** @override */
    next(): any;
}
/**
 * Concrete `goog.iter.Iterator` subclass that also implements `ShimIterable`.
 * @extends {GoogIterator<VALUE>}
 * @implements {ShimIterable<VALUE>}
 * @template VALUE
 */
export class ShimGoogIterator<VALUE> extends GoogIterator<VALUE> implements ShimIterable<VALUE> {
    /** @param {!Iterator<VALUE>} iter */
    constructor(iter: any);
    iter_: any;
    /** @override */
    toGoog(): ShimGoogIterator<VALUE>;
    /** @override */
    [Symbol.iterator](): ShimEs6Iterator<any>;
    /** @override */
    toEs6(): ShimEs6Iterator<any>;
}
import { Iterator as GoogIterator } from "./iter.js";
import { Iterable as GoogIterable } from "./iter.js";
/**
 * Concrete (private) implementation of a non-iterator iterable.  This is
 * separate from the iterator versions since it supports iterables that
 * are not "one-shot".
 * @implements {ShimIterable<VALUE>}
 * @template VALUE
 */
declare class ShimIterableImpl<VALUE> implements ShimIterable<VALUE> {
    /** @param {function(): !Iterator<VALUE>} func */
    constructor(func: () => any);
    /** @const @private */
    private func_;
    /** @override */
    __iterator__(): ShimGoogIterator<any>;
    /** @override */
    toGoog(): ShimGoogIterator<any>;
    /** @override */
    [Symbol.iterator](): ShimEs6Iterator<any>;
    /** @override */
    toEs6(): ShimEs6Iterator<any>;
}
export {};
