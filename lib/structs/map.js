import * as iters from './../collections/iters.js';
import * as es6 from './../iter/es6.js';
import * as goog_iter from './../iter/iter.js';
import {Iterator as IterIterator} from './../iter/iter.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Datastructure: Hash Map.
 *
 *
 * This file contains an implementation of a Map structure. It implements a lot
 * of the methods used in google.structs so those functions work on hashes. This
 * is best suited for complex key types. For simple keys such as numbers and
 * strings consider using the lighter-weight utilities in goog.object.
 * @deprecated structs_Map is deprecated in favour of ES6 Maps.
 */

/**
 * Class for Hash Map datastructure.
 *     will be used as key-value pairs.
 * @final
 * @template K, V
 * @deprecated This type is misleading: use ES6 Map instead.
 */
class structs_Map {

  /**
   * Class for Hash Map datastructure.
   * @param {*=} opt_map Map or Object to initialize the map with.
   * @param {...*} var_args If 2 or more arguments are present then they
   *     will be used as key-value pairs.
   * @template K, V
   * @deprecated This type is misleading: use ES6 Map instead.
   */
  constructor(opt_map, var_args) {
    /**
     * Underlying JS object used to implement the map.
     * @private {!Object}
     */
    this.map_ = {};
  
    /**
     * An array of keys. This is necessary for two reasons:
     *   1. Iterating the keys using for (var key in this.map_) allocates an
     *      object for every key in IE which is really bad for IE6 GC perf.
     *   2. Without a side data structure, we would need to escape all the keys
     *      as that would be the only way we could tell during iteration if the
     *      key was an internal key or a property of the object.
     *
     * This array can contain deleted keys so it's necessary to check the map
     * as well to see if the key is still in the map (this doesn't require a
     * memory allocation in IE).
     * @private {!Array<string>}
     */
    this.keys_ = [];
  
    /**
     * The number of key value pairs in the map.
     * @const {number}
     */
    this.size = 0;
  
    /**
     * Version used to detect changes while iterating.
     * @private {number}
     */
    this.version_ = 0;
  
    var argLength = arguments.length;
  
    if (argLength > 1) {
      if (argLength % 2) {
        throw new Error('Uneven number of arguments');
      }
      for (var i = 0; i < argLength; i += 2) {
        this.set(arguments[i], arguments[i + 1]);
      }
    } else if (opt_map) {
      this.addAll(/** @type {!Object} */ (opt_map));
    }
  }

  /**
   * @return {number} The number of key-value pairs in the map.
   * @deprecated Use the `size` property instead, for alignment with ES6 Map.
   */
  getCount() {
    return this.size;
  };

  /**
   * Returns the values of the map.
   * @return {!Array<V>} The values in the map.
   * @deprecated Use `Array.from(map.values())` instead, for alignment with ES6
   *     Map.
   */
  getValues() {
    this.cleanupKeysArray_();
  
    var rv = [];
    for (var i = 0; i < this.keys_.length; i++) {
      var key = this.keys_[i];
      rv.push(this.map_[key]);
    }
    return rv;
  };

  /**
   * Returns the keys of the map.
   * @return {!Array<string>} Array of string values.
   * @deprecated Use `Array.from(map.keys())` instead, for alignment with ES6 Map.
   */
  getKeys() {
    this.cleanupKeysArray_();
    return /** @type {!Array<string>} */ (this.keys_.concat());
  };

  /**
   * Whether the map contains the given key.
   * @param {*} key The key to check for.
   * @return {boolean} Whether the map contains the key.
   * @deprecated Use `has` instead, for alignment with ES6 Map.
   */
  containsKey(key) {
    return this.has(key);
  };

  /**
   * Whether the map contains the given key.
   * @param {*} key The key to check for.
   * @return {boolean} Whether the map contains the key.
   */
  has(key) {
    return structs_Map.hasKey_(this.map_, key);
  };

  /**
   * Whether the map contains the given value. This is O(n).
   * @param {V} val The value to check for.
   * @return {boolean} Whether the map contains the value.
   */
  containsValue(val) {
    for (var i = 0; i < this.keys_.length; i++) {
      var key = this.keys_[i];
      if (structs_Map.hasKey_(this.map_, key) && this.map_[key] == val) {
        return true;
      }
    }
    return false;
  };

  /**
   * Whether this map is equal to the argument map.
   * @param {structs_Map} otherMap The map against which to test equality.
   * @param {function(V, V): boolean=} opt_equalityFn Optional equality function
   *     to test equality of values. If not specified, this will test whether
   *     the values contained in each map are identical objects.
   * @return {boolean} Whether the maps are equal.
   * @deprecated Use goog.collections.maps.equals(thisMap, otherMap,
   *     opt_equalityFn) instead, for alignment with ES6 Map.
   */
  equals(otherMap, opt_equalityFn) {
    if (this === otherMap) {
      return true;
    }
  
    if (this.size != otherMap.getCount()) {
      return false;
    }
  
    var equalityFn = opt_equalityFn || structs_Map.defaultEquals;
  
    this.cleanupKeysArray_();
    for (var key, i = 0; key = this.keys_[i]; i++) {
      if (!equalityFn(this.get(key), otherMap.get(key))) {
        return false;
      }
    }
  
    return true;
  };

  /**
   * Default equality test for values.
   * @param {*} a The first value.
   * @param {*} b The second value.
   * @return {boolean} Whether a and b reference the same object.
   */
  static defaultEquals(a, b) {
    return a === b;
  };

  /**
   * @return {boolean} Whether the map is empty.
   * @deprecated Use the size property and compare against 0, for alignment with
   *     ES6 Map.
   */
  isEmpty() {
    return this.size == 0;
  };

  /**
   * Removes all key-value pairs from the map.
   */
  clear() {
    this.map_ = {};
    this.keys_.length = 0;
    this.setSizeInternal_(0);
    this.version_ = 0;
  };

  /**
   * Removes a key-value pair based on the key. This is O(logN) amortized due to
   * updating the keys array whenever the count becomes half the size of the keys
   * in the keys array.
   * @param {*} key  The key to remove.
   * @return {boolean} Whether object was removed.
   * @deprecated Use `delete` instead, for alignment with ES6 Map.
   */
  remove(key) {
    return this.delete(key);
  };

  /**
   * Removes a key-value pair based on the key. This is O(logN) amortized due
   * to updating the keys array whenever the count becomes half the size of
   * the keys in the keys array.
   * @param {*} key  The key to remove.
   * @return {boolean} Whether object was removed.
   */
  delete(key) {
    if (structs_Map.hasKey_(this.map_, key)) {
      delete this.map_[key];
      this.setSizeInternal_(this.size - 1);
      this.version_++;
  
      // clean up the keys array if the threshold is hit
      if (this.keys_.length > 2 * this.size) {
        this.cleanupKeysArray_();
      }
  
      return true;
    }
    return false;
  };

  /**
   * Cleans up the temp keys array by removing entries that are no longer in the
   * map.
   * @private
   */
  cleanupKeysArray_() {
    if (this.size != this.keys_.length) {
      // First remove keys that are no longer in the map.
      var srcIndex = 0;
      var destIndex = 0;
      while (srcIndex < this.keys_.length) {
        var key = this.keys_[srcIndex];
        if (structs_Map.hasKey_(this.map_, key)) {
          this.keys_[destIndex++] = key;
        }
        srcIndex++;
      }
      this.keys_.length = destIndex;
    }
  
    if (this.size != this.keys_.length) {
      // If the count still isn't correct, that means we have duplicates. This can
      // happen when the same key is added and removed multiple times. Now we have
      // to allocate one extra Object to remove the duplicates. This could have
      // been done in the first pass, but in the common case, we can avoid
      // allocating an extra object by only doing this when necessary.
      var seen = {};
      var srcIndex = 0;
      var destIndex = 0;
      while (srcIndex < this.keys_.length) {
        var key = this.keys_[srcIndex];
        if (!(structs_Map.hasKey_(seen, key))) {
          this.keys_[destIndex++] = key;
          seen[key] = 1;
        }
        srcIndex++;
      }
      this.keys_.length = destIndex;
    }
  };

  /**
   * Returns the value for the given key.  If the key is not found and the default
   * value is not given this will return `undefined`.
   * @param {*} key The key to get the value for.
   * @param {DEFAULT=} opt_val The value to return if no item is found for the
   *     given key, defaults to undefined.
   * @return {V|DEFAULT} The value for the given key.
   * @template DEFAULT
   */
  get(key, opt_val) {
    if (structs_Map.hasKey_(this.map_, key)) {
      return this.map_[key];
    }
    return opt_val;
  };

  /**
   * Adds a key-value pair to the map.
   * @param {*} key The key.
   * @param {V} value The value to add.
   */
  set(key, value) {
    if (!(structs_Map.hasKey_(this.map_, key))) {
      this.setSizeInternal_(this.size + 1);
      // TODO(johnlenz): This class lies, it claims to return an array of string
      // keys, but instead returns the original object used.
      this.keys_.push(/** @type {?} */ (key));
      // Only change the version if we add a new key.
      this.version_++;
    }
    this.map_[key] = value;
  };

  /**
   * Adds multiple key-value pairs from another structs_Map or Object.
   * @param {?Object} map Object containing the data to add.
   * @deprecated Use goog.collections.maps.setAll(thisMap, map.entries()) if map
   *     is an ES6 or google.structs Map, or
   *     goog.collections.maps.setAll(thisMap, Object.entries(map)) otherwise.
   */
  addAll(map) {
    if (map instanceof structs_Map) {
      var keys = map.getKeys();
      for (var i = 0; i < keys.length; i++) {
        this.set(keys[i], map.get(keys[i]));
      }
    } else {
      for (var key in map) {
        this.set(key, map[key]);
      }
    }
  };

  /**
   * Calls the given function on each entry in the map.
   * @param {function(this:T, V, K, structs_Map<K,V>)} f
   * @param {T=} opt_obj The value of "this" inside f.
   * @template T
   * @deprecated Use ES6 Iteration instead.
   */
  forEach(f, opt_obj) {
    var keys = this.getKeys();
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var value = this.get(key);
      f.call(opt_obj, value, key, this);
    }
  };

  /**
   * Clones a map and returns a new map.
   * @return {!structs_Map} A new map with the same key-value pairs.
   * @deprecated Use `new Map(thisMap.entries())` instead, for alignment with
   *     ES6 Map.
   */
  clone() {
    return new structs_Map(this);
  };

  /**
   * Returns a new map in which all the keys and values are interchanged
   * (keys become values and values become keys). If multiple keys map to the
   * same value, the chosen transposed value is implementation-dependent.
   *
   * It acts very similarly to {goog.object.transpose(Object)}.
   *
   * @return {!structs_Map} The transposed map.
   * @deprecated Use goog.collections.maps.transpose instead, for alignment with
   *     ES6 Maps.
   */
  transpose() {
    var transposed = new structs_Map();
    for (var i = 0; i < this.keys_.length; i++) {
      var key = this.keys_[i];
      var value = this.map_[key];
      transposed.set(value, key);
    }
  
    return transposed;
  };

  /**
   * @return {!Object} Object representation of the map.
   * @deprecated Use goog.collections.maps.toObject(thisMap) instead, for aligment
   *     with ES6 Maps.
   */
  toObject() {
    this.cleanupKeysArray_();
    var obj = {};
    for (var i = 0; i < this.keys_.length; i++) {
      var key = this.keys_[i];
      obj[key] = this.map_[key];
    }
    return obj;
  };

  /**
   * Returns an iterator that iterates over the keys in the map.  Removal of keys
   * while iterating might have undesired side effects.
   * @return {!IterIterator} An iterator over the keys in the map.
   * @deprecated Use `keys()` with native iteration protocols, for alignment
   *     with ES6 Map.
   */
  getKeyIterator() {
    return this.__iterator__(true);
  };

  /**
   * @return {!IteratorIterable<K>} An ES6 Iterator that iterates over the maps
   *     keys.
   */
  keys() {
    return es6.ShimIterable.of(this.getKeyIterator()).toEs6();
  };

  /**
   * Returns an iterator that iterates over the values in the map.  Removal of
   * keys while iterating might have undesired side effects.
   * @return {!IterIterator} An iterator over the values in the map.
   * @deprecated Use `values()` with native iteration protocols, for alignment
   *     with ES6 Map.
   */
  getValueIterator() {
    return this.__iterator__(false);
  };

  /**
   * @return {!IteratorIterable<V>} An ES6 Iterator that iterates over the maps
   *     values.
   */
  values() {
    return es6.ShimIterable.of(this.getValueIterator()).toEs6();
  };

  /**
   * @return {!IteratorIterable<!Array<K|V>>} An iterator of entries in this map.
   *     The type is actually Array<[K,V]> but this is not representable in the
   *     Closure Type System.
   */
  entries() {
    const self = this;
    return iters.map(this.keys(), function(key) {
      return [key, self.get(key)];
    });
  };

  /**
   * Returns an iterator that iterates over the values or the keys in the map.
   * This throws an exception if the map was mutated since the iterator was
   * created.
   * @param {boolean=} opt_keys True to iterate over the keys. False to iterate
   *     over the values.  The default value is false.
   * @return {!IterIterator} An iterator over the values or keys in the map.
   * @deprecated Call either `keys` or `values` and use native iteration, for
   *     alignment with ES6 Map.
   */
  __iterator__(opt_keys) {
    // Clean up keys to minimize the risk of iterating over dead keys.
    this.cleanupKeysArray_();
  
    var i = 0;
    var version = this.version_;
    var selfObj = this;
  
    var newIter = new IterIterator;
    /**
     * @return {!IIterableResult<K|V>}
     * @override
     */
    newIter.next = function() {
      if (version != selfObj.version_) {
        throw new Error('The map has changed since the iterator was created');
      }
      if (i >= selfObj.keys_.length) {
        return goog_iter.ES6_ITERATOR_DONE;
      }
      var key = selfObj.keys_[i++];
      return goog_iter.createEs6IteratorYield(opt_keys ? key : selfObj.map_[key]);
    };
  
    return newIter;
  };

  /**
   * Assigns to the size property to isolate supressions of const assignment to
   * only where they are needed.
   * @param {number} newSize The size to update to.
   * @private
   */
  setSizeInternal_(newSize) {
    /** @suppress {const} */
    this.size = newSize;
  };

  /**
   * Safe way to test for hasOwnProperty.  It even allows testing for
   * 'hasOwnProperty'.
   * @param {!Object} obj The object to test for presence of the given key.
   * @param {*} key The key to check for.
   * @return {boolean} Whether the object has the key.
   * @private
   */
  static hasKey_(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
}

export {structs_Map as Map};