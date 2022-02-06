import * as google from './../google.js';
import {Iterator} from './../iter/iter.js';
import {Collection} from './collection.js';
import {Map as StructsMap} from './map.js';
import * as googstructs from './structs.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Datastructure: Set.
 *
 *
 * This class implements a set data structure. Adding and removing is O(1). It
 * supports both object and primitive values. Be careful because you can add
 * both 1 and new Number(1), because these are not the same. You can even add
 * multiple new Number(1) because these are not equal.
 */

/**
 * A set that can contain both primitives and objects.  Adding and removing
 * elements is O(1).  Primitives are treated as identical if they have the same
 * type and convert to the same string.  Objects are treated as identical only
 * if they are references to the same object.  WARNING: A structs_Set can
 * contain both 1 and (new Number(1)), because they are not the same.  WARNING:
 * Adding (new Number(1)) twice will yield two distinct elements, because they
 * are two different objects.  WARNING: Any object that is added to a
 * structs_Set will be modified!  Because google.getUid() is used to
 * identify objects, every object in the set will be mutated.
 * @implements {Collection<T>}
 * @implements {Iterable<T>}
 * @final
 * @template T
 * @deprecated This type is misleading: use ES6 Set instead.
 */
class structs_Set {

  /**
   * A set that can contain both primitives and objects.  Adding and removing
   * elements is O(1).  Primitives are treated as identical if they have the same
   * type and convert to the same string.  Objects are treated as identical only
   * if they are references to the same object.  WARNING: A structs_Set can
   * contain both 1 and (new Number(1)), because they are not the same.  WARNING:
   * Adding (new Number(1)) twice will yield two distinct elements, because they
   * are two different objects.  WARNING: Any object that is added to a
   * structs_Set will be modified!  Because google.getUid() is used to
   * identify objects, every object in the set will be mutated.
   * @param {Array<T>|Object<?,T>=} opt_values Initial values to start with.
   * @template T
   * @deprecated This type is misleading: use ES6 Set instead.
   */
  constructor(opt_values) {
    this.map_ = new StructsMap();
  
  
    /**
     * The number of items in this set.
     * @const {number}
     */
    this.size = 0;
  
    if (opt_values) {
      this.addAll(opt_values);
    }
  }

  /**
   * Obtains a unique key for an element of the set.  Primitives will yield the
   * same key if they have the same type and convert to the same string.  Object
   * references will yield the same key only if they refer to the same object.
   * @param {*} val Object or primitive value to get a key for.
   * @return {string} A unique key for this value/object.
   * @private
   */
  static getKey_(val) {
    var type = typeof val;
    if (type == 'object' && val || type == 'function') {
      return 'o' + structs_Set.getUid_(/** @type {Object} */ (val));
    } else {
      return type.substr(0, 1) + val;
    }
  };

  /**
   * @return {number} The number of elements in the set.
   * @override
   * @deprecated Use the `size` property instead, for alignment with ES6 Set.
   */
  getCount() {
    return this.map_.size;
  };

  /**
   * Add a primitive or an object to the set.
   * @param {T} element The primitive or object to add.
   * @override
   */
  add(element) {
    this.map_.set(structs_Set.getKey_(element), element);
    this.setSizeInternal_(this.map_.size);
  };

  /**
   * Adds all the values in the given collection to this set.
   * @param {Array<T>|Collection<T>|Object<?,T>} col A collection
   *     containing the elements to add.
   * @deprecated Use `goog.collections.sets.addAll(thisSet, col)` instead,
   *     converting Objects to their values using `Object.values`, for alignment
   *     with ES6 Set.
   */
  addAll(col) {
    var values = googstructs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++) {
      this.add(values[i]);
    }
    this.setSizeInternal_(this.map_.size);
  };

  /**
   * Removes all values in the given collection from this set.
   * @param {Array<T>|Collection<T>|Object<?,T>} col A collection
   *     containing the elements to remove.
   * @deprecated Use `goog.collections.sets.removeAll(thisSet, col)` instead,
   *     converting Objects to their values using `Object.values`, for alignment
   *     with ES6 Set.
   */
  removeAll(col) {
    var values = googstructs.getValues(col);
    var l = values.length;
    for (var i = 0; i < l; i++) {
      this.remove(values[i]);
    }
    this.setSizeInternal_(this.map_.size);
  };

  /**
   * Removes the given element from this set.
   * @param {T} element The primitive or object to remove.
   * @return {boolean} Whether the element was found and removed.
   */
  delete(element) {
    const rv = this.map_.remove(structs_Set.getKey_(element));
    this.setSizeInternal_(this.map_.size);
    return rv;
  };

  /**
   * Removes the given element from this set.
   * @param {T} element The primitive or object to remove.
   * @return {boolean} Whether the element was found and removed.
   * @override
   * @suppress {checkTypes}
   * @deprecated Use `delete`, for alignment with ES6 Set.
   */
  remove(element) {
    return this.delete(element);
  };

  /**
   * Removes all elements from this set.
   */
  clear() {
    this.map_.clear();
    this.setSizeInternal_(0);
  };

  /**
   * Tests whether this set is empty.
   * @return {boolean} True if there are no elements in this set.
   * @deprecated Use the size property and compare against 0, for alignment with
   *     ES6 Set.
   */
  isEmpty() {
    return this.map_.size === 0;
  };

  /**
   * Tests whether this set contains the given element.
   * @param {T} element The primitive or object to test for.
   * @return {boolean} True if this set contains the given element.
   */
  has(element) {
    return this.map_.containsKey(structs_Set.getKey_(element));
  };

  /**
   * Tests whether this set contains the given element.
   * @param {T} element The primitive or object to test for.
   * @return {boolean} True if this set contains the given element.
   * @override
   * @deprecated Use `has` instead, for alignment with ES6 Set.
   */
  contains(element) {
    return this.map_.containsKey(structs_Set.getKey_(element));
  };

  /**
   * Tests whether this set contains all the values in a given collection.
   * Repeated elements in the collection are ignored, e.g.  (new
   * structs_Set([1, 2])).containsAll([1, 1]) is True.
   * @param {Collection<T>|Object} col A collection-like object.
   * @return {boolean} True if the set contains all elements.
   * @deprecated Use `goog.collections.sets.hasAll(thisSet, col)`, converting
   *     Objects to arrays using Object.values, for alignment with ES6 Set.
   */
  containsAll(col) {
    return googstructs.every(col, this.contains, this);
  };

  /**
   * Finds all values that are present in both this set and the given collection.
   * @param {Array<S>|Object<?,S>} col A collection.
   * @return {!structs_Set<T|S>} A new set containing all the values
   *     (primitives or objects) present in both this set and the given
   *     collection.
   * @template S
   * @deprecated Use `goog.collections.sets.intersection(thisSet, col)`,
   *     converting Objects to arrays using Object.values, instead for alignment
   *     with ES6 Set.
   */
  intersection(col) {
    var result = new structs_Set();
  
    var values = googstructs.getValues(col);
    for (var i = 0; i < values.length; i++) {
      var value = values[i];
      if (this.contains(value)) {
        result.add(value);
      }
    }
  
    return result;
  };

  /**
   * Finds all values that are present in this set and not in the given
   * collection.
   * @param {Array<T>|Collection<T>|Object<?,T>} col A collection.
   * @return {!structs_Set} A new set containing all the values
   *     (primitives or objects) present in this set but not in the given
   *     collection.
   */
  difference(col) {
    var result = this.clone();
    result.removeAll(col);
    return result;
  };

  /**
   * Returns an array containing all the elements in this set.
   * @return {!Array<T>} An array containing all the elements in this set.
   * @deprecated Use `Array.from(set.values())` instead, for alignment with ES6
   *     Set.
   */
  getValues() {
    return this.map_.getValues();
  };

  /**
   * @returns {!IteratorIterable<T>} An ES6 Iterator that iterates over the values
   *     in the set.
   */
  values() {
    return this.map_.values();
  };

  /**
   * Creates a shallow clone of this set.
   * @return {!structs_Set<T>} A new set containing all the same elements as
   *     this set.
   * @deprecated Use `new Set(thisSet.values())` for alignment with ES6 Set.
   */
  clone() {
    return new structs_Set(this);
  };

  /**
   * Tests whether the given collection consists of the same elements as this set,
   * regardless of order, without repetition.  Primitives are treated as equal if
   * they have the same type and convert to the same string; objects are treated
   * as equal if they are references to the same object.  This operation is O(n).
   * @param {Collection<T>|Object} col A collection.
   * @return {boolean} True if the given collection consists of the same elements
   *     as this set, regardless of order, without repetition.
   * @deprecated Use `goog.collections.equals(thisSet, col)`, converting Objects
   *     to arrays using Object.values,  instead for alignment with ES6 Set.
   */
  equals(col) {
    return this.getCount() == googstructs.getCount(col) && this.isSubsetOf(col);
  };

  /**
   * Tests whether the given collection contains all the elements in this set.
   * Primitives are treated as equal if they have the same type and convert to the
   * same string; objects are treated as equal if they are references to the same
   * object.  This operation is O(n).
   * @param {Collection<T>|Object} col A collection.
   * @return {boolean} True if this set is a subset of the given collection.
   * @deprecated Use `goog.collections.isSubsetOf(thisSet, col)`, converting
   *     Objects to arrays using Object.values, instead for alignment with ES6
   *     Set.
   */
  isSubsetOf(col) {
    var colCount = googstructs.getCount(col);
    if (this.getCount() > colCount) {
      return false;
    }
    if (!(col instanceof structs_Set) && colCount > 5) {
      // Convert to a structs_Set so that googstructs.contains runs in
      // O(1) time instead of O(n) time.
      col = new structs_Set(col);
    }
    return googstructs.every(this, function(value) {
      return googstructs.contains(col, value);
    });
  };

  /**
   * Returns an iterator that iterates over the elements in this set.
   * @param {boolean=} opt_keys This argument is ignored.
   * @return {!Iterator} An iterator over the elements in this set.
   * @deprecated Call `values` and use native iteration, for alignment with ES6
   *     Set.
   */
  __iterator__(opt_keys) {
    return this.map_.__iterator__(false);
  };

  /**
   * Assigns to the size property to isolate supressions of const assignment
   * to only where they are needed.
   * @param {number} newSize The size to update to.
   * @private
   */
  setSizeInternal_(newSize) {
    /** @suppress {const} */
    this.size = newSize;
  };
}

/**
 * A function that returns a unique id.
 * @private @const {function(?Object): number}
 */
structs_Set.getUid_ = google.getUid;

/**
 * @return {!IteratorIterable<T>} An ES6 Iterator that iterates over the values
 *     in the set.
 */
structs_Set.prototype[Symbol.iterator] = function() {
  return this.values();
};

export {structs_Set as Set};