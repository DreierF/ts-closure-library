/**
 * Removes all the elements from the collection.
 * @param {?Object} col The collection-like object.
 */
export function clear(col: any | null): void;
/**
 * Whether the collection contains the given value. This is O(n) and uses
 * equals (==) to test the existence.
 * @param {?Object} col The collection-like object.
 * @param {*} val The value to check for.
 * @return {boolean} True if the map contains the value.
 */
export function contains(col: any | null, val: any): boolean;
/**
 * Calls f for each value in a collection. If all calls return true this return
 * true this returns true. If any returns false this returns false at this point
 *  and does not continue to check the remaining values.
 *
 * @param {S} col The collection-like object.
 * @param {function(this:T,?,?,S):boolean} f The function to call for every
 *     value. This function takes 3 arguments (the value, the key or
 *     undefined if the collection has no notion of keys, and the collection)
 *     and should return a boolean.
 * @param {T=} opt_obj  The object to be used as the value of 'this'
 *     within `f`.
 * @return {boolean} True if all key-value pairs pass the test.
 * @template T,S
 */
export function every<T, S>(col: S, f: (this: T, arg1: unknown, arg2: unknown, arg3: S) => boolean, opt_obj?: T | undefined): boolean;
/**
 * Calls a function for every value in the collection. When a call returns true,
 * adds the value to a new collection (Array is returned by default).
 *
 * @param {S} col The collection-like object.
 * @param {function(this:T,?,?,S):boolean} f The function to call for every
 *     value. This function takes
 *     3 arguments (the value, the key or undefined if the collection has no
 *     notion of keys, and the collection) and should return a Boolean. If the
 *     return value is true the value is added to the result collection. If it
 *     is false the value is not included.
 * @param {T=} opt_obj The object to be used as the value of 'this'
 *     within `f`.
 * @return {!Object|!Array<?>} A new collection where the passed values are
 *     present. If col is a key-less collection an array is returned.  If col
 *     has keys and values a plain old JS object is returned.
 * @template T,S
 */
export function filter<T, S>(col: S, f: (this: T, arg1: unknown, arg2: unknown, arg3: S) => boolean, opt_obj?: T | undefined): any | Array<unknown>;
/**
 * Calls a function for each value in a collection. The function takes
 * three arguments; the value, the key and the collection.
 *
 * @param {S} col The collection-like object.
 * @param {function(this:T,?,?,S):?} f The function to call for every value.
 *     This function takes
 *     3 arguments (the value, the key or undefined if the collection has no
 *     notion of keys, and the collection) and the return value is irrelevant.
 * @param {T=} opt_obj The object to be used as the value of 'this'
 *     within `f`.
 * @template T,S
 * @deprecated Use a more specific method, e.g. googarray.forEach,
 *     goog_object.forEach, or for-of.
 */
export function forEach<T, S>(col: S, f: (this: T, arg1: unknown, arg2: unknown, arg3: S) => unknown, opt_obj?: T | undefined): void;
/**
 * @fileoverview Generics method for collection-like classes and objects.
 *
 *
 * This file contains functions to work with collections. It supports using
 * Map, Set, Array and Object and other classes that implement collection-like
 * methods.
 * @suppress {strictMissingProperties}
 */
/**
 * Returns the number of values in the collection-like object.
 * @param {?Object} col The collection-like object.
 * @return {number} The number of values in the collection-like object.
 */
export function getCount(col: any | null): number;
/**
 * Returns the keys of the collection. Some collections have no notion of
 * keys/indexes and this function will return undefined in those cases.
 * @param {?Object} col The collection-like object.
 * @return {!Array|undefined} The keys in the collection.
 */
export function getKeys(col: any | null): Array | undefined;
/**
 * Returns the values of the collection-like object.
 * @param {?Object} col The collection-like object.
 * @return {!Array<?>} The values in the collection-like object.
 */
export function getValues(col: any | null): Array<unknown>;
/**
 * Whether the collection is empty.
 * @param {?Object} col The collection-like object.
 * @return {boolean} True if empty.
 */
export function isEmpty(col: any | null): boolean;
/**
 * Calls a function for every value in the collection and adds the result into a
 * new collection (defaults to creating a new Array).
 *
 * @param {S} col The collection-like object.
 * @param {function(this:T,?,?,S):V} f The function to call for every value.
 *     This function takes 3 arguments (the value, the key or undefined if the
 *     collection has no notion of keys, and the collection) and should return
 *     something. The result will be used as the value in the new collection.
 * @param {T=} opt_obj  The object to be used as the value of 'this'
 *     within `f`.
 * @return {!Object<V>|!Array<V>} A new collection with the new values.  If
 *     col is a key-less collection an array is returned.  If col has keys and
 *     values a plain old JS object is returned.
 * @template T,S,V
 */
export function map<T, S, V>(col: S, f: (this: T, arg1: unknown, arg2: unknown, arg3: S) => V, opt_obj?: T | undefined): any;
/**
 * Calls f for each value in a collection. If any call returns true this returns
 * true (without checking the rest). If all returns false this returns false.
 *
 * @param {S} col The collection-like object.
 * @param {function(this:T,?,?,S):boolean} f The function to call for every
 *     value. This function takes 3 arguments (the value, the key or undefined
 *     if the collection has no notion of keys, and the collection) and should
 *     return a boolean.
 * @param {T=} opt_obj  The object to be used as the value of 'this'
 *     within `f`.
 * @return {boolean} True if any value passes the test.
 * @template T,S
 */
export function some<T, S>(col: S, f: (this: T, arg1: unknown, arg2: unknown, arg3: S) => boolean, opt_obj?: T | undefined): boolean;
