export type Iterable = {
    length: number;
} | {
    __iterator__: any;
};
/**
 * @fileoverview Python style iteration utilities.
 */
/**
 * @typedef {{length:number}|{__iterator__}}
 */
export let Iterable: any;
/**
 * Class/interface for iterators.  An iterator needs to implement a `next`
 * method and it needs to throw a `StopIteration` when the
 * iteration passes beyond the end.  Iterators have no `hasNext` method.
 * It is recommended to always use the helper functions to iterate over the
 * iterator or in case you are only targeting JavaScript 1.7 for in loops.
 * @template VALUE
 */
export class Iterator<VALUE> {
    /**
     * Returns the next value of the iteration.  This will throw the object
     * {@see StopIteration} when the iteration passes the end.
     * @return {?VALUE} Any object or value.
     */
    next(): VALUE | null;
    /**
     * Returns the `Iterator` object itself.  This is used to implement
     * the iterator protocol in JavaScript 1.7
     * @param {boolean=} opt_keys  Whether to return the keys or values. Default is
     *     to only return the values.  This is being used by the for-in loop (true)
     *     and the for-each-in loop (false).  Even though the param gives a hint
     *     about what the iterator will return there is no guarantee that it will
     *     return the keys when true is passed.
     * @return {!Iterator<VALUE>} The object itself.
     */
    __iterator__(opt_keys?: boolean | undefined): Iterator<VALUE>;
}
/**
 * Singleton Error object that is used to terminate iterations.
 * @const {!Error}
 */
export let StopIteration: any;
/**
 * Creates an iterator that returns running totals from the numbers in
 * `iterable`. For example, the array {@code [1, 2, 3, 4, 5]} yields
 * {@code 1 -> 3 -> 6 -> 10 -> 15}.
 * @see http://docs.python.org/3.2/library/itertools.html#itertools.accumulate
 * @param {!Iterator<number>|!Iterable} iterable The
 *     iterable of numbers to accumulate.
 * @return {!Iterator<number>} A new iterator that returns the
 *     numbers in the series.
 */
export function accumulate(iterable: Iterator<number> | Iterable): Iterator<number>;
/**
 * Takes zero or more iterables and returns one iterator that will iterate over
 * them in the order chained.
 * @param {...!Iterator<VALUE>|!Iterable} var_args Any
 *     number of iterable objects.
 * @return {!Iterator<VALUE>} Returns a new iterator that will
 *     iterate over all the given iterables' contents.
 * @template VALUE
 */
export function chain<VALUE>(...args: ({
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>)[]): Iterator<VALUE>;
/**
 * Takes a single iterable containing zero or more iterables and returns one
 * iterator that will iterate over each one in the order given.
 * @see https://goo.gl/5NRp5d
 * @param {Iterator<?>|Iterable} iterable The iterable of
 *     iterables to chain.
 * @return {!Iterator<VALUE>} Returns a new iterator that will
 *     iterate over all the contents of the iterables contained within
 *     `iterable`.
 * @template VALUE
 */
export function chainFromIterable<VALUE>(iterable: Iterator<unknown> | Iterable): Iterator<VALUE>;
/**
 * Creates an iterator that returns combinations of elements from
 * `iterable`.
 *
 * Combinations are obtained by taking the {@see permutations} of
 * `iterable` and filtering those whose elements appear in the order they
 * are encountered in `iterable`. For example, the 3-length combinations
 * of {@code [0,1,2,3]} are {@code [[0,1,2], [0,1,3], [0,2,3], [1,2,3]]}.
 * @see http://docs.python.org/2/library/itertools.html#itertools.combinations
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable from which to generate combinations.
 * @param {number} length The length of each combination.
 * @return {!Iterator<!Array<VALUE>>} A new iterator containing
 *     combinations from the `iterable`.
 * @template VALUE
 */
export function combinations<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, length: number): Iterator<VALUE[]>;
/**
 * Creates an iterator that returns combinations of elements from
 * `iterable`, with repeated elements possible.
 *
 * Combinations are obtained by taking the Cartesian product of `length`
 * iterables and filtering those whose elements appear in the order they are
 * encountered in `iterable`. For example, the 2-length combinations of
 * {@code [1,2,3]} are {@code [[1,1], [1,2], [1,3], [2,2], [2,3], [3,3]]}.
 * @see https://goo.gl/C0yXe4
 * @see https://goo.gl/djOCsk
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to combine.
 * @param {number} length The length of each combination.
 * @return {!Iterator<!Array<VALUE>>} A new iterator containing
 *     combinations from the `iterable`.
 * @template VALUE
 */
export function combinationsWithReplacement<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, length: number): Iterator<VALUE[]>;
/**
 * Creates an iterator that filters `iterable` based on a series of
 * `selectors`. On each call to `next()`, one item is taken from
 * both the `iterable` and `selectors` iterators. If the item from
 * `selectors` evaluates to true, the item from `iterable` is given.
 * Otherwise, it is skipped. Once either `iterable` or `selectors`
 * is exhausted, subsequent calls to `next()` will throw
 * `StopIteration`.
 * @see http://docs.python.org/2/library/itertools.html#itertools.compress
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to filter.
 * @param {!Iterator<VALUE>|!Iterable} selectors An
 *     iterable of items to be evaluated in a boolean context to determine if
 *     the corresponding element in `iterable` should be included in the
 *     result.
 * @return {!Iterator<VALUE>} A new iterator that returns the
 *     filtered values.
 * @template VALUE
 */
export function compress<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, selectors: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>): Iterator<VALUE>;
/**
 * Creates an iterator that is advanced `count` steps ahead. Consumed
 * values are silently discarded. If `count` is greater than the number
 * of elements in `iterable`, an empty iterator is returned. Subsequent
 * calls to `next()` will throw `StopIteration`.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to consume.
 * @param {number} count  The number of elements to consume from the iterator.
 * @return {!Iterator<VALUE>} An iterator advanced zero or more steps
 *     ahead.
 * @template VALUE
 */
export function consume<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, count: number): Iterator<VALUE>;
/**
 * Creates an iterator that counts indefinitely from a starting value.
 * @see http://docs.python.org/2/library/itertools.html#itertools.count
 * @param {number=} opt_start The starting value. Default is 0.
 * @param {number=} opt_step The number to increment with between each call to
 *     next. Negative and floating point numbers are allowed. Default is 1.
 * @return {!Iterator<number>} A new iterator that returns the values
 *     in the series.
 */
export function count(opt_start?: number | undefined, opt_step?: number | undefined): Iterator<number>;
/**
 * Create an iterator to cycle over the iterable's elements indefinitely.
 * For example, ([1, 2, 3]) would return : 1, 2, 3, 1, 2, 3, ...
 * @see: http://docs.python.org/library/itertools.html#itertools.cycle.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable object.
 * @return {!Iterator<VALUE>} An iterator that iterates indefinitely
 *     over the values in `iterable`.
 * @template VALUE
 */
export function cycle<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>): Iterator<VALUE>;
/**
 * Builds a new iterator that iterates over the original, but skips elements as
 * long as a supplied function returns true.
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<VALUE>} A new iterator that drops elements from
 *     the original iterator as long as `f` is true.
 * @template THIS, VALUE
 */
export function dropWhile<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: any, opt_obj?: THIS | undefined): Iterator<VALUE>;
/**
 * Creates an iterator that returns arrays containing a count and an element
 * obtained from the given `iterable`.
 * @see http://docs.python.org/2/library/functions.html#enumerate
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to enumerate.
 * @param {number=} opt_start  Optional starting value. Default is 0.
 * @return {!Iterator<!Array<?>>} A new iterator containing
 *     count/item pairs.
 * @template VALUE
 */
export function enumerate<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, opt_start?: number | undefined): Iterator<Array<unknown>>;
/**
 * Iterates over two iterables and returns true if they contain the same
 * sequence of elements and have the same length.
 * @param {!Iterator<VALUE>|!Iterable} iterable1 The first
 *     iterable object.
 * @param {!Iterator<VALUE>|!Iterable} iterable2 The second
 *     iterable object.
 * @param {function(VALUE,VALUE):boolean=} opt_equalsFn Optional comparison
 *     function.
 *     Should take two arguments to compare, and return true if the arguments
 *     are equal. Defaults to {@link googarray.defaultCompareEquality} which
 *     compares the elements using the built-in '===' operator.
 * @return {boolean} true if the iterables contain the same sequence of elements
 *     and have the same length.
 * @template VALUE
 */
export function equals<VALUE>(iterable1: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, iterable2: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, opt_equalsFn?: ((arg0: VALUE, arg1: VALUE) => boolean) | undefined): boolean;
/**
 * Goes through the values in the iterator. Calls f for each of these and if any
 * of them returns false this returns false (without checking the rest). If all
 * return true this will return true.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {boolean} true if every value passes the test.
 * @template THIS, VALUE
 */
export function every<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: any, opt_obj?: THIS | undefined): boolean;
/**
 * Calls a function for every element in the iterator, and if the function
 * returns true adds the element to a new iterator.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to iterate over.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every element. This function takes 3 arguments
 *     (the element, undefined, and the iterator) and should return a boolean.
 *     If the return value is true the element will be included in the returned
 *     iterator.  If it is false the element is not included.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<VALUE>} A new iterator in which only elements
 *     that passed the test are present.
 * @template THIS, VALUE
 */
export function filter<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: any, opt_obj?: THIS | undefined): Iterator<VALUE>;
/**
 * Calls a function for every element in the iterator, and if the function
 * returns false adds the element to a new iterator.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to iterate over.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every element. This function takes 3 arguments
 *     (the element, undefined, and the iterator) and should return a boolean.
 *     If the return value is false the element will be included in the returned
 *     iterator.  If it is true the element is not included.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<VALUE>} A new iterator in which only elements
 *     that did not pass the test are present.
 * @template THIS, VALUE
 */
export function filterFalse<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: any, opt_obj?: THIS | undefined): Iterator<VALUE>;
/**
 * Calls a function for each element in the iterator with the element of the
 * iterator passed as argument.
 *
 * @param {Iterator<VALUE>|Iterable} iterable  The iterator
 *     to iterate over. If the iterable is an object `toIterator` will be
 *     called on it.
 * @param {function(this:THIS,VALUE,?,!Iterator<VALUE>)} f
 *     The function to call for every element.  This function takes 3 arguments
 *     (the element, undefined, and the iterator) and the return value is
 *     irrelevant.  The reason for passing undefined as the second argument is
 *     so that the same function can be used in {@see googarray.forEach} as
 *     well as others.  The third parameter is of type "number" for
 *     arraylike objects, undefined, otherwise.
 * @param {THIS=} opt_obj  The object to be used as the value of 'this' within
 *     `f`.
 * @template THIS, VALUE
 */
export function forEach<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: (this: THIS, arg1: VALUE, arg2: unknown, arg3: Iterator<VALUE>) => any, opt_obj?: THIS | undefined): void;
/**
 * Creates an iterator that returns arrays containing elements from the
 * `iterable` grouped by a key value. For iterables with repeated
 * elements (i.e. sorted according to a particular key function), this function
 * has a `uniq`-like effect. For example, grouping the array:
 * {@code [A, B, B, C, C, A]} produces
 * {@code [A, [A]], [B, [B, B]], [C, [C, C]], [A, [A]]}.
 * @see http://docs.python.org/2/library/itertools.html#itertools.groupby
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to group.
 * @param {function(VALUE): KEY=} opt_keyFunc  Optional function for
 *     determining the key value for each group in the `iterable`. Default
 *     is the identity function.
 * @return {!Iterator<!Array<?>>} A new iterator that returns
 *     arrays of consecutive key and groups.
 * @template KEY, VALUE
 */
export function groupBy<KEY, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, opt_keyFunc?: ((arg0: VALUE) => KEY) | undefined): Iterator<Array<unknown>>;
/**
 * Joins the values in a iterator with a delimiter.
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to get the values from.
 * @param {string} deliminator  The text to put between the values.
 * @return {string} The joined value string.
 * @template VALUE
 */
export function join<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, deliminator: string): string;
/**
 * Creates an iterator that returns the first `limitSize` elements from an
 * iterable. If this number is greater than the number of elements in the
 * iterable, all the elements are returned.
 * @see http://goo.gl/V0sihp Inspired by the limit iterator in Guava.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to limit.
 * @param {number} limitSize  The maximum number of elements to return.
 * @return {!Iterator<VALUE>} A new iterator containing
 *     `limitSize` elements.
 * @template VALUE
 */
export function limit<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, limitSize: number): Iterator<VALUE>;
/**
 * For every element in the iterator call a function and return a new iterator
 * with that value.
 *
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterator to iterate over.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):RESULT} f
 *     The function to call for every element.  This function takes 3 arguments
 *     (the element, undefined, and the iterator) and should return a new value.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<RESULT>} A new iterator that returns the
 *     results of applying the function to each element in the original
 *     iterator.
 * @template THIS, VALUE, RESULT
 */
export function map<THIS, VALUE, RESULT>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: any, opt_obj?: THIS | undefined): Iterator<RESULT>;
/**
 * Advances the iterator to the next position, returning the given default value
 * instead of throwing an exception if the iterator has no more entries.
 * @param {Iterator<VALUE>|Iterable} iterable The iterable
 *     object.
 * @param {?VALUE} defaultValue The value to return if the iterator is empty.
 * @return {?VALUE} The next item in the iteration, or defaultValue if the
 *     iterator was empty.
 * @template VALUE
 */
export function nextOrValue<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, defaultValue: VALUE | null): VALUE | null;
/**
 * Creates an iterator that returns permutations of elements in
 * `iterable`.
 *
 * Permutations are obtained by taking the Cartesian product of
 * `opt_length` iterables and filtering out those with repeated
 * elements. For example, the permutations of {@code [1,2,3]} are
 * {@code [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]}.
 * @see http://docs.python.org/2/library/itertools.html#itertools.permutations
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable from which to generate permutations.
 * @param {number=} opt_length Length of each permutation. If omitted, defaults
 *     to the length of `iterable`.
 * @return {!Iterator<!Array<VALUE>>} A new iterator containing the
 *     permutations of `iterable`.
 * @template VALUE
 */
export function permutations<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, opt_length?: number | undefined): Iterator<VALUE[]>;
/**
 * Cartesian product of zero or more sets.  Gives an iterator that gives every
 * combination of one element chosen from each set.  For example,
 * ([1, 2], [3, 4]) gives ([1, 3], [1, 4], [2, 3], [2, 4]).
 * @see http://docs.python.org/library/itertools.html#itertools.product
 * @param {...!ArrayLike<VALUE>} var_args Zero or more sets, as
 *     arrays.
 * @return {!Iterator<!Array<VALUE>>} An iterator that gives each
 *     n-tuple (as an array).
 * @template VALUE
 */
export function product<VALUE>(...args: ArrayLike<VALUE>[]): Iterator<VALUE[]>;
/**
 * Creates a new iterator that returns the values in a range.  This function
 * can take 1, 2 or 3 arguments:
 * <pre>
 * range(5) same as range(0, 5, 1)
 * range(2, 5) same as range(2, 5, 1)
 * </pre>
 *
 * @param {number} startOrStop  The stop value if only one argument is provided.
 *     The start value if 2 or more arguments are provided.  If only one
 *     argument is used the start value is 0.
 * @param {number=} opt_stop  The stop value.  If left out then the first
 *     argument is used as the stop value.
 * @param {number=} opt_step  The number to increment with between each call to
 *     next.  This can be negative.
 * @return {!Iterator<number>} A new iterator that returns the values
 *     in the range.
 */
export function range(startOrStop: number, opt_stop?: number | undefined, opt_step?: number | undefined, ...args: any[]): Iterator<number>;
/**
 * Passes every element of an iterator into a function and accumulates the
 * result.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to iterate over.
 * @param {function(this:THIS,VALUE,VALUE):VALUE} f The function to call for
 *     every element. This function takes 2 arguments (the function's previous
 *     result or the initial value, and the value of the current element).
 *     function(previousValue, currentElement) : newValue.
 * @param {?VALUE} val The initial value to pass into the function on the first
 *     call.
 * @param {THIS=} opt_obj  The object to be used as the value of 'this' within
 *     f.
 * @return {?VALUE} Result of evaluating f repeatedly across the values of
 *     the iterator.
 * @template THIS, VALUE
 */
export function reduce<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: (this: THIS, arg1: VALUE, arg2: VALUE) => VALUE, val: VALUE | null, opt_obj?: THIS | undefined): VALUE | null;
/**
 * Creates an iterator that returns the same object or value repeatedly.
 * @param {?VALUE} value Any object or value to repeat.
 * @return {!Iterator<VALUE>} A new iterator that returns the
 *     repeated value.
 * @template VALUE
 */
export function repeat<VALUE>(value: VALUE | null): Iterator<VALUE>;
/**
 * Creates an iterator that returns a range of elements from an iterable.
 * Similar to {@see googarray.slice} but does not support negative indexes.
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to slice.
 * @param {number} start  The index of the first element to return.
 * @param {number=} opt_end  The index after the last element to return. If
 *     defined, must be greater than or equal to `start`.
 * @return {!Iterator<VALUE>} A new iterator containing a slice of
 *     the original.
 * @template VALUE
 */
export function slice<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, start: number, opt_end?: number | undefined): Iterator<VALUE>;
/**
 * Goes through the values in the iterator. Calls f for each of these, and if
 * any of them returns true, this returns true (without checking the rest). If
 * all return false this will return false.
 *
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {boolean} true if any value passes the test.
 * @template THIS, VALUE
 */
export function some<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: any, opt_obj?: THIS | undefined): boolean;
/**
 * Gives an iterator that gives the result of calling the given function
 * <code>f</code> with the arguments taken from the next element from
 * <code>iterable</code> (the elements are expected to also be iterables).
 *
 * Similar to {@see map} but allows the function to accept multiple
 * arguments from the iterable.
 *
 * @param {!Iterator<?>|!Iterable} iterable The iterable of
 *     iterables to iterate over.
 * @param {function(this:THIS,...*):RESULT} f The function to call for every
 *     element.  This function takes N+2 arguments, where N represents the
 *     number of items from the next element of the iterable. The two
 *     additional arguments passed to the function are undefined and the
 *     iterator itself. The function should return a new value.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within
 *     `f`.
 * @return {!Iterator<RESULT>} A new iterator that returns the
 *     results of applying the function to each element in the original
 *     iterator.
 * @template THIS, RESULT
 */
export function starMap<THIS, RESULT>(iterable: Iterator<unknown> | Iterable, f: (this: THIS, ...arg1: any[]) => RESULT, opt_obj?: THIS | undefined): Iterator<RESULT>;
/**
 * Builds a new iterator that iterates over the original, but only as long as a
 * supplied function returns true.
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     object.
 * @param {
 *     function(this:THIS,VALUE,undefined,!Iterator<VALUE>):boolean} f
 *     The function to call for every value. This function takes 3 arguments
 *     (the value, undefined, and the iterator) and should return a boolean.
 * @param {THIS=} opt_obj This is used as the 'this' object in f when called.
 * @return {!Iterator<VALUE>} A new iterator that keeps elements in
 *     the original iterator as long as the function is true.
 * @template THIS, VALUE
 */
export function takeWhile<THIS, VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, f: any, opt_obj?: THIS | undefined): Iterator<VALUE>;
/**
 * Returns an array of iterators each of which can iterate over the values in
 * `iterable` without advancing the others.
 * @see http://docs.python.org/2/library/itertools.html#itertools.tee
 * @param {!Iterator<VALUE>|!Iterable} iterable The
 *     iterable to tee.
 * @param {number=} opt_num  The number of iterators to create. Default is 2.
 * @return {!Array<Iterator<VALUE>>} An array of iterators.
 * @template VALUE
 */
export function tee<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>, opt_num?: number | undefined): Iterator<VALUE>[];
/**
 * Converts the iterator to an array
 * @param {Iterator<VALUE>|Iterable} iterable The iterator
 *     to convert to an array.
 * @return {!Array<VALUE>} An array of the elements the iterator iterates over.
 * @template VALUE
 */
export function toArray<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>): VALUE[];
/**
 * Returns an iterator that knows how to iterate over the values in the object.
 * @param {Iterator<VALUE>|Iterable} iterable  If the
 *     object is an iterator it will be returned as is.  If the object has an
 *     `__iterator__` method that will be called to get the value
 *     iterator.  If the object is an array-like object we create an iterator
 *     for that.
 * @return {!Iterator<VALUE>} An iterator that knows how to iterate
 *     over the values in `iterable`.
 * @template VALUE
 */
export function toIterator<VALUE>(iterable: {
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>): Iterator<VALUE>;
/**
 * Creates an iterator that returns arrays containing the ith elements from the
 * provided iterables. The returned arrays will be the same size as the number
 * of iterables given in `var_args`. Once the shortest iterable is
 * exhausted, subsequent calls to `next()` will throw
 * `StopIteration`.
 * @see http://docs.python.org/2/library/itertools.html#itertools.izip
 * @param {...!Iterator<VALUE>|!Iterable} var_args Any
 *     number of iterable objects.
 * @return {!Iterator<!Array<VALUE>>} A new iterator that returns
 *     arrays of elements from the provided iterables.
 * @template VALUE
 */
export function zip<VALUE>(...args: ({
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>)[]): Iterator<VALUE[]>;
/**
 * Creates an iterator that returns arrays containing the ith elements from the
 * provided iterables. The returned arrays will be the same size as the number
 * of iterables given in `var_args`. Shorter iterables will be extended
 * with `fillValue`. Once the longest iterable is exhausted, subsequent
 * calls to `next()` will throw `StopIteration`.
 * @see http://docs.python.org/2/library/itertools.html#itertools.izip_longest
 * @param {?VALUE} fillValue The object or value used to fill shorter iterables.
 * @param {...!Iterator<VALUE>|!Iterable} var_args Any
 *     number of iterable objects.
 * @return {!Iterator<!Array<VALUE>>} A new iterator that returns
 *     arrays of elements from the provided iterables.
 * @template VALUE
 */
export function zipLongest<VALUE>(fillValue: VALUE | null, ...args: ({
    length: number;
} | {
    __iterator__: any;
} | Iterator<VALUE>)[]): Iterator<VALUE[]>;
