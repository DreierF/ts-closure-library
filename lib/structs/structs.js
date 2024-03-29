import * as googarray from './../array/array.js';
import * as google from './../google.js';
import * as goog_object from './../object/object.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generics method for collection-like classes and objects.
 *
 *
 * This file contains functions to work with collections. It supports using
 * Map, Set, Array and Object and other classes that implement collection-like
 * methods.
 * @suppress {strictMissingProperties}
 */

// We treat an object as a dictionary if it has getKeys or it is an object that
// isn't arrayLike.

/**
 * Returns the number of values in the collection-like object.
 * @param {Object} col The collection-like object.
 * @return {number} The number of values in the collection-like object.
 */
function getCount(col) {
  if (col.getCount && typeof col.getCount == 'function') {
    return col.getCount();
  }
  if (google.isArrayLike(col) || typeof col === 'string') {
    return col.length;
  }
  return goog_object.getCount(col);
};

/**
 * Returns the values of the collection-like object.
 * @param {Object} col The collection-like object.
 * @return {!Array<?>} The values in the collection-like object.
 */
function getValues(col) {
  if (col.getValues && typeof col.getValues == 'function') {
    return col.getValues();
  }
  // ES6 Map and Set both define a values function that returns an iterator.
  // The typeof check allows the compiler to remove the Map and Set polyfills
  // if they are otherwise unused throughout the entire binary.
  if ((typeof Map !== 'undefined' && col instanceof Map) ||
      (typeof Set !== 'undefined' && col instanceof Set)) {
    return Array.from(col.values());
  }
  if (typeof col === 'string') {
    return col.split('');
  }
  if (google.isArrayLike(col)) {
    var rv = [];
    var l = col.length;
    for (var i = 0; i < l; i++) {
      rv.push(col[i]);
    }
    return rv;
  }
  return goog_object.getValues(col);
};

/**
 * Returns the keys of the collection. Some collections have no notion of
 * keys/indexes and this function will return undefined in those cases.
 * @param {Object} col The collection-like object.
 * @return {!Array|undefined} The keys in the collection.
 */
function getKeys(col) {
  if (col.getKeys && typeof col.getKeys == 'function') {
    return col.getKeys();
  }
  // if we have getValues but no getKeys we know this is a key-less collection
  if (col.getValues && typeof col.getValues == 'function') {
    return undefined;
  }
  // ES6 Map and Set both define a keys function that returns an iterator. For
  // Sets this iterates over the same values as the values iterator.
  // The typeof check allows the compiler to remove the Map and Set polyfills
  // if they are otherwise unused throughout the entire binary.
  if (typeof Map !== 'undefined' && col instanceof Map) {
    return Array.from(col.keys());
  }
  // Unlike the native Set, goog.structs.Set does not expose keys as the values.
  if (typeof Set !== 'undefined' && col instanceof Set) {
    return undefined;
  }
  if (google.isArrayLike(col) || typeof col === 'string') {
    var rv = [];
    var l = col.length;
    for (var i = 0; i < l; i++) {
      rv.push(i);
    }
    return rv;
  }

  return goog_object.getKeys(col);
};

/**
 * Whether the collection contains the given value. This is O(n) and uses
 * equals (==) to test the existence.
 * @param {Object} col The collection-like object.
 * @param {*} val The value to check for.
 * @return {boolean} True if the map contains the value.
 */
function contains(col, val) {
  if (col.contains && typeof col.contains == 'function') {
    return col.contains(val);
  }
  if (col.containsValue && typeof col.containsValue == 'function') {
    return col.containsValue(val);
  }
  if (google.isArrayLike(col) || typeof col === 'string') {
    return googarray.contains(/** @type {!Array<?>} */ (col), val);
  }
  return goog_object.containsValue(col, val);
};

/**
 * Whether the collection is empty.
 * @param {Object} col The collection-like object.
 * @return {boolean} True if empty.
 */
function isEmpty(col) {
  if (col.isEmpty && typeof col.isEmpty == 'function') {
    return col.isEmpty();
  }

  // We do not use goog.string.isEmptyOrWhitespace because here we treat the
  // string as
  // collection and as such even whitespace matters

  if (google.isArrayLike(col) || typeof col === 'string') {
    return /** @type {!Array<?>} */ (col).length === 0;
  }
  return goog_object.isEmpty(col);
};

/**
 * Removes all the elements from the collection.
 * @param {Object} col The collection-like object.
 * @return {void}
 */
function clear(col) {
  // NOTE(arv): This should not contain strings because strings are immutable
  if (col.clear && typeof col.clear == 'function') {
    col.clear();
  } else if (google.isArrayLike(col)) {
    googarray.clear(/** @type {IArrayLike<?>} */ (col));
  } else {
    goog_object.clear(col);
  }
};

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
 * @return {void}
 * @template T,S
 * @deprecated Use a more specific method, e.g. native Array.prototype.forEach,
 *     or for-of.
 */
function forEach(col, f, opt_obj) {
  if (col.forEach && typeof col.forEach == 'function') {
    col.forEach(f, opt_obj);
  } else if (google.isArrayLike(col) || typeof col === 'string') {
    Array.prototype.forEach.call(/** @type {!Array<?>} */ (col), f, opt_obj);
  } else {
    var keys = getKeys(col);
    var values = getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++) {
      f.call(/** @type {?} */ (opt_obj), values[i], keys && keys[i], col);
    }
  }
};

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
function filter(col, f, opt_obj) {
  if (typeof col.filter == 'function') {
    return col.filter(f, opt_obj);
  }
  if (google.isArrayLike(col) || typeof col === 'string') {
    return Array.prototype.filter.call(
        /** @type {!Array<?>} */ (col), f, opt_obj);
  }

  var rv;
  var keys = getKeys(col);
  var values = getValues(col);
  var l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0; i < l; i++) {
      if (f.call(/** @type {?} */ (opt_obj), values[i], keys[i], col)) {
        rv[keys[i]] = values[i];
      }
    }
  } else {
    // We should not use Array#filter here since we want to make sure that
    // the index is undefined as well as make sure that col is passed to the
    // function.
    rv = [];
    for (var i = 0; i < l; i++) {
      if (f.call(opt_obj, values[i], undefined, col)) {
        rv.push(values[i]);
      }
    }
  }
  return rv;
};

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
function map(col, f, opt_obj) {
  if (typeof col.map == 'function') {
    return col.map(f, opt_obj);
  }
  if (google.isArrayLike(col) || typeof col === 'string') {
    return Array.prototype.map.call(/** @type {!Array<?>} */ (col), f, opt_obj);
  }

  var rv;
  var keys = getKeys(col);
  var values = getValues(col);
  var l = values.length;
  if (keys) {
    rv = {};
    for (var i = 0; i < l; i++) {
      rv[keys[i]] = f.call(/** @type {?} */ (opt_obj), values[i], keys[i], col);
    }
  } else {
    // We should not use Array#map here since we want to make sure that
    // the index is undefined as well as make sure that col is passed to the
    // function.
    rv = [];
    for (var i = 0; i < l; i++) {
      rv[i] = f.call(/** @type {?} */ (opt_obj), values[i], undefined, col);
    }
  }
  return rv;
};

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
function some(col, f, opt_obj) {
  if (typeof col.some == 'function') {
    return col.some(f, opt_obj);
  }
  if (google.isArrayLike(col) || typeof col === 'string') {
    return Array.prototype.some.call(
        /** @type {!Array<?>} */ (col), f, opt_obj);
  }
  var keys = getKeys(col);
  var values = getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    if (f.call(/** @type {?} */ (opt_obj), values[i], keys && keys[i], col)) {
      return true;
    }
  }
  return false;
};

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
function every(col, f, opt_obj) {
  if (typeof col.every == 'function') {
    return col.every(f, opt_obj);
  }
  if (google.isArrayLike(col) || typeof col === 'string') {
    return Array.prototype.every.call(
        /** @type {!Array<?>} */ (col), f, opt_obj);
  }
  var keys = getKeys(col);
  var values = getValues(col);
  var l = values.length;
  for (var i = 0; i < l; i++) {
    if (!f.call(/** @type {?} */ (opt_obj), values[i], keys && keys[i], col)) {
      return false;
    }
  }
  return true;
};

export {clear, contains, every, filter, forEach, getCount, getKeys, getValues, isEmpty, map, some};