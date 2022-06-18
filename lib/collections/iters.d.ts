/**
 * Maps the values of one iterable to create another iterable.
 *
 * When next() is called on the returned iterable, it will call the given
 * function `f` with the next value of the given iterable
 * `iterable` until the given iterable is exhausted.
 *
 * @param {!Iterable<VALUE>} iterable
 * @param {function(VALUE): RESULT} f
 * @return {!IteratorIterable<RESULT>} The created iterable that gives the
 *     mapped values.
 * @template VALUE, RESULT
 */
export function map<VALUE, RESULT>(iterable: any, f: (arg0: VALUE) => RESULT): any;
/**
 * Filter elements from one iterator to create another iterable.
 *
 * When next() is called on the returned iterator, it will call next() on the
 * given iterator and call the given function `f` with that value until `true`
 * is returned or the given iterator is exhausted.
 *
 * @param {!Iterable<VALUE>} iterable
 * @param {function(VALUE): boolean} f
 * @return {!IteratorIterable<VALUE>} The created iterable that gives the mapped
 *     values.
 * @template VALUE
 */
export function filter<VALUE>(iterable: any, f: (arg0: VALUE) => boolean): any;
/**
 * Concatenates multiple iterators to create a new iterable.
 *
 * When next() is called on the return iterator, it will call next() on the
 * current passed iterator. When the current passed iterator is exhausted, it
 * will move on to the next iterator until there are no more left.
 *
 * All generator return values will be ignored (i.e. when childIter.next()
 * returns {done: true, value: notUndefined} it will be treated as just
 * {done: true}).
 *
 * @param {...!Iterable<VALUE>} iterables
 * @return {!IteratorIterable<VALUE>}
 * @template VALUE
 */
export function concat<VALUE>(...iterables: any[]): any;
/**
 * Creates an array containing the values from the given iterator.
 * @param {!Iterator<VALUE>} iterator
 * @return {!Array<VALUE>}
 * @template VALUE
 */
export function toArray<VALUE>(iterator: any): VALUE[];
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Utilities for working with ES6 iterables.
 *
 * The goal is that this should be a replacement for google.iter which uses
 * a now non-standard approach to iterables.
 *
 * This module's API should track the TC39 proposal as closely as possible to
 * allow for eventual deprecation and migrations.
 * https://github.com/tc39/proposal-iterator-helpers
 *
 * @see go/closure-iters-labs
 * @see https://goo.gl/Rok5YQ
 */
/**
 * Get the iterator for an iterable.
 * @param {!Iterable<VALUE>} iterable
 * @return {!Iterator<VALUE>}
 * @template VALUE
 */
export function getIterator<VALUE>(iterable: any): any;
/**
 * Call a function with every value of an iterable.
 *
 * Warning: this function will never halt if given an iterable that
 * is never exhausted.
 *
 * @param {!Iterator<VALUE>} iterator
 * @param {function(VALUE) : *} f
 * @template VALUE
 */
export function forEach<VALUE>(iterator: any, f: (arg0: VALUE) => any): void;
