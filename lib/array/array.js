import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utilities for manipulating arrays.
 */

/**
 * @type {boolean} If true, JSCompiler will use the native implementation of
 * array functions where appropriate (e.g., `Array#filter`) and remove the
 * unused pure JS implementation.
 */
const ASSUME_NATIVE_FUNCTIONS = true;
export {ASSUME_NATIVE_FUNCTIONS};

/**
 * Returns the last element in an array without removing it.
 * Same as {@link goog.array.last}.
 * @param {IArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */
function peek(array) {
  return array[array.length - 1];
}
export {peek};

/**
 * Returns the last element in an array without removing it.
 * Same as {@link goog.array.peek}.
 * @param {IArrayLike<T>|string} array The array.
 * @return {T} Last item in array.
 * @template T
 */
export const last = peek;

// NOTE(arv): Since most of the array functions are generic it allows you to
// pass an array-like object. Strings have a length and are considered array-
// like. However, the 'in' operator does not work on strings so we cannot just
// use the array path even if the browser supports indexing into strings. We
// therefore end up splitting the string.

/**
 * Returns the index of the first element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
 *
 * @param {IArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at index 0.
 * @return {number} The index of the first matching array element.
 * @template T
 * @deprecated Use Array.indexOf directly
 */
function indexOf(arr, obj, opt_fromIndex) {
      asserts.assert(arr.length != null);

      return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
    };
export {indexOf};

/**
 * Returns the index of the last element of an array with a specified value, or
 * -1 if the element is not present in the array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-lastindexof}
 *
 * @param {!IArrayLike<T>|string} arr The array to be searched.
 * @param {T} obj The object for which we are searching.
 * @param {?number=} opt_fromIndex The index at which to start the search. If
 *     omitted the search starts at the end of the array.
 * @return {number} The index of the last matching array element.
 * @template T
 * @deprecated Use Array.lastIndexOf directly
 */
function lastIndexOf(arr, obj, opt_fromIndex) {
      asserts.assert(arr.length != null);

      // Firefox treats undefined and null as 0 in the fromIndex argument which
      // leads it to always return -1
      const fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
      return Array.prototype.lastIndexOf.call(arr, obj, fromIndex);
    };
export {lastIndexOf};

/**
 * Calls a function for each element in an array. Skips holes in the array.
 * See {@link http://tinyurl.com/developer-mozilla-org-array-foreach}
 *
 * @param {IArrayLike<T>|string} arr Array or array like object over
 *     which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function takes 3 arguments (the element, the index and the
 *     array). The return value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @template T,S
 * @deprecated Use Array.forEach directly or for ... of loops
 */
function forEach(arr, f, opt_obj) {
      asserts.assert(arr.length != null);

      Array.prototype.forEach.call(arr, f, opt_obj);
    };
export {forEach};

/**
 * Calls a function for each element in an array, starting from the last
 * element rather than the first.
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this: S, T, number, ?): ?} f The function to call for every
 *     element. This function
 *     takes 3 arguments (the element, the index and the array). The return
 *     value is ignored.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @template T,S
 */
function forEachRight(arr, f, opt_obj) {
  const l = arr.length;  // must be fixed during loop... see docs
  const arr2 = (typeof arr === 'string') ? arr.split('') : arr;
  for (let i = l - 1; i >= 0; --i) {
    if (i in arr2) {
      f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr);
    }
  }
}
export {forEachRight};

/**
 * Calls a function for each element in an array, and if the function returns
 * true adds the element to a new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?):boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and must
 *     return a Boolean. If the return value is true the element is added to the
 *     result array. If it is false the element is not included.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {!Array<T>} a new array in which only elements that passed the test
 *     are present.
 * @template T,S
 * @deprecated Use Array.filter directly
 */
function filter(arr, f, opt_obj) {
      asserts.assert(arr.length != null);

      return Array.prototype.filter.call(arr, f, opt_obj);
    };
export {filter};

/**
 * Calls a function for each element in an array and inserts the result into a
 * new array.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
 *
 * @param {IArrayLike<VALUE>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this:THIS, VALUE, number, ?): RESULT} f The function to call
 *     for every element. This function takes 3 arguments (the element,
 *     the index and the array) and should return something. The result will be
 *     inserted into a new array.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
 * @return {!Array<RESULT>} a new array with the results from f.
 * @template THIS, VALUE, RESULT
 * @deprecated Use Array.map directly
 */
function map(arr, f, opt_obj) {
      asserts.assert(arr.length != null);

      return Array.prototype.map.call(arr, f, opt_obj);
    };
export {map};

/**
 * Passes every element of an array into a function and accumulates the result.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduce}
 * Note that this implementation differs from the native Array.prototype.reduce
 * in that the initial value is assumed to be defined (the MDN docs linked above
 * recommend not omitting this parameter, although it is technically optional).
 *
 * For example:
 * var a = [1, 2, 3, 4];
 * reduce(a, function(r, v, i, arr) {return r + v;}, 0);
 * returns 10
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {R} Result of evaluating f repeatedly across the values of the array.
 * @template T,S,R
 * @deprecated Use Array.reduce directly
 */
function reduce(arr, f, val, opt_obj) {
      asserts.assert(arr.length != null);
      if (opt_obj) {
        f = google.bind(f, opt_obj);
      }
      return Array.prototype.reduce.call(arr, f, val);
    };
export {reduce};

/**
 * Passes every element of an array into a function and accumulates the result,
 * starting from the last element and working towards the first.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-reduceright}
 *
 * For example:
 * var a = ['a', 'b', 'c'];
 * reduceRight(a, function(r, v, i, arr) {return r + v;}, '');
 * returns 'cba'
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, R, T, number, ?) : R} f The function to call for
 *     every element. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {?} val The initial value to pass into the function on the first call.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {R} Object returned as a result of evaluating f repeatedly across the
 *     values of the array.
 * @template T,S,R
 * @deprecated Use Array.reduceRight directly
 */
function reduceRight(arr, f, val, opt_obj) {
      asserts.assert(arr.length != null);
      asserts.assert(f != null);
      if (opt_obj) {
        f = google.bind(f, opt_obj);
      }
      return Array.prototype.reduceRight.call(arr, f, val);
    };
export {reduceRight};

/**
 * Calls f for each element of an array. If any call returns true, some()
 * returns true (without checking the remaining elements). If all calls
 * return false, some() returns false.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-some}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj  The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} true if any element passes the test.
 * @template T,S
 * @deprecated Use Array.some directly
 */
function some(arr, f, opt_obj) {
      asserts.assert(arr.length != null);

      return Array.prototype.some.call(arr, f, opt_obj);
    };
export {some};

/**
 * Call f for each element of an array. If all calls return true, every()
 * returns true. If any call returns false, every() returns false and
 * does not continue to check the remaining elements.
 *
 * See {@link http://tinyurl.com/developer-mozilla-org-array-every}
 *
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within f.
 * @return {boolean} false if any element fails the test.
 * @template T,S
 * @deprecated Use Array.every directly
 */
function every(arr, f, opt_obj) {
      asserts.assert(arr.length != null);

      return Array.prototype.every.call(arr, f, opt_obj);
    };
export {every};

/**
 * Counts the array elements that fulfill the predicate, i.e. for which the
 * callback function returns true. Skips holes in the array.
 *
 * @param {!IArrayLike<T>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this: S, T, number, ?): boolean} f The function to call for
 *     every element. Takes 3 arguments (the element, the index and the array).
 * @param {S=} opt_obj The object to be used as the value of 'this' within f.
 * @return {number} The number of the matching elements.
 * @template T,S
 */
function count(arr, f, opt_obj) {
  let count = 0;
  forEach(arr, function(element, index, arr) {
    if (f.call(/** @type {?} */ (opt_obj), element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
}
export {count};

/**
 * Search an array for the first element that satisfies a given condition and
 * return that element.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The first array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 * @deprecated Use arr.find(f) instead
 */
function find(arr, f, opt_obj) {
  const i = findIndex(arr, f, opt_obj);
  return i < 0 ? null : typeof arr === 'string' ? arr.charAt(i) : arr[i];
}
export {find};

/**
 * Search an array for the first element that satisfies a given condition and
 * return its index.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
 *     every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the first array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 * @deprecated Use arr.findIndex(f) instead
 */
function findIndex(arr, f, opt_obj) {
  const l = arr.length;  // must be fixed during loop... see docs
  const arr2 = (typeof arr === 'string') ? arr.split('') : arr;
  for (let i = 0; i < l; i++) {
    if (i in arr2 && f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
}
export {findIndex};

/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return that element.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {T|null} The last array element that passes the test, or null if no
 *     element is found.
 * @template T,S
 */
function findRight(arr, f, opt_obj) {
  const i = findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : typeof arr === 'string' ? arr.charAt(i) : arr[i];
}
export {findRight};

/**
 * Search an array (in reverse order) for the last element that satisfies a
 * given condition and return its index.
 * @param {IArrayLike<T>|string} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The index of the last array element that passes the test,
 *     or -1 if no element is found.
 * @template T,S
 */
function findIndexRight(arr, f, opt_obj) {
  const l = arr.length;  // must be fixed during loop... see docs
  const arr2 = (typeof arr === 'string') ? arr.split('') : arr;
  for (let i = l - 1; i >= 0; i--) {
    if (i in arr2 && f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
}
export {findIndexRight};

/**
 * Whether the array contains the given object.
 * @param {IArrayLike<?>|string} arr The array to test for the presence of the
 *     element.
 * @param {*} obj The object for which to test.
 * @return {boolean} true if obj is present.
 * @deprecated Use arr.includes(obj) instead
 */
function contains(arr, obj) {
  return indexOf(arr, obj) >= 0;
}
export {contains};

/**
 * Whether the array is empty.
 * @param {IArrayLike<?>|string} arr The array to test.
 * @return {boolean} true if empty.
 */
function isEmpty(arr) {
  return arr.length == 0;
}
export {isEmpty};

/**
 * Clears the array.
 * @param {IArrayLike<?>} arr Array or array like object to clear.
 */
function clear(arr) {
  // For non real arrays we don't have the magic length so we delete the
  // indices.
  if (!Array.isArray(arr)) {
    for (let i = arr.length - 1; i >= 0; i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
}
export {clear};

/**
 * Pushes an item into an array, if it's not already in the array.
 * @param {Array<T>} arr Array into which to insert the item.
 * @param {T} obj Value to add.
 * @template T
 */
function insert(arr, obj) {
  if (!contains(arr, obj)) {
    arr.push(obj);
  }
}
export {insert};

/**
 * Inserts an object at the given index of the array.
 * @param {IArrayLike<?>} arr The array to modify.
 * @param {*} obj The object to insert.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
function insertAt(arr, obj, opt_i) {
  splice(arr, opt_i, 0, obj);
}
export {insertAt};

/**
 * Inserts at the given index of the array, all elements of another array.
 * @param {IArrayLike<?>} arr The array to modify.
 * @param {IArrayLike<?>} elementsToAdd The array of elements to add.
 * @param {number=} opt_i The index at which to insert the object. If omitted,
 *      treated as 0. A negative index is counted from the end of the array.
 */
function insertArrayAt(arr, elementsToAdd, opt_i) {
  google.partial(splice, arr, opt_i, 0).apply(null, elementsToAdd);
}
export {insertArrayAt};

/**
 * Inserts an object into an array before a specified object.
 * @param {Array<T>} arr The array to modify.
 * @param {T} obj The object to insert.
 * @param {T=} opt_obj2 The object before which obj should be inserted. If obj2
 *     is omitted or not found, obj is inserted at the end of the array.
 * @template T
 */
function insertBefore(arr, obj, opt_obj2) {
  let i;
  if (arguments.length == 2 || (i = indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    insertAt(arr, obj, i);
  }
}
export {insertBefore};

/**
 * Removes the first occurrence of a particular value from an array.
 * @param {IArrayLike<T>} arr Array from which to remove
 *     value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */
function remove(arr, obj) {
  const i = indexOf(arr, obj);
  let rv;
  if ((rv = i >= 0)) {
    removeAt(arr, i);
  }
  return rv;
}
export {remove};

/**
 * Removes the last occurrence of a particular value from an array.
 * @param {!IArrayLike<T>} arr Array from which to remove value.
 * @param {T} obj Object to remove.
 * @return {boolean} True if an element was removed.
 * @template T
 */
function removeLast(arr, obj) {
  const i = lastIndexOf(arr, obj);
  if (i >= 0) {
    removeAt(arr, i);
    return true;
  }
  return false;
}
export {removeLast};

/**
 * Removes from an array the element at index i
 * @param {IArrayLike<?>} arr Array or array like object from which to
 *     remove value.
 * @param {number} i The index to remove.
 * @return {boolean} True if an element was removed.
 */
function removeAt(arr, i) {
  asserts.assert(arr.length != null);

  // use generic form of splice
  // splice returns the removed items and if successful the length of that
  // will be 1
  return Array.prototype.splice.call(arr, i, 1).length == 1;
}
export {removeAt};

/**
 * Removes the first value that satisfies the given condition.
 * @param {IArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {boolean} True if an element was removed.
 * @template T,S
 */
function removeIf(arr, f, opt_obj) {
  const i = findIndex(arr, f, opt_obj);
  if (i >= 0) {
    removeAt(arr, i);
    return true;
  }
  return false;
}
export {removeIf};

/**
 * Removes all values that satisfy the given condition.
 * @param {IArrayLike<T>} arr Array or array
 *     like object over which to iterate.
 * @param {?function(this:S, T, number, ?) : boolean} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the element, the index and the array) and should
 *     return a boolean.
 * @param {S=} opt_obj An optional "this" context for the function.
 * @return {number} The number of items removed
 * @template T,S
 */
function removeAllIf(arr, f, opt_obj) {
  let removedCount = 0;
  forEachRight(arr, function(val, index) {
    if (f.call(/** @type {?} */ (opt_obj), val, index, arr)) {
      if (removeAt(arr, index)) {
        removedCount++;
      }
    }
  });
  return removedCount;
}
export {removeAllIf};

/**
 * Returns a new array that is the result of joining the arguments.  If arrays
 * are passed then their items are added, however, if non-arrays are passed they
 * will be added to the return array as is.
 *
 * Note that ArrayLike objects will be added as is, rather than having their
 * items added.
 *
 * concat([1, 2], [3, 4]) -> [1, 2, 3, 4]
 * concat(0, [1, 2]) -> [0, 1, 2]
 * concat([1, 2], null) -> [1, 2, null]
 *
 * There is bug in all current versions of IE (6, 7 and 8) where arrays created
 * in an iframe become corrupted soon (not immediately) after the iframe is
 * destroyed. This is common if loading data via goog.net.IframeIo, for example.
 * This corruption only affects the concat method which will start throwing
 * Catastrophic Errors (#-2147418113).
 *
 * See http://endoflow.com/scratch/corrupted-arrays.html for a test case.
 *
 * Internally google.array should use this, so that all methods will continue to
 * work on these broken array objects.
 *
 * @param {...*} var_args Items to concatenate.  Arrays will have each item
 *     added, while primitives and objects will be added as is.
 * @return {!Array<?>} The new resultant array.
 * @deprecated Use Array.concat directly
 */
function concat(var_args) {
  return Array.prototype.concat.apply([], arguments);
}
export {concat};

/**
 * Returns a new array that contains the contents of all the arrays passed.
 * @param {...!Array<T>} var_args
 * @return {!Array<T>}
 * @template T
 * @deprecated Use Array.concat directly
 */
function join(var_args) {
  return Array.prototype.concat.apply([], arguments);
}
export {join};

/**
 * Converts an object to an array.
 * @param {IArrayLike<T>|string} object  The object to convert to an
 *     array.
 * @return {!Array<T>} The object converted into an array. If object has a
 *     length property, every property indexed with a non-negative number
 *     less than length will be included in the result. If object does not
 *     have a length property, an empty array will be returned.
 * @template T
 */
function toArray(object) {
  const length = object.length;

  // If length is not a number the following is false. This case is kept for
  // backwards compatibility since there are callers that pass objects that are
  // not array like.
  if (length > 0) {
    const rv = new Array(length);
    for (let i = 0; i < length; i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
}
export {toArray};

/**
 * Does a shallow copy of an array.
 * @param {IArrayLike<T>|string} arr  Array or array-like object to
 *     clone.
 * @return {!Array<T>} Clone of the input array.
 * @template T
 */
function clone(arr) {
  return toArray(arr);
}
export {clone};

/**
 * Extends an array with another array, element, or "array like" object.
 * This function operates 'in-place', it does not create a new Array.
 *
 * Example:
 * var a = [];
 * extend(a, [0, 1]);
 * a; // [0, 1]
 * extend(a, 2);
 * a; // [0, 1, 2]
 *
 * @param {Array<VALUE>} arr1  The array to modify.
 * @param {...(IArrayLike<VALUE>|VALUE)} var_args The elements or arrays of
 *     elements to add to arr1.
 * @template VALUE
 */
function extend(arr1, var_args) {
  for (let i = 1; i < arguments.length; i++) {
    const arr2 = arguments[i];
    if (google.isArrayLike(arr2)) {
      const len1 = arr1.length || 0;
      const len2 = arr2.length || 0;
      arr1.length = len1 + len2;
      for (let j = 0; j < len2; j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
}
export {extend};

/**
 * Adds or removes elements from an array. This is a generic version of Array
 * splice. This means that it might work on other objects similar to arrays,
 * such as the arguments object.
 *
 * @param {IArrayLike<T>} arr The array to modify.
 * @param {number|undefined} index The index at which to start changing the
 *     array. If not defined, treated as 0.
 * @param {number} howMany How many elements to remove (0 means no removal. A
 *     value below 0 is treated as zero and so is any other non number. Numbers
 *     are floored).
 * @param {...T} var_args Optional, additional elements to insert into the
 *     array.
 * @return {!Array<T>} the removed elements.
 * @template T
 * @deprecated Use arr.splice(index, howMany, var_args) instead
 */
function splice(arr, index, howMany, var_args) {
  asserts.assert(arr.length != null);

  return Array.prototype.splice.apply(arr, slice(arguments, 1));
}
export {splice};

/**
 * Returns a new array from a segment of an array. This is a generic version of
 * Array slice. This means that it might work on other objects similar to
 * arrays, such as the arguments object.
 *
 * @param {IArrayLike<T>|string} arr The array from
 * which to copy a segment.
 * @param {number} start The index of the first element to copy.
 * @param {number=} opt_end The index after the last element to copy.
 * @return {!Array<T>} A new array containing the specified segment of the
 *     original array.
 * @template T
 * @deprecated Use arr.slice(start, opt_end) instead
 */
function slice(arr, start, opt_end) {
  asserts.assert(arr.length != null);

  // passing 1 arg to slice is not the same as passing 2 where the second is
  // null or undefined (in that case the second argument is treated as 0).
  // we could use slice on the arguments object and then use apply instead of
  // testing the length
  if (arguments.length <= 2) {
    return Array.prototype.slice.call(arr, start);
  } else {
    return Array.prototype.slice.call(arr, start, opt_end);
  }
}
export {slice};

/**
 * Removes all duplicates from an array (retaining only the first
 * occurrence of each array element).  This function modifies the
 * array in place and doesn't change the order of the non-duplicate items.
 *
 * For objects, duplicates are identified as having the same unique ID as
 * defined by {@link google.getUid}.
 *
 * Alternatively you can specify a custom hash function that returns a unique
 * value for each item in the array it should consider unique.
 *
 * Runtime: N,
 * Worstcase space: 2N (no dupes)
 *
 * @param {IArrayLike<T>} arr The array from which to remove
 *     duplicates.
 * @param {Array=} opt_rv An optional array in which to return the results,
 *     instead of performing the removal inplace.  If specified, the original
 *     array will remain unchanged.
 * @param {function(T):string=} opt_hashFn An optional function to use to
 *     apply to every item in the array. This function should return a unique
 *     value for each item in the array it should consider unique.
 * @template T
 */
function removeDuplicates(arr, opt_rv, opt_hashFn) {
  const returnArray = opt_rv || arr;
  function defaultHashFn(item) {
    // Prefix each type with a single character representing the type to
    // prevent conflicting keys (e.g. true and 'true').
    return google.isObject(item) ? 'o' + google.getUid(item) :
                                 (typeof item).charAt(0) + item;
  };
  const hashFn = opt_hashFn || defaultHashFn;

  let cursorInsert = 0;
  let cursorRead = 0;
  const seen = {};

  while (cursorRead < arr.length) {
    const current = arr[cursorRead++];
    const key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
}
export {removeDuplicates};

/**
 * Searches the specified array for the specified target using the binary
 * search algorithm.  If no opt_compareFn is specified, elements are compared
 * using <code>defaultCompare</code>, which compares the elements
 * using the built in < and > operators.  This will produce the expected
 * behavior for homogeneous arrays of String(s) and Number(s). The array
 * specified <b>must</b> be sorted in ascending order (as defined by the
 * comparison function).  If the array is not sorted, results are undefined.
 * If the array contains multiple instances of the specified target value, the
 * left-most instance will be found.
 *
 * Runtime: O(log n)
 *
 * @param {IArrayLike<VALUE>} arr The array to be searched.
 * @param {TARGET} target The sought value.
 * @param {function(TARGET, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, the target value and an element from your array, and return a
 *     negative number, zero, or a positive number depending on whether the
 *     first argument is less than, equal to, or greater than the second.
 * @return {number} Lowest index of the target value if found, otherwise
 *     (-(insertion point) - 1). The insertion point is where the value should
 *     be inserted into arr to preserve the sorted property.  Return value >= 0
 *     iff target is found.
 * @template TARGET, VALUE
 */
function binarySearch(arr, target, opt_compareFn) {
  return binarySearch_(
      arr, opt_compareFn || defaultCompare, false /* isEvaluator */, target);
}
export {binarySearch};

/**
 * Selects an index in the specified array using the binary search algorithm.
 * The evaluator receives an element and determines whether the desired index
 * is before, at, or after it.  The evaluator must be consistent (formally,
 * map(map(arr, evaluator, opt_obj), goog.math.sign)
 * must be monotonically non-increasing).
 *
 * Runtime: O(log n)
 *
 * @param {IArrayLike<VALUE>} arr The array to be searched.
 * @param {function(this:THIS, VALUE, number, ?): number} evaluator
 *     Evaluator function that receives 3 arguments (the element, the index and
 *     the array). Should return a negative number, zero, or a positive number
 *     depending on whether the desired index is before, at, or after the
 *     element passed to it.
 * @param {THIS=} opt_obj The object to be used as the value of 'this'
 *     within evaluator.
 * @return {number} Index of the leftmost element matched by the evaluator, if
 *     such exists; otherwise (-(insertion point) - 1). The insertion point is
 *     the index of the first element for which the evaluator returns negative,
 *     or arr.length if no such element exists. The return value is non-negative
 *     iff a match is found.
 * @template THIS, VALUE
 */
function binarySelect(arr, evaluator, opt_obj) {
  return binarySearch_(
      arr, evaluator, true /* isEvaluator */, undefined /* opt_target */,
      opt_obj);
}
export {binarySelect};

/**
 * Implementation of a binary search algorithm which knows how to use both
 * comparison functions and evaluators. If an evaluator is provided, will call
 * the evaluator with the given optional data object, conforming to the
 * interface defined in binarySelect. Otherwise, if a comparison function is
 * provided, will call the comparison function against the given data object.
 *
 * This implementation purposefully does not use google.bind or google.partial for
 * performance reasons.
 *
 * Runtime: O(log n)
 *
 * @param {IArrayLike<?>} arr The array to be searched.
 * @param {function(?, ?, ?): number | function(?, ?): number} compareFn
 *     Either an evaluator or a comparison function, as defined by binarySearch
 *     and binarySelect above.
 * @param {boolean} isEvaluator Whether the function is an evaluator or a
 *     comparison function.
 * @param {?=} opt_target If the function is a comparison function, then
 *     this is the target to binary search for.
 * @param {Object=} opt_selfObj If the function is an evaluator, this is an
 *     optional this object for the evaluator.
 * @return {number} Lowest index of the target value if found, otherwise
 *     (-(insertion point) - 1). The insertion point is where the value should
 *     be inserted into arr to preserve the sorted property.  Return value >= 0
 *     iff target is found.
 * @private
 */
function binarySearch_(arr, compareFn, isEvaluator, opt_target, opt_selfObj) {
  let left = 0;            // inclusive
  let right = arr.length;  // exclusive
  let found;
  while (left < right) {
    const middle = left + ((right - left) >>> 1);
    let compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      // NOTE(dimvar): To avoid this cast, we'd have to use function overloading
      // for the type of binarySearch_, which the type system can't express yet.
      compareResult = /** @type {function(?, ?): number} */ (compareFn)(
          opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      // We are looking for the lowest index so we can't return immediately.
      found = !compareResult;
    }
  }
  // left is the index if found, or the insertion point otherwise.
  // Avoiding bitwise not operator, as that causes a loss in precision for array
  // indexes outside the bounds of a 32-bit signed integer.  Array indexes have
  // a maximum value of 2^32-2 https://tc39.es/ecma262/#array-index
  return found ? left : -left - 1;
}

/**
 * Sorts the specified array into ascending order.  If no opt_compareFn is
 * specified, elements are compared using
 * <code>defaultCompare</code>, which compares the elements using
 * the built in < and > operators.  This will produce the expected behavior
 * for homogeneous arrays of String(s) and Number(s), unlike the native sort,
 * but will give unpredictable results for heterogeneous lists of strings and
 * numbers with different numbers of digits.
 *
 * This sort is not guaranteed to be stable.
 *
 * Runtime: Same as `Array.prototype.sort`
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {?function(T,T):number=} opt_compareFn Optional comparison
 *     function by which the
 *     array is to be ordered. Should take 2 arguments to compare, and return a
 *     negative number, zero, or a positive number depending on whether the
 *     first argument is less than, equal to, or greater than the second.
 * @template T
 * @deprecated Use arr.sort(opt_compareFn) instead
 */
function sort(arr, opt_compareFn) {
  // TODO(arv): Update type annotation since null is not accepted.
  arr.sort(opt_compareFn || defaultCompare);
}
export {sort};

/**
 * Sorts the specified array into ascending order in a stable way.  If no
 * opt_compareFn is specified, elements are compared using
 * <code>defaultCompare</code>, which compares the elements using
 * the built in < and > operators.  This will produce the expected behavior
 * for homogeneous arrays of String(s) and Number(s).
 *
 * Runtime: Same as `Array.prototype.sort`, plus an additional
 * O(n) overhead of copying the array twice.
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {?function(T, T): number=} opt_compareFn Optional comparison function
 *     by which the array is to be ordered. Should take 2 arguments to compare,
 *     and return a negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template T
 */
function stableSort(arr, opt_compareFn) {
  const compArr = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    compArr[i] = {index: i, value: arr[i]};
  }
  const valueCompareFn = opt_compareFn || defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
  }
  sort(compArr, stableCompareFn);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = compArr[i].value;
  }
}
export {stableSort};

/**
 * Sort the specified array into ascending order based on item keys
 * returned by the specified key function.
 * If no opt_compareFn is specified, the keys are compared in ascending order
 * using <code>defaultCompare</code>.
 *
 * Runtime: O(S(f(n)), where S is runtime of <code>sort</code>
 * and f(n) is runtime of the key function.
 *
 * @param {Array<T>} arr The array to be sorted.
 * @param {function(T): K} keyFn Function taking array element and returning
 *     a key used for sorting this element.
 * @param {?function(K, K): number=} opt_compareFn Optional comparison function
 *     by which the keys are to be ordered. Should take 2 arguments to compare,
 *     and return a negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template T,K
 */
function sortByKey(arr, keyFn, opt_compareFn) {
  const keyCompareFn = opt_compareFn || defaultCompare;
  sort(arr, function(a, b) {
    return keyCompareFn(keyFn(a), keyFn(b));
  });
}
export {sortByKey};

/**
 * Sorts an array of objects by the specified object key and compare
 * function. If no compare function is provided, the key values are
 * compared in ascending order using <code>defaultCompare</code>.
 * This won't work for keys that get renamed by the compiler. So use
 * {'foo': 1, 'bar': 2} rather than {foo: 1, bar: 2}.
 * @param {Array<Object>} arr An array of objects to sort.
 * @param {string} key The object key to sort by.
 * @param {Function=} opt_compareFn The function to use to compare key
 *     values.
 */
function sortObjectsByKey(arr, key, opt_compareFn) {
  sortByKey(arr, function(obj) {
    return obj[key];
  }, opt_compareFn);
}
export {sortObjectsByKey};

/**
 * Tells if the array is sorted.
 * @param {!IArrayLike<T>} arr The array.
 * @param {?function(T,T):number=} opt_compareFn Function to compare the
 *     array elements.
 *     Should take 2 arguments to compare, and return a negative number, zero,
 *     or a positive number depending on whether the first argument is less
 *     than, equal to, or greater than the second.
 * @param {boolean=} opt_strict If true no equal elements are allowed.
 * @return {boolean} Whether the array is sorted.
 * @template T
 */
function isSorted(arr, opt_compareFn, opt_strict) {
  const compare = opt_compareFn || defaultCompare;
  for (let i = 1; i < arr.length; i++) {
    const compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
}
export {isSorted};

/**
 * Compares two arrays for equality. Two arrays are considered equal if they
 * have the same length and their corresponding elements are equal according to
 * the comparison function.
 *
 * @param {IArrayLike<A>} arr1 The first array to compare.
 * @param {IArrayLike<B>} arr2 The second array to compare.
 * @param {?function(A,B):boolean=} opt_equalsFn Optional comparison function.
 *     Should take 2 arguments to compare, and return true if the arguments
 *     are equal. Defaults to {@link goog.array.defaultCompareEquality} which
 *     compares the elements using the built-in '===' operator.
 * @return {boolean} Whether the two arrays are equal.
 * @template A
 * @template B
 */
function equals(arr1, arr2, opt_equalsFn) {
  if (!google.isArrayLike(arr1) || !google.isArrayLike(arr2) ||
      arr1.length != arr2.length) {
    return false;
  }
  const l = arr1.length;
  const equalsFn = opt_equalsFn || defaultCompareEquality;
  for (let i = 0; i < l; i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
}
export {equals};

/**
 * 3-way array compare function.
 * @param {!IArrayLike<VALUE>} arr1 The first array to
 *     compare.
 * @param {!IArrayLike<VALUE>} arr2 The second array to
 *     compare.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is to be ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {number} Negative number, zero, or a positive number depending on
 *     whether the first argument is less than, equal to, or greater than the
 *     second.
 * @template VALUE
 */
function compare3(arr1, arr2, opt_compareFn) {
  const compare = opt_compareFn || defaultCompare;
  const l = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < l; i++) {
    const result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return defaultCompare(arr1.length, arr2.length);
}
export {compare3};

/**
 * Compares its two arguments for order, using the built in < and >
 * operators.
 * @param {VALUE} a The first object to be compared.
 * @param {VALUE} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is less than, equal to, or greater than the second,
 *     respectively.
 * @template VALUE
 */
function defaultCompare(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}
export {defaultCompare};

/**
 * Compares its two arguments for inverse order, using the built in < and >
 * operators.
 * @param {VALUE} a The first object to be compared.
 * @param {VALUE} b The second object to be compared.
 * @return {number} A negative number, zero, or a positive number as the first
 *     argument is greater than, equal to, or less than the second,
 *     respectively.
 * @template VALUE
 */
function inverseDefaultCompare(a, b) {
  return -defaultCompare(a, b);
}
export {inverseDefaultCompare};

/**
 * Compares its two arguments for equality, using the built in === operator.
 * @param {*} a The first object to compare.
 * @param {*} b The second object to compare.
 * @return {boolean} True if the two arguments are equal, false otherwise.
 */
function defaultCompareEquality(a, b) {
  return a === b;
}
export {defaultCompareEquality};

/**
 * Inserts a value into a sorted array. The array is not modified if the
 * value is already present.
 * @param {IArrayLike<VALUE>} array The array to modify.
 * @param {VALUE} value The object to insert.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {boolean} True if an element was inserted.
 * @template VALUE
 */
function binaryInsert(array, value, opt_compareFn) {
  const index = binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
}
export {binaryInsert};

/**
 * Removes a value from a sorted array.
 * @param {!IArrayLike<VALUE>} array The array to modify.
 * @param {VALUE} value The object to remove.
 * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
 *     function by which the array is ordered. Should take 2 arguments to
 *     compare, and return a negative number, zero, or a positive number
 *     depending on whether the first argument is less than, equal to, or
 *     greater than the second.
 * @return {boolean} True if an element was removed.
 * @template VALUE
 */
function binaryRemove(array, value, opt_compareFn) {
  const index = binarySearch(array, value, opt_compareFn);
  return (index >= 0) ? removeAt(array, index) : false;
}
export {binaryRemove};

/**
 * Splits an array into disjoint buckets according to a splitting function.
 * @param {IArrayLike<T>} array The array.
 * @param {function(this:S, T, number, !IArrayLike<T>):?} sorter Function to
 *     call for every element.  This takes 3 arguments (the element, the index
 *     and the array) and must return a valid object key (a string, number,
 *     etc), or undefined, if that object should not be placed in a bucket.
 * @param {S=} opt_obj The object to be used as the value of 'this' within
 *     sorter.
 * @return {!Object<!Array<T>>} An object, with keys being all of the unique
 *     return values of sorter, and values being arrays containing the items for
 *     which the splitter returned that key.
 * @template T,S
 */
function bucket(array, sorter, opt_obj) {
  const buckets = {};

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    const key = sorter.call(/** @type {?} */ (opt_obj), value, i, array);
    if (key !== undefined) {
      // Push the value to the right bucket, creating it if necessary.
      const bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }

  return buckets;
}
export {bucket};

/**
 * Splits an array into disjoint buckets according to a splitting function.
 * @param {!IArrayLike<V>} array The array.
 * @param {function(V, number, !IArrayLike<V>):(K|undefined)} sorter Function to
 *     call for every element.  This takes 3 arguments (the element, the index,
 *     and the array) and must return a value to use as a key, or undefined, if
 *     that object should not be placed in a bucket.
 * @return {!Map<K, !Array<V>>} A map, with keys being all of the unique
 *     return values of sorter, and values being arrays containing the items for
 *     which the splitter returned that key.
 * @template K,V
 */
function bucketToMap(array, sorter) {
  const /** !Map<K, !Array<V>> */ buckets = new Map();

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    const key = sorter(value, i, array);
    if (key !== undefined) {
      // Push the value to the right bucket, creating it if necessary.
      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = [];
        buckets.set(key, bucket);
      }
      bucket.push(value);
    }
  }

  return buckets;
}
export {bucketToMap};

/**
 * Creates a new object built from the provided array and the key-generation
 * function.
 * @param {IArrayLike<T>} arr Array or array like object over
 *     which to iterate whose elements will be the values in the new object.
 * @param {?function(this:S, T, number, ?) : string} keyFunc The function to
 *     call for every element. This function takes 3 arguments (the element, the
 *     index and the array) and should return a string that will be used as the
 *     key for the element in the new object. If the function returns the same
 *     key for more than one element, the value for that key is
 *     implementation-defined.
 * @param {S=} opt_obj The object to be used as the value of 'this'
 *     within keyFunc.
 * @return {!Object<T>} The new object.
 * @template T,S
 */
function toObject(arr, keyFunc, opt_obj) {
  const ret = {};
  forEach(arr, function(element, index) {
    ret[keyFunc.call(/** @type {?} */ (opt_obj), element, index, arr)] =
        element;
  });
  return ret;
}
export {toObject};

/**
 * Creates a new ES6 Map built from the provided array and the key-generation
 * function.
 * @param {!IArrayLike<V>} arr Array or array like object over which to iterate
 *     whose elements will be the values in the new object.
 * @param {?function(V, number, ?) : K} keyFunc The function to call for every
 *     element. This function takes 3 arguments (the element, the index, and the
 *     array) and should return a value that will be used as the key for the
 *     element in the new object. If the function returns the same key for more
 *     than one element, the value for that key is implementation-defined.
 * @return {!Map<K, V>} The new map.
 * @template K,V
 */
function toMap(arr, keyFunc) {
  const /** !Map<K, V> */ map = new Map();

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    map.set(keyFunc(element, i, arr), element);
  }

  return map;
}
export {toMap};

/**
 * Creates a range of numbers in an arithmetic progression.
 *
 * Range takes 1, 2, or 3 arguments:
 * <pre>
 * range(5) is the same as range(0, 5, 1) and produces [0, 1, 2, 3, 4]
 * range(2, 5) is the same as range(2, 5, 1) and produces [2, 3, 4]
 * range(-2, -5, -1) produces [-2, -3, -4]
 * range(-2, -5, 1) produces [], since stepping by 1 wouldn't ever reach -5.
 * </pre>
 *
 * @param {number} startOrEnd The starting value of the range if an end argument
 *     is provided. Otherwise, the start value is 0, and this is the end value.
 * @param {number=} opt_end The optional end value of the range.
 * @param {number=} opt_step The step size between range values. Defaults to 1
 *     if opt_step is undefined or 0.
 * @return {!Array<number>} An array of numbers for the requested range. May be
 *     an empty array if adding the step would not converge toward the end
 *     value.
 */
function range(startOrEnd, opt_end, opt_step) {
  const array = [];
  let start = 0;
  let end = startOrEnd;
  const step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }

  if (step * (end - start) < 0) {
    // Sign mismatch: start + step will never reach the end value.
    return [];
  }

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      array.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      array.push(i);
    }
  }
  return array;
}
export {range};

/**
 * Returns an array consisting of the given value repeated N times.
 *
 * @param {VALUE} value The value to repeat.
 * @param {number} n The repeat count.
 * @return {!Array<VALUE>} An array with the repeated value.
 * @template VALUE
 */
function repeat(value, n) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
}
export {repeat};

/**
 * Returns an array consisting of every argument with all arrays
 * expanded in-place recursively.
 *
 * @param {...*} var_args The values to flatten.
 * @return {!Array<?>} An array containing the flattened values.
 */
function flatten(var_args) {
  const CHUNK_SIZE = 8192;

  const result = [];
  for (let i = 0; i < arguments.length; i++) {
    const element = arguments[i];
    if (Array.isArray(element)) {
      for (let c = 0; c < element.length; c += CHUNK_SIZE) {
        const chunk = slice(element, c, c + CHUNK_SIZE);
        const recurseResult = flatten.apply(null, chunk);
        for (let r = 0; r < recurseResult.length; r++) {
          result.push(recurseResult[r]);
        }
      }
    } else {
      result.push(element);
    }
  }
  return result;
}
export {flatten};

/**
 * Rotates an array in-place. After calling this method, the element at
 * index i will be the element previously at index (i - n) %
 * array.length, for all values of i between 0 and array.length - 1,
 * inclusive.
 *
 * For example, suppose list comprises [t, a, n, k, s]. After invoking
 * rotate(array, 1) (or rotate(array, -4)), array will comprise [s, t, a, n, k].
 *
 * @param {!Array<T>} array The array to rotate.
 * @param {number} n The amount to rotate.
 * @return {!Array<T>} The array.
 * @template T
 */
function rotate(array, n) {
  asserts.assert(array.length != null);

  if (array.length) {
    n %= array.length;
    if (n > 0) {
      Array.prototype.unshift.apply(array, array.splice(-n, n));
    } else if (n < 0) {
      Array.prototype.push.apply(array, array.splice(0, -n));
    }
  }
  return array;
}
export {rotate};

/**
 * Moves one item of an array to a new position keeping the order of the rest
 * of the items. Example use case: keeping a list of JavaScript objects
 * synchronized with the corresponding list of DOM elements after one of the
 * elements has been dragged to a new position.
 * @param {!IArrayLike<?>} arr The array to modify.
 * @param {number} fromIndex Index of the item to move between 0 and
 *     `arr.length - 1`.
 * @param {number} toIndex Target index between 0 and `arr.length - 1`.
 */
function moveItem(arr, fromIndex, toIndex) {
  asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  asserts.assert(toIndex >= 0 && toIndex < arr.length);
  // Remove 1 item at fromIndex.
  const removedItems = Array.prototype.splice.call(arr, fromIndex, 1);
  // Insert the removed item at toIndex.
  Array.prototype.splice.call(arr, toIndex, 0, removedItems[0]);
  // We don't use goog.array.insertAt and goog.array.removeAt, because they're
  // significantly slower than splice.
}
export {moveItem};

/**
 * Creates a new array for which the element at position i is an array of the
 * ith element of the provided arrays.  The returned array will only be as long
 * as the shortest array provided; additional values are ignored.  For example,
 * the result of zipping [1, 2] and [3, 4, 5] is [[1,3], [2, 4]].
 *
 * This is similar to the zip() function in Python.  See {@link
 * http://docs.python.org/library/functions.html#zip}
 *
 * @param {...!IArrayLike<?>} var_args Arrays to be combined.
 * @return {!Array<!Array<?>>} A new array of arrays created from
 *     provided arrays.
 */
function zip(var_args) {
  if (!arguments.length) {
    return [];
  }
  const result = [];
  let minLen = arguments[0].length;
  for (let i = 1; i < arguments.length; i++) {
    if (arguments[i].length < minLen) {
      minLen = arguments[i].length;
    }
  }
  for (let i = 0; i < minLen; i++) {
    const value = [];
    for (let j = 0; j < arguments.length; j++) {
      value.push(arguments[j][i]);
    }
    result.push(value);
  }
  return result;
}
export {zip};

/**
 * Shuffles the values in the specified array using the Fisher-Yates in-place
 * shuffle (also known as the Knuth Shuffle). By default, calls Math.random()
 * and so resets the state of that random number generator. Similarly, may reset
 * the state of any other specified random number generator.
 *
 * Runtime: O(n)
 *
 * @param {!Array<?>} arr The array to be shuffled.
 * @param {function():number=} opt_randFn Optional random function to use for
 *     shuffling.
 *     Takes no arguments, and returns a random number on the interval [0, 1).
 *     Defaults to Math.random() using JavaScript's built-in Math library.
 */
function shuffle(arr, opt_randFn) {
  const randFn = opt_randFn || Math.random;

  for (let i = arr.length - 1; i > 0; i--) {
    // Choose a random array index in [0, i] (inclusive with i).
    const j = Math.floor(randFn() * (i + 1));

    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}
export {shuffle};

/**
 * Returns a new array of elements from arr, based on the indexes of elements
 * provided by index_arr. For example, the result of index copying
 * ['a', 'b', 'c'] with index_arr [1,0,0,2] is ['b', 'a', 'a', 'c'].
 *
 * @param {!IArrayLike<T>} arr The array to get a indexed copy from.
 * @param {!IArrayLike<number>} index_arr An array of indexes to get from arr.
 * @return {!Array<T>} A new array of elements from arr in index_arr order.
 * @template T
 */
function copyByIndex(arr, index_arr) {
  const result = [];
  forEach(index_arr, function(index) {
    result.push(arr[index]);
  });
  return result;
}
export {copyByIndex};

/**
 * Maps each element of the input array into zero or more elements of the output
 * array.
 *
 * @param {!IArrayLike<VALUE>|string} arr Array or array like object
 *     over which to iterate.
 * @param {function(this:THIS, VALUE, number, ?): !Array<RESULT>} f The function
 *     to call for every element. This function takes 3 arguments (the element,
 *     the index and the array) and should return an array. The result will be
 *     used to extend a new array.
 * @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
 * @return {!Array<RESULT>} a new array with the concatenation of all arrays
 *     returned from f.
 * @template THIS, VALUE, RESULT
 */
function concatMap(arr, f, opt_obj) {
  return concat.apply([], map(arr, f, opt_obj));
}
export {concatMap};
